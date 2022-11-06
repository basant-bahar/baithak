import { KeyboardEvent, RefObject, useCallback, useEffect, useRef, useState } from "react";

function onEscapeKeyPress(fn: Function) {
  const ESC_KEY = 27;
  return (keyCode: number) => (keyCode === ESC_KEY ? fn() : null);
}

export function useDropdown<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
  boolean,
  () => void
] {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<T>(null);
  const actionRef = useRef<T>(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleGlobalMouseDown = ({ target }) => {
      if (!ref.current || ref.current.contains(target)) {
        return;
      }
      close();
    };
    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    const handleGlobalKeydown = () => {
      onEscapeKeyPress(close);
    };

    if (actionRef.current) actionRef.current.addEventListener("mousedown", handleToggle);
    document.addEventListener("mousedown", handleGlobalMouseDown);
    document.addEventListener("keydown", handleGlobalKeydown);

    return () => {
      if (actionRef.current) actionRef.current.removeEventListener("mousedown", handleToggle);
      document.removeEventListener("mousedown", handleGlobalMouseDown);
      document.removeEventListener("keydown", handleGlobalKeydown);
    };
  }, [isOpen, setIsOpen, close]);

  return [ref, actionRef, isOpen, close];
}
