"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useState, useTransition, Suspense } from "react";
import { toast } from "sonner";

function VerifyRequestContent() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [emailPending, startTransitionEmail] = useTransition();
    const isOtpCompleted = otp.length === 6;
    const params = useSearchParams();
    const email = params.get('email') as string;

    function verifyOtp() {
        startTransitionEmail(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp: otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success('Email verified');
                        router.push("/");
                    },
                    onError: () => {
                        toast.error('Error verifying Email/OTP');
                    }
                }
            })
        })
    }

    return (
        <Card className="w-full mx-auto">
            <CardHeader className="text-center ">
                <CardTitle className="text-xl">Pleas check you email</CardTitle>
                <CardDescription>
                    We have sent a verifycation email code to you email addres. Please open the email and paste the code below.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP value={otp} onChange={(value) => setOtp(value)} maxLength={6} className="gap-2">
                        <InputOTPGroup>
                            <InputOTPSlot index={0}/>
                            <InputOTPSlot index={1}/>
                            <InputOTPSlot index={2}/>
                        </InputOTPGroup>
                        {/* <InputOTPSeparator/> */}
                        <InputOTPGroup>
                            <InputOTPSlot index={3}/>
                            <InputOTPSlot index={4}/>
                            <InputOTPSlot index={5}/>
                        </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to you email</p>
                </div>

                <Button onClick={verifyOtp} disabled={emailPending || !isOtpCompleted} className="w-full">
                    {emailPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Carregando...</span>
                        </>
                    ) : (
                        <>
                            "Verify Account"
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}

export default function VerifyRequest() {
    return (
        <Suspense>
            <VerifyRequestContent />
        </Suspense>
    );
}