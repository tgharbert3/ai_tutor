'use client'
import { useEffect, useState } from "react";
import StatusStream from "./status.stream";

 

export default function SyncData() {
    const [ingestionRunId, setIngestionRunId] = useState<string | null>(null);

    useEffect(() => {
        const run = async () => {
            const res = await fetch("/api/sync" , {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    
                },
                credentials: "include"
                
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status}: ${text}`)
            };
            const {ingestionRunId} = await res.json();
            setIngestionRunId(ingestionRunId);
            console.log(ingestionRunId);
        }
        run().catch(console.error); 
    }, [])

    return ingestionRunId ? <StatusStream ingestionRunId={ingestionRunId} /> : null;
}