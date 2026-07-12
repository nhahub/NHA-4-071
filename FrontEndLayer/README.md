# Morshed University Platform — FrontEndLayer

## Integration Resources

For frontend developers integrating with the backend API, all required documentation and tools are in the following locations:

### 1. Integration Plan (Must Read)

```
../Diagrams_And_Reports/Integration_Plan.md
```

This document contains:
- Complete endpoint reference (all 60+ endpoints organized by role)
- Request/response shapes for every endpoint
- Authentication setup (JWT Bearer token)
- Response format conventions
- Known issues and missing features

### 2. Postman Collection (Import into Postman)

```
../BackEndLayer/Morshed.postman_collection.json
```

Pre-configured with all API endpoints, request bodies, and auth token auto-save. Import this file into Postman and create an environment with `baseUrl = http://localhost:5000/api`.

### Quick Start

1. Read the Integration Plan first
2. Import the Postman collection
3. Log in via `Auth > Login` to auto-save your token
4. Start testing endpoints by role (Student, Professor, Advisor, Admin)

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend base URL |
| `VITE_USE_DUMMY_DATA` | `false` | Set `true` to use mock data (no backend needed) |
