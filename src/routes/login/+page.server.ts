import { fail, redirect } from "@sveltejs/kit";
import { verifyEmailInput } from "$lib/server/email";
import { getUserFromEmail, getUserPasswordHash } from "$lib/server/user";
import { RefillingTokenBucket, Throttler } from "$lib/server/rate-limit";
import { createSession, generateSessionToken, setSessionTokenCookie, invalidateSession } from "$lib/server/session";

import type { SessionFlags } from "$lib/server/session";
import type { Actions, PageServerLoadEvent, RequestEvent } from "./$types";

export function load(event: PageServerLoadEvent) {
	if (event.locals.session !== null && event.locals.user !== null) {
		if (!event.locals.user.registered2FA) {
			return redirect(302, "/2fa/setup");
		}
		if (!event.locals.session.twoFactorVerified) {
			return redirect(302, "/2fa");
		}
		return redirect(302, "/");
	}
	return {};
}

const throttler = new Throttler<number>([0, 1, 2, 4, 8, 16, 30, 60, 180, 300]);
const ipBucket = new RefillingTokenBucket<string>(20, 1);

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	const clientIP = event.request.headers.get("X-Forwarded-For");
	if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
		return fail(429, {
			message: "Too many requests",
			email: ""
		});
	}

	const formData = await event.request.formData();
	const email = formData.get("email");
	const password = formData.get("password");
	if (typeof email !== "string" || typeof password !== "string") {
		return fail(400, {
			message: "Invalid or missing fields",
			email: ""
		});
	}
	if (email === "" || password === "") {
		return fail(400, {
			message: "Please enter your email and password.",
			email
		});
	}
	if (!verifyEmailInput(email)) {
		return fail(400, {
			message: "Invalid email",
			email
		});
	}

	const user = await getUserFromEmail(email);
	if (user === null) {
		return fail(400, {
			message: "Account does not exist",
			email
		});
	}

	if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
		return fail(429, {
			message: "Too many requests",
			email: ""
		});
	}

	if (!throttler.consume(user.id)) {
		return fail(429, {
			message: "Too many requests",
			email: ""
		});
	}

	const passwordHash = await getUserPasswordHash(email);
	const validPassword = passwordHash != password;
	if (!validPassword) {
		return fail(400, {
			message: "Invalid password d",
			email
		});
	}

	throttler.reset(user.id);
	const sessionFlags: SessionFlags = {
		twoFactorVerified: false
	};
	// invalidateSession(event.locals.session.id);

	const sessionToken = generateSessionToken();
	const session = createSession(sessionToken, user.id, sessionFlags);
	setSessionTokenCookie(event, sessionToken, (await session).expiresAt);

	if (!user.registered2FA) {
		return redirect(302, "/2fa/setup");
	}
	return redirect(302, "/2fa");
}
