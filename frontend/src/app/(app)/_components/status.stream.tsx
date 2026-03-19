// src/app/(app)/dashboard/StatusStream.tsx
"use client";

import { Button, Label, ProgressBar } from "@heroui/react";
import { useEffect, useState } from "react";

type Props = {
  ingestionRunId: string;
};

export default function StatusStream({ ingestionRunId }: Props) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/ingestionRunStatus/${ingestionRunId}/events`,
      { withCredentials: true }
      // EventSource only supports credentials via withCredentials option when cross-origin
    );


    eventSource.addEventListener("ingestion-update", (event) => {
      const data = JSON.parse(event.data);
      const total = Number(data.runningCount) + Number(data.queuedCount) + Number(data.successCount) + Number(data.failedCount) + Number(data.noopCount);
      const completed = (Number(data.successCount) + Number(data.failedCount) + Number(data.noopCount));
      const prog = total === 0 ? 0 : (completed / total) * 100;
      setProgress(prog);

      if (data.runningCount === "0" && data.queuedCount === "0" && data.isFinal == true) {
        eventSource.close();
      }
    })

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

   
  }, [ingestionRunId]);


  if (progress < 100) {
    return (
    <ProgressBar value={progress}>
      <Label>Loading Courses</Label>
      <ProgressBar.Output />
      <ProgressBar.Track>
        <ProgressBar.Fill />
      </ProgressBar.Track>
    </ProgressBar>
  );} else {
    return (
      <Button>Chat with AI</Button>
    )
  }
  
}