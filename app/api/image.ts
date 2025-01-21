import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to generate image");
        }

        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json(
            { error: "Failed to generate image" },
            { status: 500 }
        );
    }
}