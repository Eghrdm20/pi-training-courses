"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Compass, Home, Search, User } from "lucide-react"

type Course = {
  id: number
  title: string
  description: string | null
  instructor_name: string
  price: number | null
  currency: string | null
  is_free: boolean
  duration: string | null
}

export default function ExplorePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/courses", { cache: "no-store" })
        const json = await res.json()
        setCourses(Array.isArray(json.courses) ? json.courses : [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return courses
    return courses.filter((course) => {
      return (
        course.title.toLowerCase().includes(q) ||
        (course.description || "").toLowerCase().includes(q) ||
        course.instructor_name.toLowerCase().includes(q)
      )
    })
  }, [courses, query])

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", direction: "rtl", fontFamily: "Arial, sans-serif" }}>
      <main style={{ maxWidth: 460, margin: "0 auto", padding: 14, paddingBottom: 96 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: "6px 0 14px" }}>استكشف</h1>

        <div
          style={{
            position: "relative",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: "0 14px 0 44px",
            height: 52,
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Search
            size={20}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث هنا..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 15,
              color: "#0f172a",
            }}
          />
        </div>

        {loading ? (
          <p style={{ color: "#64748b", fontSize: 15 }}>جاري التحميل...</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {filtered.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                style={{
                  textDecoration: "none",
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 14,
                  color: "#0f172a",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{course.title}</div>
                <div style={{ fontSize: 14, color: "#64748b", marginBottom: 6 }}>
                  بواسطة {course.instructor_name}
                </div>
                <div style={{ fontSize: 13, color: "#475569" }}>
                  {course.is_free ? "مجاني" : `${course.price ?? 0} ${course.currency || "PI"}`} •{" "}
                  {course.duration || "غير محدد"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 460,
          background: "white",
          borderTop: "1px solid #e5e7eb",
          padding: 10,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
        }}
      >
        <Link
          href="/"
          style={{
            color: "#0f172a",
            borderRadius: 16,
            padding: "10px 8px",
            fontSize: 14,
            fontWeight: 700,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            textDecoration: "none",
          }}
        >
          <Home size={18} />
          الرئيسية
        </Link>

        <Link
          href="/explore"
          style={{
            background: "#0f172a",
            color: "white",
            borderRadius: 16,
            padding: "10px 8px",
            fontSize: 14,
            fontWeight: 800,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            textDecoration: "none",
          }}
        >
          <Compass size={18} />
          استكشف
        </Link>

        <Link
          href="/profile"
          style={{
            color: "#0f172a",
            borderRadius: 16,
            padding: "10px 8px",
            fontSize: 14,
            fontWeight: 700,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            textDecoration: "none",
          }}
        >
          <User size={18} />
          الملف الشخصي
        </Link>
      </nav>
    </div>
  )
}
