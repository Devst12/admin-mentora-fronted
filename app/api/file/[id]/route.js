// app/api/file/[id]/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

import File from '@/lib/modal/File'; // Adjust path
import connectionToDatabase from '@/lib/database/mongoose';

export async function GET(req, { params }) {
  try {
    await connectionToDatabase();

    const file = await File.findOne({ shortId: params.id });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // 1. Get the current CDN path from Telegram
    const getFileResponse = await axios.get(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getFile?file_id=${file.fileId}`
    );

    const filePath = getFileResponse.data.result?.file_path;

    // 2. Build the CDN URL
    const cdnUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${filePath}`;

    // 3. Forward the request to Telegram with Range support (for videos)
    const rangeHeader = req.headers.get('range');

    const response = await axios({
      method: 'GET',
      url: cdnUrl,
      responseType: 'stream',
      headers: rangeHeader ? { Range: rangeHeader } : {},
      validateStatus: (status) => status === 206 || status === 200,
    });

    // 4. Stream the response back to the user
    const contentLength = response.headers['content-length'];
    const contentType = response.headers['content-type'];
    const statusCode = response.status;

    const stream = new ReadableStream({
      start(controller) {
        response.data.on('data', (chunk) => {
          controller.enqueue(chunk);
        });
        response.data.on('end', () => {
          controller.close();
        });
        response.data.on('error', (err) => {
          controller.error(err);
        });
      },
    });

    return new NextResponse(stream, {
      status: statusCode,
      headers: {
        'Content-Type': contentType,
        'Content-Length': contentLength,
        'Accept-Ranges': 'bytes',
        'Content-Range': response.headers['content-range'] || '',
      },
    });

  } catch (error) {
    console.error('File Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve file' },
      { status: 500 }
    );
  }
}