import type {
  HtmlHTMLAttributes,
  MouseEvent,
  ReactElement,
  RefObject,
} from "react";

type WithRef<T> = T & { ref: RefObject<HTMLElement> };
type ScrollbarVisibilityType = "onscroll" | "always" | "onhover";

export interface CoolScrollbarProps
  extends Pick<
    HtmlHTMLAttributes<HTMLDivElement>,
    "className" | "style" | "children"
  > {
  scrollerWidth?: number;
  customScrollTrack?:
    | ((props: WithRef<ScrollbarTrackProps>) => ReactElement)
    | ReactElement;
  customScrollThumb?:
    | ((props: WithRef<ScrollbarThumbProps>) => ReactElement)
    | ReactElement;
  scrollBarVisibility?: ScrollbarVisibilityType;
  // minimumThumbHeight?: number;
  // thumbHeight?: number;
}

export interface ScrollbarThumbProps
  extends HtmlHTMLAttributes<HTMLDivElement> {
  handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
}

export interface ScrollbarTrackProps
  extends HtmlHTMLAttributes<HTMLDivElement> {
  handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (e: MouseEvent<HTMLDivElement>) => void;
}

export interface ThumbDragState {
  initialThumbPosY?: number;
  initialScrollTop?: number;
  isDragging?: boolean;
}

export interface ScrollTrackEventState {
  isTrackHold?: boolean;
  scrollIntervalState?: number;
  scrollCurrent?: number;
}

export interface GetScrollAmountParams {
  e: MouseEvent<HTMLDivElement>;
  thumbHeight?: number;
  pageScrollLength?: number;
}
