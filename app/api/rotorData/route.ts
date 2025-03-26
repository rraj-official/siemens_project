import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // Get the rotor number from query params
    const { searchParams } = new URL(request.url);
    const rotorNumber = searchParams.get('rotorNumber');

    if (!rotorNumber) {
      return NextResponse.json(
        { error: 'Missing rotorNumber parameter' },
        { status: 400 }
      );
    }

    // Get absolute path to the CSV file
    const filePath = path.join(process.cwd(), 'utils', 'rotorData', rotorNumber, `${rotorNumber} - Sheet1.csv`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `CSV file for rotor ${rotorNumber} not found` },
        { status: 404 }
      );
    }
    
    // Read the file
    const csvData = fs.readFileSync(filePath, 'utf8');
    
    // Return the data
    return NextResponse.json({ csvData });
  } catch (error) {
    console.error('Error reading rotor data:', error);
    return NextResponse.json(
      { error: 'Failed to load rotor data' },
      { status: 500 }
    );
  }
} 