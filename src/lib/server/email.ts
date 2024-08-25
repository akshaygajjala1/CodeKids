import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'contact@codekidsacademy.org',
        pass: env.EMAIL_PASSWORD
    }
});

export const sendMail = async ({
    toEmail,
    subject,
    text
}: {
    toEmail: string;
    subject: string;
    text: string;
}): Promise<boolean> => {
    try {
        await transporter.sendMail({
            from: 'contact@codekidsacademy.org',
            to: toEmail,
            subject: subject,
            text: text
        });
        return true;
    } catch (exc) {
        console.log(exc);
        return false;
    }
};
