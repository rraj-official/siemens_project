import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // Get the rotor number and image number from query params
    const { searchParams } = new URL(request.url);
    const rotorNumber = searchParams.get('rotorNumber');
    const imageNumber = searchParams.get('image');

    if (!rotorNumber || !imageNumber) {
      return NextResponse.json(
        { error: 'Missing rotorNumber or image parameter' },
        { status: 400 }
      );
    }

    // Get absolute path to the image file
    const filePath = path.join(process.cwd(), 'utils', 'rotorData', rotorNumber, `${rotorNumber}_${imageNumber}.png`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `Image file for rotor ${rotorNumber} (image ${imageNumber}) not found` },
        { status: 404 }
      );
    }
    
    // Read the file
    const imageBuffer = fs.readFileSync(filePath);
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error reading rotor image:', error);
    return NextResponse.json(
      { error: 'Failed to load rotor image' },
      { status: 500 }
    );
  }
} 