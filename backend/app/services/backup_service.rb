require "fileutils"
require "json"
require "open3"
require "time"

class BackupService
  BACKUP_DIR = Rails.root.join("storage", "backups")
  METADATA_FILE = BACKUP_DIR.join("backups.json")
  DEFAULT_RETENTION_COUNT = 30

  class << self
    def create_backup(created_by: nil)
      FileUtils.mkdir_p(BACKUP_DIR)
      BackupLock.acquire
      begin
        timestamp = Time.now.strftime("%Y-%m-%d_%H-%M-%S")
        filename = "backup_#{timestamp}.gz"
        filepath = BACKUP_DIR.join(filename)

        uri = ENV["MONGODB_URI"]
        raise "MONGODB_URI not set" if uri.blank?

        cmd = [ "mongodump", "--uri=#{uri}", "--gzip", "--archive=#{filepath}" ]
        stdout, stderr, status = Open3.capture3(*cmd)

        unless status.success?
          FileUtils.rm_f(filepath)
          raise "mongodump failed: #{stderr.presence || stdout}"
        end

        size = File.size(filepath)
        metadata = load_metadata
        entry = {
          "filename" => filename,
          "size" => size,
          "size_human" => human_size(size),
          "created_at" => Time.now.utc.iso8601,
          "created_by" => created_by
        }
        metadata.unshift(entry)
        save_metadata(metadata)
        prune!

        entry
      ensure
        BackupLock.release
      end
    end

    def list_backups
      load_metadata.select { |b| File.exist?(BACKUP_DIR.join(b["filename"])) }
    end

    def delete_backup(filename)
      raise "Invalid filename" if filename.include?("..") || filename.include?("/")
      filepath = BACKUP_DIR.join(filename)
      raise "Backup not found" unless File.exist?(filepath)

      FileUtils.rm_f(filepath)
      metadata = load_metadata.reject { |b| b["filename"] == filename }
      save_metadata(metadata)
      true
    end

    def prune!
      retention = ENV.fetch("BACKUP_RETENTION_COUNT", DEFAULT_RETENTION_COUNT).to_i
      metadata = load_metadata
      return if metadata.size <= retention

      to_delete = metadata.drop(retention)
      to_delete.each do |entry|
        filepath = BACKUP_DIR.join(entry["filename"])
        FileUtils.rm_f(filepath)
      end
      save_metadata(metadata.first(retention))
    end

    private

    def load_metadata
      return [] unless File.exist?(METADATA_FILE)
      JSON.parse(File.read(METADATA_FILE))
    rescue StandardError
      []
    end

    def save_metadata(metadata)
      File.write(METADATA_FILE, JSON.pretty_generate(metadata))
    end

    def human_size(bytes)
      return "0 B" if bytes.nil? || bytes.zero?
      units = [ "B", "KB", "MB", "GB", "TB" ]
      exp = (Math.log(bytes) / Math.log(1024)).to_i
      exp = units.size - 1 if exp >= units.size
      "%.1f %s" % [ bytes / 1024.0**exp, units[exp] ]
    end
  end
end
