'use client'
import { useState, SetStateAction } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSearchPosts } from "@/utils/supabase/queries";
import Link from "next/link";

const SearchInput = () => {
  const [userInput, setUserInput] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["search-results", userInput],
    queryFn: async () => {
      const { data, error } = await getSearchPosts(userInput);
      if (error) throw new Error();
      return data;
    },
    enabled: userInput && userInput.length > 3 ? true : false,
  });

  console.log("Search results:", data);

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Search size={32} />
        <input
          onChange={handleChange}
          className="border-1 rounded-xl p-2"
          name="search"
          placeholder="Search"
        />
      </div>

      {data && (
        <div
          onClick={() => setUserInput("")}
          className="border absolute bg-white p-2 rounded-xl"
        >
          {data.map(({ title, slug }: { title: string; slug: string }) => (
            <Link className="block" href={`/${slug}`} key={slug}>
              {title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


export default SearchInput