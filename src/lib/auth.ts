import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins"
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    github: {
        clientId: env.AUTH_GITHUB_CLIENT_ID,
        clientSecret: env.AUTH_GITHUB_SECRET,

    },
  },

  plugins: [
      emailOTP({
          async sendVerificationOTP({email, otp}) {
              await resend.emails.send({
                from: 'WandersonCoderG6. <onboarding@resend.dev>',
                to: [email],
                subject: 'WandersonCoderG6. - Verify your email',
                html: `<p>Your OTP is <strong>${otp}</strong></p>`,
              });
          }
      })
    ]
});