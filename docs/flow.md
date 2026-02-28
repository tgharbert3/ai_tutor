# Application Flow & Architecture

## 1. App Container (Application Lifetime)

### Responsibility

The App Container initializes and owns all long-lived, expensive infrastructure dependencies.

### Examples

- Database connection
- Redis connection
- Queue / Flow producers
- Concrete repository implementations
- External API adapters

The App Container is created once at application startup.

### App Container Methods

The App Container exposes factory methods for scoped operations:

- `createIngestionScope(...)`
- (future) `createReportingScope(...)`
- (future) `createAdminScope(...)`

Each method represents a **unit of work** or **request type** in the system.

The container wires infrastructure → ports and passes only the required abstractions into scopes.

---

## 2. Scope Request Classes (Operation Lifetime)

### Responsibility

Represent a single unit of work (e.g., one ingestion request).

Each scope:

- Is created via the App Container.
- Receives required dependencies (as ports).
- May construct request-scoped adapters (e.g., `CanvasClient` using API token).
- Exposes a single primary method: `execute()`.

### What `execute()` Does

- Orchestrates the high-level flow.
- Calls one or more use case classes.
- Coordinates execution order.
- Does **not** contain low-level business rules.

Scopes are orchestration boundaries — not business logic containers.

---

## 3. Use Case Classes (Business Logic Layer)

### Responsibility

Encapsulate specific business workflows.

### Examples

- `EnsureSchoolExists`
- `CreateIngestionRecord`
- `StartIngestionFlow`
- `FinalizeIngestion`

Use cases:

- Depend only on **ports (interfaces)**.
- Are agnostic to infrastructure.
- Can call multiple repositories.
- Can call multiple external services (through ports).
- Coordinate domain entities (pure or near-pure functions).

Use cases contain the core application behavior.

They are similar to "services" in layered architecture, but:

- More focused
- Dependent on abstractions
- Free from infrastructure knowledge

---

## 4. Dependency Direction

### Outward Dependencies (Infrastructure)

Concrete implementations:

- `SchoolRepository` (DB)
- `CanvasClient` (HTTP)
- Queue adapters

Instantiated only in the **App Container**.

---

### Inward Dependencies (Ports / Interfaces)

Use cases and scopes depend on:

- `SchoolRepositoryPort`
- `UserRepositoryPort`

This ensures:

- Business logic does not depend on infrastructure.
- Infrastructure can be swapped without modifying use cases.
- Testing is simplified via mocking ports.

---

## 5. Core Principles

### 1. Single Instantiation Boundary

Concrete external dependencies are instantiated only in the App Container.

### 2. Dependency Inversion

Use cases depend on interfaces, not implementations.

### 3. Clear Lifetimes

- App Container → Application lifetime
- Scope → Request/job lifetime
- Use Case → Operation lifetime

### 4. Separation of Concerns

- Controllers handle HTTP.
- Scopes orchestrate workflows.
- Use cases contain business rules.
- Repositories handle persistence.
- Clients handle external API interaction.

---

## 6. Ingestion Example (Conceptual Flow)

Controller  
→ `AppContainer.createIngestionScope(ctx)`  
→ `IngestionScope.execute()`  
→ `EnsureSchoolExists`  
→ `CreateIngestionRecord`  
→ `StartQueueFlow`  
→ Return ingestion ID

---

## Summary

This structure provides:

- Modular growth
- Clear reasoning about data flow
- Infrastructure swaps without rewriting business logic
- Easy unit testing of use cases
- Predictable execution boundaries

This architecture is a simplified Clean Architecture approach with explicit lifetime boundaries and strict dependency direction.
