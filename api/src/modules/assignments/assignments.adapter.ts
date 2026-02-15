import type { AssignmentType, CanvasAssignmentType } from "@/lib/types.js";

function canvasToDb(rawAssignments: CanvasAssignmentType): AssignmentType {
    return {
        assignmentId: rawAssignments.id,
        assignmentName: rawAssignments.name || "",
        courseId: rawAssignments.id,
        description: rawAssignments.description || "",
        dueAt: rawAssignments.due_at || "",
        pointsPossible: rawAssignments.points_possible,
        url: rawAssignments.html_url,
    };
}

export function mapAssignmentsToDb(assignments: CanvasAssignmentType[]) {
    return assignments.map(canvasToDb);
}