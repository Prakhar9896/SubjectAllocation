import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const { data, error } = await supabase.auth.signInWithPassword({
  email: "admin1@gmail.com",
  password: "August@01"
});

if (error) {
  console.log("Login failed:", error.message);
} else {
  console.log("ACCESS TOKEN:\n", data.session.access_token);
}
