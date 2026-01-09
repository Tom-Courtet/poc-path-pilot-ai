import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Récupération de la clé API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API non configurée." },
        { status: 500 }
      );
    }

    // 2. Lecture du prompt envoyé par le frontend
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Le prompt est vide." },
        { status: 400 }
      );
    }

    // 3. Initialisation du client Google
    const genAI = new GoogleGenerativeAI(apiKey);

    // --- CORRECTION ICI ---
    // Nous utilisons un modèle présent dans votre liste JSON : "gemini-2.0-flash"
    // C'est un modèle excellent, très rapide et multimodal.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. Appel à l'IA
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Retour au frontend
    return NextResponse.json({ result: text });

  } catch (error: any) {
    console.error("Erreur Gemini:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la génération." },
      { status: 500 }
    );
  }
}