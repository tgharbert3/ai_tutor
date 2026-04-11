# Mentora

Mentora is an AI-powered tutoring platform designed to help students interact with course material in a more useful and structured way. The project focuses on practical academic workflows such as asking questions about course content, tracking ingestion progress for course materials, and building the backend foundations for reliable AI-assisted learning tools.

This project was developed as a faculty-supervised software project and is being built with an emphasis on clean architecture, testability, and clear separation between infrastructure concerns and application logic.

## Why I Built It

Many AI learning tools feel generic. I wanted to build a system that is grounded in real academic workflows and course data rather than broad, context-free chatbot interactions.

Mentora is intended to support experiences such as:

* asking questions about course content
* generating study help from syllabus material
* tracking ingestion and processing of academic documents
* building a foundation for future features like personalized study plans and assignment-aware tutoring

## Core Goals

* Build a real multi-service software system rather than a simple demo
* Apply software engineering practices such as dependency injection, repository abstractions, and modular boundaries
* Support retrieval-based question answering over course content
* Stream ingestion progress to the frontend in real time
* Create a strong portfolio project that demonstrates backend, distributed systems, and applied AI skills

## Current Features

* Course content ingestion pipeline
* Background task orchestration with queue workers
* Real-time ingestion status updates via Server-Sent Events
* Syllabus processing and storage pipeline
* Vector-based retrieval pipeline for academic content
* Full-stack architecture with separate frontend, API services, and AI worker services

## Architecture Overview

Mentora is structured as a multi-service application with clear responsibilities across layers.

### Frontend

* **Next.js** frontend
* Provides the user-facing interface for interacting with the platform
* Connects to backend services through API routes and streaming endpoints

### TypeScript API Services

* Built with **Bun** and **Hono**
* Handles HTTP APIs, orchestration, authentication-related flows, and ingestion coordination
* Uses service containers and repository abstractions to keep infrastructure concerns separated from business logic

### Python AI Service

* Built with **FastAPI**
* Handles AI-related background processing and vectorization workflows
* Integrates with embedding and retrieval tooling for academic content search

### Data and Messaging

* **PostgreSQL** for relational data
* **PGVector** for vector storage
* **Redis** for queueing and pub/sub messaging
* **BullMQ** for background job processing

### Reverse Proxy / Local Infrastructure

* **Nginx** for request routing in development
* **Docker Compose** for local orchestration across services

## Technical Highlights

### Clean Architecture-Inspired Boundaries

A major design goal of this project is to avoid tightly coupling application logic to third-party libraries. Repository interfaces and dependency injection are used to isolate infrastructure details and make the codebase easier to test and evolve.

### Real-Time Ingestion Updates

The system streams ingestion progress back to the frontend using **Server-Sent Events (SSE)**. Redis pub/sub is used to bridge worker-side progress updates to connected clients.

### Retrieval-Augmented Generation Foundations

The project includes a retrieval pipeline for course materials, with academic content chunking, vectorization, metadata enrichment, and storage in PGVector-backed tables.

### Multi-Language System Design

Mentora uses both **TypeScript** and **Python** in places where each language is a good fit. TypeScript powers the main application and orchestration layers, while Python supports AI-oriented processing workflows.

## Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS

### Backend

* Bun
* Hono
* FastAPI
* PostgreSQL
* Redis
* BullMQ
* Nginx

### AI / Data

* LlamaIndex
* PGVector
* OpenAI embeddings
* SQLAlchemy
* Drizzle ORM

### Dev / Tooling

* Docker Compose
* Git
* TypeScript
* Python

## Example Responsibilities in the System

The system currently supports workflows such as:

* ingesting course data and syllabus content
* processing background jobs for ingestion and vectorization
* publishing progress updates for frontend visibility
* storing and querying vectorized academic content
* preparing a foundation for AI tutoring and study-plan generation

## What This Project Demonstrates

This project is meant to demonstrate more than just API building. It reflects experience with:

* backend system design
* distributed application structure
* queue-based asynchronous workflows
* real-time communication patterns
* applied AI integration
* software architecture and testability concerns
* full-stack coordination across multiple services

## Planned Improvements

* conversational query interface for students
* stronger retrieval and prompt orchestration
* richer course-aware tutoring workflows
* expanded test coverage across services
* improved document ingestion and chunking strategies
* deployment-ready production configuration

## Running the Project

> This section can be updated as the repository setup stabilizes.

### High-Level Local Setup

1. Start infrastructure services such as PostgreSQL, Redis, and Nginx
2. Start the TypeScript API services
3. Start the Python AI service
4. Start the frontend
5. Run ingestion and connect through the frontend interface

## Project Status

Mentora is an active in-progress project under continued development. The architecture and core ingestion pipeline are the current focus, with conversational tutoring features being built on top of that foundation.

## Repository

GitHub: [github.com/tgharbert3/ai_tutor](https://github.com/tgharbert3/ai_tutor)

## Author

**Tyler Harbert**
Computer Science student at the University of North Carolina Wilmington
Interested in software engineering, backend development, and applied AI

