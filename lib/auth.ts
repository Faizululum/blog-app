import { jwtVerify } from "jose";

export async function verifyAuth(token: string) {
    if (!token) {
        return null;
    }

    try {
        const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));

        return {
            userId: payload.userId,
            email: payload.email,
            userName: payload.userName,
        };
    } catch (error) {
        console.log(error, "Error fetching token");
        return null
    }
}