import { RefillingTokenBucket } from "$lib/server/rate-limit";
import { validateSessionToken, setSessionTokenCookie, deleteSessionTokenCookie } from "$lib/server/session";
import { sequence } from "@sveltejs/kit/hooks";
import { redirect } from '@sveltejs/kit';

import type { Handle } from "@sveltejs/kit";

const bucket = new RefillingTokenBucket<string>(100, 1);

const rateLimitHandle: Handle = async ({ event, resolve }) => {
	const clientIP = event.request.headers.get("X-Forwarded-For");
	if (clientIP === null) {
		return resolve(event);
	}
	let cost: number;
	if (event.request.method === "GET" || event.request.method === "OPTIONS") {
		cost = 1;
	} else {
		cost = 3;
	}
	if (!bucket.consume(clientIP, cost)) {
		return new Response("Too many requests", {
			status: 429
		});
	}
	return resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get("session") ?? null;

    console.log('token authHandle:' + token);
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		if (event.url.pathname !== '/login' && event.url.pathname !== '/set-password') {
			throw redirect(303, '/login');
		}
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt);
	} 
    else {
		deleteSessionTokenCookie(event);
	}

	event.locals.session = session;
	event.locals.user = user;
    console.log("authHandle Session:", event.locals.session);
    console.log("authHandle User:", event.locals.user);
	return resolve(event);
};

export const handle = sequence(rateLimitHandle, authHandle);