class Api::V1::Admin::BackupsController < Api::V1::Admin::AdminController
  before_action :check_lock, only: [ :create, :restore ]

  def index
    backups = BackupService.list_backups
    render json: { backups: backups }
  end

  def create
    entry = BackupService.create_backup(created_by: current_user&.email)
    render json: { message: "Backup created successfully", backup: entry }, status: :created
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def download
    filename = params[:id].to_s
    raise "Invalid filename" if filename.blank? || filename.include?("..") || filename.include?("/") || filename.include?("\\")
    raise "Invalid filename" unless filename.match?(/\A[a-zA-Z0-9._-]+\.gz\z/)
    filepath = Rails.root.join("storage", "backups").join(filename)
    raise "Backup not found" unless File.exist?(filepath.to_s)

    send_file filepath.to_s, type: "application/gzip", disposition: "attachment", filename: filename, x_sendfile: false
  rescue => e
    render json: { error: e.message }, status: :not_found
  end

  def destroy
    filename = params[:id]
    BackupService.delete_backup(filename)
    render json: { message: "Backup deleted successfully" }
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def restore
    if Rails.env.production? && ENV["ALLOW_RESTORE_IN_PROD"] != "true"
      return render json: { error: "Restore is disabled in production. Set ALLOW_RESTORE_IN_PROD=true to enable." }, status: :forbidden
    end

    confirmation = params[:confirmation].to_s
    unless confirmation == "RESTORE"
      return render json: { error: "Confirmation required. Type RESTORE to confirm." }, status: :unprocessable_entity
    end

    result =
      if params[:file].present?
        RestoreService.restore_from_upload(params[:file], created_by: current_user&.email)
      elsif params[:filename].present?
        RestoreService.restore_from_file(params[:filename], created_by: current_user&.email)
      else
        return render json: { error: "filename or file required" }, status: :bad_request
      end

    render json: { message: "Database restored successfully", pre_restore: result[:pre_restore] }
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  ensure
    BackupLock.release
  end

  private

  def check_lock
    if BackupLock.locked?
      render json: { error: "Another backup or restore operation is in progress" }, status: :conflict
    end
  end
end
