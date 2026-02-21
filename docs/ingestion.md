# ETL Pipeline

## Services:

### API Service:

- The scope of this service is to handle the fetching, extracting, and loading data from the canvas api to my local db.
- It is also responsible for all the logic handling stale data.
- Handling the websocket connection with the front end.

### AI Service:

- The scope of this service is to complete the vectorization of the data and insert it into the vector db.

### Stratagies

- The jobs will be completed by background workers using the bullMQ library.
- There will be a shared redis instance that will be the source of truth for the jobs.
- The AI chatbot will be locked on the frontend until full ingestion is completed.

## Lifecycle of a request

1. Fetch the user enrollments from the canvas api
2. Fetch the user enrollments from the local db
3. Upsert any courses that do not exist yet with their id and null to prevent any FK constraint errors.
4. Compare the enrollments and update the user enrollments table as needed.
5. Enrollment fork: See cases (1-3).
6. Fetch the users activity stream from canvas
7. Compare the latest stream id from local db to the canvas.
8. If nothing has changed, return.
9. If new items, pull the full stream, and start the logic for checking the stale data.
10. Parse each stream item and enqueue an job to fetch, extract, load, and vectorize until the streamid equals the one in the db (see cases 4-5).

### Cases:

- Case 1: User has no enrollments, mark all coureses as inactive in the user enrollments table
- Case 2: User has enrollments from canvas but none in db, this means new user to the app, update user enrollments.
- Case 3: Existing user with new enrollments, add new enrollments to user enrollments and then proceed.
- Case 4: The api service will handle the etl from canvas and the ai servive will handle the vectorizing.
- Case 5: Each stream activity will be parsed by the url to identify what needs to be updated

### Notes:

- Add way to clear old vectors out of the vector db.
