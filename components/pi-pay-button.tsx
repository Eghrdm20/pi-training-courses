"use client"

import { useEffect, useState } from "react"

type PiPayButtonProps = {
  amount: number
  memo: string
  metadata?: Record<string, unknown>
  onPaid?: () => void
}

type CachedPiUser = {
  uid: string
  username: string
}

export default function PiPayButton({
  amount,
  memo,
  metadata,
  onPaid,
}: PiPayButtonProps) {
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState("")
  const [piUser, setPiUser] = useState<CachedPiUser | null>(null)

  useEffect(() => {
    const cached = window.localStorage.getItem("pi_user")
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed?.uid && parsed?.username) {
          setPiUser(parsed)
        }
      } catch (error) {
        console.error(error)
      }
    }

    let cancelled = false

    const timer = window.setInterval(() => {
      const Pi = (window as any).Pi
      if (!Pi) return

      window.clearInterval(timer)

      try {
        Pi.init({
          version: "2.0",
          sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === "true",
        })

        if (!cancelled) {
          setReady(true)
        }
      } catch (error) {
        console.error(error)
        if (!cancelled) {
          setStatus("تعذر تهيئة Pi SDK")
        }
      }
    }, 500)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  const handlePayment = async () => {
    try {
      const Pi = (window as any).Pi

      if (!Pi) {
        setStatus("Pi SDK غير متاح")
        return
      }

      if (!piUser?.uid || !piUser?.username) {
        setStatus("اربط حساب Pi من صفحة الملف الشخصي أولًا")
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
              uid: piUser.uid,
              username: piUser.username,
              amount,
              currency: "PI",
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
      {piUser?.username ? (
        <div style={{ fontSize: 13, color: "#64748b" }}>
          Pi: {piUser.username}
        </div>
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
