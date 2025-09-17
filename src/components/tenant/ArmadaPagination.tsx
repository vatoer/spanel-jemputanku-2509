export function ArmadaPagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  return (
    <div className="flex justify-end mt-4 gap-2">
      <button
        className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      <span className="px-2 py-1">{page} / {totalPages}</span>
      <button
        className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
