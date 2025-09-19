import Image from "next/image";
import Header from "./components/Header";
import { createClient } from "../utils/supabase/client";

export default function Home() {
  const posts = [{
    title: "Hello World",
    author: "Stephen King"
  },
  {
    title: "Hello World",
    author: "Stephen King"
  },
  {
    title: "Hello World",
    author: "Stephen King"
  },
  {
    title: "Hello World",
    author: "Stephen King"
  }]

   const supabase= createClient();
   const { data,error } = await supabase.from("posts").select('id, title, slug, user("username")')
   .order('created_at', {ascending: false});
  return (
      <div className="w-[80%] mx-auto mt-4">
        {data && data.map(item => 
            <div className="rounded-xl border-1 p-5 mb-4">
              <h2 className="font-bold text-xl">{item.title}</h2>
              <div className="text-right">posted by: {item.author}</div>
            </div>
          )}
      </div>
    
  );
}
