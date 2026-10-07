import { useState, useLayoutEffect } from 'react';

export type VisibleBox = { top: number; left: number; width: number; height: number };

const PHONE_MAX_WIDTH = 767;
/** Mensaje del snippet de WordPress con la altura visible del padre. */
export const PARENT_VIEWPORT_MESSAGE = 'ADAB_PARENT_VIEWPORT';

let parentReportedHeight: number | null = null;

export function isPhoneViewport(): boolean {
  return window.innerWidth <= PHONE_MAX_WIDTH;
}

export function readVisibleBox(): VisibleBox {
  const ownViewport = window.visualViewport;
  const phone = isPhoneViewport();

  let fallbackHeight = ownViewport?.height ?? window.innerHeight;
  if (phone && parentReportedHeight != null) {
    fallbackHeight = Math.min(fallbackHeight, parentReportedHeight);
  }

  const fallback: VisibleBox = {
    top: ownViewport?.offsetTop ?? 0,
    left: ownViewport?.offsetLeft ?? 0,
    width: ownViewport?.width ?? window.innerWidth,
    height: fallbackHeight,
  };

  try {
    const frame = window.frameElement as HTMLElement | null;
    const parentWindow = window.parent;
    if (!frame || !parentWindow || parentWindow === window) {
      return clampToViewport(fallback);
    }

    const rect = frame.getBoundingClientRect();
    const parentViewport = parentWindow.visualViewport;

    // Tablet / desktop: recorte con offset del visualViewport.
    if (!phone) {
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
    }

    // Celular: recortar contra el área cliente visible, sin mezclar offsetTop.
    let viewHeight = parentViewport?.height ?? parentWindow.innerHeight;
    const viewWidth = parentViewport?.width ?? parentWindow.innerWidth;
    if (parentReportedHeight != null) {
      viewHeight = Math.min(viewHeight, parentReportedHeight);
    }

    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.min(rect.bottom, viewHeight);
    const visibleLeft = Math.max(rect.left, 0);
    const visibleRight = Math.min(rect.right, viewWidth);
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

    const onParentMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== PARENT_VIEWPORT_MESSAGE) return;
      const height = Number(data.height);
      parentReportedHeight = Number.isFinite(height) && height > 0 ? height : null;
      update();
    };

    window.addEventListener('resize', update);
    window.addEventListener('message', onParentMessage);
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
      window.removeEventListener('message', onParentMessage);
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
