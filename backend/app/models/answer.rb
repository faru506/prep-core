class Answer
  include Mongoid::Document
  include Mongoid::Timestamps

  field :content, type: String

  embedded_in :question

  validates :content, presence: true
end