import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, serverEnv } from "@/lib/env";

export const createAdminClient = () => {
  return createClient(SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY);
};
