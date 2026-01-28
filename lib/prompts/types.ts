// Types partagés pour les prompts et l'API

export interface Location {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface Child {
    age: number;
}

export interface Preferences {
    sharedExpensesTracking: boolean;
    activityLevel: "low" | "medium" | "high";
    dietaryPreference: string;
    reducedMobility: boolean;
    travelWithChildren: boolean;
    children: Child[];
    spokenLanguages: string[];
    ecologicalPreference: boolean;
}

export interface Lodging {
    lodgingId: string;
    destinationId: string;
    checkInDate: string;
    checkOutDate: string;
    price: string;
}

export interface Transport {
    id: string;
    type: string;
    departureHour: string;
    arrivalHour: string;
    price: string;
    company: string;
}

export interface TripRequest {
    name: string;
    tripType: "friends" | "family" | "couple" | "solo" | "business";
    numberOfPeople: number;
    departurePoint: Location;
    returnPoint: Location;
    preferences: Preferences;
    availableLodgings: Lodging[];
    availableTransports: Transport[];
    budget: string;
    tripGoal: "cheapest" | "most_places";
}

export interface SelectedTransport {
    id: string;
    departureDate: string;
}

export interface SelectedLodging {
    lodgingId: string;
    checkInDate: string;
    checkOutDate: string;
}

export interface TripSelectionResponse {
    selectedTransports: SelectedTransport[];
    selectedLodgings: SelectedLodging[];
    tripStartDate: string;
    tripEndDate: string;
    totalCost: string;
    remainingBudget: string;
}
