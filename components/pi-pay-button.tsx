"use client"

import { useEffect, useState } from "react"

type PiPayButtonProps = {
  amount: number
  memo: string
  metadata?: Record<string, unknown>
  onPaid?: () => void
}

export default function PiPayButton({
  amount,
  memo,
  metadata,
  onPaid,
}: PiPayButtonProps) {
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState("")
  const [username, setUsername] = useState("")

  useEffect(() => {
    let cancelled = false
    let initialized = false

    const boot = async () => {
      const Pi = (window as any).Pi
      if (!Pi || initialized) return

      initialized = true

      try {
        Pi.init({
          version: "2.0",
          sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === "true",
        })

        const scopes = ["payments", "username"]

        const auth = await Pi.authenticate(
          scopes,
          async (payment: any) => {
            try {
              if (payment?.identifier && payment?.transaction?.txid) {
                await fetch("/api/pi/complete", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paymentId: payment.identifier,
                    txid: payment.transaction.txid,
                    courseId: metadata?.courseId,
                  }),
                })
              }
            } catch (error) {
              console.error("Incomplete payment handler error:", error)
            }
          }
        )

        if (!cancelled) {
          setReady(true)
          setUsername(auth?.user?.username || auth?.username || "")
        }
      } catch (error) {
        console.error("Pi auth failed:", error)
        if (!cancelled) {
          setStatus("افتح التطبيق من Pi Browser وسجّل الدخول أولًا")
        }
      }
    }

    const timer = window.setInterval(() => {
      if ((window as any).Pi) {
        window.clearInterval(timer)
        boot()
      }
    }, 500)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [metadata])

  const handlePayment = async () => {
    try {
      const Pi = (window as any).Pi

      if (!Pi) {
        setStatus("Pi SDK غير متاح")
        return
      }

      setStatus("جاري فتح نافذة الدفع...")

      const paymentData = {
        amount,
        memo,
        metadata: metadata || {},
      }

      const paymentCallbacks = {
        onReadyForServerApproval: async (paymentId: string) => {
          const res = await fetch("/api/pi/approve", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ paymentId }),
          })

          if (!res.ok) {
            const json = await res.json().catch(() => ({}))
            throw new Error(json?.error || "Approve failed")
          }
        },

        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          const res = await fetch("/api/pi/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentId,
              txid,
              courseId: metadata?.courseId,
            }),
          })

          const json = await res.json().catch(() => ({}))

          if (!res.ok) {
            throw new Error(json?.error || "Complete failed")
          }

          setStatus("تم الدفع بنجاح")
          onPaid?.()
        },

        onCancel: () => {
          setStatus("تم إلغاء الدفع")
        },

        onError: (error: any) => {
          console.error("Pi payment error:", error)
          setStatus("فشل الدفع")
        },
      }

      await Pi.createPayment(paymentData, paymentCallbacks)
    } catch (error) {
      console.error(error)
      setStatus("تعذر إتمام الدفع")
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {username ? (
        <div style={{ fontSize: 13, color: "#64748b" }}>Pi: {username}</div>
      ) : null}

      <button
        onClick={handlePayment}
        disabled={!ready}
        style={{
          border: "none",
          background: ready ? "#0f172a" : "#94a3b8",
          color: "white",
          padding: "11px 16px",
          borderRadius: 14,
          fontSize: 15,
          fontWeight: 800,
          cursor: ready ? "pointer" : "not-allowed",
        }}
      >
        ادفع بـ Pi
      </button>

      {status ? (
        <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
          {status}
        </div>
      ) : null}
    </div>
  )
}
