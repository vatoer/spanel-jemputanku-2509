"use client";

import { SignupForm } from "@/components/auth/SignupForm";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SignupPage() {
  const isMobile = useIsMobile();

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Jemputanku and start managing your transportation"
      isMobile={isMobile}
    >
      <SignupForm />
    </AuthLayout>
  );
}