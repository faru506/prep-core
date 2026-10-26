require "fileutils"
require "open3"

class RestoreService
  BACKUP_DIR = Rails.root.join("storage", "backups")

  class << self
    def restore_from_file(filename, created_by: nil)
      raise "Invalid filename" if filename.include?("..") || filename.include?("/")
      filepath = BACKUP_DIR.join(filename)
      raise "Backup file not found" unless File.exist?(filepath)
      restore_archive(filepath, created_by: created_by)
    end

    def restore_from_upload(uploaded_file, created_by: nil)
      raise "No file uploaded" unless uploaded_file
      raise "Invalid file type" unless uploaded_file.original_filename.to_s.end_with?(".gz")

      FileUtils.mkdir_p(BACKUP_DIR)
      timestamp = Time.now.strftime("%Y-%m-%d_%H-%M-%S")
      filename = "upload_#{timestamp}_#{File.basename(uploaded_file.original_filename)}"
      filepath = BACKUP_DIR.join(filename)
      File.binwrite(filepath, uploaded_file.read)
      begin
        restore_archive(filepath, created_by: created_by)
      ensure
        FileUtils.rm_f(filepath)
      end
    end

    private

    def restore_archive(filepath, created_by: nil)
      BackupLock.acquire
      begin
        pre_restore = BackupService.create_backup(created_by: "pre-restore-#{created_by}")
        Rails.logger.info "Created pre-restore backup: #{pre_restore['filename']}"

        uri = ENV["MONGODB_URI"]
        raise "MONGODB_URI not set" if uri.blank?
        raise "Invalid URI" unless uri.to_s.match?(%r{\Amongodb(\+srv)?://[^\s]+\z})

        cmd = [ "mongorestore", "--uri", uri.to_s, "--gzip", "--archive", filepath.to_s, "--drop" ]
        stdout, stderr, status = Open3.capture3(*cmd)

        unless status.success?
          raise "mongorestore failed: #{stderr.presence || stdout}"
        end

        begin
          Mongoid::Tasks::Database.create_indexes
        rescue StandardError => e
          Rails.logger.warn "Failed to create indexes after restore: #{e.message}"
        end

        { success: true, pre_restore: pre_restore["filename"] }
      ensure
        BackupLock.release
      end
    end
  end
end
