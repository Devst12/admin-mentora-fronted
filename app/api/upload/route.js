import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

export async function POST(req) {
  try {
    const { fileName, fileType, base64File } = await req.json();
    
    // THE FOLDER ID FROM YOUR SCREENSHOT
    const FOLDER_ID = '1wEKRYfM0VSsxqz6jvkkazezOq080keHI';

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const base64Data = base64File.split(',')[1];
    const bufferStream = new Readable();
    bufferStream.push(Buffer.from(base64Data, 'base64'));
    bufferStream.push(null);

    // CRITICAL: We must include the parents array in the requestBody
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileType,
        parents: [FOLDER_ID], 
      },
      media: {
        mimeType: fileType,
        body: bufferStream,
      },
      // These flags help bypass quota issues by ensuring it looks at the shared folder
      supportsAllDrives: true,
      keepRevisionForever: true,
      fields: 'id',
    });

    return NextResponse.json({ success: true, id: response.data.id });

  } catch (error) {
    // This will print the detailed error to your terminal
    console.error('CRITICAL ERROR:', error.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}