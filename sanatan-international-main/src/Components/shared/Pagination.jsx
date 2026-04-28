export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const go = (p) => onChange(Math.max(1, Math.min(totalPages, p)));
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        disabled={page === 1}
        onClick={() => go(page - 1)}
        className="px-3 py-1 text-sm border rounded disabled:opacity-40 hover:bg-slate-50"
      >
        Prev
      </button>
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => go(page + 1)}
        className="px-3 py-1 text-sm border rounded disabled:opacity-40 hover:bg-slate-50"
      >
        Next
      </button>
    </div>
  );
}
