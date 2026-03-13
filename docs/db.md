# DB schmea(version 1.3)

<img width="4383" height="2055" alt="dbSchema" src="https://github.com/user-attachments/assets/d4c17e1b-b1b2-41c0-bdd5-4f8cd771f309" />

## Legend

### User Enrollments (Join table for User and Courses)

- Enrollment state: Whether the enrollment is active, invited, or concluded
- isActive: if the users enrollment in the course is active or not. Boolean

### Courses

- Workflow state: Whether the course is available, completed, or deleted
- canvasUpdatedAt: The last time the course was updated by the professor.
- lastVectorizedAt: The last time the course was vectorized for the llm.
- lastSyncedAt: The last time that data was synced from canvas.
- courseCode: "CS 101"

### Assignments

- workflowState: published or unpublished. Only feed the published info to the llm

### Course Activity Stream:

- Used to keep track of each stream item to know whe to an incremental update
- canvasStreamId: id for the specific stream
- entityType: if its a 'announcment', 'assignment', or 'discussion topic' etc...
- htmlUrl: the url that leads to the real canvas page. Will be used for parsing what to fetch
- eventTime: when the canvas opject was 'updated_at'
- dedupHash: a hash of the url and time to generate a unique key. Make sure the multiple users in the same class don't add rows for the same object.
- status: used to know the state of the job.

### User Sync:

- latestStreamId: keep track of the latest id
- lastChecked: Date to know it was last checked
- Status: Used to by the workers to know if it is being processed

### Version 1.1

- added course activity stream table

### Version 1.2

- Added user_sync table
- Updated users table to only contain info that is needed
- fixed typos

### Version 1.3

- added canvasUserId to users table
