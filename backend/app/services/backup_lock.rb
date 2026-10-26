require "fileutils"

class BackupLock
  LOCK_FILE = Rails.root.join("storage", "backups", ".backup.lock")

  class << self
    def acquire
      FileUtils.mkdir_p(File.dirname(LOCK_FILE))
      @lock_file = File.open(LOCK_FILE, File::RDWR | File::CREAT, 0o644)
      unless @lock_file.flock(File::LOCK_EX | File::LOCK_NB)
        @lock_file.close
        raise "Another backup or restore operation is already in progress"
      end
      @lock_file.write(Process.pid.to_s)
      @lock_file.flush
      true
    end

    def release
      if @lock_file
        @lock_file.flock(File::LOCK_UN)
        @lock_file.close
        @lock_file = nil
      end
      File.delete(LOCK_FILE) if File.exist?(LOCK_FILE)
      true
    rescue StandardError
      true
    end

    def locked?
      FileUtils.mkdir_p(File.dirname(LOCK_FILE))
      f = File.open(LOCK_FILE, File::RDWR | File::CREAT, 0o644)
      locked = !f.flock(File::LOCK_EX | File::LOCK_NB)
      f.flock(File::LOCK_UN)
      f.close
      locked
    end
  end
end
