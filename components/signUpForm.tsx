"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import { signUpSchema, signUpSchemaType } from "@/schema/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MagicCard } from "./ui/magic-card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useTheme } from "next-themes";
import { Loader2Icon } from "lucide-react";
export const SignUpForm = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // New resend functionality state
  const RESEND_INTERVAL = 30; // seconds before user can resend
  const [resendTimer, setResendTimer] = useState(0);

  const { signUp, isLoaded, setActive } = useSignUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  // Countdown timer effect
  useEffect(() => {
    if (resendTimer === 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const onSubmit = async (data: signUpSchemaType) => {
    if (!isLoaded) return;
    setIsSubmitting(true);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (error: any) {
      console.error("signup error", error);
      toast.error(
        error.errors?.[0]?.message ||
          "An error occurred during signup. Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // New resend function
  const handleResendCode = async () => {
    if (!isLoaded || !signUp || resendTimer > 0) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResendTimer(RESEND_INTERVAL); // start cool-down
      toast.success("Verification code sent successfully!");
    } catch (error: any) {
      console.error("resend error", error);
      const errorMessage =
        error.errors?.[0]?.message ||
        "Could not resend the code. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
        });
        router.push("/dashboard");
      } else {
        console.error("verification incomplete", result);
        toast("Verification could not be completed");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast(
        "Verification Code " + error.errors?.[0]?.message ||
          "An error occurred during verification. Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verification form with resend functionality
  if (verifying) {
    return (
      <Card className="p-0 max-w-sm w-full shadow-none border-none">
        <MagicCard
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
          className="p-0"
        >
          <CardHeader className="border-b border-border p-4">
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              Enter the 6-digit code we just sent to your inbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleVerificationSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || verificationCode.length !== 6}
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>

              {/* Resend code section */}
              <div className="text-sm text-center">
                {!resendTimer ? (
                  <>
                    <span>Didn't receive a code?</span>
                    <Button
                      type="button"
                      onClick={handleResendCode}
                      variant={"link"}
                      className="cursor-pointer"
                    >
                      Resend
                    </Button>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    You can resend in {resendTimer}s
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </MagicCard>
      </Card>
    );
  }

  return (
    <Card className="p-0 max-w-sm w-full shadow-none border-none">
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        className="p-0"
      >
        <CardHeader className="border-b border-border p-4">
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                <Input
                  id="passwordConfirmation"
                  type="password"
                  placeholder="••••••••"
                  {...register("passwordConfirmation")}
                />
                {errors.passwordConfirmation && (
                  <p className="text-red-500 text-sm">
                    {errors.passwordConfirmation.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="p-4 border-t border-border flex flex-col">
          <Button
            type="submit"
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                Please wait
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <div className="text-sm text-center">
            <span>Already have an account?</span>
            <Button
              type="button"
              onClick={() => router.push("/signin")}
              variant={"link"}
              className="cursor-pointer -ml-3"
            >
              signin
            </Button>
          </div>
        </CardFooter>
      </MagicCard>
    </Card>
  );
};
