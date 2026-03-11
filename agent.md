# 🧠 Senior Backend Agent Rules

**Tech Stack:** Node.js (ESM) + Hono

---

# 1️⃣ Architecture Principles

We strictly follow:

* ✅ Clean Architecture
* ✅ Layered Architecture
* ✅ Separation of Concerns
* ❌ No business logic inside routes
* ❌ No direct database access inside controllers
* ❌ No circular dependencies

---

# 2️⃣ Project Folder Structure

```
src/
│
├── app.ts
├── server.ts
│
├── config/
│   ├── env.ts
│   ├── firebase.ts
│
├── common/
│   ├── middleware/
│   ├── utils/
│   ├── errors/
│   └── types/
│
├── modules/
│   ├── student/
│   │   ├── student.route.ts
│   │   ├── student.controller.ts
│   │   ├── student.service.ts
│   │   ├── student.repository.ts
│   │   ├── student.schema.ts
│   │   └── student.types.ts
│   │
│   └── enrollment/
│       ├── enrollment.route.ts
│       ├── enrollment.controller.ts
│       ├── enrollment.service.ts
│       ├── enrollment.repository.ts
│       └── enrollment.schema.ts
│
└── database/
    └── index.ts
```

---

# 3️⃣ Layer Responsibilities (STRICT)

## 🛣️ Route Layer (`*.route.ts`)

* Registers Hono routes
* Applies middleware
* Calls controller
* ZERO business logic

---

## 🎮 Controller Layer (`*.controller.ts`)

* Handles HTTP layer
* Validates request
* Calls service
* Returns formatted response
* No database calls

Controller must:

* Extract `req.json()`
* Pass clean data to service
* Return JSON response

---

## 🧠 Service Layer (`*.service.ts`)

* Contains ALL business logic
* Coordinates multiple repositories
* Handles transactions
* No HTTP objects allowed
* No `ctx` usage

Service must:

* Accept plain parameters
* Return plain objects

---

## 🗄️ Repository Layer (`*.repository.ts`)

* Only handles database logic
* No business logic
* No HTTP logic
* One repository per aggregate/entity

---

# 4️⃣ Naming Conventions (Non-Negotiable)

## Files

```
student.service.ts
student.repository.ts
student.controller.ts
```

## Classes

```
StudentService
StudentRepository
StudentController
```

## Methods

* `createStudent`
* `updateStudent`
* `findStudentById`
* `deleteStudent`

Avoid generic names like:

* ❌ handleData
* ❌ processStuff
* ❌ doLogic

---

# 5️⃣ API Response Standard

## Success Response

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Student not found"
}
```

All errors must be handled through centralized error middleware.

---

# 6️⃣ Validation Rules

* Use schema validation (Zod recommended)
* Validation must happen before service execution
* Never validate inside service layer

---

# 7️⃣ Dependency Flow (One Direction Only)

```
Route → Controller → Service → Repository → Database
```

Never reverse the flow.

---

# 8️⃣ Environment Rules

* Access environment variables only in `config/env.ts`
* Validate environment variables at startup
* Never use `process.env` directly outside config

---

# 9️⃣ Middleware Rules

```
common/middleware/
    auth.middleware.ts
    logger.middleware.ts
    error.middleware.ts
```

Rules:

* Auth middleware must not contain business logic
* Logger must include requestId
* Error middleware must handle all thrown errors

---

# 🔟 Database Rules

* No raw queries inside service
* All database access through repository
* Repository must return clean domain objects
* Do not leak database models to controller

---

# 1️⃣1️⃣ Transaction Rule

If an operation spans multiple repositories:

* Service must coordinate
* Repositories must remain independent

---

# 1️⃣2️⃣ Code Quality Standards

* Use async/await only
* No `.then()` chains
* Max 40 lines per function
* Max 200 lines per file
* If file grows beyond limits → split it

---

# 1️⃣3️⃣ Security Rules

* Never trust client input
* Always validate input
* Never expose internal errors
* Use try/catch in controller layer
* Use centralized error formatter

---

# 1️⃣4️⃣ Hono Usage Rules

In `app.ts`:

```ts
const app = new Hono()
app.route('/students', studentRoutes)
```

Do NOT define business logic directly in route registration.

---

# 1️⃣5️⃣ Feature-Based Scaling Rule

When adding a new domain:

```
modules/
   teacher/
   attendance/
   payments/
```

Each feature must be isolated and self-contained.

---

# 1️⃣6️⃣ Logging Rules

Every request must log:

* Request ID
* HTTP Method
* URL
* Status Code
* Execution Time

---

# 1️⃣7️⃣ Testing Readiness

Project must support:

```
tests/
   student.service.test.ts
   student.controller.test.ts
```

Services must be testable without running the HTTP server.

---

# 🎯 Golden Rule

If a file imports:

* `hono` → it must be route or controller only
* Database client → repository only
* Multiple repositories → service only

---

# 📌 Final Commandment

Business logic lives in service.
Data access lives in repository.
HTTP handling lives in controller.
Routing lives in route.
Configuration lives in config.

No exceptions.
