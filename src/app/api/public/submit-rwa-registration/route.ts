// Public, unauthenticated endpoint backing the /rwa-registration-form page.
// Accepts multipart/form-data (four KYC file uploads + registration fields)
// and hands off to src/lib/server/rwaRegistrationIntake.ts.
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { intakeRwaRegistration, type RwaRegistrationFile } from '@/lib/server/rwaRegistrationIntake';
import type { RwaDocType } from '@/types';

const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number');

const fieldsSchema = z.object({
  willingToRegister: z.enum(['yes', 'no']),
  fullName: z.string().trim().min(2, 'Full name is required'),
  relationName: z.string().trim().min(2, "S/o or W/o name is required"),
  blockName: z.string().trim().min(1, 'Block name is required'),
  plotNo: z.string().trim().min(1, 'Plot number is required'),
  plotSizeSqYd: z.coerce.number().positive('Enter a valid plot size'),
  phone: phoneSchema,
});

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB per document
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

const REQUIRED_DOCS: { field: string; type: RwaDocType }[] = [
  { field: 'registryCopy', type: 'registry_copy' },
  { field: 'panCard', type: 'pan_card' },
  { field: 'aadhaar', type: 'aadhaar' },
  { field: 'photo', type: 'photo' },
];

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
  }

  const parsedFields = fieldsSchema.safeParse({
    willingToRegister: formData.get('willingToRegister'),
    fullName: formData.get('fullName'),
    relationName: formData.get('relationName'),
    blockName: formData.get('blockName'),
    plotNo: formData.get('plotNo'),
    plotSizeSqYd: formData.get('plotSizeSqYd'),
    phone: formData.get('phone'),
  });

  if (!parsedFields.success) {
    return NextResponse.json(
      { error: parsedFields.error.issues[0]?.message ?? 'Invalid submission' },
      { status: 400 }
    );
  }

  const files: RwaRegistrationFile[] = [];
  for (const { field, type } of REQUIRED_DOCS) {
    const entry = formData.get(field);
    if (!(entry instanceof File) || entry.size === 0) {
      return NextResponse.json({ error: `Please upload the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}` }, { status: 400 });
    }
    if (entry.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'Each file must be under 8 MB' }, { status: 400 });
    }
    if (!ACCEPTED_TYPES.has(entry.type)) {
      return NextResponse.json({ error: 'Files must be JPG, PNG, WEBP, or PDF' }, { status: 400 });
    }
    const buffer = Buffer.from(await entry.arrayBuffer());
    files.push({ type, buffer, contentType: entry.type, extension: EXTENSION_BY_TYPE[entry.type] });
  }

  try {
    const result = await intakeRwaRegistration({
      willingToRegister: parsedFields.data.willingToRegister === 'yes',
      fullName: parsedFields.data.fullName,
      relationName: parsedFields.data.relationName,
      blockName: parsedFields.data.blockName,
      plotNo: parsedFields.data.plotNo,
      plotSizeSqYd: parsedFields.data.plotSizeSqYd,
      phone: parsedFields.data.phone,
      files,
    });
    return NextResponse.json({ ok: true, id: result.id });
  } catch (err) {
    console.error('RWA registration intake failed:', err);
    const message = err instanceof Error ? err.message : 'Submission failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
