import CourseHeader from "../../_components/courseHeader";
import { getCourseTabs } from "./data";

type Params = Promise<{ courseId: string }>

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode, 
    params: Params,
}) {
    const { courseId } = await params;
    const courseTabs = await getCourseTabs(courseId);

     return (
        <div className="flex flex-col min-h-screen">
            <CourseHeader canvasCourseId={Number(courseId)} />
            <div className="flex mt-5 flex-1">
                <section className="shrink-0 w-48 flex justify-center border-r-2">
                    <ul>
                        {courseTabs.map((tab, index) => {
                            return <li key={index}>{tab}</li>
                        })}
                    </ul>
                </section>
                <section className="flex-1 flex justify-center">{children}</section>
            </div>
        </div>
    );
}