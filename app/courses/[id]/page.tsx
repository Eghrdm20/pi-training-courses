"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import PiPayButton from "@/components/pi-pay-button"

type Course = {
  id: number
  title: string
  description: string | null
  instructor_name: string
  price: number | null
  currency: string | null
  is_free: boolean
  image_url: string | null
  video_url: string | null
  file_url: string | null
  duration: string | null
  students_count: number | null
  rating: number | null
  is_new: boolean | null
  created_at: string
}

export default function CourseDetailsPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [paid, setPaid] = useState(false)

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
      <main
        style={{
          minHeight: "100vh",
          padding: 20,
          fontFamily: "Arial, sans-serif",
          direction: "rtl",
          background: "#f8fafc",
          color: "#0f172a",
        }}
      >
        جاري التحميل...
      </main>
    )
  }

  if (!course) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 20,
          fontFamily: "Arial, sans-serif",
          direction: "rtl",
          background: "#f8fafc",
          color: "#0f172a",
        }}
      >
        <p>الدورة غير موجودة.</p>
        <Link href="/" style={{ color: "#0f172a", textDecoration: "none" }}>
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
        <Link
          href="/"
          style={{
            color: "#0f172a",
            textDecoration: "none",
            fontSize: 14,
            display: "inline-block",
            marginBottom: 12,
          }}
        >
          ← العودة
        </Link>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            marginTop: 8,
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          {course.image_url ? (
            <img
              src={course.image_url}
              alt={course.title}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                display: "block",
                background: "#e2e8f0",
              }}
            />
          ) : (
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
          )}

          <div style={{ padding: 16 }}>
            <h1
              style={{
                fontSize: 24,
                margin: "0 0 8px",
                fontWeight: 900,
                lineHeight: 1.5,
              }}
            >
              {course.title}
            </h1>

            <p
              style={{
                fontSize: 14,
                color: "#64748b",
                margin: "0 0 10px",
              }}
            >
              بواسطة {course.instructor_name}
            </p>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.9,
                color: "#334155",
                margin: "0 0 14px",
              }}
            >
              {course.description || "بدون وصف"}
            </p>

            {course.video_url ? (
              <div style={{ marginBottom: 14 }}>
                <video
                  controls
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    background: "#000",
                    display: "block",
                  }}
                  src={course.video_url}
                />
              </div>
            ) : null}

            {course.file_url ? (
              <div style={{ marginBottom: 14 }}>
                <a
                  href={course.file_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    background: "#e2e8f0",
                    color: "#0f172a",
                    padding: "10px 14px",
                    borderRadius: 12,
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  فتح ملف الدورة
                </a>
              </div>
            ) : null}

            <div
              style={{
                fontSize: 14,
                color: "#475569",
                display: "grid",
                gap: 8,
                marginBottom: 14,
                lineHeight: 1.8,
              }}
            >
              <span>التقييم: {course.rating ?? 0}</span>
              <span>الطلاب: {course.students_count ?? 0}</span>
              <span>المدة: {course.duration || "غير محدد"}</span>
              <span>
                السعر:{" "}
                {course.is_free
                  ? "مجاني"
                  : `${course.price ?? 0} ${course.currency || "PI"}`}
              </span>
            </div>

            {course.is_free ? (
              <button
                style={{
                  border: "none",
                  background: "#0f172a",
                  color: "white",
                  padding: "11px 16px",
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                ابدأ الآن
              </button>
            ) : paid ? (
              <div
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  color: "#065f46",
                  padding: 12,
                  borderRadius: 14,
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1.8,
                }}
              >
                تم تسجيل الدفع بنجاح. يمكنك الآن متابعة محتوى الدورة.
              </div>
            ) : (
              <PiPayButton
                amount={Number(course.price ?? 0)}
                memo={`شراء دورة: ${course.title}`}
                metadata={{ courseId: course.id }}
                onPaid={() => setPaid(true)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
