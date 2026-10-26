namespace :backup do
  desc "Create a full database backup"
  task create: :environment do
    begin
      entry = BackupService.create_backup(created_by: "rake")
      puts "Backup created: #{entry['filename']} (#{entry['size_human']})"
    rescue => e
      puts "Error: #{e.message}"
      exit 1
    end
  end

  desc "List all backups"
  task list: :environment do
    backups = BackupService.list_backups
    if backups.empty?
      puts "No backups found"
    else
      backups.each do |b|
        puts "#{b['filename']} - #{b['size_human']} - #{b['created_at']}#{b['created_by'] ? " (#{b['created_by']})" : ''}"
      end
    end
  end

  desc "Restore from a backup file"
  task :restore, [ :filename ] => :environment do |_t, args|
    filename = args[:filename]
    raise "Usage: rake backup:restore[filename.gz]" if filename.blank?
    begin
      result = RestoreService.restore_from_file(filename, created_by: "rake")
      puts "Restore completed. Pre-restore snapshot: #{result[:pre_restore]}"
    rescue => e
      puts "Error: #{e.message}"
      exit 1
    end
  end

  desc "Prune old backups"
  task prune: :environment do
    BackupService.prune!
    puts "Pruning completed"
  end
end
