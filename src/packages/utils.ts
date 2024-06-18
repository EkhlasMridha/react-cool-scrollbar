import { GetScrollAmountParams } from "./scroller.types";

export function getScrollAmount({
  e,
  pageScrollLength,
  thumbHeight,
}: GetScrollAmountParams) {
  const scrollTrack = e.target as HTMLElement;

  const { clientY } = e;
  const rect = scrollTrack?.getBoundingClientRect();

  const trackTop = rect?.top;
  const thumbOffset = -(thumbHeight ?? 0) / 2;

  const clickRatio =
    (clientY - trackTop + thumbOffset) / scrollTrack.clientHeight;

  const scrollAmount = Math.floor(clickRatio * (pageScrollLength ?? 0));
  return scrollAmount ?? 0;
}
