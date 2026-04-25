# frozen_string_literal: true

# update_ruby_to_html.rb
# This script ensures that the Ruby course, topics, and questions exist and have the correct HTML content.

data = [
  {
title: 'OOP Fundamentals',
questions: [

{
  title: 'What is Object-Oriented Programming (OOP) and how is it implemented in Ruby?',
  level: 'low',
  answer: '<p><strong>Object-Oriented Programming (OOP)</strong> is a programming paradigm based on objects that contain both data (attributes) and behavior (methods).</p>
  <p>Ruby is a <strong>pure object-oriented language</strong>, meaning everything in Ruby is an object.</p>
  <ul>
    <li><strong>Class</strong>: Blueprint for creating objects</li>
    <li><strong>Object</strong>: Instance of a class</li>
    <li><strong>Methods</strong>: Define behavior</li>
    <li><strong>Attributes</strong>: Store data</li>
  </ul>
  <pre class="editor-code-block"><code>
class Car
  def start
    puts "Car started"
  end
end

car = Car.new
car.start
  </code></pre>
  <p>Here, <strong>Car</strong> is a class and <strong>car</strong> is an object created from it.</p>'
},

{
  title: 'What is a class and an object in Ruby? Provide an example.',
  level: 'low',
  answer: '<p>A <strong>class</strong> is a blueprint used to create objects. An <strong>object</strong> is an instance of a class.</p>
  <pre class="editor-code-block"><code>
class User
  def greet
    puts "Hello User"
  end
end

user = User.new
user.greet
  </code></pre>
  <ul>
    <li><strong>User</strong> is the class</li>
    <li><strong>user</strong> is the object</li>
    <li><strong>greet</strong> is the method</li>
  </ul>'
},

{
  title: 'What is encapsulation in Ruby and how do you implement it?',
  level: 'low',
  answer: '<p><strong>Encapsulation</strong> is the concept of restricting direct access to object data and exposing it through methods.</p>
  <p>Ruby provides <strong>access modifiers</strong> like <strong>attr_reader</strong>, <strong>attr_writer</strong>, and <strong>attr_accessor</strong>.</p>
  <pre class="editor-code-block"><code>
class Person
  attr_accessor :name

  def initialize(name)
    @name = name
  end
end

person = Person.new("Farooq")
puts person.name
  </code></pre>
  <p>Here, <strong>name</strong> is accessed through getter and setter methods.</p>'
},

{
  title: 'Explain the difference between attr_reader, attr_writer, and attr_accessor.',
  level: 'low',
  answer: '<p>These methods create getter and setter methods automatically.</p>
  <ul>
    <li><strong>attr_reader</strong> → Getter only</li>
    <li><strong>attr_writer</strong> → Setter only</li>
    <li><strong>attr_accessor</strong> → Getter and Setter</li>
  </ul>
  <pre class="editor-code-block"><code>
class Product
  attr_reader :name
  attr_writer :price
  attr_accessor :stock

  def initialize(name, price, stock)
    @name = name
    @price = price
    @stock = stock
  end
end
  </code></pre>'
},

{
  title: 'What is the initialize method in Ruby and when is it called?',
  level: 'low',
  answer: '<p>The <strong>initialize</strong> method is a constructor that runs automatically when a new object is created.</p>
  <pre class="editor-code-block"><code>
class User
  def initialize(name)
    @name = name
  end

  def display
    puts @name
  end
end

user = User.new("Farooq")
user.display
  </code></pre>
  <p>The <strong>initialize</strong> method sets the initial state of the object.</p>'
},

{
  title: 'What is inheritance in Ruby? Provide an example.',
  level: 'medium',
  answer: '<p><strong>Inheritance</strong> allows one class to inherit behavior from another class.</p>
  <pre class="editor-code-block"><code>
class Animal
  def speak
    puts "Animal makes sound"
  end
end

class Dog < Animal
end

dog = Dog.new
dog.speak
  </code></pre>
  <p><strong>Dog</strong> inherits the <strong>speak</strong> method from <strong>Animal</strong>.</p>'
},

{
  title: 'What is method overriding in Ruby? Show an example.',
  level: 'medium',
  answer: '<p><strong>Method overriding</strong> occurs when a subclass provides its own implementation of a method defined in its parent class.</p>
  <pre class="editor-code-block"><code>
class Animal
  def speak
    puts "Animal sound"
  end
end

class Dog < Animal
  def speak
    puts "Dog barks"
  end
end

dog = Dog.new
dog.speak
  </code></pre>
  <p>The subclass method replaces the parent method.</p>'
},

{
  title: 'What is polymorphism in Ruby? Provide an example.',
  level: 'medium',
  answer: '<p><strong>Polymorphism</strong> allows different classes to respond to the same method name in different ways.</p>
  <pre class="editor-code-block"><code>
class Dog
  def sound
    puts "Bark"
  end
end

class Cat
  def sound
    puts "Meow"
  end
end

animals = [Dog.new, Cat.new]

animals.each do |animal|
  animal.sound
end
  </code></pre>
  <p>Each object responds differently to the same method.</p>'
},

{
  title: 'Explain the difference between instance methods and class methods.',
  level: 'medium',
  answer: '<p><strong>Instance methods</strong> belong to objects, while <strong>class methods</strong> belong to the class itself.</p>
  <pre class="editor-code-block"><code>
class MathHelper
  def instance_method
    puts "Instance method"
  end

  def self.class_method
    puts "Class method"
  end
end

obj = MathHelper.new
obj.instance_method

MathHelper.class_method
  </code></pre>'
},

{
  title: 'What is the difference between private, protected, and public methods in Ruby?',
  level: 'medium',
  answer: '<p>Ruby provides access control using method visibility.</p>
  <ul>
    <li><strong>public</strong> → Accessible anywhere</li>
    <li><strong>private</strong> → Only within same object</li>
    <li><strong>protected</strong> → Accessible within same class hierarchy</li>
  </ul>
  <pre class="editor-code-block"><code>
class Account
  def initialize(balance)
    @balance = balance
  end

  def withdraw(amount)
    deduct(amount)
  end

  private

  def deduct(amount)
    @balance -= amount
  end
end
  </code></pre>'
},

{
  title: 'What is the difference between composition and inheritance? When would you use composition?',
  level: 'medium',
  answer: '<p><strong>Inheritance</strong> represents an "is-a" relationship, while <strong>composition</strong> represents a "has-a" relationship.</p>
  <pre class="editor-code-block"><code>
class Engine
  def start
    puts "Engine started"
  end
end

class Car
  def initialize
    @engine = Engine.new
  end

  def start
    @engine.start
  end
end
  </code></pre>
  <p>Use <strong>composition</strong> when you want flexible and reusable components instead of strict hierarchy.</p>'
},

{
  title: 'What will be the output of the following Ruby code and why?',
  level: 'hard',
  answer: '<pre class="editor-code-block"><code>
class Parent
  def greet
    puts "Hello from Parent"
  end
end

class Child < Parent
  def greet
    super
    puts "Hello from Child"
  end
end

Child.new.greet
  </code></pre>
  <p><strong>Output:</strong></p>
  <pre class="editor-code-block"><code>
Hello from Parent
Hello from Child
  </code></pre>
  <p><strong>Explanation:</strong></p>
  <ul>
    <li><strong>super</strong> calls the parent class method.</li>
    <li>After parent execution, child method continues.</li>
  </ul>'
},

{
  title: 'Explain how Ruby handles multiple inheritance and what modules provide.',
  level: 'hard',
  answer: '<p>Ruby does not support multiple inheritance using classes, but supports it using <strong>modules</strong>.</p>
  <pre class="editor-code-block"><code>
module Flyable
  def fly
    puts "Flying"
  end
end

module Swimmable
  def swim
    puts "Swimming"
  end
end

class Duck
  include Flyable
  include Swimmable
end

duck = Duck.new
duck.fly
duck.swim
  </code></pre>
  <p>Modules enable sharing reusable functionality across classes.</p>'
},

{
  title: 'How does method lookup work in Ruby when using inheritance and modules?',
  level: 'hard',
  answer: '<p>Ruby follows a <strong>method lookup chain</strong> to find methods.</p>
  <ul>
    <li>Class itself</li>
    <li>Included modules</li>
    <li>Superclass</li>
    <li>Superclass modules</li>
    <li>Object class</li>
    <li>Kernel</li>
    <li>BasicObject</li>
  </ul>
  <pre class="editor-code-block"><code>
module A
  def greet
    puts "Hello from A"
  end
end

class Parent
  include A
end

class Child < Parent
end

Child.new.greet
  </code></pre>
  <p>Ruby finds <strong>greet</strong> in module A during lookup.</p>'
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
