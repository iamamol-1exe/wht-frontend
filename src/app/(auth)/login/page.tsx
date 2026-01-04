"use client";

import { AuthApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [laoding, setlaoding] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleLogin = async () => {
    try {
      setlaoding(true);
      setError("");
      setSuccess("");
      const data = await AuthApi.login(email, password);
      console.log(data);
      setSuccess("Login successful! Redirecting to dashboard...");


      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
      setlaoding(false);
    }
  };
  return (
    <div className="h-screen overflow-y-scroll scrollbar-hide">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-2xl">
            <p className="mx-auto max-w-lg py-4 text-left">
              <EncryptedText
                text="Welcome Back to Whatube!"
                encryptedClassName="text-neutral-500"
                revealedClassName="dark:text-white text-black"
                revealDelayMs={30}
              />
            </p>
          </div>
          <Card className="opacity-80">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">
                Login
              </CardTitle>
              <CardDescription className="text-center font-medium text-lg">
                Login For Start Messaging
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 rounded-md text-sm">
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md text-sm">
                  {error}
                </div>
              )}
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="font-bold">
                      Email
                    </Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      disabled={laoding}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      type="password"
                      required
                      disabled={laoding}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button
                onClick={handleLogin}
                type="submit"
                className="w-full mb-3"
                disabled={laoding}
              >
                {laoding ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
