"use client"

import { useEffect, useState } from "react"
import { Bell, Search, User, BookOpen } from "lucide-react"

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
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            maxWidth: 460,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <button
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <User size={24} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontWeight: 800,
              fontSize: 24,
            }}
          >
            <span style={{ fontSize: 28 }}>🎓</span>
            <span>دورات تدريبية</span>
          </div>

          <button
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <Bell size={24} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 460, margin: "0 auto", padding: 16, paddingBottom: 120 }}>
        <section style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 46,
              lineHeight: 1.1,
              margin: "8px 0",
              fontWeight: 900,
            }}
          >
            مرحباً بك
          </h1>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: 20,
              lineHeight: 1.6,
            }}
          >
            ابدأ بناء منصة الدورات الخاصة بك
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <div
            style={{
              position: "relative",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 20,
              padding: "18px 18px 18px 52px",
            }}
          >
            <Search
              size={28}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <span style={{ color: "#94a3b8", fontSize: 20 }}>ابحث عن الدورات...</span>
          </div>
        </section>

        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <button
              style={{
                border: "none",
                background: "transparent",
                fontSize: 18,
                cursor: "pointer",
                color: "#0f172a",
              }}
            >
              عرض الكل
            </button>
            <h2
              style={{
                margin: 0,
                fontSize: 34,
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
                borderRadius: 24,
                padding: 28,
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>جاري تحميل الدورات</p>
              <p style={{ marginTop: 12, color: "#64748b", fontSize: 18 }}>يرجى الانتظار قليلًا...</p>
            </div>
          ) : error ? (
            <div
              style={{
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                borderRadius: 24,
                padding: 28,
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{error}</p>
            </div>
          ) : courses.length === 0 ? (
            <div
              style={{
                background: "white",
                border: "1px dashed #cbd5e1",
                borderRadius: 24,
                padding: 28,
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>لا توجد دورات منشورة بعد</p>
              <p style={{ marginTop: 12, color: "#64748b", fontSize: 18, lineHeight: 1.8 }}>
                أضف دورات إلى جدول courses في Supabase وستظهر هنا تلقائيًا.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {courses.map((course) => (
                <article
                  key={course.id}
                  style={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: 24,
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <div
                    style={{
                      height: 180,
                      background: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 42,
                    }}
                  >
                    📘
                  </div>

                  <div style={{ padding: 18 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          background: course.is_new ? "#22c55e" : "#e2e8f0",
                          color: course.is_new ? "white" : "#0f172a",
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {course.is_new ? "جديد" : "دورة"}
                      </span>

                      <h3
                        style={{
                          margin: 0,
                          fontSize: 28,
                          lineHeight: 1.3,
                          fontWeight: 900,
                          textAlign: "right",
                        }}
                      >
                        {course.title}
                      </h3>
                    </div>

                    <p
                      style={{
                        margin: "0 0 10px 0",
                        color: "#64748b",
                        fontSize: 18,
                      }}
                    >
                      بواسطة {course.instructor_name}
                    </p>

                    <p
                      style={{
                        margin: "0 0 16px 0",
                        color: "#475569",
                        fontSize: 17,
                        lineHeight: 1.8,
                      }}
                    >
                      {course.description || "بدون وصف"}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 16,
                        color: "#475569",
                        fontSize: 16,
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
                        gap: 12,
                      }}
                    >
                      <button
                        style={{
                          border: "none",
                          background: "#0f172a",
                          color: "white",
                          padding: "14px 22px",
                          borderRadius: 18,
                          fontSize: 18,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        {course.is_free ? "ابدأ الآن" : "اشترك الآن"}
                      </button>

                      <div
                        style={{
                          fontSize: 34,
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
          padding: 12,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}
      >
        <button
          style={{
            border: "none",
            background: "#0f172a",
            color: "white",
            borderRadius: 22,
            padding: "14px 10px",
            fontSize: 16,
            fontWeight: 800,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <BookOpen size={22} />
          الرئيسية
        </button>

        <button
          style={{
            border: "none",
            background: "transparent",
            color: "#0f172a",
            borderRadius: 22,
            padding: "14px 10px",
            fontSize: 16,
            fontWeight: 700,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Search size={22} />
          استكشف
        </button>

        <button
          style={{
            border: "none",
            background: "transparent",
            color: "#0f172a",
            borderRadius: 22,
            padding: "14px 10px",
            fontSize: 16,
            fontWeight: 700,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <User size={22} />
          الملف الشخصي
        </button>
      </nav>
    </div>
  )
              }
