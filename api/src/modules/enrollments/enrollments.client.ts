export async function fetchUserEnrollmetnsFromCanvas(API_TOKEN: string, canvasBaseUrl: string) {
    try {
        const enrollments = await fetch(`${canvasBaseUrl}/users/self/enrollments`, {
            method: "GET",
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        return await enrollments.json();
    }
    catch (error: any) {
        console.error(error.message);
        throw new Error("Unable to fetch user enrollments fro, canvas");
    }
}