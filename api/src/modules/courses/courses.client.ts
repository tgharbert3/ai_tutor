export async function fetchCoursesFromCanvas(API_TOKEN: string, canvasBaseUrl: string) {
    try {
        console.log(canvasBaseUrl);
        const courses = await fetch(`${canvasBaseUrl}/courses?per_page=75&include[]=syllabus_body`, {
            method: "GET",
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        return courses.json();
    }
    catch (error: any) {
        console.error(error);
        throw new Error("Unable to fetch courses from canvas");
    }
}
