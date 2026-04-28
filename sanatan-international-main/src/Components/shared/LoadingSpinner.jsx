export default function LoadingSpinner({ fullScreen = false, label }) {
  const wrap = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-[#FAF8F3]/90 z-[2000]"
    : "flex items-center justify-center py-10";
  return (
    <div className={wrap}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        {label && <p className="text-slate-600 text-sm">{label}</p>}
      </div>
    </div>
  );
}
