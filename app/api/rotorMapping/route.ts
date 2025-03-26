import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get absolute path to the JSON file
    const filePath = path.join(process.cwd(), 'utils', 'rotorMapping.json');
    
    // Read the file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse JSON
    const data = JSON.parse(fileContents);
    
    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading rotor mapping data:', error);
    return NextResponse.json(
      { error: 'Failed to load rotor mapping data' },
      { status: 500 }
    );
  }
}