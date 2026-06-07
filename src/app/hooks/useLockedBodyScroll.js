"use client";

import { useEffect } from "react";

export function useLockedBodyScroll(active) {
  useEffect(() => {
    if (!active || typeof window === "undefined") return;

    const { body, documentElement } = document;
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollbarGap = window.innerWidth - documentElement.clientWidth;

    const previousBody = {
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const previousHtml = {
      overflow: documentElement.style.overflow,
      overscrollBehavior: documentElement.style.overscrollBehavior,
      scrollBehavior: documentElement.style.scrollBehavior,
    };

    documentElement.style.scrollBehavior = "auto";
    documentElement.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }

    return () => {
      body.style.overflow = previousBody.overflow;
      body.style.overscrollBehavior = previousBody.overscrollBehavior;
      body.style.position = previousBody.position;
      body.style.top = previousBody.top;
      body.style.left = previousBody.left;
      body.style.right = previousBody.right;
      body.style.width = previousBody.width;
      body.style.paddingRight = previousBody.paddingRight;

      documentElement.style.overflow = previousHtml.overflow;
      documentElement.style.overscrollBehavior = previousHtml.overscrollBehavior;
      window.scrollTo(0, scrollY);
      documentElement.style.scrollBehavior = previousHtml.scrollBehavior;
    };
  }, [active]);
}
