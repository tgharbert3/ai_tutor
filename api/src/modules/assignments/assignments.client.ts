export async function fetchAssignmentsFromCanvas(API_TOKEN: string, canvasBaseUrl: string, courseId: number) {
    try {
        const courses = await fetch(`${canvasBaseUrl}/courses/${courseId}/assignments`, {
            method: "GET",
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        return courses.json();
    }
    catch (error: any) {
        console.error(error);
        throw new Error("Unable to fetch assignments from canvas");
    }
}