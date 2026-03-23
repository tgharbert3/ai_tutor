import type { ICourseInfoRepository } from "@/infrastructure/interfaces/repos/courseInfo.interface.js";
import type { IEnrollmentRepo } from "@/infrastructure/interfaces/repos/enrollment.interface.js";

export interface GetCourseInfoForDashboardDeps {
    enrollmentsRepo: IEnrollmentRepo;
    courseInfoRepo: ICourseInfoRepository;
}

export interface GetCourseTabsDeps {
    enrollmentsRepo: IEnrollmentRepo;
    courseInfoRepo: ICourseInfoRepository;
}

export interface GetCourseSyllabusDeps {
    enrollmentsRepo: IEnrollmentRepo;
    courseInfoRepo: ICourseInfoRepository;
}