FROM ruby:3.4.1

# Install dependencies
RUN apt-get update -qq && \
    apt-get install -y build-essential nodejs curl gnupg cron wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    wget -q https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-arm64-100.9.4.tgz -O /tmp/mongotools.tgz && \
    tar -xzf /tmp/mongotools.tgz -C /tmp && \
    cp /tmp/mongodb-database-tools-*/bin/* /usr/local/bin/ && \
    chmod +x /usr/local/bin/mongodump /usr/local/bin/mongorestore 2>/dev/null; \
    rm -rf /tmp/mongotools.tgz /tmp/mongodb-database-tools-*

# Set working directory
WORKDIR /app

# Copy Gemfiles
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle install

# Copy project
COPY . .

# Create backup directory
RUN mkdir -p /app/storage/backups

# Expose port
EXPOSE 3000

# Start Rails
CMD ["rails", "server", "-b", "0.0.0.0"]