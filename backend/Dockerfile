FROM ruby:3.4.1

# Install dependencies
RUN apt-get update -qq && \
    apt-get install -y build-essential nodejs

# Set working directory
WORKDIR /app

# Copy Gemfiles
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle install

# Copy project
COPY . .

# Expose port
EXPOSE 3000

# Start Rails
CMD ["rails", "server", "-b", "0.0.0.0"]