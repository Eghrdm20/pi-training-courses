export async function POST(request: Request) {
  try {
    const { paymentId, txid } = await request.json()

    if (!paymentId || !txid) {
      return Response.json(
        { error: "paymentId and txid are required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.PI_API_KEY
    if (!apiKey) {
      return Response.json({ error: "PI_API_KEY is missing" }, { status: 500 })
    }

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

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "complete failed" }, { status: 500 })
  }
}
