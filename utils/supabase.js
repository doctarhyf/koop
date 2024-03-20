import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

export const TABLE_NAMES = {
  KOOP_USERS: "koop_users",
  KOOP_SHOPS: "koop_shops",
  KOOP_ITEMS: "koop_items",
  KOOP_COMMENTS: "koop_comments",
  KOOP_MSG_OUTBOX: "koop_messages_out",
  KOOP_MSG_INBOX: "koop_messages_in",
};

export const KOOP_BUCKET_NAME = "koop";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
