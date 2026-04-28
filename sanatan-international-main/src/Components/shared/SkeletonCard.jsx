export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-48 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-200 rounded w-1/3" />
      </div>
    </div>
  );
}
