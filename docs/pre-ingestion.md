# Logic for what is completed before the start of ingestion

- Request is received
- Auth Middleware intercepts, validates the JWE, extracts and injects data back into the hono context variable
- Service Middleware intercepts and injects the service container into the hono context variable
- Router routes to controller
- Controller recieves and calls the facade function with the userid, and canvasUrl from the context variable
- Facade funtion:
  - checks to see if the user exists (case 1)
  - If user exists, proccced to ingestion
  - If not, check to see if the school exists in the school table by querying for the url. (case 2)
  - School exists: insert user with the school FK populated -> procced to ingestion
  - School !exists: fetch school info from the brandConfig endpoint and insert school -> insert user -> procced

## Cases

### Case 1

- Decideing to check if the user exists rather than upsert because if they exist then we can short circuit it by returing the school info with the select request.

### Case 2

- need a way to normalize the school url to make sure we dont have different schools in the table for one physical school
  - Fix: used the native URL object.Refrence the MDN web docs
