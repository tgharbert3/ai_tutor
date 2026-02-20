import { SchoolService } from "./school.service.js";

export async function fetchSchoolPrimaryColor(API_TOKEN: string, canvasBaseUrl: string) {
    const builtUrl = SchoolService.buildCanvasUrl(canvasBaseUrl, "brand_variables");
    try {
        const config = await fetch(`${builtUrl}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        const colors = await config.json();
        return colors["ic-brand-primary"];
    }
    catch (error: any) {
        console.error(error);
        throw new Error("Unable to fetch the school primary color");
    }
};