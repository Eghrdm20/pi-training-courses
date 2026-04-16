export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("COMPLETE BODY:", JSON.stringify(body))

    const { paymentId, txid } = body

    if (!paymentId || !txid) {
      console.error("COMPLETE ERROR: paymentId or txid missing")
      return Response.json(
        { error: "paymentId and txid are required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.PI_API_KEY

    if (!apiKey) {
      console.error("COMPLETE ERROR: PI_API_KEY is missing")
      return Response.json({ error: "PI_API_KEY is missing" }, { status: 500 })
    }

    console.log("COMPLETE START paymentId:", paymentId, "txid:", txid)

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      }
    )

    const text = await response.text()

    console.log("COMPLETE STATUS:", response.status)
    console.log("COMPLETE RESPONSE:", text)

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("COMPLETE CATCH ERROR:", error)
    return Response.json({ error: "complete failed" }, { status: 500 })
  }
}
