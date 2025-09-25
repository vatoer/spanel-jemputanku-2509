"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { auth } from "@/lib/firebase";
import { loginSchema, type LoginFormData } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export function LoginForm() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { user, loading, getToken } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle redirect for authenticated users
  useEffect(() => {
    const handleRedirect = async () => {
      if (!loading && user) {
        console.log('User detected in LoginForm:', user.email);
        
        // Check if user has a valid token
        const token = await getToken();
        console.log('Token exists:', !!token);
        
        if (token) {
          // Get redirect URL from query params or default to dashboard
          const urlParams = new URLSearchParams(window.location.search);
          const redirectUrl = urlParams.get('redirect') || '/admin-dashboard';
          console.log('Redirecting to:', redirectUrl);
          
          // Use replace instead of push to avoid back button issues
          router.replace(redirectUrl);
        } else {
          console.log('No valid token, user might need to re-authenticate');
          // Clear user state if no valid token
          // This might indicate a stale auth state
        }
      }
    };

    handleRedirect();
  }, [user, loading, router, getToken]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setSubmitError("");

    try {
      // Set persistence based on remember me option
      await setPersistence(
        auth, 
        data.rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // User will be automatically redirected by AuthContext
      router.push('/admin-dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          setError('email', { message: 'No account found with this email' });
          break;
        case 'auth/wrong-password':
          setError('password', { message: 'Incorrect password' });
          break;
        case 'auth/invalid-email':
          setError('email', { message: 'Invalid email address' });
          break;
        case 'auth/user-disabled':
          setSubmitError('Your account has been disabled. Please contact support.');
          break;
        case 'auth/too-many-requests':
          setSubmitError('Too many failed attempts. Please try again later.');
          break;
        default:
          setSubmitError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setSubmitError("");

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      await signInWithPopup(auth, provider);
      router.push('/admin-dashboard');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setSubmitError('Sign in was cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        setSubmitError('Popup was blocked. Please allow popups and try again.');
      } else {
        setSubmitError('Failed to sign in with Google. Please try again.');
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
          <p className="mt-1 text-xs text-gray-500">User: {user.email}</p>
          {/* Add a fallback link in case redirect fails */}
          <Button 
            variant="link" 
            size="sm" 
            className="mt-4 text-blue-600"
            onClick={() => router.replace('/admin-dashboard')}
          >
            Click here if not redirected automatically
          </Button>
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
          onClick={signInWithGoogle}
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
              Or continue with email
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Message */}
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            {submitError}
          </Alert>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-800">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="name@company.com"
              className={`h-12 pl-4 pr-4 text-sm border-2 rounded-lg transition-all duration-200 ${
                errors.email 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.email.message}
            </p>
          )}
        </div>
        
        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-800">
              Password <span className="text-red-500">*</span>
            </Label>
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className={`h-12 pl-4 pr-4 text-sm border-2 rounded-lg transition-all duration-200 ${
                errors.password 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
              disabled={isLoading}
            />
            {errors.password && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                  className="border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              )}
            />
            <Label htmlFor="rememberMe" className="text-sm font-medium text-gray-700 cursor-pointer">
              Keep me signed in
            </Label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-white"></div>
              Signing In...
            </div>
          ) : (
            "Sign In to Dashboard"
          )}
        </Button>

        {/* Sign Up Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link 
              href="/signup" 
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </form>

      {/* Footer Links */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Need help?{" "}
          <a href="/support" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
            Contact Support
          </a>
          {" • "}
          <a href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}