// app/api/upload/route.js
import { NextResponse } from 'next/server';

import { uploadFileToTelegramAndDb } from '@/lib/services/fileService';
import connectionToDatabase from '@/lib/database/mongoose';


export async function POST(req) {
  try {
  
    await connectionToDatabase();

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const result = await uploadFileToTelegramAndDb(file);

    if (result.ok) {
      return NextResponse.json({ ok: true, id: result.id, url: result.url });
    } else {
      return NextResponse.json({ error: result.error, details: result.details }, { status: 500 });
    }

  } catch (error) {

    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}


export const runtime = 'nodejs';