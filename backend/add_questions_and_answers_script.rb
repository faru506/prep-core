# rubocop:disable all

data = []

ruby_course = Course.find_or_create_by!(title: 'Ruby', slug: 'ruby')
puts "Course: #{ruby_course.title} (ID: #{ruby_course.id})"

data.each do |topic_data|
  topic = Topic.find_or_create_by!(title: topic_data[:title], course: ruby_course) do |t|
    t.slug = topic_data[:title].downcase.gsub(/\s+/, '-')
  end
  puts "  Topic: #{topic.title} (ID: #{topic.id})"

  topic_data[:questions].each_with_index do |q_data, index|
    question = Question.find_or_create_by!(title: q_data[:title], topic: topic)
    question.update!(level: q_data[:level], position: index)

    answer = question.answer || question.create_answer
    answer.update!(content: q_data[:answer])
    
    puts "    Question: #{question.title} [#{question.level}] (Updated Answer)"
  end
end

puts 'Successfully updated/seeded Ruby course content to HTML!'
# rubocop:enable all
