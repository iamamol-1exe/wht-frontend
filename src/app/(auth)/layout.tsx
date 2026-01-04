import React from "react";
import dynamic from "next/dynamic";
import { BackgroundBeams } from "@/components/ui/background-beams";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      {children}
      <BackgroundBeams className="-z-10" />
    </div>
  );
};

export default AuthLayout;
