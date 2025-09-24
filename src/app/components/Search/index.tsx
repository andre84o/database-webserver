'use client'
import { useState, SetStateAction } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSearchPosts } from "@/utils/supabase/queries";
import Link from "next/link";

const SearchInput = () => {
    const [userInput, setUserInput] = useState<string>('');

      const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
        setUserInput(e.target.value);
    }
   
    const {data} = useQuery({
        queryKey: ['search-results', userInput],
        queryFn: async () => {
            const {data, error} = await getSearchPosts(userInput)
            if(error) throw new Error
            return data
        },
         enabled: userInput && userInput.length > 3 ? true: false

    })

  
    return (
      <div className="relative">
        <div className="border-1 rounded-xl p-2 items-center gap2">
          <Search size={32} />
          <input
            onChange={handleChange}
            name="search"
            className="border-1 rounded-xl p-2"
            value={userInput}
          />
        </div>
        {data && (
          <div
            onClick={() => setUserInput("")}
            className="border absolute bg-white p-2 rounded-xl"
          >
            {data.map(({ title, slug }) => (
              <Link href={`/${slug}`}>{title}</Link>
            ))}
          </div>
        )}
      </div>
    );
}

export default SearchInput