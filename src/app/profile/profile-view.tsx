"use client";

import React, { useState } from "react";
import { User } from "@/domain/entities/User";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  UpdateProfileSchema,
  ChangePasswordSchema,
} from "@/domain/validation/user";
import { validate, type FieldErrors } from "@/lib/validation";
import { FieldError } from "@/components/form/field-error";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";

export function ProfileView({ user }: { user: Omit<User, "passwordHash"> }) {
  const router = useRouter();
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    nickname: user.nickname,
    avatarUrl: user.avatarUrl || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileErrors, setProfileErrors] = useState<
    FieldErrors<{ nickname: string; avatarUrl: string }>
  >({});
  const [passwordErrors, setPasswordErrors] = useState<
    FieldErrors<{ currentPassword: string; newPassword: string }>
  >({});

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    const result = validate(UpdateProfileSchema, profileData);
    if ("errors" in result) {
      setProfileErrors(result.errors);
      return;
    }
    setProfileErrors({});
    setIsLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      await update();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const result = validate(ChangePasswordSchema, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    if ("errors" in result) {
      setPasswordErrors(result.errors);
      return;
    }
    setPasswordErrors({});

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to change password");
      }

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete account");
      }
      toast.success("Account deleted");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and public avatar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={profileData.avatarUrl || undefined}
                      alt={profileData.nickname}
                    />
                    <AvatarFallback className="text-lg">
                      {profileData.nickname[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <ImageUpload
                      endpoint="profileImage"
                      value={profileData.avatarUrl}
                      onUploadComplete={(url) =>
                        setProfileData({ ...profileData, avatarUrl: url })
                      }
                      onRemove={() =>
                        setProfileData({ ...profileData, avatarUrl: "" })
                      }
                    />
                    <FieldError messages={profileErrors.avatarUrl} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    value={profileData.nickname}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        nickname: e.target.value,
                      })
                    }
                    required
                    minLength={2}
                  />
                  <FieldError messages={profileErrors.nickname} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Email cannot be changed.
                  </p>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <FieldError messages={passwordErrors.currentPassword} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                  />
                  <FieldError messages={passwordErrors.newPassword} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Change Password"}
                </Button>
              </form>
              <Separator className="mt-10 mb-6" />
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Delete Account</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all associated data.
                  </CardDescription>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Delete account"}
                </Button>
              </div>
              {isDeleteConfirmOpen && (
                <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-4 space-y-3">
                  <p className="text-sm font-medium">
                    Are you sure you want to delete your account?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone. All your data will be permanently removed.
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDeleteConfirmOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setIsDeleteConfirmOpen(false);
                        void handleDeleteAccount();
                      }}
                      disabled={isLoading}
                    >
                      Yes, delete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
