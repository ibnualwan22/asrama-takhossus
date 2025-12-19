import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  query?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  query = "",
}: PaginationProps) {
  if (totalPages <= 1) return null

  const createPageLink = (page: number) => {
    const params = new URLSearchParams()
    if (query) params.set("query", query)
    params.set("page", page.toString())
    return `?${params.toString()}`
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      
      {/* PREVIOUS */}
      <Link
        href={createPageLink(currentPage - 1)}
        className={`px-3 py-2 rounded-lg border text-sm font-bold flex items-center gap-1
          ${currentPage === 1
            ? "pointer-events-none opacity-40"
            : "hover:bg-gray-100"
          }`}
      >
        <ChevronLeft size={16} />
        Prev
      </Link>

      {/* PAGE NUMBERS */}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(page =>
          page === 1 ||
          page === totalPages ||
          Math.abs(page - currentPage) <= 1
        )
        .map((page, index, arr) => (
          <div key={page} className="flex items-center">
            {index > 0 && page - arr[index - 1] > 1 && (
              <span className="px-2 text-gray-400">...</span>
            )}

            <Link
              href={createPageLink(page)}
              className={`px-4 py-2 rounded-lg text-sm font-bold border
                ${page === currentPage
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100"
                }`}
            >
              {page}
            </Link>
          </div>
        ))}

      {/* NEXT */}
      <Link
        href={createPageLink(currentPage + 1)}
        className={`px-3 py-2 rounded-lg border text-sm font-bold flex items-center gap-1
          ${currentPage === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-gray-100"
          }`}
      >
        Next
        <ChevronRight size={16} />
      </Link>
    </div>
  )
}
