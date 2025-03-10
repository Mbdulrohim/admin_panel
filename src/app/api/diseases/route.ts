import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const prisma = new PrismaClient();

// GET: Fetch all diseases
export async function GET(req: Request) {
  try {
    const diseases = await prisma.diseases.findMany();

    const diseasesWithSignedUrls = diseases.map((disease) => ({
      ...disease,
      image_url: disease.image_url
        ? s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: disease.image_url.split("/").slice(-2).join("/"),
            Expires: 60 * 60, // URL valid for 1 hour
          })
        : null,
    }));

    return NextResponse.json(diseasesWithSignedUrls, { status: 200 });
  } catch (error) {
    console.error("Error fetching diseases:", error);
    return NextResponse.json(
      { error: "Failed to fetch diseases" },
      { status: 500 }
    );
  }
}

// POST: Add a new disease
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const profile = formData.get("profile") as string;
    const diagnosis = formData.get("diagnosis") as string;
    const prevention = formData.get("prevention") as string;
    const conventional_treatment = formData.get("conventional_treatment") as string;
    const naturopathic_treatment = formData.get("naturopathic_treatment") as string;
    const status = formData.get("status") as string;
    const file = formData.get("file") as File;

    // Validate required fields
    if (
      !name ||
      !profile ||
      !diagnosis ||
      !prevention ||
      !conventional_treatment ||
      !naturopathic_treatment ||
      !status ||
      !file
    ) {
      console.log(formData)

      return NextResponse.json(
        { error: "All fields are required, including the file" },
        { status: 400 }
      );
    }

    // Convert the file into a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Define the key (path) where the file will be stored in S3
    const fileKey = `diseases/${Date.now()}-${file.name}`;

    // S3 upload parameters
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: file.type,
    };

    // Upload the file to S3
    const uploadResult = await s3.upload(s3Params).promise();
    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Expires: 60 * 60,
    });

    const newDisease = await prisma.diseases.create({
      data: {
        name,
        profile,
        diagnosis,
        prevention,
        conventional_treatment,
        naturopathic_treatment,
        image_url: uploadResult.Location,
        status,
      },
    });

    return NextResponse.json(
      { ...newDisease, image_url: signedUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading disease:", error);
    return NextResponse.json(
      { error: "Failed to upload disease" },
      { status: 500 }
    );
  }
}

type DiseaseUpdateInput = Partial<{
  name: string;
  profile: string;
  diagnosis: string;
  prevention: string;
  conventional_treatment: string;
  naturopathic_treatment: string;
  status: string;
  image_url: string;
}>;

export async function PUT(request: Request) {
  try {
    const updateData: DiseaseUpdateInput = {};
    let id: string | null = null;

    // Determine content type
    const contentType = request.headers.get("Content-Type");

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      id = formData.get("id") as string | null;

      const name = formData.get("name") as string | null;
      const profile = formData.get("profile") as string | null;
      const diagnosis = formData.get("diagnosis") as string | null;
      const prevention = formData.get("prevention") as string | null;
      const conventional_treatment = formData.get("conventional_treatment") as string | null;
      const naturopathic_treatment = formData.get("naturopathic_treatment") as string | null;
      const status = formData.get("status") as string | null;
      const file = formData.get("file") as File | null;

      if (!id) {
        return NextResponse.json(
          { error: "Invalid payload: 'id' is required" },
          { status: 400 }
        );
      }

      if (name) updateData.name = name;
      if (profile) updateData.profile = profile;
      if (diagnosis) updateData.diagnosis = diagnosis;
      if (prevention) updateData.prevention = prevention;
      if (conventional_treatment) updateData.conventional_treatment = conventional_treatment;
      if (naturopathic_treatment) updateData.naturopathic_treatment = naturopathic_treatment;
      if (status) updateData.status = status;

      if (file) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileKey = `diseases/${Date.now()}-${file.name}`;

        const s3Params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: fileKey,
          Body: fileBuffer,
          ContentType: file.type,
        };

        const uploadResult = await s3.upload(s3Params).promise();
        updateData.image_url = uploadResult.Location;
      }
    } else if (contentType?.includes("application/json")) {
      const body = await request.json();
      id = body.id as string | null;
      const { status, name, profile, diagnosis, prevention, conventional_treatment, naturopathic_treatment } = body;

      if (!id) {
        return NextResponse.json(
          { error: "Invalid payload: 'id' is required" },
          { status: 400 }
        );
      }

      if (status) updateData.status = status;
      if (name) updateData.name = name;
      if (profile) updateData.profile = profile;
      if (diagnosis) updateData.diagnosis = diagnosis;
      if (prevention) updateData.prevention = prevention;
      if (conventional_treatment) updateData.conventional_treatment = conventional_treatment;
      if (naturopathic_treatment) updateData.naturopathic_treatment = naturopathic_treatment;
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 415 }
      );
    }

    const updatedDisease = await prisma.diseases.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedDisease, { status: 200 });
  } catch (error) {
    console.error("Error updating disease:", error);
    return NextResponse.json(
      { error: "Failed to update disease" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a disease
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await prisma.diseases.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting disease:", error);
    return NextResponse.json(
      { error: "Failed to delete disease" },
      { status: 500 }
    );
  }
}
