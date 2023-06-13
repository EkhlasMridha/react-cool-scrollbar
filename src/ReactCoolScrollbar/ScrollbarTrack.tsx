import { type HtmlHTMLAttributes, forwardRef, type MouseEvent } from "react";

interface ScrollbarTrackProps extends HtmlHTMLAttributes<HTMLDivElement> {
  handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (e: MouseEvent<HTMLDivElement>) => void;
}

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
