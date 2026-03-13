Full Ingestion scope

full ingestion Worker

worker claims the full ingestion task from the db
it then iterates over the identifier array queueing a canvasFetch job with the kind as the identifier

worker identifiers(kinds)
fetchAllAssignments
fetchSyllabus
fetchAllModules
fetchAllFiles
fetchAllFetchAllAnnouncments

canvasFetch Worker:

claim task from ingestion_tasks
load task metadata
switch on kind to choose Canvas API call
fetch from Canvas
validate response
insert/upsert into canvas_raw_documents
insert mapping task row
enqueue mapping queue job with
mark fetch task success + progress

CourseInfo:

insert

dbWrite:

claim the task from ingestion_tasks
load the metadata
fetch the raw document from canvas_raw_documents
switch on task.kind to fiugre out the rawDoc.payload
for courseInfo:
JSON.parse the payload which will be type CanvasCourse
Call the insertCourseInfo function
Receive back Type InsertCourseInfo
Enqueue a process job for syllabus. Will need a sanitized, plainText, and hashed version of the syllabus
mark the task as complete

for WriteSyllabus:
claim the task
load the metadata
fetch the raw doc
JSON.parse the payload
call the insertSyllabus function
(need to do) enqueue a job completion job
mark the task complete

Process:

Syllabus:
claim the task
load the metadata
fetch the raw_syllabus

hash it
sanitize it
convert to plain text

insert the new syllabus versions into the syllabus table
mark the task as success

check completion:
get the job from the queue
get the run id
query the db
if success/failed = queued or !queued
mark run as complete and emit a run job completed to send to the front end
