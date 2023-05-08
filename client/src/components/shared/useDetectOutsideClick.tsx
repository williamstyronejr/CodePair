import { useEffect, useState } from "react";

const useDetectOutsideClick: any = (el: any, initialState: boolean) => {
  const [active, setActive] = useState(initialState);

  useEffect(() => {
    const pageClickEvent = (e: MouseEvent) => {
      // If the active element exists and is clicked outside of

      if (el.current !== null && !el.current.contains(e.target)) {
        setActive(!active);
      }
    };

    // If the item is active (ie open) then listen for clicks
    if (active) {
      window.addEventListener("click", pageClickEvent);
    }

    return () => {
      window.removeEventListener("click", pageClickEvent);
    };
  }, [active, el]);

  return [active, setActive];
};

export default useDetectOutsideClick;
