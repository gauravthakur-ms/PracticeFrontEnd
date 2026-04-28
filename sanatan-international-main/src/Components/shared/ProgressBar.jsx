export default function ProgressBar({ value = 0, label }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-slate-600 mb-1">
          <span>{label}</span>
          <span>{v}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
