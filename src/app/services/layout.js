"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ServicesLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const scrollContainer = document.getElementById("scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      scrollContainer.scrollLeft = 0;
    }
  }, [pathname]);

  return children;
}
