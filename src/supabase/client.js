// src/supabase/client.js
import { createClient } from "@supabase/supabase-js";

// 🔥 BURAYI DOLDURUYORSUN 🔥
// Supabase projenin URL ve ANON KEY değerlerini Supabase → Project Settings → API bölümünden kopyala

const SUPABASE_URL = "https://xfogacgctutrwvncykao.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmb2dhY2djdHV0cnd2bmN5a2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzcyNjAsImV4cCI6MjA3OTcxMzI2MH0.VmnzZlcOoSef17U4uB6iTIxsnX0Tnz1lnPUp6koi12Y";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
