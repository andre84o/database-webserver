"use client";
import React from "react";

export default function ExplorePostsLink() {
  const TARGET_SELECTOR = ".grid a";

  return (
    <a
      href="#"
      className="inline-block bg-[#D7BFFF] hover:bg-[#AE9DCB] text-2xl text-white px-6 py-3 rounded-full font-semibold
      shadow-2xl shadow-white max-[396px]:px-3 max-[396px]:py-2 max-[396px]:rounded-full max-[396px]:text-xs"
      onClick={(e) => {
        e.preventDefault();
        const firstCard = document.querySelector(
          TARGET_SELECTOR
        ) as HTMLElement | null;
        firstCard?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      Explore Posts
    </a>
  );
}
