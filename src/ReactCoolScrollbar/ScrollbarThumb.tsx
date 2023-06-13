import { forwardRef } from "react";
import type { ScrollbarThumbProps } from "./scroller.types";

const ScrollbarThumb = forwardRef<any, ScrollbarThumbProps>(
  ({ handleMouseDown, className }, ref) => {
    return (
      <div className={className} ref={ref} onMouseDown={handleMouseDown}></div>
    );
  }
);

ScrollbarThumb.displayName = "ScrollbarThumb";

export default ScrollbarThumb;
