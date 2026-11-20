require "fileutils"

class BackupLock
  LOCK_FILE = Rails.root.join("storage", "backups", ".backup.lock")

  class << self
    def acquire
      FileUtils.mkdir_p(File.dirname(LOCK_FILE))
      file = File.open(LOCK_FILE, File::RDWR | File::CREAT, 0o644)
      unless file.flock(File::LOCK_EX | File::LOCK_NB)
        file.close
        raise "Another backup or restore operation is already in progress"
      end
      file.rewind
      file.truncate(0)
      file.write(Process.pid.to_s)
      file.flush
      Thread.current[:backup_lock_file] = file
      true
    end

    def release
      file = Thread.current[:backup_lock_file]
      return true unless file

      file.flock(File::LOCK_UN)
      file.close
      Thread.current[:backup_lock_file] = nil
      true
    rescue StandardError
      Thread.current[:backup_lock_file] = nil
      true
    end

    def locked?
      FileUtils.mkdir_p(File.dirname(LOCK_FILE))
      file = File.open(LOCK_FILE, File::RDWR | File::CREAT, 0o644)
      locked = !file.flock(File::LOCK_EX | File::LOCK_NB)
      file.flock(File::LOCK_UN) unless locked
      file.close
      locked
    end
  end
end
