export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { paymentId } = body

    if (!paymentId) {
      console.error("APPROVE ERROR: paymentId is missing")
      return Response.json({ error: "paymentId is required" }, { status: 400 })
    }

    const apiKey = process.env.PI_API_KEY

    if (!apiKey) {
      console.error("APPROVE ERROR: PI_API_KEY is missing")
      return Response.json({ error: "PI_API_KEY is missing" }, { status: 500 })
    }

    console.log("APPROVE KEY LENGTH:", apiKey.length)
    console.log("APPROVE KEY LAST4:", apiKey.slice(-4))
    console.log("APPROVE START paymentId:", paymentId)

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey.trim()}`,
          "Content-Type": "application/json",
        },
      }
    )

    const text = await response.text()

    console.log("APPROVE STATUS:", response.status)
    console.log("APPROVE RESPONSE:", text)

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("APPROVE CATCH ERROR:", error)
    return Response.json({ error: "approve failed" }, { status: 500 })
  }
}
