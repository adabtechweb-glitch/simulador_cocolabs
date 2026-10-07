import type { ReactNode } from 'react';

type LiveQuoteCardShellProps = {
  glowClassName: string;
  children: ReactNode;
};

export function LiveQuoteCardShell({ glowClassName, children }: LiveQuoteCardShellProps) {
  return (
    <div className="rounded-2xl bg-[#1e1e1e] p-5 md:p-8 text-center shadow-xl shadow-black/20 relative overflow-hidden">
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 ${glowClassName} rounded-full blur-2xl pointer-events-none`}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
