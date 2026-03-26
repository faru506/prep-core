# Usage:
# rails runner scripts/import_questions.rb PATH_TO_RB_FILES

Dir.glob(ARGV[0] || 'questions/**/*.rb').each do |file|
  topic_slug = File.basename(file, '.rb').split('_').first

  topic = InterviewTopic.find_by(slug: topic_slug)

  unless topic
    puts "SKIP: No topic found for slug '#{topic_slug}' (file: #{file})"
    next
  end

  questions = eval(File.read(file))

  questions.each_with_index do |q, i|
    InterviewQuestion.find_or_create_by!(
      interview_topic: topic,
      question: q[:question]
    ) do |iq|
      iq.answer        = q[:answer]
      iq.level         = q[:level] || 'intermediate'
      iq.tags          = q[:tags] || []
      iq.target_roles  = q[:target_roles] || [ 'sde1', 'sde2' ]
      iq.is_premium    = q[:premium] || false
      iq.is_published  = true
      iq.order         = i
      iq.source_file   = file
    end
  end

  puts "Imported #{questions.size} questions for #{topic.name}"
end
