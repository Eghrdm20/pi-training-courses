"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    Pi?: {
      init: (options: { version: string; sandbox?: boolean }) => void
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: unknown) => void
      ) => Promise<{
        accessToken: string
        user?: {
          uid?: string
          username?: string
        }
      }>
      createPayment: (
        paymentData: {
          amount: number
          memo: string
          metadata: Record<string, unknown>
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void | Promise<void>
          onReadyForServerCompletion: (paymentId: string, txid: string) => void | Promise<void>
          onCancel: (paymentId: string) => void
          onError: (error: unknown, payment?: unknown) => void
        }
      ) => Promise<unknown>
    }
  }
}

type PiUser = {
  uid?: string
  username?: string
}

export default function HomePage() {
  const [piReady, setPiReady] = useState(false)
  const [piUser, setPiUser] = useState<PiUser | null>(null)
  const [status, setStatus] = useState("جاهز")
  const [busy, setBusy] = useState<"login" | "pay" | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.Pi) {
        window.Pi.init({ version: "2.0" })
        setPiReady(true)
        clearInterval(timer)
      }
    }, 300)

    return () => clearInterval(timer)
  }, [])

  async function handlePiLogin() {
    try {
      if (!window.Pi) {
        setStatus("Pi SDK غير جاهز")
        return
      }

      setBusy("login")
      setStatus("جاري تسجيل الدخول...")

      const auth = await window.Pi.authenticate(
        ["username", "payments"],
        (payment) => {
          console.log("Incomplete payment found:", payment)
        }
      )

      setPiUser(auth.user || null)
      setStatus("تم تسجيل الدخول بنجاح")
    } catch (error) {
      console.error(error)
      setStatus("فشل تسجيل الدخول")
    } finally {
      setBusy(null)
    }
  }

  async function handleTestPayment() {
    try {
      if (!window.Pi) {
        setStatus("Pi SDK غير جاهز")
        return
      }

      if (!piUser) {
        setStatus("سجل الدخول أولًا")
        return
      }

      setBusy("pay")
      setStatus("جاري بدء الدفع...")

      await window.Pi.createPayment(
        {
          amount: 0.01,
          memo: "اشتراك تجريبي لإكمال خطوة Pi",
          metadata: {
            productId: "course-test-001",
            userUid: piUser.uid || "unknown",
          },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            const res = await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            })

            if (!res.ok) {
              throw new Error("approve failed")
            }
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            const res = await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            })

            if (!res.ok) {
              throw new Error("complete failed")
            }

            setStatus("تم الدفع بنجاح")
          },

          onCancel: () => {
            setStatus("تم إلغاء الدفع")
          },

          onError: (error: unknown) => {
            console.error(error)
            setStatus("حدث خطأ أثناء الدفع")
          },
        }
      )
    } catch (error) {
      console.error(error)
      setStatus("فشل تنفيذ الدفع")
    } finally {
      setBusy(null)
    }
  }

  const categories = [
    { icon: "💻", title: "البرمجة", count: "45 دورة" },
    { icon: "🎨", title: "التصميم", count: "32 دورة" },
    { icon: "📈", title: "التسويق", count: "28 دورة" },
    { icon: "💼", title: "الأعمال", count: "38 دورة" },
  ]

  const features = [
    {
      title: "دخول سريع بـ Pi",
      text: "سجل الدخول مباشرة داخل Pi Browser بطريقة سهلة وآمنة.",
    },
    {
      title: "دفع تجريبي فوري",
      text: "اختبر عمليات الدفع الصغيرة للتأكد من أن التطبيق يعمل كما يجب.",
    },
    {
      title: "واجهة عربية واضحة",
      text: "تصميم نظيف ومريح للعين مع ترتيب مناسب للشاشات الصغيرة.",
    },
  ]

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-top">
          <div>
            <span className="mini-badge">SkillUp</span>
            <h1 className="hero-title">دورات تدريبية</h1>
            <p className="hero-subtitle">
              منصة عربية لتجربة تسجيل الدخول والدفع داخل Pi Browser بشكل جميل وبسيط.
            </p>
          </div>
          <div className="hero-icon">🎓</div>
        </div>

        <div className="hero-stats">
          <div className="stat-box">
            <strong>+120</strong>
            <span>محتوى تدريبي</span>
          </div>
          <div className="stat-box">
            <strong>Pi</strong>
            <span>دخول سريع</span>
          </div>
          <div className="stat-box">
            <strong>0.01</strong>
            <span>دفع تجريبي</span>
          </div>
        </div>
      </section>

      <section className="status-card">
        <div className="section-head">
          <h2>حالة الربط</h2>
          <span className={`status-pill ${piReady ? "ok" : "wait"}`}>
            {piReady ? "SDK جاهز" : "جاري التحميل"}
          </span>
        </div>

        <div className="status-grid">
          <div className="status-item">
            <span className="label">الحالة</span>
            <strong>{status}</strong>
          </div>

          <div className="status-item">
            <span className="label">المستخدم</span>
            <strong>{piUser?.username || "غير مسجل"}</strong>
          </div>

          <div className="status-item">
            <span className="label">رقم المستخدم</span>
            <strong>{piUser?.uid || "---"}</strong>
          </div>
        </div>

        <div className="button-row">
          <button
            className="primary-btn"
            onClick={handlePiLogin}
            disabled={busy !== null}
          >
            {busy === "login" ? "جاري الدخول..." : "تسجيل الدخول بـ Pi"}
          </button>

          <button
            className="secondary-btn"
            onClick={handleTestPayment}
            disabled={busy !== null}
          >
            {busy === "pay" ? "جاري الدفع..." : "دفع تجريبي 0.01 Pi"}
          </button>
        </div>
      </section>

      <section className="content-card">
        <div className="section-head">
          <h2>أقسام المنصة</h2>
          <span className="section-note">الأكثر طلبًا</span>
        </div>

        <div className="category-grid">
          {categories.map((item) => (
            <div className="category-box" key={item.title}>
              <div className="category-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-card">
        <div className="section-head">
          <h2>لماذا هذا التطبيق؟</h2>
          <span className="section-note">نسخة محسنة</span>
        </div>

        <div className="feature-list">
          {features.map((item) => (
            <div className="feature-box" key={item.title}>
              <div className="feature-mark">✓</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
          }
