import * as CanvasAdapter from "./courses.adapter.js";
import * as CanvasClient from "./courses.client.js";

export class CourseService {
  private apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  async syncCourses() {
    const rawCourses = await CanvasClient.fetchCoursesFromCanvas();
    const adaptedCourses = CanvasAdapter.mapCoursesToDb(rawCourses);
    return adaptedCourses;
  };
}
