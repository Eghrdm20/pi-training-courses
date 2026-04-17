"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Bell, Search, User, BookOpen, Compass } from "lucide-react"

type Course = {
  id: number
  title: string
  description: string | null
  instructor_name: string
  price: number | null
  currency: string | null
  is_free: boolean
  image_url: string | null
  duration: string | null
  students_count: number | null
  rating: number | null
  is_new: boolean | null
  created_at: string
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true)
        setError("")

        const res = await fetch("/api/courses", { cache: "no-store" })
        const json = await res.json()

        if (!res.ok) {
          throw new Error(json?.error || "Failed to load courses")
        }

        setCourses(Array.isArray(json.courses) ? json.courses : [])
      } catch (err) {
        console.error(err)
        setError("تعذر تحميل الدورات")
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const filteredCourses = useMemo(() => {
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
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        direction: "rtl",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "10px 14px",
        }}
      >
        <div
          style={{
            maxWidth: 460,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Link
            href="/profile"
            style={{
              color: "#0f172a",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={20} />
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            <span style={{ fontSize: 22 }}>🎓</span>
            <span>دورات تدريبية</span>
          </div>

          <Link
            href="/profile"
            style={{
              color: "#0f172a",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={20} />
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 460, margin: "0 auto", padding: 14, paddingBottom: 96 }}>
        <section style={{ marginBottom: 18 }}>
          <h1
            style={{
              fontSize: 30,
              lineHeight: 1.2,
              margin: "6px 0",
              fontWeight: 900,
            }}
          >
            مرحباً بك
          </h1>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            استكشف الدورات المنشورة في المنصة
          </p>
        </section>

        <section style={{ marginBottom: 20 }}>
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
              placeholder="ابحث عن الدورات..."
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
        </section>

        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Link
              href="/explore"
              style={{
                fontSize: 15,
                color: "#0f172a",
                padding: 0,
                textDecoration: "none",
              }}
            >
              عرض الكل
            </Link>

            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 900,
              }}
            >
              الدورات
            </h2>
          </div>

          {loading ? (
            <div
              style={{
                background: "white",
                border: "1px dashed #cbd5e1",
                borderRadius: 18,
                padding: 20,
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>جاري تحميل الدورات</p>
              <p style={{ marginTop: 8, color: "#64748b", fontSize: 14 }}>يرجى الانتظار قليلًا...</p>
            </div>
          ) : error ? (
            <div
              style={{
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                borderRadius: 18,
                padding: 20,
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{error}</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div
              style={{
                background: "white",
                border: "1px dashed #cbd5e1",
                borderRadius: 18,
                padding: 20,
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>لا توجد نتائج</p>
              <p style={{ marginTop: 10, color: "#64748b", fontSize: 14, lineHeight: 1.8 }}>
                جرّب كتابة اسم الدورة أو اسم المدرّب.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {filteredCourses.map((course) => (
                <article
                  key={course.id}
                  style={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
                  }}
                >
                  <div
                    style={{
                      height: 120,
                      background: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                    }}
                  >
                    📘
                  </div>

                  <div style={{ padding: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          background: course.is_new ? "#22c55e" : "#e2e8f0",
                          color: course.is_new ? "white" : "#0f172a",
                          padding: "5px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {course.is_new ? "جديد" : "دورة"}
                      </span>

                      <h3
                        style={{
                          margin: 0,
                          fontSize: 19,
                          lineHeight: 1.5,
                          fontWeight: 900,
                          textAlign: "right",
                        }}
                      >
                        {course.title}
                      </h3>
                    </div>

                    <p
                      style={{
                        margin: "0 0 8px 0",
                        color: "#64748b",
                        fontSize: 14,
                      }}
                    >
                      بواسطة {course.instructor_name}
                    </p>

                    <p
                      style={{
                        margin: "0 0 12px 0",
                        color: "#475569",
                        fontSize: 14,
                        lineHeight: 1.8,
                      }}
                    >
                      {course.description || "بدون وصف"}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 12,
                        color: "#475569",
                        fontSize: 13,
                        flexWrap: "wrap",
                      }}
                    >
                      <span>التقييم: {course.rating ?? 0}</span>
                      <span>الطلاب: {course.students_count ?? 0}</span>
                      <span>المدة: {course.duration || "غير محدد"}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <Link
                        href={`/courses/${course.id}`}
                        style={{
                          border: "none",
                          background: "#0f172a",
                          color: "white",
                          padding: "10px 16px",
                          borderRadius: 14,
                          fontSize: 15,
                          fontWeight: 800,
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                      >
                        {course.is_free ? "ابدأ الآن" : "اشترك الآن"}
                      </Link>

                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 900,
                          color: "#0f172a",
                        }}
                      >
                        {course.is_free
                          ? "مجاني"
                          : `${course.price ?? 0} ${course.currency || "PI"}`}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
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
          <BookOpen size={18} />
          الرئيسية
        </Link>

        <Link
          href="/explore"
          style={{
            background: "transparent",
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
          <Compass size={18} />
          استكشف
        </Link>

        <Link
          href="/profile"
          style={{
            background: "transparent",
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
