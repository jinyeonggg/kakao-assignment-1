export default function Loading() {
  return (
    <div className="w-full max-w-[560px] bg-surface rounded-card shadow-card border border-border overflow-hidden animate-pulse">
      <div className="h-[72px] border-b border-border px-8 flex items-center justify-between">
        <div className="h-8 w-16 bg-primary-dim rounded" />
        <div className="h-4 w-14 bg-app-bg rounded" />
      </div>
      <div className="h-[62px] border-b border-border" />
      <div className="h-[86px] border-b border-border" />
      <div className="h-[62px] border-b border-border" />
      <div className="p-8 flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[58px] bg-app-bg rounded-item border border-border" />
        ))}
      </div>
    </div>
  );
}
