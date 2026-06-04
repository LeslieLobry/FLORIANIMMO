import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { resend } from "../../../../lib/resend";

export async function POST(req) {
  try {
    const body = await req.json();

    const estimation = await prisma.estimationRequest.create({
      data: {
        adresse: body.adresse,
        ville: body.ville,
        codePostal: body.codePostal,
        typeBien: body.typeBien,

        surfaceHabitable: body.surfaceHabitable
          ? Number(body.surfaceHabitable)
          : null,
        surfaceTerrain: body.surfaceTerrain
          ? Number(body.surfaceTerrain)
          : null,
        nbPieces: body.nbPieces ? Number(body.nbPieces) : null,
        chambres: body.chambres ? Number(body.chambres) : null,
        anneeConstruction: body.anneeConstruction
          ? Number(body.anneeConstruction)
          : null,

        dpe: body.dpe || null,
        etatBien: body.etatBien || null,
        chauffage: body.chauffage || null,
        informations: body.informations || null,

        prenom: body.prenom,
        nom: body.nom,
        email: body.email,
        telephone: body.telephone,
      },
    });

    await resend.emails.send({
      from: "Florian Immo <contact@florian-immo.fr>",
      to: "leslielobry@gmail.com",
      subject: "Nouvelle demande d'estimation immobilière",
      html: `
        <h2>Nouvelle demande d'estimation</h2>

        <h3>Coordonnées</h3>
        <p><strong>Nom :</strong> ${body.prenom} ${body.nom}</p>
        <p><strong>Email :</strong> ${body.email}</p>
        <p><strong>Téléphone :</strong> ${body.telephone}</p>

        <h3>Bien immobilier</h3>
        <p><strong>Adresse :</strong> ${body.adresse}</p>
        <p><strong>Ville :</strong> ${body.codePostal} ${body.ville}</p>
        <p><strong>Type de bien :</strong> ${body.typeBien}</p>

        <h3>Caractéristiques</h3>
        <p><strong>Surface habitable :</strong> ${
          body.surfaceHabitable || "Non renseignée"
        } m²</p>
        <p><strong>Surface terrain :</strong> ${
          body.surfaceTerrain || "Non renseignée"
        } m²</p>
        <p><strong>Nombre de pièces :</strong> ${
          body.nbPieces || "Non renseigné"
        }</p>
        <p><strong>Chambres :</strong> ${
          body.chambres || "Non renseigné"
        }</p>
        <p><strong>Année de construction :</strong> ${
          body.anneeConstruction || "Non renseignée"
        }</p>
        <p><strong>DPE :</strong> ${body.dpe || "Non renseigné"}</p>
        <p><strong>État du bien :</strong> ${
          body.etatBien || "Non renseigné"
        }</p>
        <p><strong>Chauffage :</strong> ${
          body.chauffage || "Non renseigné"
        }</p>

        <h3>Informations complémentaires</h3>
        <p>${body.informations || "Aucune information complémentaire"}</p>

        <hr />
        <p><small>Demande enregistrée en base avec l'ID : ${
          estimation.id
        }</small></p>
      `,
    });

    await resend.emails.send({
      from: "Florian Immo <contact@florian-immo.fr>",
      to: body.email,
      subject: "Votre demande d'estimation a bien été envoyée",
      html: `
        <h2>Votre demande d'estimation a bien été envoyée</h2>

        <p>Bonjour ${body.prenom},</p>

        <p>
          Merci pour votre demande d'estimation immobilière.
          Florian Lobry a bien reçu les informations concernant votre bien.
        </p>

        <p>
          Il vous recontactera prochainement afin d'échanger avec vous
          et d'affiner l'évaluation de votre bien.
        </p>

        <h3>Récapitulatif de votre demande</h3>

        <p><strong>Adresse :</strong> ${body.adresse}</p>
        <p><strong>Ville :</strong> ${body.codePostal} ${body.ville}</p>
        <p><strong>Type de bien :</strong> ${body.typeBien}</p>

        <p><strong>Surface habitable :</strong> ${
          body.surfaceHabitable || "Non renseignée"
        } m²</p>
        <p><strong>Surface terrain :</strong> ${
          body.surfaceTerrain || "Non renseignée"
        } m²</p>

        <br />

        <p>À très bientôt,</p>
        <p><strong>Florian Immo</strong></p>
      `,
    });

    return NextResponse.json({
      success: true,
      id: estimation.id,
      message:
        "Votre demande d'estimation a bien été envoyée. Un email de confirmation vient de vous être envoyé.",
    });
  } catch (error) {
    console.error("Erreur demande estimation :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de l'envoi de la demande d'estimation.",
      },
      { status: 500 }
    );
  }
}