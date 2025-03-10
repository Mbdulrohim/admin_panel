import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import AWS from "aws-sdk";

const prisma = new PrismaClient();
  
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// GET: Fetch all drugs
export async function GET(req: Request) {
  try {
    const drugs = await prisma.drugs.findMany(
      
    );

    // Generate signed URLs for drug images
    const drugsWithSignedUrls = drugs.map((drug) => ({
      ...drug,
      image_url: drug.image_url
        ? s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: drug.image_url.split("/").slice(-2).join("/"),
            Expires: 60 * 60, // URL valid for 1 hour
          })
        : null,
    }));

    return NextResponse.json(drugsWithSignedUrls, { status: 200 });
  } catch (error) {
    console.error("Error fetching drugs:", error);
    return NextResponse.json(
      { error: "Failed to fetch drugs" },
      { status: 500 }
    );
  }
}

// POST: Create a new drug
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    //   console.log("FormData received:", Array.from(formData.entries())); // Debug

    const name = formData.get("name") as string;
    const profile = formData.get("profile") as string;
    const uses = formData.get("uses") as string;
    const interactions = formData.get("interactions") as string;
    const side_effects = formData.get("side_effects") as string;
    const dosage = formData.get("dosage") as string;
    const status = formData.get("status") as string;
    const brand_names = formData.get("brand_names") as string;
const patient_advice = formData.get("patient_advice") as string;
const categoryId = formData.get("category_id") as string | null;


    const file = formData.get("file") as File;

    // Validate required fields
    if (
      !name ||
      !profile ||
      !uses ||
      !interactions ||
      !side_effects ||
      !dosage ||
      !file
    ) {
      console.error("Missing required fields:", {
        name,
        profile,
        uses,
        interactions,
        side_effects,
        dosage,
        file,
      });
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Convert the file into a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `drugs/${Date.now()}-${file.name}`;
    // Upload file to S3
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: file.type,
      })
      .promise();

    // Save drug to database
    const newDrug = await prisma.drugs.create({
      data: {
        name,
        profile,
        uses,
        interactions,
        side_effects,
        dosage,
        brand_names,
        patient_advice,
        status: status || "Draft",
        image_url: uploadResult.Location,
        category_id: categoryId ? parseInt(categoryId) : null, // Save category_id

      },
    });

    console.log("New Drug Created:", newDrug);

    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Expires: 60 * 60,
    });

    return NextResponse.json(
      { ...newDrug, image_url: signedUrl },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating drug:", error);
    return NextResponse.json(
      { error: "Failed to create drug" },
      { status: 500 }
    );
  }
}

type DrugUpdateInput = Partial<{
    name: string;
  profile: string;
  uses: string;
  interactions: string,
  side_effects: string;
  dosage: string;
  brand_names:string;
  patient_advice:string;
  status: string;
  image_url:string;
  category_id?: number 
}>

// PUT: Update a drug
export async function PUT(request: Request) {
    try {
      const formData = await request.formData();
      const id = formData.get("id") as string | null;
  
      const name = formData.get("name") as string | null;
      const profile = formData.get("profile") as string | null;
      const uses = formData.get("uses") as string | null;
      const interactions = formData.get("interactions") as string | null;
      const side_effects = formData.get("side_effects") as string | null;
      const dosage = formData.get("dosage") as string | null;
      const status = formData.get("status") as string | null;
      const file = formData.get("file") as File | null;
      const categoryId = formData.get("category_id") as string | null; // New: Extract category_id

      // Validate required fields
      if (!id) {
        return NextResponse.json(
          { error: "Invalid payload: 'id' is required" },
          { status: 400 }
        );
      }
  
      const updateData: DrugUpdateInput = {};
  
      if (name) updateData.name = name;
      if (profile) updateData.profile = profile;
      if (uses) updateData.uses = uses;
      if (interactions) updateData.interactions = interactions;
      if (side_effects) updateData.side_effects = side_effects;
      if (dosage) updateData.dosage = dosage;
      if (status) updateData.status = status;
      if (formData.get("brand_names")) updateData.brand_names = formData.get("brand_names") as string;
      if (formData.get("patient_advice")) updateData.patient_advice = formData.get("patient_advice") as string;
      if (categoryId) updateData.category_id = parseInt(categoryId);

      // Handle file upload (if necessary)
      if (file) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileKey = `drugs/${Date.now()}-${file.name}`;
  
        const s3Params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: fileKey,
          Body: fileBuffer,
          ContentType: file.type,
        };
  
        const uploadResult = await s3.upload(s3Params).promise();
        updateData.image_url = uploadResult.Location;
      }
  
      const updatedDrug = await prisma.drugs.update({
        where: { id: Number(id) },
        data: updateData,
      });
  
      console.log("Updated Drug in Database:", updatedDrug);
  
      return NextResponse.json(updatedDrug, { status: 200 });
    } catch (error) {
      console.error("Error updating drug:", error);
      return NextResponse.json(
        { error: "Failed to update drug" },
        { status: 500 }
      );
    }
  }
// DELETE: Delete a drug
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.drugs.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("Error deleting Drug:", error);
    return NextResponse.json(
      { error: "Failed to delete Drug" },
      { status: 500 }
    );
  }
}
