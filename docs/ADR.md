# ADR 003: Transition from Turso to PostgreSQL for Core Storage and Vector RAG

**Status:** Proposed  
**Date:** 2026-02-14  
**Author:** Tyler

## 1. Context and Problem Statement

The "AI Tutor" project initially considered **Turso** (libSQL/SQLite) for data storage to leverage its edge-distribution capabilities. However, as the project requirements for the RAG (Retrieval-Augmented Generation) pipeline solidified, the need for a more robust, self-hosted solution became apparent. We require a database that:

- Minimizes monthly operational costs by utilizing existing infrastructure.
- Provides industry-standard performance for vector similarity search.
- Reduces architectural complexity by eliminating unnecessary third-party cloud providers.

## 2. Decision Drivers

- **Infrastructure Consolidation:** Since the application is hosted on an **Amazon EC2 instance**, running PostgreSQL on the same instance eliminates the need for an external database subscription.
- **Vector Maturity:** `pgvector` on PostgreSQL 18 provides more advanced indexing (HNSW) and a larger community ecosystem than current SQLite-based vector extensions.
- **TypeScript Ecosystem:** PostgreSQL has first-class support in the TypeScript ecosystem, offering better type safety and more mature ORM options.
- **Data Privacy:** Keeping data within our own EC2 environment ensures better control over the course information ingested from the Canvas API.

## 3. Considered Options

- **Option 1: Turso (Managed libSQL)** - Excellent for low-latency edge access but introduces a "Cold Start" problem on the free tier and additional costs at scale.
- **Option 2: PostgreSQL 18 with `pgvector`** - High-performance relational database with built-in support for vector embeddings and hybrid search.

## 4. Decision Outcome

**Chosen Option: Option 2 (PostgreSQL 18 with `pgvector`).**

### Consequences

- **Positive:** Significant cost savings; lower network latency (app and DB are on the same instance); access to advanced Postgres 18 features like Asynchronous I/O.
- **Neutral:** Shift from a managed service to a self-managed one; requires manual setup of local backups (e.g., cron jobs for `pg_dump`).
- **Negative:** Increased memory and CPU footprint on the EC2 instance compared to using a managed cloud database.

## 5. Implementation Notes

- **Binary:** Use PostgreSQL 18.2 (Homebrew for development, APT for EC2/Ubuntu).
- **Extensions:** `pgvector` must be installed and enabled (`CREATE EXTENSION vector;`).
- **Data Access:** Transition the TypeScript backend from `@libsql/client` to a PostgreSQL-compatible driver (`pg` or `postgres.js`).
- **Indexing:** Implementation of HNSW indexes for the `course_embeddings` table to ensure efficient RAG retrieval.
