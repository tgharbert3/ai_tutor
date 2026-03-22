"use client";

import { Pane, SplitPane } from "react-split-pane";
import SyncData from "./syncData";

export default function AppShell({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <section className="w-24 shrink-0">
        {nav}
      </section>

      <section className="flex-1 min-w-0 h-full">
        <SplitPane direction="horizontal" className="h-full w-full">
          <Pane minSize="400px">
            <div className="h-full min-w-0 overflow-auto">
              {children}
            </div>
          </Pane>

          <Pane defaultSize="320px" minSize="260px" maxSize="700px">
            <div className="h-full overflow-auto border-l">
              <SyncData />
            </div>
          </Pane>
        </SplitPane>
      </section>
    </div>
  );
}