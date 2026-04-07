"use server";

import { nanoid } from "nanoid";

/**
 * Generates secure initial credentials for a new client/staff.
 * In a real scenario, this would create an entry in the 'users' table 
 * and send an email or return a one-time secret.
 */
export async function generateSecureCredentials(role: "STAFF" | "CLIENT", email: string) {
    const tempPassword = nanoid(12);

    // Logic to insert into DB would go here:
    // const newUser = await db.insert(users).values({ 
    //   email, 
    //   password: await hash(tempPassword, 10),
    //   role 
    // });

    return {
        success: true,
        credentials: {
            email,
            tempPassword,
            portalUrl: role === "STAFF" ? "/admin" : "/dashboard",
        },
        message: "Secure credentials initialized and ready for deployment."
    };
}
