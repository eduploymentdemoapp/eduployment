import { hash, verify } from "@node-rs/argon2";
import { sha1 } from "@oslojs/crypto/sha1";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { randomBytes, createHash } from "crypto";

export async function hashPassword(password: string): Promise<string> {
	return await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
}

export function hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

export function generateToken() {
    return randomBytes(32).toString("hex");
}

export function generateOneTimePassword(length: number = 6, isNumeric: boolean = true): string {
    const charset = isNumeric ? "0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomBuffer = randomBytes(length);
    let otp = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = randomBuffer[i] % charset.length;
        otp += charset[randomIndex];
    }

    return otp;
}

export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
	return await verify(hash, password);
}

export async function verifyPasswordStrength(password: string): Promise<boolean> {
	if (password.length < 8 || password.length > 255) {
		return false;
	}
	const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
	const hashPrefix = hash.slice(0, 5);
	const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
	const data = await response.text();
	const items = data.split("\n");
	for (const item of items) {
		const hashSuffix = item.slice(0, 35).toLowerCase();
		if (hash === hashPrefix + hashSuffix) {
			return false;
		}
	}
	return true;
}
