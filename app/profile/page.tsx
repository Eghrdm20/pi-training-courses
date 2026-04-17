import Link from "next/link"
import { BookOpen, Compass, User, PlusCircle } from "lucide-react"

export default function ProfilePage() {
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
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: "6px 0 10px" }}>
          الملف الشخصي
        </h1>

        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.8, marginBottom: 18 }}>
          هذه صفحة الملف الشخصي. يمكنك لاحقًا إضافة بيانات المستخدم هنا.
        </p>

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
