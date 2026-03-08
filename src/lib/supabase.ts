import { createClient as createBrowserClient } from "./supabase/client";

// For legacy/service compatibility as requested by the workflow
export const supabase = createBrowserClient();
