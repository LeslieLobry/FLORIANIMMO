import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { resend } from "../../../../lib/resend";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.nom || !body.email) {
      return NextResponse.json(
        { message: "Le nom et l'email sont obligatoires." },
        { status: 400 }
      );
    }

    if (body.dateSouhaitee) {
      const date = new Date(body.dateSouhaitee);
      const day = date.getDay();

      if (day === 0) {
        return NextResponse.json(
          { message: "L'agence est fermée le dimanche." },
          { status: 400 }
        );
      }
    }

    const rendezVous = await prisma.rendezVousRequest.create({
      data: {
        nom: body.nom,
        email: body.email,
        telephone: body.telephone || null,
        sujet: body.sujet || null,
        dateSouhaitee: body.dateSouhaitee || null,
        heureSouhaitee: body.heureSouhaitee || null,
        message: body.message || null,
      },
    });

    try {
      await resend.emails.send({
        from: "Florian Immo <onboarding@resend.dev>",
        to: "TON_EMAIL_ICI",
        subject: "Nouvelle demande de rendez-vous",
        html: `
          <h2>Nouvelle demande de rendez-vous</h2>
          <p><strong>Nom :</strong> ${body.nom}</p>
          <p><strong>Email :</strong> ${body.email}</p>
          <p><strong>Téléphone :</strong> ${body.telephone || "Non renseigné"}</p>
          <p><strong>Sujet :</strong> ${body.sujet || "Non renseigné"}</p>
          <p><strong>Date souhaitée :</strong> ${body.dateSouhaitee || "Non renseignée"}</p>
          <p><strong>Heure souhaitée :</strong> ${body.heureSouhaitee || "Non renseignée"}</p>
          <p><strong>Message :</strong></p>
          <p>${body.message || "Aucun message"}</p>
        `,
      });
    } catch (emailError) {
      console.error("Erreur email rendez-vous :", emailError);
    }

    return NextResponse.json({
      message: "Demande de rendez-vous envoyée avec succès.",
      rendezVous,
    });
  } catch (error) {
    console.error("Erreur API rendez-vous :", error);

    return NextResponse.json(
      {
        message: "Erreur serveur lors de l'envoi du rendez-vous.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}