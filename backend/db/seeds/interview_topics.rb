topics = [
  { name: 'Ruby', icon: '💎', color: '#CC342D', description: 'Core Ruby language concepts' },
  { name: 'Rails', icon: '🛤️', color: '#CC0000', description: 'Ruby on Rails framework' },
  { name: 'React', icon: '⚛️', color: '#61DAFB', description: 'React.js and hooks' },
  { name: 'MongoDB', icon: '🍃', color: '#47A248', description: 'MongoDB and Mongoid ODM' },
  { name: 'Docker', icon: '🐳', color: '#2496ED', description: 'Docker and containerization' },
  { name: 'JavaScript', icon: '🟨', color: '#F7DF1E', description: 'Core JavaScript concepts' },
  { name: 'System Design', icon: '🏗️', color: '#8B5CF6', description: 'Architecture and design' },
  { name: 'DSA', icon: '🧮', color: '#F59E0B', description: 'Data structures and algorithms' },
]

topics.each_with_index do |t, i|
  InterviewTopic.find_or_create_by!(
    slug: t[:name].downcase.gsub(/\s+/, '-')
  ) do |topic|
    topic.name        = t[:name]
    topic.icon        = t[:icon]
    topic.color       = t[:color]
    topic.description = t[:description]
    topic.order       = i
    topic.is_active   = true
  end
end

puts "Seeded #{InterviewTopic.count} topics"