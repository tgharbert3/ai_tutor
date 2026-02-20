import type { Job } from "bullmq";

import type { fetchEnrollmentsJob } from "@/lib/types.js";

import { redisConfig } from "@/config/redis.js";
import db from "@/db/index.js";
import { CourseRepository } from "@/modules/courses/courses.repo.js";
import { CourseService } from "@/modules/courses/courses.service.js";
import { fetchUserEnrollmentsFromCanvas } from "@/modules/enrollments/enrollments.client.js";
import { EnrollmentRepository } from "@/modules/enrollments/enrollments.repo.js";
import { EnrollmentsService } from "@/modules/enrollments/enrollments.service.js";

import { createWorker } from "../factories/worker.js";

const enrollmentRepo = new EnrollmentRepository(db);
const courseRepo = new CourseRepository(db);

export const fetchEnrollmentsWorker = createWorker(
    "enrollmentQueue",
    async (job: Job<fetchEnrollmentsJob>) => {
        const { apiToken, canvasBaseUrl, userId, schoolId } = job.data;

        const enrollmentsService = new EnrollmentsService(enrollmentRepo, apiToken, canvasBaseUrl);
        const coursesService = new CourseService(courseRepo, apiToken, canvasBaseUrl);

        const canvasEnrollments = await fetchUserEnrollmentsFromCanvas(apiToken, canvasBaseUrl);
        const localEnrollments = await enrollmentsService.fetchLocalActiveEnrollmentIds(userId);

        // Use a set for more efficient look ups
        const canvasIdSet = new Set(canvasEnrollments.map(e => e.canvasCourseId));
        const localIdSet = new Set(localEnrollments);

        // Find the Ids that are in the local db but not in canvas
        // Will set the isActive to false
        const idsToDeactiveate = localEnrollments.filter(id => !canvasIdSet.has(id));

        // Find all the courses that are in the canvas api but not in the local db
        const coursesToCreate = canvasEnrollments.filter(e => !localIdSet.has(e.canvasCourseId));
        if (coursesToCreate.length > 0) {
            const partialData = coursesToCreate.map((e) => {
                return { courseId: e.canvasCourseId, schoolId };
            });
            await coursesService.insertPartialCourse(partialData);
        };
    },
    redisConfig,
);