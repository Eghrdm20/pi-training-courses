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

export default function HomePage() {
  const [piReady, setPiReady] = useState(false)
  const [piUser, setPiUser] = useState<{ uid?: string; username?: string } | null>(null)
  const [status, setStatus] = useState("جاهز")

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: true })
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
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#111",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>
          دورات تدريبية
        </h1>
        <p style={{ marginBottom: "24px", color: "#555" }}>
          تطبيق تجريبي لتسجيل الدخول والدفع داخل Pi Browser
        </p>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <p>حالة Pi SDK: {piReady ? "جاهز" : "غير جاهز"}</p>
          <p>الحالة: {status}</p>
          <p>المستخدم: {piUser?.username || "غير مسجل"}</p>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
            <button
              onClick={handlePiLogin}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: "#6b21a8",
                color: "white",
                cursor: "pointer",
              }}
            >
              تسجيل الدخول بـ Pi
            </button>

            <button
              onClick={handleTestPayment}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                background: "white",
                color: "#111",
                cursor: "pointer",
              }}
            >
              دفع تجريبي 0.01 Pi
            </button>
          </div>
        </div>
      </div>
    </main>
  )
              }
