import { fail, redirect } from "@sveltejs/kit";
import { updateUserPassword, getUserPasswordResetToken, deleteResetToken} from "$lib/server/user";
import { RefillingTokenBucket, Throttler } from "$lib/server/rate-limit";
import { hashPassword, hashToken, verifyPasswordStrength } from "$lib/server/password";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";

import type { Actions, PageServerLoadEvent, RequestEvent, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals }) => {
    const email = url.searchParams.get("email");
    const token = url.searchParams.get("token");
    console.log('email', email);
    console.log('token', token);

    if (!email || !token) {
        console.error("Missing email or token");
        throw redirect(302, "/login");
    }

    const resetData = await getUserPasswordResetToken(email);

    if (!resetData || resetData.token !== hashToken(token) || Date.now() > resetData.expiry) {
        console.error("Token is invalid or expired");
        throw redirect(302, "/login");
    }

    if (locals.session) {
        console.log("Invalidating existing session...");
        await invalidateSession(locals.session.id);
    }

    return { email };
};

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
    const formData = await event.request.formData();
    const newPassword = formData.get("password");
    const email = formData.get("email") as string;

    if (!newPassword ) {
        return fail(400, {
            message: "New password is required",
            errors: {
                password: !newPassword ? "New password is required" : "",
            }
        });
    }

    const strongPassword = await verifyPasswordStrength(newPassword);
	if (!strongPassword) {
		return fail(400, {
			message: "Weak password"
		});
	}

    const hashedPassword = await hashPassword(newPassword);
    await updateUserPassword(email, hashedPassword);
    await deleteResetToken(email);

    return redirect(302, '/login');
}