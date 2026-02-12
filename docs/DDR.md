# Data Decision Record

## DDR 001 (2/11/26) - Sync Tracking Table in DB

- Status: Accepted
- Context:
  - Professors update the the course infrequently, and students will check more often.
  - Full sync our course content is expensive and time consuming.
- Decision:
  - Implement a user_sync_state table in the datebase. It will store the latest_stream_id from the users Canvas activity stream.
  - Perform a quick check on login to compare if any course specific data needs to be refreshed
  - Only perform the ETL pipeline when the latest stream id has changed.
- Consequences:
  - Pros: Faster login time and reduction in times data needs to be fetched and vectorized.
  - Cons: Handle the case where the stream is empty due to a new user or if there were inactive for a long time. Will have to populated when a user registers

## DDR 00(2/12/26) - Course Activity Stream table

- Status: Accepted
- Context:
  - Used to keep track of each stream activity within each course.
- Decision:
  - Implement a course activity stream table in the database.
  - Used to keep track of what incremental updates need to be completed for each course.
- Consequences:
  - Pros: efficient way to keep track of what needs to updated and revectorized. Prevents multiple users from queuing jobs for something that is already in the vectodb.
  - Cons: Could lead to storage bloat. Added complexity in having to deal with when workers fail.
