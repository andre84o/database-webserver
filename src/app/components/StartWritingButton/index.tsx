"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/browser.client";
import { useEffect, useState } from "react";

export default function StartWritingButton({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (loading) return;
    if (user) router.push("/create");
    else router.push("/auth/login");
  };

  return (
    <button onClick={handleClick} className="button-primary inline-block" disabled={loading}>
      {children ?? "Start writing"}
    </button>
  );
}
