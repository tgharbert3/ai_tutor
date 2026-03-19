import { Card, CardDescription, CardFooter } from "@heroui/react";
import { NotebookPen } from "lucide-react";

type Props = {
    courseCode: string
    name: string;
}
export default function ClassCard(props: Props) {
    return (
        <div>
            <Card className="shadow-m rounded-none hover:shadow-lg">
                <Card.Header className="hover:underline">
                    <Card.Title>{props.courseCode}</Card.Title>
                    <CardDescription>{props.name}</CardDescription>
                </Card.Header>
                <CardFooter className="">
                    <NotebookPen strokeWidth={1.5} size={20} className=" text-slate-500 hover:text-slate-900"/>
                </CardFooter>
            </Card>
        </div> 
    )
}