import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { TripRequest } from "@/lib/prompts/types";
import { buildTripPrompt } from "@/lib/prompts/trip-generate";

export async function POST(req: NextRequest) {
    try {
        // Récupération de la clé API
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Clé API Gemini non configurée." },
                { status: 500 }
            );
        }

        const body: TripRequest = await req.json();

        // Validation des champs obligatoires
        if (!body.name || body.name.trim() === "") {
            return NextResponse.json(
                { error: "Le nom du voyage est requis." },
                { status: 400 }
            );
        }

        if (!body.tripType) {
            return NextResponse.json(
                { error: "Le type de voyage est requis." },
                { status: 400 }
            );
        }

        if (!body.numberOfPeople || body.numberOfPeople < 1) {
            return NextResponse.json(
                { error: "Le nombre de personnes est requis et doit être au moins 1." },
                { status: 400 }
            );
        }

        if (!body.departurePoint || !body.departurePoint.name) {
            return NextResponse.json(
                { error: "Le point de départ est requis." },
                { status: 400 }
            );
        }

        if (!body.returnPoint || !body.returnPoint.name) {
            return NextResponse.json(
                { error: "Le point de retour est requis." },
                { status: 400 }
            );
        }

        if (!body.preferences) {
            return NextResponse.json(
                { error: "Les préférences sont requises." },
                { status: 400 }
            );
        }

        // Construction du prompt avec les données
        const prompt = buildTripPrompt(body);
        console.log("Prompt généré:", prompt);

        // Appel à Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedContent = response.text();

        // Nettoyage du JSON retourné par l'IA (suppression des backticks markdown)
        let cleanedJson = generatedContent
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        // Parse du JSON
        let selection;
        try {
            selection = JSON.parse(cleanedJson);
        } catch {
            console.error("Erreur de parsing JSON:", cleanedJson);
            return NextResponse.json(
                { error: "Réponse de l'IA invalide", rawContent: generatedContent },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            tripId: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            request: body,
            selection,
        });

    } catch (error: unknown) {
        console.error("Erreur lors de la génération du voyage:", error);
        const errorMessage = error instanceof Error ? error.message : "Erreur lors de la génération du voyage.";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
