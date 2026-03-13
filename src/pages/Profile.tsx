import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { User, Mail, Calendar, Edit3, Save, X, ArrowLeft } from "lucide-react";
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
import { UpdateProfileRequest } from "@/types/auth";

// Validation schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user, updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  // Update form when user data changes
  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateProfile({ name: data.name } as UpdateProfileRequest);
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="mt-2 text-gray-200">Manage your account information</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-gray-200">
              Update your personal details and account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    disabled={!isEditing}
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10 bg-white/10 border-white/20 text-gray-300"
                    value={user.email}
                    disabled
                    readOnly
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Email cannot be changed from profile settings.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">Account Created</Label>
                <div className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-md border border-white/20">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-200">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">User ID</Label>
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-md border border-white/20">
                  <span className="text-sm font-mono text-gray-200">
                    {user.id}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Save className="h-4 w-4" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex items-center gap-2 border-white/20 text-gray-200 hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
