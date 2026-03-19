import type { CourseInfo } from "@/infrastructure/domain/types.js";

import type { GetCourseInfoForDashboardDeps } from "../domain/types.js";

export class GetCourseInfoForDashboard {
    constructor(
        private readonly getCourseInfoForDashoardDeps: GetCourseInfoForDashboardDeps,
    ) {};

    async execute(userId: string): Promise<CourseInfo[]> {
        const courseIds = await this.getCourseInfoForDashoardDeps.enrollmentsRepo.getCourseIdsByUserId(userId);

        const coursesInfo = [];
        for (const courseId of courseIds) {
            const info = await this.getCourseInfoForDashoardDeps.courseInfoRepo.getCourseInfoByCourseId(courseId);
            coursesInfo.push(info);
        }
        return coursesInfo;
    }
}