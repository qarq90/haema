export type ProfileField = {
    label: string;
    value?: string | null;
    mono?: boolean;
};

export type ExternalAccount = {
    id: string;
    provider: string;
    emailAddress?: string | null;
    username?: string | null;
};

export type ProfileProps = {
    imageUrl: string;
    fullName?: string | null;
    username?: string | null;
    primaryEmail?: string | null;
    externalAccounts: ExternalAccount[];
    fields: ProfileField[];
};

export type BloodProfile = {
    bloodType: string;
    heightCm: string;
    weightKg: string;
    dateOfBirth: string;
    gender: string;
    lastDonation: string;
    chronicConditions: string[];  
    medications: string[];        
    allergies: string[];          
    emergencyContactName: string;
    emergencyContactPhone: string;
};