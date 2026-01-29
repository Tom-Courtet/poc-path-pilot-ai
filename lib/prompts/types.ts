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
    $id: string;
    $collectionId?: string;
    $createdAt?: string;
    $databaseId?: string;
    $updatedAt?: string;
    $permissions?: string[];
    $sequence?: number;
    lodgingName: string;
    location: string;
    pricePerNight: number;
    numberOfGuests: number;
    numberOfRooms: number;
    photo_url?: string;
    wifi?: boolean;
    tv?: boolean;
    clim?: boolean;
    fumeur?: boolean;
}

export interface Transport {
    $id: string;
    $collectionId?: string;
    $createdAt?: string;
    $databaseId?: string;
    $updatedAt?: string;
    $permissions?: string[];
    $sequence?: number;
    type: string;
    departureHour: string;
    arrivalHour: string;
    departureLocation: string;
    arrivalLocation: string;
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
    availableLodgings?: Lodging[];
    availableTransports?: Transport[];
    budget: string;
    tripGoal: "cheapest" | "most_places";
}

export interface SelectedTransport {
    $id: string;
    departureDate: string;
}

export interface SelectedLodging {
    $id: string;
    numberOfNights: number;
}

export interface TripSelectionResponse {
    selectedTransports: SelectedTransport[];
    selectedLodgings: SelectedLodging[];
    tripStartDate: string;
    tripEndDate: string;
    totalCost: string;
    remainingBudget: string;
}
