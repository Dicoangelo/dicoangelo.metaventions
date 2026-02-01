# Artifact API Reference

API routes for managing portfolio artifacts with semantic search capabilities.

## Authentication

All mutation operations (POST, PUT, DELETE) require admin authentication via the `Authorization` header:

```bash
Authorization: Bearer <ADMIN_PASSWORD>
```

The `ADMIN_PASSWORD` environment variable must be set in `.env.local`.

## Routes

### 1. List and Create Artifacts

**File:** `/src/app/api/artifacts/route.ts`

#### GET `/api/artifacts`

List all artifacts with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status (`draft`, `published`, `archived`)
- `category` (optional): Filter by category (`project`, `skill`, `experience`, `faq`, `deep-dive`)

**Example:**
```bash
curl "http://localhost:3000/api/artifacts?status=published&category=project"
```

**Response:**
```json
{
  "artifacts": [
    {
      "id": "uuid",
      "title": "OS-App: Metaventions AI Platform",
      "slug": "os-app",
      "content": "...",
      "summary": "Agentic kernel with 3D visualizations",
      "category": "project",
      "tags": ["ai", "multi-agent", "3d"],
      "related_artifacts": [],
      "external_links": {
        "github": "https://github.com/Dicoangelo/OS-App"
      },
      "metrics": {
        "stars": "150",
        "users": "1000"
      },
      "status": "published",
      "version": 1,
      "created_at": "2026-02-01T...",
      "updated_at": "2026-02-01T...",
      "published_at": "2026-02-01T..."
    }
  ]
}
```

#### POST `/api/artifacts`

Create a new artifact.

**Auth:** Required

**Body:**
```json
{
  "title": "New Project",
  "slug": "new-project",
  "content": "# New Project\n\nDetailed markdown content...",
  "summary": "Brief summary of the project",
  "category": "project",
  "tags": ["ai", "research"],
  "external_links": {
    "github": "https://github.com/user/repo"
  },
  "metrics": {
    "stars": "50"
  },
  "status": "draft"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/artifacts \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d @artifact.json
```

**Response:**
```json
{
  "artifact": { ... }
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Validation error or duplicate slug
- `401` - Unauthorized
- `500` - Server error

---

### 2. Get, Update, Delete Artifact by ID

**File:** `/src/app/api/artifacts/[id]/route.ts`

#### GET `/api/artifacts/[id]`

Get a single artifact by ID.

**Example:**
```bash
curl "http://localhost:3000/api/artifacts/550e8400-e29b-41d4-a716-446655440000"
```

**Response:**
```json
{
  "artifact": { ... }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid UUID format
- `404` - Artifact not found
- `500` - Server error

#### PUT `/api/artifacts/[id]`

Update an existing artifact.

**Auth:** Required

**Body:** (All fields optional, only include what you want to update)
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["new", "tags"],
  "status": "published"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/artifacts/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

**Response:**
```json
{
  "artifact": { ... }
}
```

**Status Codes:**
- `200` - Updated successfully
- `400` - Validation error or duplicate slug
- `401` - Unauthorized
- `404` - Artifact not found
- `500` - Server error

#### DELETE `/api/artifacts/[id]`

Delete an artifact (cascades to chunks).

**Auth:** Required

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/artifacts/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $ADMIN_PASSWORD"
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - Deleted successfully
- `400` - Invalid UUID format
- `401` - Unauthorized
- `404` - Artifact not found
- `500` - Server error

---

### 3. Publish Artifact

**File:** `/src/app/api/artifacts/[id]/publish/route.ts`

#### POST `/api/artifacts/[id]/publish`

Publish an artifact (sets status to `published` and sets `published_at` timestamp).

**Auth:** Required

**Example:**
```bash
curl -X POST http://localhost:3000/api/artifacts/550e8400-e29b-41d4-a716-446655440000/publish \
  -H "Authorization: Bearer $ADMIN_PASSWORD"
```

**Response:**
```json
{
  "artifact": { ... }
}
```

**Status Codes:**
- `200` - Published successfully
- `400` - Invalid UUID format or already published
- `401` - Unauthorized
- `404` - Artifact not found
- `500` - Server error

---

## Validation Rules

### Artifact Fields

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes | 1-200 characters |
| `slug` | string | Yes | 1-100 characters, lowercase letters, numbers, hyphens only |
| `content` | string | Yes | Minimum 1 character (markdown) |
| `summary` | string | No | Maximum 500 characters |
| `category` | enum | Yes | One of: `project`, `skill`, `experience`, `faq`, `deep-dive` |
| `tags` | string[] | No | Array of strings |
| `related_artifacts` | UUID[] | No | Array of valid UUIDs |
| `external_links` | object | No | Key-value pairs (e.g., `{"github": "url"}`) |
| `metrics` | object | No | Key-value pairs (e.g., `{"stars": "50"}`) |
| `status` | enum | No | One of: `draft`, `published`, `archived` (default: `draft`) |

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Human-readable error message"
}
```

Common error messages:
- `"Unauthorized"` - Missing or invalid admin password
- `"Invalid artifact ID format"` - UUID validation failed
- `"Artifact not found"` - Resource doesn't exist
- `"An artifact with this slug already exists"` - Duplicate slug
- `"Title is required"` - Validation error
- `"Artifact is already published"` - Attempting to republish

---

## Implementation Notes

1. **Automatic Chunking**: When an artifact is created or its content is updated, the content is automatically chunked and embedded for semantic search.

2. **Versioning**: Each update increments the `version` field automatically.

3. **Timestamps**: `created_at` and `updated_at` are managed automatically. `published_at` is set when status changes to `published`.

4. **Cascade Deletes**: Deleting an artifact automatically deletes all associated chunks.

5. **Idempotency**: Publishing an already-published artifact returns a 400 error to prevent accidental republishing.

---

## Integration with Artifacts Library

All routes use functions from `/src/lib/artifacts.ts`:

- `listArtifacts(options)` - List with filtering
- `getArtifact(id)` - Get by ID
- `createArtifact(input)` - Create with chunking/embedding
- `updateArtifact(id, input)` - Update with re-chunking if content changed
- `deleteArtifact(id)` - Delete with cascade
- `publishArtifact(id)` - Publish

See `/src/lib/artifacts.ts` for implementation details and additional functions like `searchArtifacts()` and `getArtifactContext()`.
