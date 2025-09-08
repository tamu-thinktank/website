import { NextResponse } from "next/server";

// This endpoint has been disabled to prevent creation of dummy/mock users.
// The system now only works with real authenticated users who log in through OAuth.
// Real users automatically become available as interviewers when they authenticate.

export async function GET() {
  return NextResponse.json(
    { 
      error: "Endpoint disabled", 
      message: "This system only works with authenticated users. Please log in to become an available interviewer." 
    },
    { status: 410 } // 410 Gone - indicates the resource is intentionally no longer available
  );
}
