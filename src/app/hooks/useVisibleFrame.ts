import { useState, useLayoutEffect } from 'react';

export type VisibleBox = { top: number; left: number; width: number; height: number };

export function readVisibleBox(): VisibleBox {
  const ownViewport = window.visualViewport;
  const fallback: VisibleBox = {
    top: ownViewport?.offsetTop ?? 0,
    left: ownViewport?.offsetLeft ?? 0,
    width: ownViewport?.width ?? window.innerWidth,
    height: ownViewport?.height ?? window.innerHeight,
  };

  try {
    const frame = window.frameElement as HTMLElement | null;
    const parentWindow = window.parent;
    if (!frame || !parentWindow || parentWindow === window) return clampToViewport(fallback);

    const rect = frame.getBoundingClientRect();
    const parentViewport = parentWindow.visualViewport;
    const viewTop = parentViewport?.offsetTop ?? 0;
    const viewLeft = parentViewport?.offsetLeft ?? 0;
    const viewHeight = parentViewport?.height ?? parentWindow.innerHeight;
    const viewWidth = parentViewport?.width ?? parentWindow.innerWidth;

    const visibleTop = Math.max(rect.top, viewTop);
    const visibleBottom = Math.min(rect.bottom, viewTop + viewHeight);
    const visibleLeft = Math.max(rect.left, viewLeft);
    const visibleRight = Math.min(rect.right, viewLeft + viewWidth);
    const height = visibleBottom - visibleTop;
    const width = visibleRight - visibleLeft;
    if (height < 1 || width < 1) return clampToViewport(fallback);

    return clampToViewport({
      top: visibleTop - rect.top,
      left: visibleLeft - rect.left,
      width,
      height,
    });
  } catch {
    return clampToViewport(fallback);
  }
}

export function clampToViewport(box: VisibleBox): VisibleBox {
  const limitH = document.documentElement.clientHeight || window.innerHeight;
  const limitW = document.documentElement.clientWidth || window.innerWidth;
  const top = Math.max(0, Math.min(box.top, Math.max(0, limitH - 160)));
  const left = Math.max(0, Math.min(box.left, Math.max(0, limitW - 160)));
  return {
    top,
    left,
    width: Math.max(160, Math.min(box.width, limitW - left)),
    height: Math.max(160, Math.min(box.height, limitH - top)),
  };
}

export function useVisibleFrame(active: boolean): VisibleBox {
  const [box, setBox] = useState<VisibleBox>(readVisibleBox);

  useLayoutEffect(() => {
    if (!active) return;
    const update = () => setBox(readVisibleBox());
    update();

    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);

    let parentWindow: Window | null = null;
    try {
      if (window.parent && window.parent !== window) parentWindow = window.parent;
    } catch {
      parentWindow = null;
    }

    parentWindow?.addEventListener('resize', update);
    parentWindow?.addEventListener('scroll', update, true);
    parentWindow?.visualViewport?.addEventListener('resize', update);
    parentWindow?.visualViewport?.addEventListener('scroll', update);

    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
      parentWindow?.removeEventListener('resize', update);
      parentWindow?.removeEventListener('scroll', update, true);
      parentWindow?.visualViewport?.removeEventListener('resize', update);
      parentWindow?.visualViewport?.removeEventListener('scroll', update);
    };
  }, [active]);

  return box;
}
