import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Loaded by Expo from .env (only EXPO_PUBLIC_* vars are inlined into the bundle)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const TABLE_NAMES = {
  KOOP_USERS: "koop_users",
  KOOP_SHOPS: "koop_shops",
  KOOP_ITEMS: "koop_items",
  KOOP_COMMENTS: "koop_comments",
  KOOP_MSG_OUTBOX: "koop_messages_out",
  KOOP_MSG_INBOX: "koop_messages_in",
  KOOP_CONTACT_US: "koop_contact_us",
  KOOP_SERVICES_REQUEST: "koop_serv_req",
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
