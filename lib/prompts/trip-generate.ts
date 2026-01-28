import { TripRequest } from "./types";

/**
 * Template du prompt pour la génération d'itinéraire de voyage.
 * Modifiez ce fichier pour personnaliser le prompt envoyé à l'IA.
 */
export function buildTripPrompt(data: TripRequest): string {
    const childrenInfo = data.preferences.travelWithChildren && data.preferences.children.length > 0
        ? `Enfants présents : ${data.preferences.children.map(c => `${c.age} ans`).join(", ")}`
        : "Pas d'enfants";

    const goalInstruction = data.tripGoal === "cheapest"
        ? "L'objectif est de minimiser le coût total. Choisis les options les moins chères."
        : "L'objectif est de visiter le maximum d'endroits différents. Sélectionne plusieurs logements dans différentes zones si possible.";

    const prompt = `
Tu es un assistant de planification de voyages. Ton rôle est de sélectionner les meilleurs transports et logements parmi les options disponibles, en respectant le budget donné.

## Objectif du voyage
${goalInstruction}

## Budget total
${data.budget}

## Nombre de personnes
${data.numberOfPeople}

## Trajet
- Départ : ${data.departurePoint.name}, ${data.departurePoint.country}
- Arrivée : ${data.returnPoint.name}, ${data.returnPoint.country}

## Logements disponibles
${data.availableLodgings.length > 0
            ? data.availableLodgings.map(l => `- ID: ${l.lodgingId} | Prix: ${l.price} | Du ${new Date(l.checkInDate).toLocaleDateString('fr-FR')} au ${new Date(l.checkOutDate).toLocaleDateString('fr-FR')}`).join("\n")
            : "Aucun logement disponible"}

## Transports disponibles
${data.availableTransports.length > 0
            ? data.availableTransports.map(t => `- ID: ${t.id} | Type: ${t.type} | Compagnie: ${t.company} | Horaires: ${t.departureHour} - ${t.arrivalHour} | Prix: ${t.price}`).join("\n")
            : "Aucun transport disponible"}

## Instructions
Sélectionne les transports et logements qui rentrent dans le budget total.
${data.preferences.ecologicalPreference ? "Privilégie les options écologiques si possible." : ""}

Réponds UNIQUEMENT avec un objet JSON au format suivant (sans backticks markdown) :
{
  "selectedTransports": [
    { "id": "transport-xxx", "departureDate": "YYYY-MM-DD" }
  ],
  "selectedLodgings": [
    { "lodgingId": "lodging-xxx", "checkInDate": "YYYY-MM-DD", "checkOutDate": "YYYY-MM-DD" }
  ],
  "tripStartDate": "YYYY-MM-DD",
  "tripEndDate": "YYYY-MM-DD",
  "totalCost": "XXX €",
  "remainingBudget": "XXX €"
}
`.trim();

    return prompt;
}
