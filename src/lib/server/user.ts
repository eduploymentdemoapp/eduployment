import { db, createUserWithEmailAndPassword,  set, ref, auth, query, orderByChild, equalTo , get, update, sendEmailVerification} from "./firebase";
import { decrypt, decryptToString, encrypt, encryptString } from "./encryption";
import { hashPassword, generateToken, hashToken} from "./password";
import { generateRandomRecoveryCode } from "./utils";
import { sendCustomEmail } from './email';

export function verifyUsernameInput(username: string): boolean {
	return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function createUser(
    email: string,
    username: string,
    password: string,
    firstName: string,
    middleName: string,
    lastName: string,
    phoneNumber: string,
    durationFromDate: string,
    durationUpDate: string
): Promise<UserList> {
    try {
		const passwordResetToken = generateToken();
		const encryptedPasswordResetToken = hashToken(passwordResetToken);
		const passwordResetTokenExpiry = Date.now() + 3600 * 1000;
		
        const passwordHash = await hashPassword(password);
        const recoveryCode = generateRandomRecoveryCode();
        const encryptedRecoveryCode = encryptString(recoveryCode);

        const userCredential = await createUserWithEmailAndPassword(auth, email, passwordHash);
        const authUser = userCredential.user;

        const userRef = ref(db, `users/${authUser.uid}`);
        await set(userRef, {
            email,
            username,
            firstName,
            middleName,
            lastName,
            phoneNumber,
            durationFromDate,
            durationUpDate,
            passwordHash,
            encryptedRecoveryCode,
			encryptedPasswordResetToken,
			passwordResetTokenExpiry,
            emailVerified: false,
			passwordExpired: true,
            registered2FA: false, 
        });

        const user: UserList = {
            id: authUser.uid,
            email,
            username,
            firstName,
            middleName,
            lastName,
            phoneNumber,
            durationFromDate,
            durationUpDate,
			encryptedPasswordResetToken,
			passwordResetTokenExpiry,			
            emailVerified: false,
			passwordExpired: true,
            registered2FA: false,
        };

		await sendCustomEmail(email, firstName, middleName, lastName, passwordResetToken);

        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
}

export async function getUserFromEmail(email: string): Promise<User | null> {
	try {
		const usersRef = ref(db, 'users');
		const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));

		const snapshot = await get(emailQuery);

		if (snapshot.exists()) {
			const data = snapshot.val();

			const userId = Object.keys(data)[0];
			const userData = data[userId];

			const user: User = {
				id: userId,
				email: userData.emailAddress || "",
				username: `${userData.firstName} ${userData.lastName}`.trim() || "", 
				emailVerified: userData.emailVerified,
				registered2FA: userData.registered2FA,
			};

			return user;
		} else {
			console.log("No user found with the provided email address.");
			return null;
		}
	} catch (error) {
		console.error("Error fetching user by email:", error);
		return null;
	}
}

export async function getUserPasswordResetToken(email: string): Promise<{ token: string | null, expiry: number | null }> {
    try {
        const usersRef = ref(db, 'users');
        const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));

        const snapshot = await get(emailQuery);

        if (snapshot.exists()) {
            const data = snapshot.val();

            const userId = Object.keys(data)[0];
            const userData = data[userId];

            const token = userData.encryptedPasswordResetToken || null;
            const expiry = userData.passwordResetTokenExpiry || null;

            return { token, expiry };
        } else {
            console.log("No user found with the provided email address.");
            return { token: null, expiry: null };
        }
    } catch (error) {
        console.error("Error fetching user password reset token by email:", error);
        return { token: null, expiry: null };
    }
}

export async function getUserPasswordHash(email: string): Promise<string | null>{
	try {
		const usersRef = ref(db, 'users');
		const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));

		const snapshot = await get(emailQuery);

		if (snapshot.exists()) {
			const data = snapshot.val();

			const userId = Object.keys(data)[0];
			const userData = data[userId];

			return userData.passwordHash;
		} else {
			console.log("No user found with the provided email address.");
			return null;
		}
	} catch (error) {
		console.error("Error fetching user by email:", error);
		return null;
	}
}

