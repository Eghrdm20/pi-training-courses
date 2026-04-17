export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        direction: "rtl",
        background: "#f8fafc",
        color: "#0f172a",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>دورات تدريبية</h1>
        <p style={{ fontSize: "18px", color: "#64748b" }}>
          تم تشغيل الصفحة بنجاح. الخطوة التالية هي اختبار /api/courses
        </p>
      </div>
    </main>
  )
}
