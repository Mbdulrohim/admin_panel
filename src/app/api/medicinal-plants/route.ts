// routes.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const prisma = new PrismaClient();

type MedicinalPlantUpdateInput = Partial<{
  name: string;
  profile: string;
  medicinal_properties: string;
  side_effects: string;
  recipes: string;
  status: string;
  image_url: string;
}>;


// Configure multer for file uploads

export async function GET(req: Request) {
  try {
    // Fetch all plants from the database
    const plants = await prisma.medicinal_plants.findMany();

    // Generate signed URLs for each plant's image
    const plantsWithSignedUrls = plants.map((plant) => ({
      ...plant,
      image_url: plant.image_url
        ? s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: plant.image_url.split("/").slice(-2).join("/"), // Extract the object key from the full URL
            Expires: 60 * 60, // URL valid for 1 hour
          })
        : null, // 41
    }));

    return NextResponse.json(plantsWithSignedUrls, { status: 200 });
  } catch (error) {
    console.error("Error fetching plants:", error);
    return NextResponse.json(
      { error: "Failed to fetch plants" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const profile = formData.get("profile") as string; // description or profile
    const medicinal_properties = formData.get("medicinal_properties") as string;
    const side_effects = formData.get("side_effects") as string;
    const recipes = formData.get("recipes") as string;
    const status = formData.get("status") as string;
    const file = formData.get("file") as File;

    // Validate required fields
    if (
      !name ||
      !profile ||
      !medicinal_properties ||
      !side_effects ||
      !recipes ||
      !status ||
      !file
    ) {
      return NextResponse.json(
        { error: "All fields are required, including the file" },
        { status: 400 }
      );
    }
 
    // Convert the file into a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Define the key (path) where the file will be stored in S3
    const fileKey = `medicinal-plants/${Date.now()}-${file.name}`;

    // S3 upload parameters
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!, // The bucket name from your .env file
      Key: fileKey, // File path within the bucket
      Body: fileBuffer, // File content
      ContentType: file.type, // MIME type of the file
      // ACL: 'public-read', // Make the file publicly accessible
    };

    // Upload the file to S3
    const uploadResult = await s3.upload(s3Params).promise();
    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Expires: 60 * 60,
    });
    const newPlant = await prisma.medicinal_plants.create({
      data: {
        name,
        profile,
        medicinal_properties,
        side_effects,
        recipes,
        image_url: uploadResult.Location,
        status,
      },
    });

    return NextResponse.json(
      { ...newPlant, image_url: signedUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading content:", error);
    return NextResponse.json(
      { error: "Failed to upload content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const contentType = request.headers.get("Content-Type");
    const updateData: MedicinalPlantUpdateInput = {};
    let id: string | undefined = undefined;

    // Handle multipart/form-data
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData(); // Parse the FormData from the request
      const idValue = formData.get("id");
      id = typeof idValue === "string" ? idValue : undefined;

      const nameValue = formData.get("name");
      const profileValue = formData.get("profile");
      const medicinalPropertiesValue = formData.get("medicinal_properties");
      const sideEffectsValue = formData.get("side_effects");
      const recipesValue = formData.get("recipes");
      const statusValue = formData.get("status");
      const fileValue = formData.get("file"); // If a file is uploaded

      // Validate required fields
      if (!id) {
        return NextResponse.json(
          { error: "Invalid payload: 'id' is required" },
          { status: 400 }
        );
      }

      if (statusValue && typeof statusValue === "string") updateData.status = statusValue;
      if (nameValue && typeof nameValue === "string") updateData.name = nameValue;
      if (profileValue && typeof profileValue === "string") updateData.profile = profileValue;
      if (medicinalPropertiesValue && typeof medicinalPropertiesValue === "string")
        updateData.medicinal_properties = medicinalPropertiesValue;
      if (sideEffectsValue && typeof sideEffectsValue === "string")
        updateData.side_effects = sideEffectsValue;
      if (recipesValue && typeof recipesValue === "string") updateData.recipes = recipesValue;

      // Handle file upload (if necessary)
      if (fileValue && fileValue instanceof File) {
        const fileBuffer = Buffer.from(await fileValue.arrayBuffer());
        const fileKey = `medicinal_plants/${Date.now()}-${fileValue.name}`;

        const s3Params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: fileKey,
          Body: fileBuffer,
          ContentType: fileValue.type,
        };

        const uploadResult = await s3.upload(s3Params).promise();
        updateData.image_url = uploadResult.Location;
      }
    }
    // Handle application/json
    else if (contentType?.includes("application/json")) {
      const body = await request.json();
      id = body.id;

      const {
        status,
        name,
        profile,
        medicinal_properties,
        side_effects,
        recipes,
      } = body;

      if (!id) {
        return NextResponse.json(
          { error: "Invalid payload: 'id' is required" },
          { status: 400 }
        );
      }

      if (status) updateData.status = status;
      if (name) updateData.name = name;
      if (profile) updateData.profile = profile;
      if (medicinal_properties)
        updateData.medicinal_properties = medicinal_properties;
      if (side_effects) updateData.side_effects = side_effects;
      if (recipes) updateData.recipes = recipes;
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 415 }
      );
    }

    // Update the plant in the database
    const updatedPlant = await prisma.medicinal_plants.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedPlant, { status: 200 });
  } catch (error) {
    console.error("Error updating plant:", error);
    return NextResponse.json(
      { error: "Failed to update plant" },
      { status: 500 }
    );
  }
}




export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.medicinal_plants.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("Error deleting plant:", error);
    return NextResponse.json(
      { error: "Failed to delete plant" },
      { status: 500 }
    );
  }
}
