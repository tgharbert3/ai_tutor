import { Card, CardDescription, CardFooter } from "@heroui/react"
import { NotebookPen } from "lucide-react"

export default function ClassCard() {
    return (
        <div>
        <Card className="shadow-m rounded-none hover:shadow-lg">
            <Card.Header className="hover:underline">
                <Card.Title>Course Code</Card.Title>
                <CardDescription>Course Name</CardDescription>
            </Card.Header>
            <CardFooter className="">
                <NotebookPen strokeWidth={1.5} size={20} className=" text-slate-500 hover:text-slate-900"/>
            </CardFooter>
        </Card>
        </div> 
        
    )
}