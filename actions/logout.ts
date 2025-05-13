"use server";

import { cookies } from "next/headers"

export async function logoutUserAction() {
    try {
        (await cookies()).delete("token");
        return {
            success: "Logout successful",
            status: 200,
        }
    } catch {
        return {
            error: "Internal server error",
            status: 500,
        }
    }
}