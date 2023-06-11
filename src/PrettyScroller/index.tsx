import { MouseEvent, RefObject, useEffect, useRef } from "react";
import type { PrettyScrollerProps } from "./scroller.types";

import "./pretty-style.scss";

const MINIMUM_THUMB_HEIGHT = 20;

interface ThumbDragState {
  initialThumbPosY?: number;
  initialScrollTop?: number;
  isDragging?: boolean;
}

export const PrettyScroller = ({
  children,
  className,
  ...restProps
}: PrettyScrollerProps) => {
  const scrollHostRef = useRef<HTMLDivElement>(null);
  const scrollerThumbRef = useRef<HTMLDivElement>(null);
  const thumbDragState = useRef<ThumbDragState>({});

  const scrollerClassNames = ["pretty-scrollbar-container", className];

  useEffect(() => {
    if (!scrollHostRef.current) return;

    let resizeObserver = new ResizeObserver(() => {
      handleScrollerSize(scrollHostRef);
    });
    resizeObserver.observe(scrollHostRef.current);

    /** handle thumb position on scrolling the page */

    scrollHostRef.current.addEventListener("scroll", handlePageScroll, true);

    /** ------------- */

    return () => {
      if (!scrollHostRef.current) return;
      unSubscribeEventListeners(resizeObserver);
    };
  }, [children]);

  function unSubscribeEventListeners(resizeObserver: ResizeObserver) {
    resizeObserver?.unobserve(scrollHostRef.current!);
    scrollHostRef.current?.removeEventListener(
      "scroll",
      handlePageScroll,
      true
    );
  }

  function handleScrollerSize(ref: RefObject<HTMLDivElement>) {
    if (!ref.current || !scrollerThumbRef.current) return;

    const scrollElement = ref.current;
    const { clientHeight, scrollHeight } = scrollElement;
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * clientHeight,
      MINIMUM_THUMB_HEIGHT
    );

    scrollerThumbRef.current!.style.height = `${thumbHeight}px`;
  }

  function handlePageScroll(e: Event) {
    if (!scrollerThumbRef.current) return;

    let hostElement = e.target as HTMLDivElement;

    const thumbHeight = scrollerThumbRef.current?.clientHeight;

    const { scrollTop, scrollHeight, offsetHeight } = hostElement;
    let newTop = (scrollTop / scrollHeight) * offsetHeight;
    newTop = Math.min(newTop, offsetHeight - thumbHeight);

    scrollerThumbRef.current!.style.top = `${newTop ?? 0}px`;
  }

  const handleMouseDownOnScrollThumb = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    thumbDragState.current!.initialThumbPosY = e.clientY;
    if (scrollHostRef.current) {
      thumbDragState.current!.initialScrollTop =
        scrollHostRef.current.scrollTop;
    }
    thumbDragState.current!.isDragging = true;
  };

  function handleThumbMouseUp(e: globalThis.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (thumbDragState.current?.isDragging)
      thumbDragState.current.isDragging = false;
  }

  const handleThumbMouseMove = (e: globalThis.MouseEvent) => {
    if (thumbDragState.current?.isDragging) {
      e.preventDefault();
      e.stopPropagation();

      const scrollHostElement = scrollHostRef.current!;
      const { scrollHeight, offsetHeight } = scrollHostElement;

      const deltaY =
        (e.clientY - (thumbDragState.current?.initialThumbPosY ?? 0)) *
        (offsetHeight / (scrollerThumbRef.current?.clientHeight ?? 1));

      const newScrollTop = Math.min(
        (thumbDragState.current!.initialScrollTop ?? 0) + deltaY,
        scrollHeight - offsetHeight
      );

      scrollHostElement.scrollTop = newScrollTop;
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleThumbMouseMove);
    document.addEventListener("mouseup", handleThumbMouseUp);
    document.addEventListener("mouseleave", handleThumbMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleThumbMouseMove);
      document.removeEventListener("mouseup", handleThumbMouseUp);
      document.removeEventListener("mouseleave", handleThumbMouseUp);
    };
  }, [handleThumbMouseMove, handleThumbMouseUp]);

  return (
    <div className="prettyscoller-container">
      <div className="prettyscroller-host" ref={scrollHostRef}>
        {children}
      </div>
      <div className={scrollerClassNames.join(" ")} {...restProps}>
        <div className="pretty-scrollbar-track"></div>
        <div
          className="pretty-scrollbar-thumb"
          ref={scrollerThumbRef}
          onMouseDown={handleMouseDownOnScrollThumb}
        ></div>
      </div>
    </div>
  );
};
