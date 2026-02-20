import type { insertCourseType } from "@/db/schema.js";
import type { PartialCourse } from "@/lib/types.js";

import { addSyncCouresJob } from "@/background/courses/sync.courses.queue.js";

import type { CourseRepository } from "./courses.repo.js";

import * as CanvasAdapter from "./courses.adapter.js";
import * as CanvasClient from "./courses.client.js";

export class CourseService {
    constructor(
        private readonly repo: CourseRepository,
        private readonly apiToken: string,
        private readonly canvasBaseUrl: string,
    ) {}

    async triggerSyncCourses() {
        return await addSyncCouresJob(this.apiToken, this.canvasBaseUrl);
    }

    async syncCourses(): Promise<insertCourseType[]> {
        const rawCourses = await CanvasClient.fetchCoursesFromCanvas(this.apiToken, this.canvasBaseUrl);
        const adaptedCourses = CanvasAdapter.mapCoursesToDb(rawCourses);
        const insertedCourses = await this.repo.upsertManyCourses(adaptedCourses);
        return insertedCourses;
    };

    async insertPartialCourse(data: PartialCourse[]) {
        const response = this.repo.upsertNewCourse(data);
        return response;
    }
}