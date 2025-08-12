"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumbs({ items, className, showHome = true }: BreadcrumbProps) {
  const pathname = usePathname()

  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname)

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm text-muted-foreground mt-8", className)}>
      {showHome && (
        <>
          <Link href="/" className="flex items-center hover:text-foreground transition-colors" aria-label="Home">
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbItems.length > 0 && <ChevronRight className="h-4 w-4" />}
        </>
      )}

      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1

        return (
          <div key={item.href} className="flex items-center space-x-1">
            {isLast ? (
              <span className="font-medium text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <>
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </div>
        )
      })}
    </nav>
  )
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const label = formatSegment(segment)

    return { label, href }
  })
}

function formatSegment(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
