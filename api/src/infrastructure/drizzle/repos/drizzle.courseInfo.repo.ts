import { eq } from "drizzle-orm";

import type { CanvasTab } from "@/infrastructure/canvas/types.js";
import type { insertCourseInfo, insertTabs } from "@/infrastructure/db/schema.js";
import type { CourseInfo, FullCourseInfo, InsertCourseInfo } from "@/infrastructure/domain/types.js";
import type { ICourseInfoRepository } from "@/infrastructure/interfaces/repos/courseInfo.interface.js";
import type { db } from "@/lib/types.js";

import { courseInfo, courses, courseSyllabus, courseTabs } from "@/infrastructure/db/schema.js";

export class DrizzleCourseInfoRepository implements ICourseInfoRepository {
    constructor(private db: db) {}

    async upsertCourseInfo(courseCode: string, name: string, canvasCourseId: number, rawSyllabus: string, tabs: CanvasTab[], courseId: number): Promise<InsertCourseInfo> {
        const response = await this.db.transaction(async (tx) => {
            const info = {
                courseCode,
                name,
                canvasCourseId,
                courseId,
            } satisfies insertCourseInfo;
            const [courseInfoRow] = await tx.insert(courseInfo).values(info).onConflictDoUpdate({
                target: courseInfo.courseId,
                set: {
                    updated_at: new Date(),
                },
            }).returning();
            const courseInfoId = courseInfoRow.id;

            const [syllabusRow] = await tx.insert(courseSyllabus).values({ rawSyllabus, courseInfoId, status: "queued" }).onConflictDoUpdate({
                target: courseSyllabus.courseInfoId,
                set: {
                    rawSyllabus,
                },
            }).returning();
            const tabsToInsert = tabs.map(tab => ({
                tabId: tab.id,
                courseInfoId,
            } satisfies insertTabs));
            const newTabs = await tx.insert(courseTabs).values(tabsToInsert).onConflictDoNothing({
                target: [courseTabs.courseInfoId, courseTabs.tabId],
            }).returning();
            const newTabIds = newTabs.map(tab => tab.id);

            return { courseInfoId, syllabusId: syllabusRow.id, tabIds: newTabIds };
        });
        return response;
    }

    async fetchRawSyllabus(syllabusId: string): Promise<string> {
        const [syllabusRow] = await this.db.query.courseSyllabus.findMany({
            where: eq(courseSyllabus.id, syllabusId),
        });

        return syllabusRow.rawSyllabus;
    };

    async insertSyllabus(syllabusId: string, sanitizedSyllabus: string, plainText: string, syllabusHash: string): Promise<void> {
        await this.db.update(courseSyllabus)
            .set({ sanitizedSyllabus, plainText, hash: syllabusHash, status: "complete" })
            .where(eq(courseSyllabus.id, syllabusId))
            .returning();
    }

    async getAllCourseInfo(courseId: number): Promise<FullCourseInfo> {
        const [info] = await this.db.select()
            .from(courseInfo)
            .where(
                eq(courseInfo.courseId, courseId),
            )
            .rightJoin(courseSyllabus, eq(courseInfo.id, courseSyllabus.courseInfoId))
            .rightJoin(courseTabs, eq(courseInfo.id, courseTabs.courseInfoId));
        return info;
    };

    async getCourseInfoByCourseId(courseId: number): Promise<CourseInfo> {
        const [info] = await this.db.select().from(courses).where(eq(courses.id, courseId)).rightJoin(courseInfo, eq(courses.id, courseInfo.courseId));
        return {
            name: info.course_info.name,
            canvasCourseId: info.course_info.canvasCourseId,
            courseCode: info.course_info.courseCode,
        };
    }

    async getCourseTabs(courseId: number): Promise<string[]> {
        const result = await this.db.select()
            .from(courseInfo)
            .where(eq(courseInfo.courseId, courseId))
            .innerJoin(courseTabs, eq(courseInfo.id, courseTabs.courseInfoId));

        const tabs = result.map(course => course.course_tabs.tabId);

        return tabs;
    }

    async getCourseSyllabus(courseId: number): Promise<string | null> {
        const [result] = await this.db.select()
            .from(courseInfo)
            .where(eq(courseInfo.courseId, courseId))
            .innerJoin(courseSyllabus, eq(courseInfo.id, courseSyllabus.courseInfoId));

        return result.course_syllabus.sanitizedSyllabus;
    }
}