import bcrypt from "bcrypt"
import supabase from "./config/supabase.js"

const createAdmin = async () => {
  const email = "admin1@gmail.com"
  const password = "admin123"

  const hash = await bcrypt.hash(password, 10)

  const { error } = await supabase.from("admin").insert([
    {
      email: email,
      password_hash: hash
    }
  ])

  if (error) console.log(error)
  else console.log("Admin created successfully")
}

createAdmin()
