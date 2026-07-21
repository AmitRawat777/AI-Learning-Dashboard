# UI Flow

## Page Map

```
/ (Landing)
├── Hero + feature cards + animations
└── CTA → /dashboard

/dashboard (Main dashboard)
├── Summary cards (5 stats)
├── Search + status filter bar
├── View toggle: Kanban | Grid
├── Kanban board (3 columns) OR task grid
└── Task detail drawer (on card click)

/tasks (All tasks — same as dashboard, tasks mode)
/tasks/new (Create task modal/page)
/tasks/:id/edit (Edit task modal/page)
```

## User Flows

### 1. First Visit

1. User lands on `/` (landing page)
2. Clicks "Open Dashboard" → `/dashboard`
3. Sees summary cards + seeded sample tasks in kanban

### 2. Create Task

1. User clicks "+ New Task" → `/tasks/new`
2. Fills form: title*, description, category*, priority*, status*, owner*, due date
3. Submits → POST `/api/tasks`
4. Redirected to dashboard with success message
5. New task appears in appropriate kanban column

### 3. Update Task (Kanban)

1. User drags card from "Planned" to "In Progress"
2. PATCH `/api/tasks/{id}` with `{ status: "in_progress" }`
3. Card moves; summary counts refresh

### 4. Update Task (Form)

1. User clicks task card → detail drawer opens
2. Clicks "Edit" → `/tasks/{id}/edit`
3. Modifies fields in premium modal form
4. Submits → PATCH `/api/tasks/{id}`
5. Returns to dashboard with updated data

### 5. Filter & Search

1. User types in search box → URL updates `?search=drupal`
2. Task list/kanban filters client-side from fetched data
3. User selects status filter → `?status=in_progress`
4. Filters combine (search + status)

### 6. Switch View

1. User toggles Grid view → `?view=grid`
2. Kanban hidden; task cards shown in responsive grid
3. Toggle back → `?view=board` (default)

## UI States

| State | Trigger | Display |
|-------|---------|---------|
| Loading | API fetch in progress | Skeleton/spinner |
| Empty | No tasks or no filter matches | Illustration + "Create first task" CTA |
| Error | API failure | Red banner with message |
| Success | Task saved | Green toast/banner |
| Overdue | `isOverdue: true` | Red accent on card/badge |

## Key Components

| Component | Role |
|-----------|------|
| `AppLayout` | Nav, page shell |
| `DashboardSummary` | Stat cards with CountUp animation |
| `SearchFilter` | Search input + status dropdown |
| `KanbanBoard` | Drag-and-drop columns |
| `TaskList` | Grid view task cards |
| `TaskForm` | Create/edit modal with FormSelect dropdowns |
| `FormSelect` | Portal-based custom dropdown |
| `StateMessages` | Loading/empty/error/success |
| `PriorityBadge` | Color-coded priority label |

## URL Query Parameters

| Param | Values | Effect |
|-------|--------|--------|
| `status` | `planned`, `in_progress`, `completed` | Filter tasks |
| `search` | any string | Keyword filter |
| `view` | `board`, `grid` | Kanban vs grid |
| `task` | task ID | Open detail drawer |
| `highlight` | task ID | Highlight card after create |
