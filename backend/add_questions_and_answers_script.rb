# frozen_string_literal: true
# rubocop:disable all

# update_ruby_to_html.rb
# This script ensures that the Ruby course, topics, and questions exist and have the correct HTML content.

data = [
  {
title: 'Ruby Basics',
questions: [

{
  title: 'What are the basic data types available in Ruby?',
  level: 'low',
  answer: '<p>Ruby provides several built-in data types that are commonly used in applications.</p>

<p><strong>Common Ruby data types:</strong></p>
<ul>
<li><strong>Integer</strong> — whole numbers</li>
<li><strong>Float</strong> — decimal numbers</li>
<li><strong>String</strong> — sequence of characters</li>
<li><strong>Array</strong> — ordered list of values</li>
<li><strong>Hash</strong> — key-value pairs</li>
<li><strong>Boolean</strong> — true or false</li>
<li><strong>Nil</strong> — represents no value</li>
</ul>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
age = 25                # Integer
price = 99.99           # Float
name = "Farooq"         # String
marks = [80, 90, 100]   # Array
user = {name: "Ali"}    # Hash
is_active = true        # Boolean
value = nil             # Nil
</code></pre>'
},

{
  title: 'Explain the difference between puts, print, and p in Ruby.',
  level: 'low',
  answer: '<p>Ruby provides multiple ways to output data to the console.</p>

<ul>
<li><strong>puts</strong> — prints output with newline</li>
<li><strong>print</strong> — prints without newline</li>
<li><strong>p</strong> — prints object in debug-friendly format</li>
</ul>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
puts "Hello"
puts "World"

print "Hello"
print "World"

p "Hello"
</code></pre>

<p><strong>Output:</strong></p>

<pre class="editor-code-block"><code>
Hello
World
HelloWorld
"Hello"
</code></pre>'
},

{
  title: 'What is the difference between String and Symbol in Ruby?',
  level: 'low',
  answer: '<p><strong>Strings</strong> and <strong>Symbols</strong> are both used to represent text, but they behave differently.</p>

<ul>
<li><strong>String</strong> — mutable (can be changed)</li>
<li><strong>Symbol</strong> — immutable and memory-efficient</li>
<li>Symbols are commonly used as <strong>hash keys</strong></li>
</ul>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
str = "hello"
str.upcase!

sym = :hello

puts str      # "HELLO"
puts sym      # :hello
</code></pre>'
},

{
  title: 'How do you define variables in Ruby? Explain naming conventions.',
  level: 'low',
  answer: '<p>Variables in Ruby are dynamically typed and do not require explicit type declarations.</p>

<p><strong>Naming conventions:</strong></p>
<ul>
<li>Must start with lowercase letter or underscore</li>
<li>Use snake_case</li>
<li>Cannot start with numbers</li>
</ul>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
user_name = "Farooq"
age = 24
_is_valid = true
</code></pre>'
},

{
  title: 'Explain conditional statements in Ruby with examples.',
  level: 'low',
  answer: '<p>Conditional statements allow execution of code based on conditions.</p>

<p><strong>Ruby supports:</strong></p>
<ul>
<li>if</li>
<li>elsif</li>
<li>else</li>
<li>unless</li>
<li>case</li>
</ul>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
age = 18

if age &gt;= 18
  puts "Adult"
else
  puts "Minor"
end
</code></pre>'
},

{
  title: 'Explain the difference between Array and Hash in Ruby.',
  level: 'medium',
  answer: '<p><strong>Array</strong> and <strong>Hash</strong> are collection data structures in Ruby.</p>

<ul>
<li><strong>Array</strong> stores ordered elements accessed by index</li>
<li><strong>Hash</strong> stores key-value pairs accessed by keys</li>
</ul>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
# Array
fruits = ["apple", "banana"]
puts fruits[0]

# Hash
user = {name: "Ali", age: 25}
puts user[:name]
</code></pre>'
},

{
  title: 'What are Ruby blocks? Explain with example.',
  level: 'medium',
  answer: '<p>A <strong>block</strong> is a chunk of code passed to methods.</p>

<p>Blocks are commonly used with iterators.</p>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
numbers = [1, 2, 3]

numbers.each do |num|
  puts num * 2
end
</code></pre>

<p>Here, the code inside <strong>do...end</strong> is the block.</p>'
},

{
  title: 'Explain how loops work in Ruby. Give examples of different loop types.',
  level: 'medium',
  answer: '<p>Loops allow repeated execution of code.</p>

<p><strong>Common Ruby loops:</strong></p>

<ul>
<li>while</li>
<li>until</li>
<li>for</li>
<li>each</li>
</ul>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
i = 1

while i &lt;= 3
  puts i
  i += 1
end
</code></pre>'
},

{
  title: 'What is the difference between ==, eql?, and equal? in Ruby?',
  level: 'medium',
  answer: '<p>Ruby provides multiple equality methods.</p>

<ul>
<li><strong>==</strong> compares values</li>
<li><strong>eql?</strong> compares value and type</li>
<li><strong>equal?</strong> checks object identity</li>
</ul>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
a = "hello"
b = "hello"

puts a == b        # true
puts a.eql?(b)     # true
puts a.equal?(b)   # false
</code></pre>'
},

{
  title: 'Explain how methods are defined in Ruby and how arguments work.',
  level: 'medium',
  answer: '<p>Methods in Ruby are defined using the <strong>def</strong> keyword.</p>

<p>Ruby supports:</p>

<ul>
<li>Default arguments</li>
<li>Keyword arguments</li>
<li>Variable arguments</li>
</ul>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
def greet(name = "Guest")
  puts "Hello #{name}"
end

greet("Farooq")
greet
</code></pre>'
},

{
  title: 'Explain the difference between nil and false in Ruby.',
  level: 'medium',
  answer: '<p>In Ruby, both <strong>nil</strong> and <strong>false</strong> are falsy values, but they are different.</p>

<ul>
<li><strong>nil</strong> represents absence of value</li>
<li><strong>false</strong> represents boolean false</li>
</ul>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
value = nil

if value
  puts "True"
else
  puts "Falsy"
end
</code></pre>

<p>Output:</p>

<pre class="editor-code-block"><code>
Falsy
</code></pre>'
},

{
  title: 'Predict the output of the following Ruby code and explain why.',
  level: 'hard',
  answer: '<p>This question tests understanding of Ruby object references.</p>

<p><strong>Code:</strong></p>

<pre class="editor-code-block"><code>
arr1 = [1, 2, 3]
arr2 = arr1

arr2 &lt;&lt; 4

puts arr1.inspect
</code></pre>

<p><strong>Output:</strong></p>

<pre class="editor-code-block"><code>
[1, 2, 3, 4]
</code></pre>

<p><strong>Explanation:</strong></p>

<ul>
<li>arr1 and arr2 reference the same object</li>
<li>Appending to arr2 modifies arr1</li>
</ul>'
},

{
  title: 'What is the difference between dup and clone in Ruby?',
  level: 'hard',
  answer: '<p>Both <strong>dup</strong> and <strong>clone</strong> create copies of objects.</p>

<ul>
<li><strong>dup</strong> copies object without frozen state</li>
<li><strong>clone</strong> copies object including frozen state</li>
</ul>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
str = "hello".freeze

dup_str = str.dup
clone_str = str.clone

puts dup_str.frozen?    # false
puts clone_str.frozen?  # true
</code></pre>'
},

{
  title: 'Explain how Ruby handles mutable objects and demonstrate a common bug caused by mutability.',
  level: 'hard',
  answer: '<p>Ruby objects like arrays and hashes are mutable, meaning their contents can change.</p>

<p>A common bug occurs when the same object reference is reused unintentionally.</p>

<p><strong>Example:</strong></p>

<pre class="editor-code-block"><code>
def add_item(list = [])
  list &lt;&lt; "item"
  list
end

puts add_item.inspect
puts add_item.inspect
</code></pre>

<p><strong>Output:</strong></p>

<pre class="editor-code-block"><code>
["item"]
["item", "item"]
</code></pre>

<p><strong>Explanation:</strong></p>

<ul>
<li>Default arguments are evaluated once</li>
<li>The same array object is reused</li>
</ul>'
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
