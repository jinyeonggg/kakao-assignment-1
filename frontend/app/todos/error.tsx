'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full max-w-[560px] bg-surface rounded-card shadow-card border border-border p-12 flex flex-col items-center gap-4">
      <p className="text-text-muted text-sm">오류가 발생했습니다.</p>
      <p className="text-xs text-danger">{error.message}</p>
      <button
        onClick={reset}
        className="h-9 px-4 text-sm font-semibold text-white bg-primary rounded-btn shadow-btn hover:bg-primary-hover transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
