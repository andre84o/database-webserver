import type { NextConfig } from "next";

function ensureNoServiceRoleLeak() {
  try {
    for (const k of Object.keys(process.env)) {
      const up = k.toUpperCase();
      if (up.includes("SUPABASE_SERVICE_ROLE_KEY") && up.startsWith("NEXT_PUBLIC")) {
        throw new Error(
          `Unsafe env detected: ${k} would expose SUPABASE service role key to the client. Remove it.`
        );
      }
    }

    if ((process.env as any)["NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY"]) {
      throw new Error(
        `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is set. Do NOT expose service role keys to the client.`
      );
    }
  } catch (e) {
    throw e;
  }
}

ensureNoServiceRoleLeak();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
