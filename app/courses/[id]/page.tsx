"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Course = {
  id: number
  title: string
  description: string | null
  instructor_name: string
  price: number | null
  currency: string | null
  is_free: boolean
  duration: string | null
  students_count: number | null
  rating: number | null
}

export default function CourseDetailsPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch("/api/courses", { cache: "no-store" })
        const json = await res.json()
        const items = Array.isArray(json.courses) ? json.courses : []
        const found = items.find((item: Course) => String(item.id) === String(id))
        setCourse(found || null)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [id])

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", padding: 20, fontFamily: "Arial, sans-serif", direction: "rtl" }}>
        جاري التحميل...
      </main>
    )
  }

  if (!course) {
    return (
      <main style={{ minHeight: "100vh", padding: 20, fontFamily: "Arial, sans-serif", direction: "rtl" }}>
        <p>الدورة غير موجودة.</p>
        <Link href="/" style={{ color: "#0f172a" }}>
          العودة للرئيسية
        </Link>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily: "Arial, sans-serif",
        direction: "rtl",
        padding: 16,
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <Link href="/" style={{ color: "#0f172a", textDecoration: "none", fontSize: 14 }}>
          ← العودة
        </Link>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            marginTop: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 140,
              background: "#e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
            }}
          >
            📘
          </div>

          <div style={{ padding: 16 }}>
            <h1 style={{ fontSize: 24, margin: "0 0 8px", fontWeight: 900 }}>{course.title}</h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 10px" }}>
              بواسطة {course.instructor_name}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "#334155", margin: "0 0 14px" }}>
              {course.description || "بدون وصف"}
            </p>

            <div style={{ fontSize: 14, color: "#475569", display: "grid", gap: 8, marginBottom: 14 }}>
              <span>التقييم: {course.rating ?? 0}</span>
              <span>الطلاب: {course.students_count ?? 0}</span>
              <span>المدة: {course.duration || "غير محدد"}</span>
              <span>
                السعر: {course.is_free ? "مجاني" : `${course.price ?? 0} ${course.currency || "PI"}`}
              </span>
            </div>

            <button
              style={{
                border: "none",
                background: "#0f172a",
                color: "white",
                padding: "11px 16px",
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              {course.is_free ? "ابدأ الآن" : "اشترك الآن"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
        }
