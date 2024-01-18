import type {
  HtmlHTMLAttributes,
  MouseEvent,
  ReactElement,
  RefObject,
} from "react";

type WithRef<T> = T & { ref: RefObject<HTMLElement> };
type ScrollbarVisibilityType = "onscroll" | "always" | "onhover";

export interface CoolScrollbarProps extends HtmlHTMLAttributes<HTMLDivElement> {
  scrollerWidth?: number;
  customScrollTrack?:
    | ((props: WithRef<ScrollbarTrackProps>) => ReactElement)
    | ReactElement;
  customScrollThumb?:
    | ((props: WithRef<ScrollbarThumbProps>) => ReactElement)
    | ReactElement;
  style?: any;
  scrollBarVisibility?: ScrollbarVisibilityType;
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
