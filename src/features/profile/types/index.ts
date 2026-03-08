// Profile types re-export (Step 74)
// Profile types are defined in auth/types since they share the user model
export type {
  UserProfile,
  UpdateProfileData,
  NotificationSettings,
  LoyaltyTierInfo,
} from "@/features/auth/types";
