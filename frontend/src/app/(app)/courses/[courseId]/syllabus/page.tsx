import { getCourseSyllabus } from "../data";

type Props = {
    params:  Promise<{courseId: string}>
}

export default async function Page({ params }: Props,) {
    const { courseId } = await params;
    const syllabus = await getCourseSyllabus(courseId);
    console.log(syllabus);
    return (
       <div dangerouslySetInnerHTML={{__html: syllabus}} className="p-3"/>
    )
}