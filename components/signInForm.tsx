"use client";
import { signInSchema, signInSchemaType } from "@/schema/signInSchema";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MagicCard } from "./ui/magic-card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Loader2Icon } from "lucide-react";

export const SignInForm = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: signInSchemaType) => {
    if (!isLoaded) return;
    setIsSubmitting(true);

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Signed in successfully");
        router.push("/dashboard");
      } else {
        toast.error("Sign in failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(
        error.errors?.[0]?.message || "An error occurred during sign in"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-0 max-w-sm w-full shadow-none border-none">
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        className="p-0"
      >
        <CardHeader className="border-b border-border p-4">
          <CardTitle>Welcome Back! 👋</CardTitle>
          <CardDescription>
            Sign in to your account to continue your journey
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="identifier">Email</Label>
                <Input
                  id="identifier"
                  type="email"
                  placeholder="name@example.com"
                  {...register("identifier")}
                />
                {errors.identifier && (
                  <p className="text-red-500 text-sm">
                    {errors.identifier.message}
                  </p>
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
              "Sign In"
            )}
          </Button>

          <div className="text-sm text-center mt-4">
            <span>Don't have an account? </span>
            <Button
              type="button"
              onClick={() => router.push("/signup")}
              variant="link"
              className="cursor-pointer -ml-3"
            >
              Sign up
            </Button>
          </div>
        </CardFooter>
      </MagicCard>
    </Card>
  );
};
