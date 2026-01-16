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
import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const user = await AuthApi.register(username, email, password, name, dob);
      console.log(user);
      setSuccess("Register successful! Redirecting to dashboard...");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Register failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-2xl">
            <p className="mx-auto max-w-lg py-4 text-left">
              <EncryptedText
                text="Welcome to Whatube!"
                encryptedClassName="text-neutral-500"
                revealedClassName="dark:text-white text-black"
                revealDelayMs={30}
              />
            </p>
          </div>
          <Card className="opacity-80">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-semibold">
                Register
              </CardTitle>
              <CardDescription className="text-center font-medium text-lg">
                Register to Get Access
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
              >
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="font-bold">
                      Full Name
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </div>
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
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username" className="font-bold">
                      Username
                    </Label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      id="username"
                      type="text"
                      placeholder="ex. amold"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dob" className="font-bold">
                      Date of Birth
                    </Label>
                    <Input
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      id="dob"
                      type="date"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="must be 3 character"
                      id="password"
                      type="password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-3"></CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Register;
