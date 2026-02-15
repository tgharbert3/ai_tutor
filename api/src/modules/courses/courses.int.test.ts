import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";

import { Client } from "pg";
import { beforeAll, describe, it } from "vitest";

import { CourseRepository } from "./courses.repo.js";


describe("user Routes", () => {
    let postgresContainer: StartedPostgreSqlContainer;
    let postgresClient: Client;
    let db;
    let courseRepo: CourseRepository;

    beforeAll(async () => {
       
    
    }, 30000);

    it("test", async () => {
        
    })
    // it("should return an array of courses", async () => {
    // const courseInstance = new CourseService(courseRepo, env.API_TOKEN, env.CANVAS_BASE_URL);
    // const response = await courseInstance.syncCourses();
    // expect(response).toBeInstanceOf(Array);

    // const coursesFromDb = await courseRepo.findAllCourses();
    // expect(coursesFromDb).toBeInstanceOf(Array);
    // });
});