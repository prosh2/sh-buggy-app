import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const API_URL = process.env.OCR_API_URL + "/paddle";
    if (!API_URL) {
      return NextResponse.json(
        { error: "API_URL not configured" },
        { status: 500 }
      );
    }
    // Parse form data (for multipart/form-data)
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // Create form data to send to external API
    const externalForm = new FormData();
    externalForm.append("file", imageFile);

    // Forward to external API
    const response = await fetch(API_URL, {
      method: "POST",
      body: externalForm,
    });

    if (!response.ok) {
      const text: string = await response.text();
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
