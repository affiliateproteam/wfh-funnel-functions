exports.handler = async function (event) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let firstName, email;

  try {
    const body = JSON.parse(event.body);
    firstName = body.firstName;
    email = body.email;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  if (!email || !firstName) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing fields" }) };
  }

  try {
    const response = await fetch("https://api.systeme.io/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.SYSTEME_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        firstName: firstName,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Systeme.io error:", errorText);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Systeme.io error", detail: errorText }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
