import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { RegisterRequest } from "@/types/auth";

// Validation schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData as RegisterRequest);
      navigate("/");
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-green-400" />
          </div>
          <CardTitle className="text-2xl text-center text-white">
            Create account
          </CardTitle>
          <CardDescription className="text-center text-white/70">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Full Name
              </Label>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-3 bg-white/10 border border-white/20 rounded-lg">
                  <User className="h-4 w-4 text-white/70" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="flex-1 p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white/10 focus:text-white"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-3 bg-white/10 border border-white/20 rounded-lg">
                  <Mail className="h-4 w-4 text-white/70" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white/10 focus:text-white"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-3 bg-white/10 border border-white/20 rounded-lg">
                  <Lock className="h-4 w-4 text-white/70" />
                </div>
                <div className="flex-1 relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white/10 focus:text-white pr-12"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 p-3 bg-white/10 border border-white/20 rounded-lg">
                  <Lock className="h-4 w-4 text-white/70" />
                </div>
                <div className="flex-1 relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white/10 focus:text-white pr-12"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-green-400 hover:text-green-300"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 hover:border-white/30 transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Go back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