export async function getUserTOTPKey(userId: string): Promise<Uint8Array | null> {
    try {
        const userRef = ref(db, `users/${userId}/totp_key`);

        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
            console.error("No TOTP key found for userId:", userId);
            return null; 
        }

        const encryptedKey = snapshot.val();
        if (!encryptedKey || !(encryptedKey instanceof Array)) {
            console.error("TOTP key is not an array or is missing for userId:", userId);
            return null;
        }

        const encryptedKeyBuffer = Buffer.from(encryptedKey);
		console.log('encryptedKeyBuffer', encryptedKeyBuffer);
        const decryptedKey = decrypt(encryptedKeyBuffer);
		console.log('decryptedKey', decryptedKey);

        return decryptedKey;
    } catch (error) {
        console.error("Error fetching TOTP key for userId:", userId, error);
        return null;
    }
}

export async function updateUserTOTPKey(userId: string, key: Uint8Array): Promise<void> {
    try {
        const encryptedKey = encrypt(key);

        const userRef = ref(db, `users/${userId}`);

        await update(userRef, {
            totp_key: encryptedKey,
			registered2FA: true
        });

        console.log(`TOTP key updated successfully for userId: ${userId}`);
    } catch (error) {
        console.error(`Failed to update TOTP key for userId: ${userId}`, error);
        throw error;
    }
}

export async function updateUserPassword(email: string, newPassword: string): Promise<void> {
    try {
        const usersRef = ref(db, 'users');
        const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));

        const snapshot = await get(emailQuery);

        if (!snapshot.exists()) {
            console.log("No user found with the provided email address.");
            throw new Error("User not found");
        }

        const data = snapshot.val();
        const userId = Object.keys(data)[0];
        const userRef = ref(db, `users/${userId}`);

        const newPasswordHash = await hashPassword(newPassword);

        await update(userRef, {
            passwordHash: newPasswordHash,
            passwordExpired: false,
			emailVerified: true,
        });

        console.log(`Password updated successfully for user: ${email}`);
    } catch (error) {
        console.error("Error updating user password:", error);
        throw new Error("Failed to update user password");
    }
}

export async function deleteResetToken(email: string): Promise<void> {
    try {
        const usersRef = ref(db, 'users');
        const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));

        const snapshot = await get(emailQuery);

        if (!snapshot.exists()) {
            console.log("No user found with the provided email address.");
            throw new Error("User not found");
        }

        const data = snapshot.val();
        const userId = Object.keys(data)[0];
        const userRef = ref(db, `users/${userId}`);

        await update(userRef, {
            encryptedPasswordResetToken: null,
            passwordResetTokenExpiry: null,
        });

        console.log(`Reset token removed successfully for user: ${email}`);
    } catch (error) {
        console.error("Error removing reset token:", error);
        throw new Error("Failed to remove reset token");
    }
}

export async function getAllUsers(): Promise<UserList[]> {
	try {
		const usersRef = ref(db, "users");

		const snapshot = await get(usersRef);

		if (snapshot.exists()) {
			const data = snapshot.val();
			// console.log("All users data found:", data);

			const users: UserList[] = Object.keys(data).map((userId) => {
				const userData = data[userId];

				return {
					id: userId,
					email: userData.email || "",
					username: `${userData.firstName} ${userData.middleName || ""} ${userData.lastName}`.trim(),
					firstName: userData.firstName || "",
					middleName: userData.middleName || "",
					lastName: userData.lastName || "",
					phoneNumber: userData.phoneNumber || "",
					durationFromDate: userData.durationFromDate || "",
					durationUpDate: userData.durationUpDate || "",
					emailVerified: Boolean(userData.emailVerified),
					registered2FA: Boolean(userData.totp_key && userData.totp_key.length > 0),
				};
			});

			return users;
		} else {
			console.log("No users found in the database.");
			return [];
		}
	} catch (error) {
		console.error("Error fetching all users:", error);
		throw error;
	}
}

export interface User {
	id: string;
	email: string;
	username: string;
	emailVerified: boolean;
	registered2FA: boolean;
}

export interface UserList {
	id: string;
	email: string;
	username: string;
	firstName: string;
	middleName: string;
	lastName: string;
	phoneNumber: string;
	durationFromDate: string;
	durationUpDate: string;
	encryptedPasswordResetToken: string;
	passwordResetTokenExpiry: number;
	emailVerified: boolean;
	passwordExpired: true;
	registered2FA: boolean;
}
