"use client";
import React from "react";

export default function ExplorePostsLink() {
  const TARGET_SELECTOR = ".grid a";

  return (
    <a
      href="#"
      className="inline-block bg-amber-500 text-black px-6 py-3 rounded-full font-semibold shadow"
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
