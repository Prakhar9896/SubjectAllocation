import { createClient } from '@supabase/supabase-js';

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    

    if (!token) return res.status(401).json({ error: 'No token' });

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    const { data, error } = await supabase.auth.getUser();



    if (error) return res.status(401).json({ error: 'Invalid token' });

    req.user = data.user;
    req.supabase = supabase;

    next();

  } catch (err) {
    console.log("MIDDLEWARE CRASH:", err);
    res.status(500).json({ error: "Auth middleware failed" });
  }
};
