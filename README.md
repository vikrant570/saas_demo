# SAAS Employee Management API

A simple multi-tenant REST API for managing employees, built with Node.js, Express, and MongoDB.

## Main Features

- **Multi-tenant support:** Each company (tenant) manages its own employees.
- **Authentication:** JWT-based authentication for secure access.
- **Employee management:** CRUD operations for employees, scoped to each tenant.

## API Endpoints

### Tenant (Company) Routes (`/api/saas/tenant`)

- `POST /register` — Register a new tenant (company).
- `POST /login` — Login as a tenant (returns JWT in cookie).
- `DELETE /delete` — Delete the logged-in tenant account (requires authentication).

### Employee Routes (`/api/saas/employee`)

- `GET /` — List all employees for the authenticated tenant.
- `POST /` — Create a new employee (requires authentication).
- `GET /:id` — Get details of a specific employee (requires authentication).
- `DELETE /:id` — Delete an employee (requires authentication).

### Tenant Info (`/api/saas`)

- `GET /` — Get details of the authenticated tenant (requires authentication).

## Getting Started

- Install dependencies: `npm install`
- Start the server: `npm start`
- Configure environment variables in a `.env` file (see `src/app.js` for required variables like `PORT` and `JWT_SECRET`).

---

**Tech Stack:** Node.js, Express, MongoDB, JWT, bcrypt
