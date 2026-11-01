# Power Tools Bus Services Management System

A responsive, secure web application for a Zambian bus transportation company, built with HTML, CSS, JavaScript, Bootstrap 5, Supabase, and Netlify Functions.

## Features

- Authentication and role-based access control
- Dashboard with live KPIs and analytics
- Bus, route, trip, booking, payment, ticket, staff, driver, passenger, and reporting modules
- Database migration SQL for Supabase PostgreSQL
- Netlify function stubs for secure server-side logic
- Netlify-ready configuration

## Tech stack

- HTML5
- CSS3
- JavaScript ES modules
- Bootstrap 5
- Supabase PostgreSQL + Auth
- Netlify hosting + Functions

## Local development

1. Copy `.env.example` to a local `.env` file or set the same variables in Netlify.
2. Update `assets/js/config.js` with your Supabase project URL and anon key.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the local dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## Supabase setup

1. Create a Supabase project.
2. Run the SQL migration in `database/migrations/001_init.sql`.
3. Enable authentication providers as needed.
4. Configure RLS policies.
5. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in Netlify environment variables.

## Netlify deployment

1. Push the repository to GitHub.
2. Import the repo into Netlify.
3. Set the environment variables in the Netlify dashboard.
4. Deploy.

## Important security notes

- Do not expose the Supabase service-role key in frontend code.
- Use only the anon key in browser code.
- Keep all privileged operations in Netlify Functions or Supabase database functions.

## Project structure

- `assets/` – frontend styling and scripts
- `database/migrations/` – SQL migrations
- `netlify/functions/` – serverless functions
- `index.html` – home page
- `login.html` – authentication page
- `dashboard.html` – main admin dashboard
- `buses.html` – bus management
- `routes.html` – route management
- `trips.html` – trip scheduling
- `bookings.html` – bookings
- `passengers.html` – passengers
- `payments.html` – payment tracking
- `tickets.html` – ticket management
- `staff.html` – staff management
- `drivers.html` – drivers
- `reports.html` – reports and analytics
- `settings.html` – company settings
