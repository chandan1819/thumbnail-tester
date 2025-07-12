import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { Writable } from 'stream';
import sizeOf from 'image-size';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const formidablePromise = (req: Request): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    // We need to write the file to a temporary location to get its dimensions
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 1024 * 1024 * 5, // 5mb
    });

    form.parse(req as any, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

export async function POST(request: Request) {
  try {
    const { fields, files } = await formidablePromise(request);
    const file = files.file;

    if (!file || file.length === 0) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const singleFile = file[0];

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!singleFile.mimetype || !allowedTypes.includes(singleFile.mimetype)) {
      return NextResponse.json({ success: false, message: 'Invalid file type. Only JPG and PNG are allowed.' }, { status: 400 });
    }

    // Validate image dimensions
    try {
      const buffer = fs.readFileSync(singleFile.filepath);
      const dimensions = sizeOf(buffer);
      if (dimensions.width !== 1280 || dimensions.height !== 720) {
        return NextResponse.json({ success: false, message: 'Invalid image dimensions. Must be 1280x720.' }, { status: 400 });
      }
    } catch (dimError) {
      console.error('Dimension check error:', dimError);
      return NextResponse.json({ success: false, message: 'Could not check image dimensions.' }, { status: 500 });
    } finally {
        // Clean up the temporary file
        fs.unlinkSync(singleFile.filepath);
    }


    console.log('File uploaded:', singleFile.originalFilename);
    return NextResponse.json({ success: true, message: 'File parsed successfully' });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
} 