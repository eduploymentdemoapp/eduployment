import { fail, redirect } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies }) => {
    if (!locals.session) {
        throw redirect(302, "/login"); 
    }
    try {
        await invalidateSession(locals.session.id);

    } catch (error) {
        console.error("Error invalidating session:", error);
    }
    throw redirect(302, "/login");
};
