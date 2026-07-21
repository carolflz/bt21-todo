import { PointerEvent as ReactPointerEvent, useCallback, useRef } from "react";

interface Size {
  width: number;
  height: number;
}

interface UseResizableOptions {
  minWidth?: number;
  minHeight?: number;
  onResizeEnd: (size: Size) => void;
}

export function useResizable(initialSize: Size, options: UseResizableOptions) {
  const sizeRef = useRef<Size>(initialSize);
  sizeRef.current = initialSize;
  const { minWidth = 140, minHeight = 120, onResizeEnd } = options;

  const startResize = useCallback(
    (e: ReactPointerEvent, element: HTMLElement) => {
      e.stopPropagation();
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = sizeRef.current.width;
      const startHeight = sizeRef.current.height;
      let latest: Size = { width: startWidth, height: startHeight };

      function handleMove(moveEvent: PointerEvent) {
        const nextWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX));
        const nextHeight = Math.max(minHeight, startHeight + (moveEvent.clientY - startY));
        latest = { width: nextWidth, height: nextHeight };
        element.style.width = `${nextWidth}px`;
        element.style.height = `${nextHeight}px`;
      }

      function handleUp() {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        onResizeEnd(latest);
      }

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [minWidth, minHeight, onResizeEnd]
  );

  return { startResize };
}
