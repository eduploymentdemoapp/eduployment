import { getAllUsers, createUser } from '$lib/server/user';
import {  verifyEmailInput, checkEmailAvailability } from '$lib/server/email';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoadEvent, RequestEvent } from "./$types";

export async function load(event: PageServerLoadEvent) {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, "/login");
	}
    if (!event.locals.user.registered2FA) {
		return redirect(302, "/2fa/setup");
	}
    if (!event.locals.session.twoFactorVerified) {
        return redirect(302, "/2fa");
    }    
    
    try {
        const users = await getAllUsers();

        return {
            users,
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        return {
            users: [],
            error: "Failed to fetch users",
        };
    }
}


export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
    const formData = await event.request.formData();
    const email = formData.get("email"); 
    const firstName = formData.get("firstName");
    const middleName = formData.get("middleName");
    const lastName = formData.get("lastName");
    const phoneNumber = formData.get("phoneNumber");
    const userName = 'dummyUserName';
    const durationFromDate = formData.get("fromDuration");
    const durationUpDate = formData.get("UpToDuration");

    console.log('durationFromDate', durationFromDate);
console.log('durationUpDate', durationUpDate);

    const pwd = '';

    if (!email || !firstName || !lastName || !phoneNumber) {
        return fail(400, {
            message: "All fields must be filled",
            errors: {
                email: !email ? "Email is required" : "",
                firstName: !firstName ? "First name is required" : "",
                lastName: !lastName ? "Last name is required" : "",
                phoneNumber: !phoneNumber ? "Phone number is required" : ""
            }
        });
    }

    if (!verifyEmailInput(email)) {
        return fail(400, {
            message: "Invalid email format",
            errors: { email: "Please provide a valid email address" }
        });
    }

    if (!/^[A-Z]/.test(firstName)) {
        return fail(400, {
            message: "First name must start with an uppercase letter",
            errors: { firstName: "First name must start with an uppercase letter" }
        });
    }

    if (!/^[a-z]*$/.test(middleName)) {
        return fail(400, {
            message: "Middle name must be all lowercase",
            errors: { middleName: "Middle name must be all lowercase" }
        });
    }

    if (!/^[A-Z]/.test(lastName)) {
        return fail(400, {
            message: "Last name must start with an uppercase letter",
            errors: { lastName: "Last name must start with an uppercase letter" }
        });
    }

    const regex = /^\+[1-9]\d{1,14}$/;
    if (!phoneNumber || !regex.test(String(phoneNumber))) {
        return fail(400, {
            message: "Invalid phone number format",
            errors: { phoneNumber: "Phone number must be in E.164 format (e.g., +1234567890)" }
        });
    }

    const regex1 = /^\d{4}-\d{2}-\d{2}$/; 
    if (!durationFromDate || !regex1.test(String(durationFromDate))) {
        return fail(400, {
            message: "Invalid 'From' duration format",
            errors: { fromDuration: "Duration From must be in YYYY-MM-DD format" }
        });
    }
    if (!durationUpDate || !regex1.test(String(durationUpDate))) {
        return fail(400, {
            message: "Invalid 'Up To' duration format",
            errors: { upToDuration: "Duration Up To must be in YYYY-MM-DD format" }
        });
    }

    if (await checkEmailAvailability(email)) {
        return fail(400, {
            message: "User with this email address already exists.",
            errors: { email: "Please provide a unique email address" }
        });
    }

    try {
        const user = await createUser(
            email,
            userName,
            pwd,
            firstName,
            middleName,
            lastName,
            phoneNumber,
            durationFromDate,
            durationUpDate
        );

        const users = await getAllUsers();

        return {
            success: true,
            users,
        };        

    } catch (error) {
        console.error("Error creating user:", error);
        return fail(500, {
            message: "An unexpected error occurred while creating the user"
        });
    }

}