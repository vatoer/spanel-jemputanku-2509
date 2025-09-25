"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LoginPage() {
  const isMobile = useIsMobile();

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your Jemputanku account"
      isMobile={isMobile}
    >
      <LoginForm />
    </AuthLayout>
  );
}