# db/seeds.rb

puts "Creating users..."

users_data = [
  { first_name: "John", last_name: "Doe", email: "john.doe@example.com", role: "admin", password: "Password1!" },
  { first_name: "Jane", last_name: "Smith", email: "jane.smith@example.com", role: "user", password: "Password1!" },
  { first_name: "Michael", last_name: "Johnson", email: "michael.j@tech.com", role: "user", password: "Password1!" },
  { first_name: "Emily", last_name: "Brown", email: "emily.brown@email.com", role: "user", password: "Password1!" },
  { first_name: "David", last_name: "Wilson", email: "david.w@company.com", role: "user", password: "Password1!" },
  { first_name: "Sarah", last_name: "Davis", email: "sarah.davis@example.com", role: "admin", password: "Password1!" },
  { first_name: "James", last_name: "Miller", email: "james.m@startup.io", role: "user", password: "Password1!" },
  { first_name: "Lisa", last_name: "Garcia", email: "lisa.garcia@corp.net", role: "user", password: "Password1!" },
  { first_name: "Robert", last_name: "Martinez", email: "robert.m@business.com", role: "user", password: "Password1!" },
  { first_name: "Amanda", last_name: "Anderson", email: "amanda.a@tech.co", role: "user", password: "Password1!" },
  { first_name: "Christopher", last_name: "Taylor", email: "chris.t@web.dev", role: "admin", password: "Password1!" },
  { first_name: "Jessica", last_name: "Thomas", email: "jess.t@company.org", role: "user", password: "Password1!" },
  { first_name: "Daniel", last_name: "Jackson", email: "daniel.j@startup.io", role: "user", password: "Password1!" },
  { first_name: "Michelle", last_name: "White", email: "michelle.w@email.com", role: "user", password: "Password1!" },
  { first_name: "Matthew", last_name: "Harris", email: "matt.h@business.net", role: "user", password: "Password1!" },
  { first_name: "Ashley", last_name: "Martin", email: "ashley.m@corp.com", role: "user", password: "Password1!" },
  { first_name: "Andrew", last_name: "Thompson", email: "andrew.t@tech.io", role: "admin", password: "Password1!" },
  { first_name: "Stephanie", last_name: "Robinson", email: "stephanie.r@company.org", role: "user", password: "Password1!" },
  { first_name: "Joshua", last_name: "Clark", email: "joshua.c@startup.dev", role: "user", password: "Password1!" },
  { first_name: "Nicole", last_name: "Lewis", email: "nicole.l@email.net", role: "user", password: "Password1!" },
  { first_name: "Ryan", last_name: "Walker", email: "ryan.w@business.com", role: "user", password: "Password1!" },
  { first_name: "Elizabeth", last_name: "Hall", email: "elizabeth.h@corp.io", role: "user", password: "Password1!" },
  { first_name: "Kevin", last_name: "Young", email: "kevin.y@tech.org", role: "user", password: "Password1!" },
  { first_name: "Lauren", last_name: "King", email: "lauren.k@company.net", role: "admin", password: "Password1!" },
  { first_name: "Brandon", last_name: "Wright", email: "brandon.w@startup.co", role: "user", password: "Password1!" }
]

users_data.each do |user_data|
  user = User.find_or_initialize_by(email: user_data[:email])

  unless user.persisted?
    user.assign_attributes(
      first_name: user_data[:first_name],
      last_name: user_data[:last_name],
      role: user_data[:role],
      password: user_data[:password]
    )
    user.save!
    puts "Created user: #{user.email} (role: #{user.role})"
  else
    puts "User already exists: #{user.email}"
  end
end

puts "User creation complete!"
puts "Total users: #{User.count}"
