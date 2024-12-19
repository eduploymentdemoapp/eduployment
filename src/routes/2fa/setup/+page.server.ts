import { createTOTPKeyURI, verifyTOTP } from "@oslojs/otp";
import { fail, redirect } from "@sveltejs/kit";
import { decodeBase64, encodeBase64 } from "@oslojs/encoding";
import { updateUserTOTPKey } from "$lib/server/user";
import { setSessionAs2FAVerified } from "$lib/server/session";
import { RefillingTokenBucket } from "$lib/server/rate-limit";
import { renderSVG } from "uqr";

import type { Actions, RequestEvent } from "./$types";

const totpUpdateBucket = new RefillingTokenBucket<number>(3, 60 * 10);

export async function load(event: RequestEvent) {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, "/login");
	}
	const totpKey = new Uint8Array(20);
	crypto.getRandomValues(totpKey);
	const encodedTOTPKey = encodeBase64(totpKey);
	const keyURI = createTOTPKeyURI("Eduployment", event.locals.user.username, totpKey, 30, 6);
	const qrcode = renderSVG(keyURI);
	return {
		encodedTOTPKey,
		qrcode
	};
}

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	if (event.locals.session === null || event.locals.user === null) {
		return fail(401, {
			message: "Not authenticated"
		});
	}

	const formData = await event.request.formData();
	const encodedKey = formData.get("key");
	const code = formData.get("code");
	if (typeof encodedKey !== "string" || typeof code !== "string") {
		return fail(400, {
			message: "Invalid or missing fields"
		});
	}
	if (code === "") {
		return fail(400, {
			message: "Please enter your code"
		});
	}
	if (encodedKey.length !== 28) {
		return fail(400, {
			message: "Please enter your code"
		});
	}
	let key: Uint8Array;
	try {
		key = decodeBase64(encodedKey);
	} catch {
		return fail(400, {
			message: "Invalid key"
		});
	}
	if (key.byteLength !== 20) {
		return fail(400, {
			message: "Invalid key"
		});
	}
	if (!totpUpdateBucket.consume(event.locals.user.id, 1)) {
		return fail(429, {
			message: "Too many requests"
		});
	}
	if (!verifyTOTP(key, 30, 6, code)) {
		return fail(400, {
			message: "Invalid code"
		});
	}
	updateUserTOTPKey(event.locals.session.userId, key);
	setSessionAs2FAVerified(event.locals.session.id);
	return redirect(302, "/");
}
