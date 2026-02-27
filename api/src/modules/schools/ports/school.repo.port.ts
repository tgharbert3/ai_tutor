import type { PartialSchool, SchoolDto } from "../domain/types.js";

export interface SchoolRepositoryPort {
    upsertSchool: (school: PartialSchool) => Promise<SchoolDto>;
    fetchOneSchoolByUrl: (url: string) => Promise<SchoolDto>;
};