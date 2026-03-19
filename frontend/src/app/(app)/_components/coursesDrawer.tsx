'use client'

import { Button, Drawer, useOverlayState } from "@heroui/react";
import { Course } from "../dashboard/page";
import { X } from "lucide-react";

type Props = {
  courses: Course[];
}
export function CoursesDrawer({courses}: Props) {
  const state = useOverlayState();
  return (
    <Drawer>
      <Button className="bg-slate-700" onPress={state.open}>Courses</Button>
      <Drawer.Backdrop variant="transparent">
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
                  return <li key={course.canvasCourseId} className="m-4 text-lg text-slate-800">
                    {course.courseCode}
                  </li>
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