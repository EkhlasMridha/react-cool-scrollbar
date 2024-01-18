import {
  type MouseEvent,
  type RefObject,
  useEffect,
  useRef,
  cloneElement,
} from "react";
import type { CoolScrollbarProps } from "./scroller.types";
import ScrollbarTrack from "./ScrollbarTrack";
import ScrollbarThumb from "./ScrollbarThumb";
import style from "./ReactCoolScrollbar.module.scss";

const MINIMUM_THUMB_HEIGHT = 20;

interface ThumbDragState {
  initialThumbPosY?: number;
  initialScrollTop?: number;
  isDragging?: boolean;
}

interface ScrollTrackEventState {
  isTrackHold?: boolean;
  scrollIntervalState?: number;
  scrollCurrent?: number;
}

const ReactCoolScrollbar = ({
  children,
  className,
  scrollerWidth = 10,
  customScrollThumb,
  customScrollTrack,
  scrollBarVisibility = "onhover",
  ...restProps
}: CoolScrollbarProps) => {
  const scrollHostRef = useRef<HTMLDivElement>(null);
  const scrollerThumbRef = useRef<HTMLDivElement>(null);
  const thumbDragState = useRef<ThumbDragState>({});
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollBarContainerRef = useRef<HTMLDivElement>(null);

  const trackEventState = useRef<ScrollTrackEventState>({ scrollCurrent: 0 });

  const scrollerClassNames = [style.coolScrollbarContainer, className];
  const scrollTrackClassname = style.coolScrollbarTrack;
  const scrollbarThumbClassname = style.coolScrollbarThumb;
  let timer: number;

  useEffect(() => {
    if (!scrollHostRef.current) return;

    let resizeObserver = new ResizeObserver(() => {
      handleScrollerSize(scrollHostRef);
    });
    resizeObserver.observe(scrollHostRef.current);

    /** handle thumb position on scrolling the page */
    scrollHostRef.current.addEventListener("scroll", handlePageScroll, true);

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

    scrollBarContainerRef.current!.style.display =
      thumbHeight >= scrollHeight ? "none" : "block";
  }

  function handlePageScroll(e: Event) {
    if (!scrollerThumbRef.current) return;

    let hostElement = e.target as HTMLDivElement | null;

    const thumbHeight = scrollerThumbRef.current?.clientHeight;

    if (scrollBarVisibility === "onscroll") {
      scrollHostRef.current?.setAttribute("aria-controls", "always");

      clearTimeout(timer);
      timer = setTimeout(() => {
        scrollHostRef.current?.setAttribute("aria-controls", "onscroll");
      }, 1500);
    }

    const { scrollTop, scrollHeight, offsetHeight } = hostElement!;
    let newTop = (scrollTop / scrollHeight) * offsetHeight;
    newTop = Math.min(newTop, offsetHeight - thumbHeight);

    scrollerThumbRef.current!.style.top = `${newTop ?? 0}px`;

    hostElement = null;
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

    scrollBarContainerRef.current?.setAttribute("area-active", "true");
  };

  function handleThumbMouseUp(e: globalThis.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    scrollBarContainerRef.current?.setAttribute("area-active", "false");

    if (scrollBarVisibility === "onscroll") {
      clearTimeout(timer);
      scrollHostRef.current?.setAttribute("aria-controls", "onscroll");
    }

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

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();

    trackEventState.current!.isTrackHold = true;

    const scrollAmount = getScrollAmount(e) ?? 0;

    scrollHostRef.current?.scrollTo({
      behavior: "smooth",
      top: scrollAmount,
    });
  }

  function handleMouseUp(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();

    trackEventState.current!.isTrackHold = false;

    clearInterval(trackEventState.current?.scrollIntervalState);
  }

  function getScrollAmount(e: MouseEvent<HTMLDivElement>) {
    if (
      !scrollTrackRef.current ||
      !scrollerThumbRef.current ||
      !scrollHostRef.current
    )
      return;

    let scrollTrack = e.target as HTMLElement;

    const { clientY } = e;
    const rect = scrollTrack?.getBoundingClientRect();

    const trackTop = rect?.top;
    const thumbOffset = -(scrollerThumbRef.current?.clientHeight ?? 0) / 2;

    const clickRatio =
      (clientY - trackTop + thumbOffset) / scrollTrackRef.current.clientHeight;

    const scrollAmount = Math.floor(
      clickRatio * scrollHostRef.current?.scrollHeight
    );
    return scrollAmount;
  }

  const getScrollTrack = () => {
    return typeof customScrollTrack === "function"
      ? customScrollTrack({
          ref: scrollTrackRef,
          handleMouseDown: handleMouseDown,
          handleMouseUp,
          className: scrollTrackClassname,
        })
      : cloneElement(customScrollTrack!, {
          ref: scrollTrackRef,
          handleMouseDown: handleMouseDown,
          handleMouseUp,
          className: scrollTrackClassname,
        });
  };

  const getScrollThumb = () => {
    return typeof customScrollThumb === "function"
      ? customScrollThumb({
          ref: scrollerThumbRef,
          handleMouseDown: handleMouseDownOnScrollThumb,
          className: scrollbarThumbClassname,
        })
      : cloneElement(customScrollThumb!, {
          ref: scrollerThumbRef,
          handleMouseDown: handleMouseDownOnScrollThumb,
          handleMouseUp,
          className: scrollbarThumbClassname,
        });
  };

  return (
    <div className={[style.coolscollerContainer].join(" ")}>
      <div
        className={style.coolscrollerHost}
        ref={scrollHostRef}
        aria-controls={scrollBarVisibility}
      >
        {children}
      </div>
      <div
        ref={scrollBarContainerRef}
        className={scrollerClassNames.join(" ")}
        style={{ width: scrollerWidth }}
        {...restProps}
      >
        {!customScrollTrack ? (
          <ScrollbarTrack
            className={scrollTrackClassname}
            handleMouseDown={handleMouseDown}
            handleMouseUp={handleMouseUp}
            ref={scrollTrackRef}
          />
        ) : (
          getScrollTrack()
        )}
        {!customScrollThumb ? (
          <ScrollbarThumb
            ref={scrollerThumbRef}
            className={scrollbarThumbClassname}
            handleMouseDown={handleMouseDownOnScrollThumb}
          />
        ) : (
          getScrollThumb()
        )}
      </div>
    </div>
  );
};

export default ReactCoolScrollbar;
