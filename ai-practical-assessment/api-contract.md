# API Contract

Base URL (local): `https://ai-practical-assessment.ddev.site` (proxied from Vite dev server at `:5173`)

All responses use `Content-Type: application/json`.

---

## Endpoint: List Tasks

**Method:** `GET`  
**Path:** `/api/tasks`  
**Purpose:** Return all tasks, optionally filtered by status and search keyword.

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter: `planned`, `in_progress`, `completed` |
| `search` | string | Case-insensitive keyword match on title/description |

### Response

```json
{
  "data": [
    {
      "id": 1,
      "title": "Learn Drupal JSON:API",
      "description": "Read docs and build sample endpoint",
      "category": "learning",
      "priority": "high",
      "status": "in_progress",
      "ownerId": 2,
      "ownerName": "alex.learner",
      "dueDate": "2026-08-01T00:00:00+00:00",
      "createdAt": "2026-07-01T00:00:00+00:00",
      "updatedAt": "2026-07-10T00:00:00+00:00",
      "isOverdue": false
    }
  ]
}
```

---

## Endpoint: Get Task

**Method:** `GET`  
**Path:** `/api/tasks/{id}`  
**Purpose:** Return a single task by ID.

### Response

```json
{
  "data": { "...": "same shape as list item" }
}
```

---

## Endpoint: Create Task

**Method:** `POST`  
**Path:** `/api/tasks`  
**Purpose:** Create a new project task.

### Request

```json
{
  "title": "Build React dashboard",
  "description": "Summary cards and task list",
  "category": "project",
  "priority": "high",
  "status": "planned",
  "ownerId": 2,
  "dueDate": "2026-08-15"
}
```

### Response (201)

```json
{
  "data": { "...": "created task" },
  "message": "Task created successfully."
}
```

---

## Endpoint: Update Task

**Method:** `PATCH`  
**Path:** `/api/tasks/{id}`  
**Purpose:** Partially update an existing task.

### Request

Same fields as create (all optional for PATCH).

### Response

```json
{
  "data": { "...": "updated task" },
  "message": "Task updated successfully."
}
```

---

## Endpoint: Dashboard Summary

**Method:** `GET`  
**Path:** `/api/tasks/summary`  
**Purpose:** Aggregate counts for dashboard stat cards.

### Response

```json
{
  "total": 5,
  "completed": 1,
  "inProgress": 1,
  "overdue": 1,
  "highPriority": 2
}
```

---

## Endpoint: List Users

**Method:** `GET`  
**Path:** `/api/users`  
**Purpose:** Return users for owner dropdown.

### Response

```json
{
  "data": [
    {
      "id": 2,
      "name": "alex.learner",
      "email": "alex.learner@example.com",
      "role": "learner"
    }
  ]
}
```

---

## Validation Rules

| Field | Rules |
|-------|-------|
| `title` | Required, non-empty string, max 255 chars |
| `category` | Required; one of: `learning`, `project`, `research`, `other` |
| `priority` | Required; one of: `low`, `medium`, `high` |
| `status` | Required; one of: `planned`, `in_progress`, `completed` |
| `ownerId` | Required; must reference existing user |
| `dueDate` | Optional; ISO date string `YYYY-MM-DD` |
| `description` | Optional text |

## Error Responses

| Status | When |
|--------|------|
| 400 | Validation failed |
| 404 | Task not found |
| 500 | Server error |

```json
{
  "message": "Validation failed.",
  "errors": {
    "title": "Title is required."
  }
}
```
