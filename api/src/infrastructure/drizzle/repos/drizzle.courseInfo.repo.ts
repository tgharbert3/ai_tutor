import type { CanvasTab } from "@/infrastructure/canvas/types.js";
import type { insertCourseInfo, insertTabs } from "@/infrastructure/db/schema.js";
import type { InsertCourseInfo } from "@/infrastructure/domain/types.js";
import type { ICourseInfoRepository } from "@/infrastructure/interfaces/courseInfo.interface.js";
import type { db } from "@/lib/types.js";

import { courseInfo, courseSyllabus, courseTabs } from "@/infrastructure/db/schema.js";

export class DrizzleCourseInfoRepository implements ICourseInfoRepository {
    constructor(private db: db) {}

    async insertCourseInfo(courseCode: string, name: string, canvasCourseId: number, rawSyllabus: string, tabs: CanvasTab[]): Promise<InsertCourseInfo> {
        const response = await this.db.transaction(async (tx) => {
            const info = {
                courseCode,
                name,
                canvasCourseId,
            } satisfies insertCourseInfo;
            const [courseInfoRow] = await tx.insert(courseInfo).values(info).returning();
            const courseInfoId = courseInfoRow.id;

            const [syllabusRow] = await tx.insert(courseSyllabus).values({ rawSyllabus, courseInfoId, status: "queued" }).returning();
            const tabsToInsert = tabs.map(tab => ({
                tabId: tab.id,
                htmlUrl: tab.html_url,
                normalizedUrl: null,
                courseInfoId,
                status: "queued",
            } satisfies insertTabs));
            const newTabs = await tx.insert(courseTabs).values(tabsToInsert).returning();
            const newTabIds = newTabs.map(tab => tab.id);

            return { courseInfoId, syllabusId: syllabusRow.id, tabIds: newTabIds };
        });
        return response;
    }
}