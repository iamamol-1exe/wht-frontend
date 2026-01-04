import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { Input } from "@/components/ui/input";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Label } from "@radix-ui/react-label";

const Register = () => {
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
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="font-bold">
                      Email
                    </Label>
                    <Input
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
                      id="username"
                      type="emausernameil"
                      placeholder="ex. amold"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      placeholder="must be 3 character"
                      id="password"
                      type="password"
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full mb-3">
                Register
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Register;
