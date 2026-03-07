export type BrnadVariables = Record<string, string>;

export interface CanvasEnrollment {
    id: number;
    courseId: number;
    enrollmentState: string;
}

export interface StreamActivityItem {
    id: number;
    courseId: number;
    entityType: StreamActivityType;
    htmlUrl: string;
    updated_at: Date;
};

export type StreamActivityType = "DiscussionTopic" | "Conversation " | "Message" | "Submission " | "Conference" | "Collaboration" | "AssessmentRequest" | "Announcement";

export interface CanvasCourse {
    id: number;
    name: string;
    course_code: string;
    syllabus_body: string;
    workflow_state: string;
    tabs: object;
}

export interface CanvasTab {
    id: string;
    html_url: string;
    normalizedUrl: string;
    canvasInfoId: string;
}