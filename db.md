# DB schmea

<img width="5664" height="2547" alt="db_schema_1 0" src="https://github.com/user-attachments/assets/219c5fa9-a7d9-4aac-a661-ae7d37ec74f1" />

## Legend

###  User Enrollments (Join table for User and Courses)
- Enrollment state: Whether the enrollment is active, invited, or concluded
- isActive: if the users enrollment in the course is active or not. Boolean

### Courses
- Workflow state: Whether the case is available, completed, or deleted
- canvasUpdatedAt: The last time the course was updated by the professor. Used to know when the course needs to be refreshed.
- lastVectorizedAt: The last time the course was vectorized for the llm.
- if canvasUpdatedAt is after lastVectorized, need to full fetch the course
- courseCodeL "CS 101"

### Assignments
- workflowState: published or unpublished. Only feed the published info to the llm
