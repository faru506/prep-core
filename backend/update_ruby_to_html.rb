# rubocop:disable all
# update_ruby_to_html.rb
data = [
  {
    title: 'Ruby Basics',
    questions: [
      { 
        title: 'What are the basic data types in Ruby?', 
        answer: '<p>Basic data types include:</p><ul><li><strong>Integers</strong>: <code>1</code>, <code>42</code></li><li><strong>Floats</strong>: <code>3.14</code>, <code>0.5</code></li><li><strong>Strings</strong>: \'Hello\', "World"</li><li><strong>Symbols</strong>: <code>:name</code>, <code>:id</code></li><li><strong>Booleans</strong>: <code>true</code>, <code>false</code></li><li><strong>Nil</strong>: <code>nil</code> (representing nothingness)</li></ul>' 
      },
      { 
        title: 'What is the difference between a local variable and a global variable in Ruby?', 
        answer: '<p>Local variables are scoped to the current method or block. Global variables are accessible everywhere.</p><pre class="editor-code-block"><code># Local variable
name = "Farooq"

# Global variable
$global_config = { theme: "dark" }</code></pre>' 
      },
      { 
        title: 'How do you define a constant in Ruby?', 
        answer: '<p>Constants start with an uppercase letter. While Ruby allows changing them, it issues a warning.</p><pre class="editor-code-block"><code>MAX_RETRY = 3
PI = 3.14159</code></pre>' 
      },
      { 
        title: 'Explain the difference between `puts`, `print`, and `p` in Ruby.', 
        answer: '<p>- <code>puts</code>: Adds a newline.<br>- <code>print</code>: No newline.<br>- <code>p</code>: Prints the <code>.inspect</code> version (great for debugging).</p><pre class="editor-code-block"><code>arr = [1, 2]
puts arr # Prints as separate lines
print arr # Prints as [1, 2] without newline
p arr # Prints as [1, 2] with newline</code></pre>' 
      },
      { 
        title: 'What is a symbol in Ruby and why is it used?', 
        answer: '<p>A symbol is an immutable, unique identifier.</p><p><strong>Memory Comparison:</strong></p><ul><li><strong>String</strong>: Every time you create "name", a new object is created.</li><li><strong>Symbol</strong>: <code>:name</code> always refers to the exact same object in memory.</li></ul><pre class="editor-code-block"><code>"name".object_id # Different every time
:name.object_id    # Same every time</code></pre>' 
      },
      { 
        title: 'How does Ruby handle string interpolation?', 
        answer: '<p>Ruby uses <code>\#{}</code> inside double quotes.</p><pre class="editor-code-block"><code>name = "Alice"
puts "Hello, \#{name}!" # => Hello, Alice!
puts \'Hello, \#{name}!\'   # => Hello, #{name}! (Single quotes don\'t interpolate)</code></pre>' 
      },
      { 
        title: 'Explain the use of the `unless` statement in Ruby.', 
        answer: '<p><code>unless</code> is the opposite of <code>if</code>.</p><pre class="editor-code-block"><code># Instead of:
if !user.logged_in?
  redirect_to login_path
end

# Use:
unless user.logged_in?
  redirect_to login_path
end</code></pre>' 
      },
      { 
        title: 'How do loops like `while` and `until` differ in Ruby?', 
        answer: '<p>- <code>while</code>: Runs while condition is <strong>true</strong>.<br>- <code>until</code>: Runs while condition is <strong>false</strong>.</p><pre class="editor-code-block"><code>i = 0
while i < 5
  puts i
  i += 1
end

j = 0
until j == 5
  puts j
  j += 1
end</code></pre>' 
      },
      { 
        title: 'What is the difference between `||=` and `=` in Ruby?', 
        answer: '<p><code>||=</code> (Memoization) assigns a value only if the left side is <code>nil</code> or <code>false</code>.</p><pre class="editor-code-block"><code>@user ||= User.find(1) 
# If @user exists, it does nothing. 
# If @user is nil, it fetches from DB.</code></pre>' 
      },
      { 
        title: 'Explain how Ruby manages memory for strings versus symbols.', 
        answer: '<p>Strings are heap-allocated objects. Symbols are stored in a global symbol table (interned). This means symbols are faster for comparisons (pointer comparison vs character-by-character) and use less memory when repeated frequently.</p>' 
      }
    ]
  },
  {
    title: 'OOP Fundamentals',
    questions: [
      { 
        title: 'What is a class in Ruby?', 
        answer: '<p>A class is a blueprint for objects.</p><pre class="editor-code-block"><code>class Robot
  def greet
    puts "Hello!"
  end
end

bot = Robot.new
bot.greet</code></pre>' 
      },
      { 
        title: 'What is the purpose of the `initialize` method in a Ruby class?', 
        answer: '<p>It\'s the constructor. It sets the initial state.</p><pre class="editor-code-block"><code>class User
  def initialize(name)
    @name = name
  end
end

u = User.new("Bob") # calls initialize</code></pre>' 
      },
      { 
        title: 'How do you create an instance of a class in Ruby?', 
        answer: '<p>By calling <code>.new</code>.</p><pre class="editor-code-block"><code>car = Car.new</code></pre>' 
      },
      { 
        title: 'What is inheritance in Ruby and how is it implemented?', 
        answer: '<p>Implemented using <code><</code>.</p><pre class="editor-code-block"><code>class Animal
  def eat; puts "Nom nom"; end
end

class Dog < Animal
  def bark; puts "Woof!"; end
end

d = Dog.new
d.eat # Inherited
d.bark # Own method</code></pre>' 
      },
      { 
        title: 'What is `attr_accessor` and what does it do?', 
        answer: '<p>It creates getter and setter methods.</p><pre class="editor-code-block"><code>class Person
  attr_accessor :name
end

p = Person.new
p.name = "Joe" # Setter
puts p.name     # Getter</code></pre>' 
      },
      { 
        title: 'Explain the difference between `attr_reader` and `attr_writer`.', 
        answer: '<p>- <code>attr_reader</code>: Only getter.<br>- <code>attr_writer</code>: Only setter.</p><pre class="editor-code-block"><code>class Secret
  attr_reader :key
  def initialize; @key = "123"; end
end

s = Secret.new
puts s.key # OK
s.key = "456" # Error: NoWriterError</code></pre>' 
      },
      { 
        title: 'What is the `self` keyword used for in Ruby classes?', 
        answer: '<p>Refers to the current object.</p><pre class="editor-code-block"><code>class Example
  def who_am_i
    puts self # The instance
  end

  def self.class_method
    puts self # The Example class
  end
end</code></pre>' 
      },
      { 
        title: 'How do you define a class method in Ruby?', 
        answer: '<p>Use <code>def self.method_name</code>.</p><pre class="editor-code-block"><code>class Calculator
  def self.add(a, b)
    a + b
  end
end

Calculator.add(2, 3) # 5</code></pre>' 
      },
      { 
        title: 'What is method overriding in Ruby?', 
        answer: '<p>When a subclass replaces a method from the parent.</p><pre class="editor-code-block"><code>class Parent
  def info; puts "I am Parent"; end
end

class Child < Parent
  def info; puts "I am Child"; end
end</code></pre>' 
      },
      { 
        title: 'What does the `super` keyword do in Ruby?', 
        answer: '<p>Calls the parent\'s method.</p><pre class="editor-code-block"><code>class Parent
  def greet; puts "Hello from Parent"; end
end

class Child < Parent
  def greet
    super
    puts "Hello from Child"
  end
end
# Result: Hello from Parent \n Hello from Child</code></pre>' 
      }
    ]
  },
  {
    title: 'Collections',
    questions: [
      { 
        title: 'What is an Array in Ruby?', 
        answer: '<p>Ordered, integer-indexed collection.</p><pre class="editor-code-block"><code>list = ["Apple", "Banana", 10, :fruit]
puts list[0] # Apple</code></pre>' 
      },
      { 
        title: 'How do you add an element to the end of an array?', 
        answer: '<p>Use <code><<</code> or <code>.push</code>.</p><pre class="editor-code-block"><code>arr = [1, 2]
arr << 3
# arr is now [1, 2, 3]</code></pre>' 
      },
      { 
        title: 'What is a Hash in Ruby?', 
        answer: '<p>Key-value pairs.</p><pre class="editor-code-block"><code>user = { name: "Alice", age: 25 }
puts user[:name] # Alice</code></pre>' 
      },
      { 
        title: 'How do you access a value in a Hash using a key?', 
        answer: '<p>Bracket notation.</p><pre class="editor-code-block"><code>h = { a: 1 }
h[:a] # 1</code></pre>' 
      },
      { 
        title: 'What is the difference between `.map` and `.each` in Ruby?', 
        answer: '<p>- <code>.each</code>: returns the original array.<br>- <code>.map</code>: returns a new array with modified elements.</p><pre class="editor-code-block"><code>nums = [1, 2, 3]
nums.each { |n| n * 2 } # => [1, 2, 3]
nums.map { |n| n * 2 }  # => [2, 4, 6]</code></pre>' 
      },
      { 
        title: 'How does the `.select` method work on collections?', 
        answer: '<p>Filters items that return true.</p><pre class="editor-code-block"><code>nums = [1, 2, 3, 4]
nums.select { |n| n.even? } # => [2, 4]</code></pre>' 
      },
      { 
        title: 'What is the purpose of the `.reject` method?', 
        answer: '<p>Opposite of `.select`.</p><pre class="editor-code-block"><code>nums = [1, 2, 3, 4]
nums.reject { |n| n.even? } # => [1, 3]</code></pre>' 
      },
      { 
        title: 'What is a Range in Ruby and how is it defined?', 
        answer: '<p>Sequence between two values.</p><pre class="editor-code-block"><code>(1..5).to_a   # [1, 2, 3, 4, 5]
(1...5).to_a  # [1, 2, 3, 4] (exclusive)</code></pre>' 
      },
      { 
        title: 'Explain the time and space complexity of accessing a value in a Hash.', 
        answer: '<p>Time: <strong>O(1)</strong> on average. Space: <strong>O(n)</strong> where n is number of entries.</p>' 
      },
      { 
        title: 'Compare `Array#compact` and `Array#flatten`.', 
        answer: '<p>- <code>compact</code>: removes nils.<br>- <code>flatten</code>: removes nesting.</p><pre class="editor-code-block"><code>[1, nil, 2].compact    # => [1, 2]
[[1, 2], [3]].flatten  # => [1, 2, 3]</code></pre>' 
      }
    ]
  },
  {
    title: 'Blocks & Iterators',
    questions: [
      { 
        title: 'What is a block in Ruby?', 
        answer: '<p>Anonymous function passed to a method.</p><pre class="editor-code-block"><code>[1, 2].each { |x| puts x }</code></pre>' 
      },
      { 
        title: 'What does the `yield` keyword do?', 
        answer: '<p>Tells Ruby to run the block passed to the method.</p><pre class="editor-code-block"><code>def run_me
  puts "Start"
  yield
  puts "End"
end

run_me { puts "Middle" }
# Output: Start \n Middle \n End</code></pre>' 
      },
      { 
        title: 'How can you check if a block was given to a method?', 
        answer: '<p>Use <code>block_given?</code>.</p><pre class="editor-code-block"><code>def greet
  if block_given?
    yield
  else
    puts "Hello!"
  end
end</code></pre>' 
      },
      { 
        title: 'What is the difference between `times` and `upto` iterators?', 
        answer: '<p>- <code>times</code>: starts from 0.<br>- <code>upto</code>: starts from a specific value.</p><pre class="editor-code-block"><code>3.times { |i| puts i }   # 0, 1, 2
1.upto(3) { |i| puts i } # 1, 2, 3</code></pre>' 
      },
      { 
        title: 'How does `.each_with_index` work?', 
        answer: '<p>Yields element and index.</p><pre class="editor-code-block"><code>["a", "b"].each_with_index { |val, i| puts "#{i}: #{val}" }
# 0: a \n 1: b</code></pre>' 
      },
      { 
        title: 'What happens if you call `yield` in a method that was called without a block?', 
        answer: '<p>Raises <code>LocalJumpError</code>. Use <code>block_given?</code> to prevent this.</p>' 
      },
      { 
        title: 'Compare `do...end` blocks with curly brace `{...}` blocks in terms of precedence.', 
        answer: '<p><code>{}</code> has higher precedence than <code>do...end</code>.</p><pre class="editor-code-block"><code># These behave differently when passed to a method:
foo(1, { puts "hi" }) # block is passed to foo
foo(1, do puts "hi" end) # block is passed to the method call, not foo</code></pre>' 
      },
      { 
        title: 'Explain how a block can modify a variable outside its scope.', 
        answer: '<p>Blocks are closures.</p><pre class="editor-code-block"><code>count = 0
[1, 2].each { count += 1 }
puts count # => 2</code></pre>' 
      },
      { 
        title: 'How do you pass arguments to a block using `yield`?', 
        answer: '<p>Pass arguments to <code>yield</code>.</p><pre class="editor-code-block"><code>def multiply_by_two
  yield(2)
end

multiply_by_two { |num| puts 10 * num } # 20</code></pre>' 
      },
      { 
        title: 'What is the difference between a block and a Proc?', 
        answer: '<p>Blocks are syntactic sugar; Procs are actual objects.</p><pre class="editor-code-block"><code>my_proc = Proc.new { puts "Hi" }
my_proc.call</code></pre>' 
      }
    ]
  },
  {
    title: 'Modules & Mixins',
    questions: [
      { 
        title: 'What is a Module in Ruby?', 
        answer: '<p>Collection of methods. No instances.</p><pre class="editor-code-block"><code>module Logger
  def log(msg); puts "LOG: #{msg}"; end
end</code></pre>' 
      },
      { 
        title: 'What is a Mixin?', 
        answer: '<p>Adding module methods to a class.</p><pre class="editor-code-block"><code>class User
  include Logger
end
User.new.log("User created")</code></pre>' 
      },
      { 
        title: 'What is the difference between `include` and `extend`?', 
        answer: '<p>- <code>include</code>: Instance methods.<br>- <code>extend</code>: Class methods.</p><pre class="editor-code-block"><code>module M; def hello; "hi"; end; end
class A; include M; end
A.new.hello # works

class B; extend M; end
B.hello # works</code></pre>' 
      },
      { 
        title: 'What is the purpose of the `Comparable` module?', 
        answer: '<p>Provides comparison methods.</p><pre class="editor-code-block"><code>class Version
  include Comparable
  def initialize(v); @v = v; end
  def <=>(other); @v <=> other.v; end
  attr_reader :v
end
Version.new(1) < Version.new(2) # true</code></pre>' 
      },
      { 
        title: 'What is the `Enumerable` module?', 
        answer: '<p>Provides <code>.map</code>, <code>.reduce</code>, etc. Requires <code>.each</code>.</p><pre class="editor-code-block"><code>module MyList
  include Enumerable
  def each; yield 1; yield 2; end
end
# Now MyList has .map, .select, etc.</code></pre>' 
      },
      { 
        title: 'How do modules help in avoiding multiple inheritance issues?', 
        answer: '<p>Ruby allows only one parent class, but many included modules. This avoids the \'Diamond Problem\' found in C++.</p>' 
      },
      { 
        title: 'Explain the concept of a \'Namespace\' in the context of Ruby modules.', 
        answer: '<p>Prevents naming clashes.</p><pre class="editor-code-block"><code>module Payment
  class Processor; end
end

module Shipping
  class Processor; end
end</code></pre>' 
      },
      { 
        title: 'What is the \'Ancestors\' chain in Ruby?', 
        answer: '<p>The search path for methods: Class -> Modules -> Superclass -> ... -> Object -> BasicObject.</p>' 
      },
      { 
        title: 'How does `prepend` differ from `include`?', 
        answer: '<p>- <code>include</code>: Module is after the class.<br>- <code>prepend</code>: Module is before the class.</p><pre class="editor-code-block"><code>module M; def say; puts "Mod"; end; end
class A; prepend M; def say; puts "Class"; end; end
A.new.say # Prints "Mod" (since it\'s prepended)</code></pre>' 
      },
      { 
        title: 'Explain how to use a module as a singleton class extension.', 
        answer: '<p>Using <code>extend</code> on an instance.</p><pre class="editor-code-block"><code>module Extra; def secret; "ssh!"; end; end
obj = Object.new
obj.extend(Extra)
obj.secret # "ssh!"</code></pre>' 
      }
    ]
  },
  {
    title: 'Exception Handling',
    questions: [
      { 
        title: 'What is the basic syntax for handling exceptions in Ruby?', 
        answer: '<p>
```ruby
begin
  1 / 0
rescue ZeroDivisionError => e
  puts "Error: #{e.message}"
end
```' 
      },
      { 
        title: 'What does the `ensure` block do?', 
        answer: '<p>Runs no matter what.</p><pre class="editor-code-block"><code>begin
  file = File.open("test.txt")
rescue
  puts "Error"
ensure
  file.close # Always closes
end</code></pre>' 
      },
      { 
        title: 'How do you manually raise an exception in Ruby?', 
        answer: '<p>Using <code>raise</code>.</p><pre class="editor-code-block"><code>raise "Custom Error" if value < 0</code></pre>' 
      },
      { 
        title: 'What is the base class for most exceptions in Ruby?', 
        answer: '<p><code>StandardError</code>. Do not rescue <code>Exception</code> as it catches <code>SignalException</code> (like Ctrl+C).</p>' 
      },
      { 
        title: 'How do you rescue multiple specific exceptions in one block?', 
        answer: '<p>Comma-separated.</p><pre class="editor-code-block"><code>begin
  # code
rescue TypeError, ArgumentError => e
  puts e.message
end</code></pre>' 
      },
      { 
        title: 'What is the difference between `raise` and `fail`?', 
        answer: '<p>They are identical. <code>fail</code> is used to signal a failure in logic.</p>' 
      },
      { 
        title: 'How do you create a custom exception class?', 
        answer: '<p>Inherit from <code>StandardError</code>.</p><pre class="editor-code-block"><code>class MyError < StandardError; end
raise MyError, "Something happened"</code></pre>' 
      },
      { 
        title: 'Explain the `retry` keyword in a `rescue` block.', 
        answer: '<p>Re-runs the <code>begin</code> block.</p><pre class="editor-code-block"><code>begin
  do_risky_network_call
rescue NetworkError
  retry # tries again
end</code></pre>' 
      },
      { 
        title: 'What happens if an exception is raised but not rescued anywhere?', 
        answer: '<p>The program crashes and prints a stack trace (backtrace).</p>' 
      },
      { 
        title: 'How do you handle exceptions that occur within an `ensure` block?', 
        answer: '<p>They bubble up and override the original exception if one was active.</p>' 
      }
    ]
  }
]

ruby_course = Course.find_or_create_by(title: 'Ruby', slug: 'ruby')

data.each do |topic_data|
  topic = Topic.find_by(title: topic_data[:title], course: ruby_course)
  next unless topic

  topic_data[:questions].each do |q_data|
    question = Question.find_by(title: q_data[:title], topic: topic)
    next unless question

    if question.answer
      question.answer.update(content: q_data[:answer])
    else
      question.create_answer(content: q_data[:answer])
    end
  end
end

puts 'Successfully updated Ruby SDE 1 to HTML content!'
