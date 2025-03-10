import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const prisma = new PrismaClient();

// Define the type for updates
type MarriageAndSexMattersUpdateInput = Partial<{
  title: string;
  content: string;
  image_url: string;
  status: string; // Draft or Published
  pricing: string; // Free or Subscription
}>;

// GET: Fetch all marriage and sex matters
export async function GET(request: Request) {
  try {
    const matters = await prisma.marriage_and_sex_matters.findMany();

    // Generate signed URLs for image access
    const mattersWithSignedUrls = matters.map((matter) => ({
      ...matter,
      image_url: matter.image_url
        ? s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: matter.image_url.split("/").slice(-2).join("/"),
            Expires: 60 * 60, // 1 hour expiry
          })
        : null,
    }));

    return NextResponse.json(mattersWithSignedUrls, { status: 200 });
  } catch (error) {
    console.error("Error fetching matters:", error);
    return NextResponse.json(
      { error: "Failed to fetch matters" },
      { status: 500 }
    );
  }
}

// POST: Create a new marriage and sex matter
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as string;
    const file = formData.get("file") as File;
    const pricing = formData.get("pricing") as string;

    // Validate required fields
    if (!title || !content || !status || !file || !pricing) {
      return NextResponse.json(
        { error: "All fields are required, including the file" },
        { status: 400 }
      );
    }

    // Process the file for S3
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `marriage-and-sex-matters/${Date.now()}-${file.name}`;

    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: file.type,
    };

    const uploadResult = await s3.upload(s3Params).promise();

    // Save to the database
    const newMatter = await prisma.marriage_and_sex_matters.create({
      data: {
        title,
        content,
        status,
        pricing,
        image_url: uploadResult.Location,
      },
    });

    return NextResponse.json(newMatter, { status: 200 });
  } catch (error) {
    console.error("Error creating matter:", error);
    return NextResponse.json(
      { error: "Failed to create matter" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing marriage and sex matter
export async function PUT(request: Request) {
  try {
    const contentType = request.headers.get("Content-Type");
    const updateData: MarriageAndSexMattersUpdateInput = {};
    let id: string | undefined = undefined;

    // Handle multipart/form-data
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      const idValue = formData.get("id");
      id = typeof idValue === "string" ? idValue : undefined;

      if (!id) {
        return NextResponse.json(
          { error: "'id' is required" },
          { status: 400 }
        );
      }

      const title = formData.get("title") as string | null;
      const content = formData.get("content") as string | null;
      const status = formData.get("status") as string | null;
      const pricing = formData.get("pricing") as string | null;

      const file = formData.get("file") as File | null;

      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (status) updateData.status = status;
      if (pricing) updateData.pricing = pricing;

      // Process file upload if provided
      if (file) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileKey = `marriage-and-sex-matters/${Date.now()}-${file.name}`;

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
      id = body.id;

      if (!id) {
        return NextResponse.json(
          { error: "'id' is required" },
          { status: 400 }
        );
      }

      const { title, content, status, pricing, image_url } = body;

      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (status) updateData.status = status;
      if (pricing) updateData.pricing = pricing; // Add pricing update
      if (image_url) updateData.image_url = image_url;
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 415 }
      );
    }

    // Update the record in the database
    const updatedMatter = await prisma.marriage_and_sex_matters.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedMatter, { status: 200 });
  } catch (error) {
    console.error("Error updating matter:", error);
    return NextResponse.json(
      { error: "Failed to update matter" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a marriage and sex matter
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "'id' is required" },
        { status: 400 }
      );
    }

    await prisma.marriage_and_sex_matters.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting matter:", error);
    return NextResponse.json(
      { error: "Failed to delete matter" },
      { status: 500 }
    );
  }
}
