export async function urlHealthCheck (API_TOKEN: string, url: string) {
    try {
        const courses = await fetch(`${url}/courses`, {
            method: "GET",
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        const isValid = await courses.json();
        if (isValid.length > 0) {
            return true;
        }
        return false;
    }
    catch (error: any) {
        console.error(error);
        throw new Error("Failed health check");
    }
}