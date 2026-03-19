import { cookies } from "next/headers";
import ClassCard from "../_components/classCard";
import DashboardHeader from "../_components/dashboardHeader";
import SyncData from "../_components/syncData";
import NavBar from "../_components/navbar";

export type Course = {
    courseCode: string;
    name: string;
    canvasCourseId: number;
}

export default async function Page() {
    const cookiesStore = await cookies();
    const cookieHeader = cookiesStore.toString();

    const response = await fetch("http://localhost:3600/api/v1/dashboard", {
        headers: {
            Cookie: cookieHeader,
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
    }
    const coursesArray = await response.json()

    return (
        <div className="flex min-h-screen bg-background">
            <section className="shrink-0 w-24">
                <NavBar courses={coursesArray}/>
            </section>
            <section className="flex-1">
                <div className="p-6">
                    <div className="w-full p-4">
                        <DashboardHeader />
                    </div>
                <div className="pt-4">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(262px,1fr))] gap-6">
                    {coursesArray.map((course: Course) => <ClassCard courseCode={course.courseCode} name={course.name} key={course.canvasCourseId}/>)}
                    </div>
                </div>
                 </div> 
            </section>
           <section className="w-56 flex flex-col items-center m-8 shrink-0">
                <SyncData />
            </section>
        </div>
    )
}