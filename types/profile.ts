export interface UserProfile {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role_id: string;
    roles: {
        id: string;
        label: string;
    }
}

export interface TransformedUser {
    id: string;
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
    roleId: string;
    userRole: string;
}

export interface Volunteer {
    created_at: string;
    id: string;
    race_id: string | null;
    volunteer_id: string | null;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
        email: string | null;
    } | null;
}


export interface TransformedVolunteer {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
    email: string | null;
}

export interface Volunteer2 {
    id: string
    full_name: string | null
    avatar_url: string | null
    email: string | null
}
