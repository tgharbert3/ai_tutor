# DB schmea

<img width="5664" height="2601" alt="dbSchema" src="https://github.com/user-attachments/assets/d57d967b-9027-4275-ac55-3872137216ca" />

## Legend

###  User Enrollments (Join table for User and Courses)
- Enrollment state: Whether the enrollment is active, invited, or concluded
- isActive: if the users enrollment in the course is active or not. Boolean

### Courses
- Workflow state: Whether the course is available, completed, or deleted
- canvasUpdatedAt: The last time the course was updated by the professor. Used to know when the course needs to be refreshed.
- lastVectorizedAt: The last time the course was vectorized for the llm.
- lastSyncedAt: The last time that data was synced from canvas
- courseCode: "CS 101"

### Assignments
- workflowState: published or unpublished. Only feed the published info to the llm
