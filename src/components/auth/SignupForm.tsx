"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { auth } from "@/lib/firebase";
import { signupSchema, type SignupFormData } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const roleOptions = [
  { value: "", label: "Select your role" },
  { value: "admin", label: "Administrator" },
  { value: "fleet_manager", label: "Fleet Manager" },
  { value: "driver", label: "Driver" },
  { value: "dispatcher", label: "Dispatcher" },
];

export function SignupForm() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { user, loading } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      company: "",
      role: "",
      agreementAccepted: false,
    },
  });

  // Handle redirect for authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setSubmitError("");

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );

      // Update user profile with name
      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

      setSuccessMessage("Account created successfully! Redirecting to dashboard...");
      
      // User will be automatically synced by AuthContext
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('email', { message: 'This email is already registered' });
          break;
        case 'auth/invalid-email':
          setError('email', { message: 'Invalid email address' });
          break;
        case 'auth/operation-not-allowed':
          setSubmitError('Email/password accounts are not enabled. Please contact support.');
          break;
        case 'auth/weak-password':
          setError('password', { message: 'Password is too weak' });
          break;
        default:
          setSubmitError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    setIsLoading(true);
    setSubmitError("");

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign up error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setSubmitError('Sign up was cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        setSubmitError('Popup was blocked. Please allow popups and try again.');
      } else {
        setSubmitError('Failed to sign up with Google. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting authenticated users
  if (user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-2xl rounded-2xl border border-gray-200 p-8 space-y-6">
      {/* OAuth Providers */}
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 text-sm font-medium border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          onClick={signUpWithGoogle}
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500 font-medium">
              Or create account with email
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            {submitError}
          </Alert>
        )}

      {/* Name Fields */}
      <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-2 gap-4'}`}>
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            type="text"
            {...register("firstName")}
            placeholder="Enter your first name"
            className={errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            type="text"
            {...register("lastName")}
            placeholder="Enter your last name"
            className={errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="Enter your email address"
          className={errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password Fields */}
      <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-2 gap-4'}`}>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Create a password"
            className={errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm your password"
            className={errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Contact & Company Info */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          placeholder="+1 (555) 123-4567"
          className={errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
        />
        {errors.phone && (
          <p className="text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company" className="text-sm font-medium text-gray-700">
          Company Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="company"
          type="text"
          {...register("company")}
          placeholder="Enter your company name"
          className={errors.company ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
        />
        {errors.company && (
          <p className="text-sm text-red-600">{errors.company.message}</p>
        )}
      </div>

      {/* Role Selection */}
      <div className="space-y-2">
        <Label htmlFor="role" className="text-sm font-medium text-gray-700">
          Your Role <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className={errors.role ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.slice(1).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && (
          <p className="text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* Terms Agreement */}
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <Controller
            name="agreementAccepted"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="agreementAccepted"
                checked={field.value}
                onCheckedChange={field.onChange}
                className={errors.agreementAccepted ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              />
            )}
          />
          <Label htmlFor="agreementAccepted" className="text-sm font-medium text-gray-700 cursor-pointer leading-5">
            I agree to the Terms of Service and Privacy Policy <span className="text-red-500">*</span>
          </Label>
        </div>
        {errors.agreementAccepted && (
          <p className="text-sm text-red-600">{errors.agreementAccepted.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      {/* Additional Info */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Need help? Contact our{" "}
          <a href="/support" className="text-blue-600 hover:text-blue-500 font-medium">
            support team
          </a>
        </p>
      </div>
      </form>
    </div>
  );
}