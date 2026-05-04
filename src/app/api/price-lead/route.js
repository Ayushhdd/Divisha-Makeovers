export const runtime = "nodejs";

const DEFAULT_NOTIFY_EMAIL = "divishamakeovers5@gmail.com";

function cleanText(value, maxLength = 200) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return cleanText(value, 600)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[+\d][\d\s().-]{6,17}$/.test(phone);
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (cleanText(body.company)) {
      return Response.json({ ok: true });
    }

    const lead = {
      name: cleanText(body.name, 80),
      whatsapp: cleanText(body.whatsapp, 18),
      email: cleanText(body.email, 120),
      serviceName: cleanText(body.serviceName, 120),
      packageName: cleanText(body.packageName, 180),
      price: cleanText(body.price, 40),
    };

    if (!lead.name || !lead.whatsapp || !lead.serviceName || !lead.packageName || !lead.price) {
      return Response.json({ error: "Please fill the required details." }, { status: 400 });
    }

    if (!isValidPhone(lead.whatsapp)) {
      return Response.json({ error: "Please enter a valid WhatsApp number." }, { status: 400 });
    }

    if (!isValidEmail(lead.email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.PRICE_LEAD_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Divisha Makeovers <onboarding@resend.dev>";

    const subject = `New price view: ${lead.packageName}`;
    const submittedAt = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    const html = `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin: 0 0 16px; color: #be185d;">New package price view</h2>
        <p style="margin: 0 0 18px;">Someone viewed a package price on the Divisha Makeovers website.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 620px;">
          <tr><td style="padding: 8px 0; font-weight: 700;">Name</td><td>${escapeHtml(lead.name)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">WhatsApp</td><td>${escapeHtml(lead.whatsapp)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Email</td><td>${escapeHtml(lead.email || "Not provided")}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Service</td><td>${escapeHtml(lead.serviceName)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Package</td><td>${escapeHtml(lead.packageName)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Price</td><td>${escapeHtml(lead.price)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700;">Time</td><td>${escapeHtml(submittedAt)}</td></tr>
        </table>
      </div>
    `;

    if (!apiKey) {
      console.info("[price-lead]", { ...lead, submittedAt });
      return Response.json({ ok: true, notification: "not_configured" });
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: notifyEmail,
        subject,
        html,
        reply_to: lead.email || undefined,
      }),
    });

    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error("[price-lead] Resend failed", detail);
      return Response.json(
        { error: "We could not send the request right now. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[price-lead]", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
