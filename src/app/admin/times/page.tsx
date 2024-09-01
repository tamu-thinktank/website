"use client";

import PickTimezone from "@/components/pick-timezone";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/trpc/react";
import { useState } from "react";
import OfficersGrid from "./officers-grid";
import PickTeams from "./pick-teams";

export default function MeetingTimes() {
  const [userTimezone, setUserTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  // const { mutate: clearTimes } = api.admin.clearAvailabilities.useMutation();

  return (
    <Card className="h-[95%] overflow-auto">
      <CardContent className="mt-6 flex gap-4">
        {/* <Button size={"sm"} className="mt-6" onClick={() => clearTimes()}>
          Clear times
        </Button> */}
        <PickTimezone
          userTimezone={userTimezone}
          setUserTimezone={setUserTimezone}
        />
        <PickTeams />
      </CardContent>
      <CardContent>
        <OfficersGrid userTimezone={userTimezone} />
      </CardContent>
    </Card>
  );
}
