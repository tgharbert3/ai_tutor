import { FlowProducer } from "bullmq";

import { insertAssignmentsQueue } from "../assignments/assignment.queue.js";
import { enrollmentQueue } from "../enrollments/enrollment.queue.js";

export async function startSync(apiToken: string, canvasBaseUrl: string, userId: string, schoolId: number) {
    const assignmentsProducer = new FlowProducer();

    return await assignmentsProducer.add({
        name: "loadAssignments",
        queueName: insertAssignmentsQueue.name,
        children: [
            {
                name: "fetchEnrollments",
                queueName: enrollmentQueue.name,
                data: { apiToken, canvasBaseUrl, userId, schoolId },
            },
        ],
    });
}