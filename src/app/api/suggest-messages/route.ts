import dbConnect from "@/lib/dbConnect";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API = process.env.GEMINI_KEY || "";
const genAI = new GoogleGenerativeAI(API);

export async function POST(request: Request) {
    await dbConnect();

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const { prompt } = await request.json();

        const result = await model.generateContentStream(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            return new Response(JSON.stringify({ success: false, message: "Text Not Found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: text }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: error }), { status: 500 });
    }
}
