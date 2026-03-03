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