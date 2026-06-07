export function scrollToPageTopInstant() {
  if (typeof window === "undefined") return;

  const { documentElement, scrollingElement } = document;
  const previousScrollBehavior = documentElement.style.scrollBehavior;

  documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);

  if (scrollingElement) {
    scrollingElement.scrollTop = 0;
    scrollingElement.scrollLeft = 0;
  }

  requestAnimationFrame(() => {
    documentElement.style.scrollBehavior = previousScrollBehavior;
  });
}
