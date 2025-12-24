import connectionToDatabase from "@/lib/database/mongoose";
import Upload from "@/lib/models/Upload";
import { NextResponse } from "next/server";
import { generateCustomSlug, isAllowedUser } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session || !isAllowedUser(session.user?.email)) {
      return NextResponse.json({ error: "Access Denied: Email not authorized" }, { status: 403 });
    }

    await connectionToDatabase();
    const data = await req.json();
    
    const tempId = new mongoose.Types.ObjectId();
    const slug = generateCustomSlug(data.title, tempId);

    const newUpload = await Upload.create({
      ...data,
      _id: tempId,
      slug,
      uploaderEmail: session.user.email,
      isAdmin: true
    });

    return NextResponse.json(newUpload, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectionToDatabase();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const cat = searchParams.get("category");

  let query = {};
  if (cat && cat !== "All") query.category = cat;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } }
    ];
  }

  const data = await Upload.find(query).sort({ createdAt: -1 });
  return NextResponse.json(data);
}