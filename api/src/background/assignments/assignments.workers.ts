import { redisConfig } from "@/config/redis.js";
import { fetchAssignmentsFromCanvas } from "@/modules/assignments/assignments.client.js";
import { Job } from "bullmq";
import { createWorker } from "../factories/worker.js";

export const fetchAssignmentsWorker = createWorker(
    "fetchAssigmentsQueue", 
    async (job: Job) => {
        const { apiToken, canvasBaseUrl, courseId} = job.data;

        const response = await fetchAssignmentsFromCanvas(apiToken, canvasBaseUrl, courseId);
        await job.updateProgress(100);
        return response;
    },
    redisConfig
)

export const extractAssignmentsWorker = createWorker(
    "extractAssignmentsQueue", 
    async (job: Job) => {
        const result = await job.getChildrenValues();
        const assignmentsArray = Object.values(result)[0]
        // console.log(Object.values(result)[0][0])
        // const reslutJson = JSON.stringify(result, null, 2)
        // console.log(`result: ${reslutJson}`);
        await job.updateProgress(100);
        return assignmentsArray;
    }, 
    redisConfig
)

export const insertAssignmentsWorker = createWorker(
    "insertAssignmentsQueue", 
    async (job: Job) => {
        const result = await job.getChildrenValues();
    },
    redisConfig
)
