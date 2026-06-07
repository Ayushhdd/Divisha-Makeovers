"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { scrollToPageTopInstant } from "@/app/utils/scrollToPageTopInstant";

export default function ServicesLayout({ children }) {
  const pathname = usePathname();
  const lastResetPathname = useRef(null);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    if (lastResetPathname.current === pathname) return;
    lastResetPathname.current = pathname;

    scrollToPageTopInstant();
  }, [pathname]);

  return children;
}
