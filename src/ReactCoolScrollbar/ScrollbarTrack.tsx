import { forwardRef } from "react";
import type { ScrollbarTrackProps } from "./scroller.types";

const ScrollbarTrack = forwardRef<any, ScrollbarTrackProps>(
  ({ handleMouseDown, handleMouseUp, className }, ref) => {
    return (
      <div
        className={className}
        ref={ref}
        onClick={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></div>
    );
  }
);

ScrollbarTrack.displayName = "ScrollbarTrack";

export default ScrollbarTrack;
