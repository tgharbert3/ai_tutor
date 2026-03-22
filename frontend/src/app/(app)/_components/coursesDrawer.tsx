'use client'

import { Button, Drawer } from "@heroui/react";
import { Course } from "../dashboard/page";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  courses: Course[];
}
export function CoursesDrawer({courses}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Drawer>
      <Button className="bg-slate-700" onPress={() => setIsOpen(true)}>Courses</Button>
      <Drawer.Backdrop variant="transparent" isOpen={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Content placement="left" className="pl-24">
          <Drawer.Dialog>
            <Drawer.Header>
              <Drawer.Heading className="flex justify-between">
                <span className="font-semibold text-2xl text-slate-700">Courses</span>
                <Button slot="close" variant="secondary">
                <X strokeWidth={2}/>
              </Button>
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <ul>
                {courses.map(course => {
                  return <Link key={course.canvasCourseId} href={`/courses/${course.canvasCourseId}`}>
                    <li className="m-4 text-lg text-slate-800" onClick={() => setIsOpen(false)}>{course.courseCode} </li>
                  </Link>
                })}
              </ul>
            </Drawer.Body>
            <Drawer.Footer>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}