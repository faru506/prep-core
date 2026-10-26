# Background Jobs Memory

## No asynchronous processing is configured

**Knowledge**

The repository ships ActiveJob but uses no queue backend. `app/jobs/` contains only `ApplicationJob` (the default empty base class), the Gemfile has no Sidekiq/Resque/Sucker Punch, `docker-compose.dev.yml` starts only `backend`, `frontend`, and `mongodb`, and nothing in the app calls `perform_later`. `REDIS_URL` is present in `backend/.env` but no code reads it.

Consequences: all work (including seeding via `rails runner`) executes inside the request/process that triggers it, and there is no retry/backoff infrastructure. Adding a background job requires both a queue adapter and a worker process, which the Docker stack does not provide today.

**Use When**

Considering asynchronous work, diagnosing timeouts on heavy endpoints, or being asked to add a job/worker.

**Source**

- `backend/app/jobs/application_job.rb`
- `backend/Gemfile`
- `docker-compose.dev.yml`
- `backend/.env`

**Last Verified**

2026-10-26
