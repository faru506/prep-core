# frozen_string_literal: true

# update_ruby_to_html.rb
# This script ensures that the Ruby course, topics, and questions exist and have the correct HTML content.

data = [
  {
  title: 'Ruby Basics',
  questions: [

    {
      title: 'Is everything in Ruby an object?',
      level: 'low',
      answer: '<p>Yes, everything in Ruby is an object, including numbers, booleans, and nil.</p><pre class="editor-code-block"><code>5.class      # Integer
true.class   # TrueClass
nil.class    # NilClass</code></pre>'
    },

    {
      title: 'What are truthy and falsy values in Ruby?',
      level: 'medium',
      answer: '<p>Only <code>false</code> and <code>nil</code> are falsy in Ruby. Everything else is truthy.</p><pre class="editor-code-block"><code>if 0
  puts "Runs"  # 0 is truthy
end</code></pre>'
    },

    {
      title: 'How do you check the type of a variable in Ruby?',
      level: 'low',
      answer: '<p>You can use the <code>.class</code> method to check the type of a variable.</p><pre class="editor-code-block"><code>name = "Farooq"
puts name.class  # String</code></pre>'
    },

    {
      title: 'What is multiple assignment in Ruby?',
      level: 'medium',
      answer: '<p>Multiple assignment allows assigning multiple variables at once.</p><pre class="editor-code-block"><code>a, b = 1, 2

# Swapping variables
a, b = b, a</code></pre>'
    },

    {
      title: 'Explain the difference between == and equal? in Ruby.',
      level: 'medium',
      answer: '<p><code>==</code> checks value equality, while <code>equal?</code> checks object identity.</p><pre class="editor-code-block"><code>a = "hi"
b = "hi"

a == b        # true
a.equal?(b)   # false</code></pre>'
    },

    {
      title: 'How do you convert a string to integer in Ruby?',
      level: 'low',
      answer: '<p>You can use <code>to_i</code> method to convert a string into an integer.</p><pre class="editor-code-block"><code>num = "10"
num.to_i   # 10</code></pre>'
    },

    {
      title: 'How do you convert an integer to string in Ruby?',
      level: 'low',
      answer: '<p>You can use <code>to_s</code> method to convert an integer into a string.</p><pre class="editor-code-block"><code>num = 10
num.to_s   # "10"</code></pre>'
    },

    {
      title: 'What is the difference between nil and empty? in Ruby?',
      level: 'medium',
      answer: '<p><code>nil</code> represents absence of value, while <code>empty?</code> checks if collection has no elements.</p><pre class="editor-code-block"><code>name = nil
puts name.nil?   # true

arr = []
puts arr.empty?  # true</code></pre>'
    },

    {
      title: 'How do you define a method in Ruby?',
      level: 'low',
      answer: '<p>Methods are defined using the <code>def</code> keyword.</p><pre class="editor-code-block"><code>def greet
  puts "Hello"
end

greet</code></pre>'
    },

    {
      title: 'How do you pass arguments to a method?',
      level: 'low',
      answer: '<p>Arguments can be passed inside parentheses after method name.</p><pre class="editor-code-block"><code>def greet(name)
  puts "Hello #{name}"
end

greet("Farooq")</code></pre>'
    },

    {
      title: 'What are default arguments in Ruby methods?',
      level: 'medium',
      answer: '<p>Default arguments allow assigning default values to parameters.</p><pre class="editor-code-block"><code>def greet(name = "Guest")
  puts "Hello #{name}"
end

greet       # Hello Guest
greet("Farooq")</code></pre>'
    },

    {
      title: 'What is method return behavior in Ruby?',
      level: 'medium',
      answer: '<p>Ruby methods return the last evaluated expression automatically.</p><pre class="editor-code-block"><code>def add(a, b)
  a + b
end

puts add(2, 3)  # 5</code></pre>'
    },

    {
      title: 'How does Ruby handle operator precedence?',
      level: 'medium',
      answer: '<p>Ruby follows mathematical precedence rules: parentheses first, then multiplication/division, then addition/subtraction.</p><pre class="editor-code-block"><code>result = 2 + 3 * 4
puts result   # 14</code></pre>'
    },

    {
      title: 'What is the ternary operator in Ruby?',
      level: 'medium',
      answer: '<p>The ternary operator provides a shorthand conditional expression.</p><pre class="editor-code-block"><code>age = 18

status = age >= 18 ? "Adult" : "Minor"
puts status</code></pre>'
    },

    {
      title: 'What happens if you use an undefined variable in Ruby?',
      level: 'hard',
      answer: '<p>Using an undefined variable raises a <code>NameError</code>.</p><pre class="editor-code-block"><code>puts username

# NameError: undefined local variable</code></pre>'
    }

  ]
}
]

ruby_course = Course.find_or_create_by!(title: 'Ruby', slug: 'ruby')
puts "Course: #{ruby_course.title} (ID: #{ruby_course.id})"

data.each do |topic_data|
  topic = Topic.find_or_create_by!(title: topic_data[:title], course: ruby_course) do |t|
    t.slug = topic_data[:title].downcase.gsub(/\s+/, '-')
  end
  puts "  Topic: #{topic.title} (ID: #{topic.id})"

  topic_data[:questions].each do |q_data|
    question = Question.find_or_create_by!(title: q_data[:title], topic: topic)
    question.update!(level: q_data[:level])

    answer = question.answer || question.create_answer
    answer.update!(content: q_data[:answer])
    
    puts "    Question: #{question.title} [#{question.level}] (Updated Answer)"
  end
end

puts 'Successfully updated/seeded Ruby course content to HTML!'
