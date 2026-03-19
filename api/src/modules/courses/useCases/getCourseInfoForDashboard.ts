import type { CourseInfo } from "@/infrastructure/domain/types.js";

import type { GetCourseInfoForDashboardDeps } from "../domain/types.js";

export class GetCourseInfoForDashboard {
    constructor(
        private readonly getCourseInfoForDashoardDeps: GetCourseInfoForDashboardDeps,
    ) {};

    async execute(userId: string): Promise<CourseInfo[]> {
        const courseIds = await this.getCourseInfoForDashoardDeps.enrollmentsRepo.getCourseIdsByUserId(userId);

        const coursesInfo = await Promise.all(
            courseIds.map(async (courseId) => {
                return await this.getCourseInfoForDashoardDeps.courseInfoRepo.getCourseInfoByCourseId(courseId);
            }),
        );
        return coursesInfo;
    }
}