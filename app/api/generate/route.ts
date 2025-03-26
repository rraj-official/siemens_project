import { QrGenerateRequest, QrGenerateResponse } from '@/utils/service';
import { NextRequest } from 'next/server';
import { nanoid } from '@/utils/utils';

/**
 * Validates a request object.
 *
 * @param {QrGenerateRequest} request - The request object to be validated.
 * @throws {Error} Error message if URL or prompt is missing.
 */

const validateRequest = (request: QrGenerateRequest) => {
  if (!request.url) {
    throw new Error('URL is required');
  }
  if (!request.prompt) {
    throw new Error('Prompt is required');
  }
};

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as QrGenerateRequest;

  try {
    validateRequest(reqBody);
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 400 });
    }
  }

  const id = nanoid();

  // Create a mock response instead of making real API calls
  const response: QrGenerateResponse = {
    image_url: "https://placeholder.com/qr-placeholder.png",
    model_latency_ms: 1000,
    id: id,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
  });
}
