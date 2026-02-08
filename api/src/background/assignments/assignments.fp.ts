import { FlowProducer } from "bullmq";
import { fetchAssignmentsQueue, extractAssignmentsQueue, insertAssignmentsQueue } from "./assignment.queue.js";


export async function loadAssignments(apiToken: string, canvasBaseUrl: string, courseId: number) {
    const assignmentsProducer = new FlowProducer();

    return await assignmentsProducer.add({
        name: "loadAssignments",
        queueName: insertAssignmentsQueue.name,
        children: [
            { 
                name: "extractAssignments",  
                queueName: extractAssignmentsQueue.name, 
                children: [
                    { 
                        name: "fetchAssignments", 
                        data: {apiToken, canvasBaseUrl, courseId}, 
                        queueName: fetchAssignmentsQueue.name
                    }
                ]
            },
        ]
    });
}

