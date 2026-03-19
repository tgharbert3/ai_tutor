// src/app/(app)/dashboard/StatusStream.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  ingestionRunId: string;
};

export default function StatusStream({ ingestionRunId }: Props) {
  const [closed, setClosed] = useState<boolean>(true);

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/ingestionRunStatus/${ingestionRunId}/events`,
      { withCredentials: true }
      // EventSource only supports credentials via withCredentials option when cross-origin
    );

    eventSource.onopen = (e) => {
      console.log("opening event source");
      setClosed(false);
    }

    eventSource.onmessage = (event) => {
      console.log("message:", event);
    };

    eventSource.addEventListener("ingestion-update", (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.runningCount === "0" && data.queuedCount === "0" && data.isFinal == true) {
        eventSource.close();
        setClosed(true)
      }
    })

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      // console.log(eventSource.CLOSED);
      eventSource.close();
      setClosed(true);
    };

  }, [ingestionRunId]);

  if (closed) {
    return <></>
  } else {
    return <div>Listening for updates...</div>;
  }
}