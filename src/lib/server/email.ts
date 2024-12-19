import { db, get, ref, query, orderByChild, equalTo } from "./firebase";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "eduploymentdemoapp@gmail.com",
        pass: "cfae lwmj umdl rmnf",
    },
});

export function verifyEmailInput(email: string): boolean {
	return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
    try {
        const usersRef = ref(db, "users");

        const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));

        const snapshot = await get(emailQuery);

        return snapshot.exists();
    } catch (error) {
        console.error("Error checking email availability:", error);
        throw new Error("Failed to check email availability");
    }
}

export async function sendCustomEmail(email: string, firstName: string, middleName: string, lastName: string, passwordResetToken: string): Promise<void> {
    const mailOptions = {
        from: "no-reply@eduployment.nl",
        to: email,
        subject: "Email Verification - Eduployment",
        html: `
            <p>Dear ${firstName} ${middleName} ${lastName},</p>
            <p>Your email address has been verified. To get started, you just need to set a password. To do so, use the link below:</p> 
            <p><a href="http://localhost:5173/set-password?email=${encodeURIComponent(email)}&token=${passwordResetToken}">Set Password</a></p>
            <p>The link is valid for one hour, sent at ${new Date().toISOString()} (GMT).</p>
            <p>Eduployment</p>
            <p><a href="https://www.eduployment.nl">www.eduployment.nl</a></p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", email);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}