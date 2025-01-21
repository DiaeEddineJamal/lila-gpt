import { StreamingTextResponse } from "ai";
import { Ollama } from "@langchain/community/llms/ollama";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    console.log("Request body:", reqBody);

    if (!reqBody.messages || reqBody.messages.length === 0) {
      throw new Error("No messages provided in the request body");
    }

    const prompt = reqBody.messages[reqBody.messages.length - 1].content;
    console.log("Prompt:", prompt);

    // Check if the request is for image generation
    const isImageGeneration = reqBody.isImageGeneration || false;

    if (isImageGeneration) {
      // Handle image generation
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
    } else {
      // Handle text generation
      const ollama = new Ollama({
        baseUrl: "http://localhost:11434",
        model: "llama3.2:3b",
      });

      console.log("Ollama instance created");

      const stream = await ollama.stream(prompt);
      console.log("Stream obtained:", stream);

      if (!stream) {
        throw new Error("Stream is undefined");
      }

      return new StreamingTextResponse(stream);
    }
  } catch (error: unknown) {
    console.error("Error in POST function:", error);

    let errorMessage = "An unknown error occurred";
    let errorStack = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack || "";
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return new Response(JSON.stringify({ error: errorMessage, stack: errorStack }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}