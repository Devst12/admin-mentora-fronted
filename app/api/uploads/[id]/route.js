import connectionToDatabase from "@/lib/database/mongoose";
import Upload from "@/lib/models/Upload";
import { NextResponse } from "next/server";
import { generateCustomSlug, isAllowedUser } from "@/lib/utils";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

// --- THE EDIT API (PUT) ---
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession();
    
    // 1. Security: Check if user is logged in and allowed
    if (!session || !isAllowedUser(session.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectionToDatabase();
    const { id } = params; // This gets the ID from the URL
    const data = await req.json();

    // 2. Slug Logic: Re-generate the slug based on the new title
    const newSlug = generateCustomSlug(data.title, id);

    // 3. Database Update
    // FIXED: Changed 'data.desc' to 'data.description' and 'data.comments' to 'data.commentsEnabled'
    const updatedUpload = await Upload.findByIdAndUpdate(
      id,
      { 
        title: data.title,
        description: data.description, // Fixed
        tags: data.tags, 
        category: data.category,
        commentsEnabled: data.commentsEnabled, // Fixed
        slug: newSlug 
      },
      { new: true } 
    );

    if (!updatedUpload) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUpload);
  } catch (error) {
    console.error("EDIT API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- THE DELETE API (DELETE) ---
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session || !isAllowedUser(session.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectionToDatabase();
    const deleted = await Upload.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}