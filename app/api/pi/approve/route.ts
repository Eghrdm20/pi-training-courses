export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json()

    if (!paymentId) {
      return Response.json({ error: "paymentId is required" }, { status: 400 })
    }

    const apiKey = process.env.PI_API_KEY
    if (!apiKey) {
      return Response.json({ error: "PI_API_KEY is missing" }, { status: 500 })
    }

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
        },
      }
    )

    const text = await response.text()

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "approve failed" }, { status: 500 })
  }
}
