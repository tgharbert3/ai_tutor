# ETL Pipeline

## Services:

### API :

- The scope of this is to handle the fetching, extracting, and loading data from the canvas api to my local db.
- It is also responsible for all the logic handling stale data.
- Handling the websocket connection with the front end.

### AI:

- The scope of this is to complete the vectorization of the data and insert it into the vector db.

### Stratagies

- The jobs will be completed by background workers using the bullMQ library.
- There will be a shared redis instance that will be the source of truth for the jobs.
- The AI chatbot will be locked on the frontend until full ingestion is completed.

## Lifecycle of a request

### Phase one:

1. Fetch the user enrollments from the canvas api
2. Fetch the user enrollments from the local db 
3. Compare the enrollments for added/existing courses see Phase 2
4. For dropped courses mark the course in the user_enrollments table as false

### Phase 2:

5. Perform a global check against the courses table from the added user enrollments
   - Conditon 1: If the course is missing from the courses table
   - Action: Run a heavy ingestion flow of all course materials and mark the user as active in the user_enrollments table

   - Conditon 2: The course exists
   - Action: fetch the course activity stream and compare it to the local activity stream.
     - If not up to date, enqueue a lightweight job to ingest the new data
     - If up to date, mark the job as done.

6. Ingestion is complete when all of the courses are updated and the new vectors have been added in the vector db.
   - This means that every delta for every course has been checked for that user.

### BullMQ view

- Request is received
- Job is added to enrollment queue
- Enrollment worker picks up the job and fetchs both the canvas and local db enrollments
- Enrollment worker compares the two, it addeds the new/existing courses to one array and dropped courses to a new array
- It then iterates over the added/existing array and added each course to a course queue
- The course worker than grabs a course from the queue, pulls the activity stream form the local db and canvas
- It compares the two. If up to date, then completes the job, if new item, then will start a flow producer for that specific
  new item (assignment, announcment, etc)
- The flow producer will then etl for their specific domain.

- The enrollment queue is itself a flow producer to keep track of all the jobs that need to completed.

### Notes:

- The api service will handle the etl from canvas and the ai servive will handle the vectorizing.
- Each stream activity will be parsed by the url to identify what needs to be updated
- Add way to clear old vectors out of the vector db.
