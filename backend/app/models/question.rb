class Question
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  field :position, type: Integer

  belongs_to :topic

  embeds_one :answer, cascade_callbacks: true

  validates :title, presence: true

  index({ topic_id: 1 })
  index({ position: 1 })
end