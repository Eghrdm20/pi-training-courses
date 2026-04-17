"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { BookOpen, Compass, User, PlusCircle, LogIn } from "lucide-react"

declare global {
  interface Window {
    Pi?: any
  }
}

export default function ProfilePage() {
  const [piReady, setPiReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [uid, setUid] = useState("")
  const [status, setStatus] = useState("غير مرتبط بـ Pi")

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (window.Pi) {
        window.clearInterval(timer)

        try {
          window.Pi.init({
            version: "2.0",
            sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === "true",
          })
          setPiReady(true)
          setStatus("Pi SDK جاهز")
        } catch (error) {
          console.error(error)
          setStatus("تعذر تهيئة Pi SDK")
        }
      }
    }, 500)

    return () => window.clearInterval(timer)
  }, [])

  const handlePiLogin = async () => {
    try {
      if (!window.Pi) {
        setStatus("افتح التطبيق من Pi Browser")
        return
      }

      setLoading(true)
      setStatus("جاري ربط حساب Pi...")

      const scopes = ["username", "payments"]

      const auth = await window.Pi.authenticate(scopes, (payment: any) => {
        console.log("Incomplete payment found:", payment)
      })

      setUsername(auth?.user?.username || "")
      setUid(auth?.user?.uid || "")
      setStatus("تم الربط بنجاح")
    } catch (error) {
      console.error(error)
      setStatus("فشل الربط أو تم الإلغاء")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        direction: "rtl",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <main style={{ maxWidth: 460, margin: "0 auto", padding: 14, paddingBottom: 96 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: "6px 0 10px", color: "#0f172a" }}>
          الملف الشخصي
        </h1>

        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.8, marginBottom: 18 }}>
          يمكنك ربط حساب Pi من هنا.
        </p>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 14,
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
            ربط حساب Pi
          </div>

          <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 12 }}>
            الحالة: {status}
          </div>

          {username ? (
            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#065f46",
                borderRadius: 14,
                padding: 12,
                fontSize: 14,
                lineHeight: 1.8,
              }}
            >
              <div>اسم مستخدم Pi: {username}</div>
              <div>UID: {uid}</div>
            </div>
          ) : (
            <button
              onClick={handlePiLogin}
              disabled={!piReady || loading}
              style={{
                border: "none",
                background: piReady ? "#0f172a" : "#94a3b8",
                color: "white",
                borderRadius: 14,
                padding: "12px 16px",
                fontSize: 15,
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: piReady && !loading ? "pointer" : "not-allowed",
              }}
            >
              <LogIn size={18} />
              {loading ? "جاري الربط..." : "ربط حساب Pi"}
            </button>
          )}
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <Link
            href="/"
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 14,
              textDecoration: "none",
              color: "#0f172a",
              fontWeight: 700,
            }}
          >
            دوراتي
          </Link>

          <Link
            href="/explore"
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 14,
              textDecoration: "none",
              color: "#0f172a",
              fontWeight: 700,
            }}
          >
            استكشاف الدورات
          </Link>

          <Link
            href="/"
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 14,
              textDecoration: "none",
              color: "#0f172a",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <PlusCircle size={18} />
            إنشاء دورة جديدة قريبًا
          </Link>
        </div>
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
          <BookOpen size={18} />
          الرئيسية
        </Link>

        <Link
          href="/explore"
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
          <Compass size={18} />
          استكشف
        </Link>

        <Link
          href="/profile"
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
          <User size={18} />
          الملف الشخصي
        </Link>
      </nav>
    </div>
  )
}
