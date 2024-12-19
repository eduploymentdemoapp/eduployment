import { db, set, ref, get, update, remove} from "./firebase";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { redirect } from "@sveltejs/kit";

import type { User } from "./user";
import type { RequestEvent } from "@sveltejs/kit";

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    try {
        const sessionRef = ref(db, `sessions/${sessionId}`);
        const sessionSnapshot = await get(sessionRef);

        if (!sessionSnapshot.exists()) {
            console.log("Session not found");
            return { session: null, user: null };
        }
        const sessionData = sessionSnapshot.val();

        const currentTime = Date.now();
        const expiresAt = sessionData.expiresAt * 1000;

        if (currentTime >= expiresAt) {
            console.log("Session expired");
            return { session: null, user: null };
        }

        const fifteenDaysMs = 1000 * 60 * 60 * 24 * 15;
        if (currentTime >= expiresAt - fifteenDaysMs) {
            const newExpiration = Math.floor((currentTime + 1000 * 60 * 60 * 24 * 30) / 1000); 
            await sessionRef.update({ expiresAt: newExpiration });
            sessionData.expiresAt = newExpiration;
        }

        const userRef = ref(db, `users/${sessionData.userId}`);
        const userSnapshot = await get(userRef);

        if (!userSnapshot.exists()) {
            console.log("User not found for the session");
            return { session: null, user: null };
        }

        const userData = userSnapshot.val();

        const session: Session = {
            id: sessionId,
            userId: sessionData.userId,
            expiresAt: new Date(sessionData.expiresAt * 1000),
            twoFactorVerified: Boolean(sessionData.twoFactorVerified),
        };

        const user: User = {
            id: sessionData.userId,
            email: userData.email || "",
            username: `${userData.firstName} ${userData.lastName}` || "",
            emailVerified: userData.emailVerified, 
            registered2FA: userData.totp_key && userData.totp_key.length > 0 || false,
        };

        return { session, user };
    } catch (error) {
        console.error("Error validating session token:", error);
        return { session: null, user: null };
    }
}

export async function invalidateSession(sessionId: string): Promise<void> {
	try {
		const sessionRef = ref(db, `sessions/${sessionId}`);
		
		await remove(sessionRef);

	} catch (error) {
		console.error(`Error invalidating session ${sessionId}:`, error);
	}
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set("session", token, {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		expires: expiresAt
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set("session", "", {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		maxAge: 0
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token: string, userId: string, flags: SessionFlags): Promise<Session> {
	console.log('createSession token:' + token);
	console.log('createSession userId:' + userId);

	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		twoFactorVerified: flags.twoFactorVerified
	};

	console.log('sessionId :' + sessionId);

	const userRef = ref(db, `sessions/${sessionId}`);
    await set(userRef, {
		sessionId,
		userId,
		expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
		twoFactorVerified: Number(session.twoFactorVerified),
    });
	
	return session;
}

export function setSessionAs2FAVerified(sessionId: string): void {
    const sessionRef = ref(db, `sessions/${sessionId}`);
    update(sessionRef, {
        twoFactorVerified: true
    })
    .then(() => {
        console.log("Session updated to 2FA verified.");
    })
    .catch((error) => {
        console.error("Error updating session:", error);
    });
}

export async function signOut(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
    if (!event.locals.session) {
        return redirect(302, "/login");
    }
    await invalidateSession(event.locals.session.id);
    deleteSessionTokenCookie(event);
    throw redirect(302, "/login");
}

export interface SessionFlags {
	twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
	id: string;
	expiresAt: Date;
	userId: number;
}

type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };
