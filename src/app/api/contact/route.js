import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    const { firstName, lastName, email, phone, subject, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "Prénom, email et message obligatoires." },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName || ""}`.trim();

    await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM,
      to: process.env.CONTACT_EMAIL_TO,
      replyTo: email,
      subject: `Nouvelle demande de contact - ${subject || "Sans sujet"}`,
      html: `
        <h2>Nouvelle demande depuis Florian Immo</h2>
        <p><strong>Nom :</strong> ${fullName}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
        <p><strong>Sujet :</strong> ${subject || "Non renseigné"}</p>
        <hr />
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message envoyé avec succès.",
    });
  } catch (error) {
    console.error("Erreur contact:", error);

    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}