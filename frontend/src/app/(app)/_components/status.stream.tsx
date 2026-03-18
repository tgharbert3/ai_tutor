// src/app/(app)/dashboard/StatusStream.tsx
"use client";

import { useEffect } from "react";

type Props = {
  ingestionRunId: string;
};

export default function StatusStream({ ingestionRunId }: Props) {
  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:3600/ingestionRunStatus/${ingestionRunId}/events`,
      { withCredentials: true }
      // EventSource only supports credentials via withCredentials option when cross-origin
    );

    eventSource.onopen = (e) => {
      console.log("opening event source");
    }

    eventSource.onmessage = (event) => {
      console.log("message:", event);
    };

    eventSource.addEventListener("ingestion-update", (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.runningCount === "0" && data.queuedCount === "0" && data.isFinal == true) {
        eventSource.close();
      }
      
    })

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      // console.log(eventSource.CLOSED);
      eventSource.close();
    };

  }, [ingestionRunId]);

  return <div>Listening for updates...</div>;

}