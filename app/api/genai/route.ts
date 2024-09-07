import { StreamingTextResponse } from "ai";
import { Ollama } from "@langchain/community/llms/ollama";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    console.log("Request body:", reqBody);

    if (!reqBody.messages || reqBody.messages.length === 0) {
      throw new Error("No messages provided in the request body");
    }

    const prompt = reqBody.messages[reqBody.messages.length - 1].content;
    console.log("Prompt:", prompt);

    const ollama = new Ollama({
      baseUrl: 'https://immune-humpback-heartily.ngrok-free.app',
      model: 'Luzivx/luzivila-model',
    });

    console.log("Ollama instance created");

    const stream = await ollama.stream(prompt);
    console.log("Stream obtained:", stream);

    if (!stream) {
      throw new Error("Stream is undefined");
    }

    return new StreamingTextResponse(stream);
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
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
