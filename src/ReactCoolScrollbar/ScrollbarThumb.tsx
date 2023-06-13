import { type HtmlHTMLAttributes, forwardRef, type MouseEvent } from "react";

interface ScrollbarThumbProps extends HtmlHTMLAttributes<HTMLDivElement> {
  handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
}

const ScrollbarThumb = forwardRef<any, ScrollbarThumbProps>(
  ({ handleMouseDown, className }, ref) => {
    return (
      <div className={className} ref={ref} onMouseDown={handleMouseDown}></div>
    );
  }
);

ScrollbarThumb.displayName = "ScrollbarThumb";

export default ScrollbarThumb;
