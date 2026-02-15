import type { Job } from "bullmq";

import type { CanvasAssignmentType, fetchAssignmentJob } from "@/lib/types.js";

import { redisConfig } from "@/config/redis.js";
import { mapAssignmentsToDb } from "@/modules/assignments/assignments.adapter.js";
import { fetchAssignmentsFromCanvas } from "@/modules/assignments/assignments.client.js";

import { createWorker } from "../factories/worker.js";

export const fetchAssignmentsWorker = createWorker(
    "fetchAssigmentsQueue",
    async (job: Job<fetchAssignmentJob>) => {
        const { apiToken, canvasBaseUrl, courseId } = job.data;

        const response = await fetchAssignmentsFromCanvas(apiToken, canvasBaseUrl, courseId);
        job.data = response;
        await job.updateProgress(100);
        return response;
    },
    redisConfig,
);

export const extractAssignmentsWorker = createWorker(
    "extractAssignmentsQueue",
    async (job: Job) => {
        const result = await job.getChildrenValues<CanvasAssignmentType[]>();
        const assignmentsArray = Object.values(result)[0];
        console.log(assignmentsArray[0].id);
        const extractedAssignments = mapAssignmentsToDb(assignmentsArray);
        return extractedAssignments;
    },
    redisConfig,
);

export const insertAssignmentsWorker = createWorker(
    "insertAssignmentsQueue",
    async (job: Job) => {
        const result = await job.getChildrenValues();
        const assignmentsArray = Object.values(result)[0];
        console.log(assignmentsArray);
    },
    redisConfig,
);