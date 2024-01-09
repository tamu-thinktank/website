"use client";

import PickTimezone from "@/components/pick-timezone";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import OfficersGrid from "./officers-grid";

export default function MeetingTimes() {
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  return (
    <Card className="h-[95%] overflow-auto">
      <CardContent className="mt-6 flex flex-col gap-1">
        <PickTimezone
          userTimezone={userTimezone}
          setUserTimezone={setUserTimezone}
        />
      </CardContent>
      <CardContent>
        <OfficersGrid userTimezone={userTimezone} />
      </CardContent>
    </Card>
  );
}
