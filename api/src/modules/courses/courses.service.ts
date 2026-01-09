import type { insertCourseType } from "@/db/schema.js";

import { addSyncCouresJob } from "@/queues/sync.courses.queue.js";

import * as CanvasAdapter from "./courses.adapter.js";
import * as CanvasClient from "./courses.client.js";
import * as CanvasRepo from "./courses.repo.js";

export class CourseService {
    private apiToken: string;
    private canvasBaseUrl: string;

    constructor(apiToken: string, canvasBaseUrl: string) {
        this.apiToken = apiToken;
        this.canvasBaseUrl = canvasBaseUrl;
    }

    async triggerSyncCourses() {
        return await addSyncCouresJob(this.apiToken, this.canvasBaseUrl);
    }

    async syncCourses(): Promise<insertCourseType[]> {
        console.log("Syncing Courses");
        const rawCourses = await CanvasClient.fetchCoursesFromCanvas(this.apiToken, this.canvasBaseUrl);
        const adaptedCourses = CanvasAdapter.mapCoursesToDb(rawCourses);
        const insertedCourses = await CanvasRepo.upsertManyCourses(adaptedCourses);
        return insertedCourses;
    };
}
