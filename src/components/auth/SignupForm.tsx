"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/schemas/auth";

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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
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

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setSubmitError("");

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMessage("Account created successfully! Please check your email for verification.");
        
        // Redirect after success
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 2000);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}