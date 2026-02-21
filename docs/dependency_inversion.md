# Dependency Inversion

## High Level Summary

- The api service implements dependency inversion by defining a Composition Root(services.container.ts). The root is responsible lazily instantiating each of the classes as needed. This frees up the lower level classes to focus on their responsibilites rather than having to instantiate other classes as needed.

## Why?

- This allows for agnostic testing. I was running into trouble trying when i was trying to use the pglite db for testing instead of a postgres database or a postgres database in a docker container. By moving everything to a centralized compositon root, it allows me to inject the PGlite database into the servies instead of the real postgres database.

## Key Arhitectural Patterns

- The Compostion Root:
  - Pattern: IoC (Inversion of Control)
  - Benefit: Centralizes all the services and repository classes to one place across the entire app

- Constuctor Injection:
  - Pattern: Dependency Injection
  - Benefits: Adheres to the Design by contract principle. Each service class defines what it needs to complete its job.

- Lazy Initialization:
  Pattern: Lazy Loading / Memoization
  Benefits: In the composition root, the services are lazily loaded meaning they the classes and repos are instantiated only when needed. If the User service is needed then when calling the container class for the user service the assignment service class is not instantiated
