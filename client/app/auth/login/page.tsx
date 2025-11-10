
"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <Suspense fallback={<div>Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
