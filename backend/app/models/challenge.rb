class Challenge
  include Mongoid::Document
  include Mongoid::Timestamps

  # Fields
  field :title,        type: String
  field :description,  type: String
  field :start_date,   type: Date
  field :end_date,     type: Date

  # Associations
  belongs_to :user

  # Indexes (useful if you query by dates)
  index({ start_date: 1 })
  index({ end_date: 1 })

  # Validations
  validates :title, :description, :start_date, :end_date, presence: true

  validate :end_date_after_start_date

  private

  def end_date_after_start_date
    return if start_date.blank? || end_date.blank?

    if end_date < start_date
      errors.add(:end_date, "must be after start date")
    end
  end
end
