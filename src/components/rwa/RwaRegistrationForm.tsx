'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, AlertCircle, UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB — matches the API route's limit

function fileField(label: string) {
  return z
    .custom<FileList>((val) => val instanceof FileList && val.length === 1, `${label} is required`)
    .refine((val) => (val as FileList)[0]?.size <= MAX_FILE_BYTES, `${label} must be under 8 MB`);
}

const schema = z.object({
  willingToRegister: z.enum(['yes', 'no'], { message: 'Please select yes or no' }),
  fullName: z.string().trim().min(2, 'Enter the full name'),
  relationName: z.string().trim().min(2, "Enter the father's / husband's name"),
  blockName: z.string().trim().min(1, 'Enter the block name'),
  plotNo: z.string().trim().min(1, 'Enter the plot number'),
  plotSizeSqYd: z
    .string()
    .trim()
    .min(1, 'Enter the plot size')
    .refine((v) => Number(v) > 0, 'Enter a valid plot size'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  registryCopy: fileField('Registry copy'),
  panCard: fileField('PAN card'),
  aadhaar: fileField('Aadhaar card'),
  photo: fileField('Passport size photo'),
});

type FormData = z.infer<typeof schema>;

const FILE_FIELDS: { name: keyof FormData; label: string; accept: string }[] = [
  { name: 'registryCopy', label: 'Registry Copy', accept: 'image/*,.pdf' },
  { name: 'panCard', label: 'PAN Card', accept: 'image/*,.pdf' },
  { name: 'aadhaar', label: 'Aadhaar Card', accept: 'image/*,.pdf' },
  { name: 'photo', label: 'Passport Size Photo', accept: 'image/*' },
];

export default function RwaRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    try {
      const fd = new FormData();
      fd.append('willingToRegister', data.willingToRegister);
      fd.append('fullName', data.fullName);
      fd.append('relationName', data.relationName);
      fd.append('blockName', data.blockName);
      fd.append('plotNo', data.plotNo);
      fd.append('plotSizeSqYd', data.plotSizeSqYd);
      fd.append('phone', data.phone);
      fd.append('registryCopy', data.registryCopy[0]);
      fd.append('panCard', data.panCard[0]);
      fd.append('aadhaar', data.aadhaar[0]);
      fd.append('photo', data.photo[0]);

      const res = await fetch('/api/public/submit-rwa-registration', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Submission failed');
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong. Please call or WhatsApp us directly.'
      );
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-12 text-center">
        <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-serif text-ink text-2xl mb-2">Registration Submitted!</h3>
        <p className="text-slate-600 font-inter">
          Thank you. Our team will verify your documents and get in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate encType="multipart/form-data" className="space-y-6">
      {submitError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <p className="text-red-700 text-xs font-inter">{submitError}</p>
        </div>
      )}

      {/* Willing to register */}
      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm font-inter font-medium text-text mb-1.5">
          Are you willing for the registration of RWA society?
        </legend>
        <div className="flex gap-3">
          {(['yes', 'no'] as const).map((value) => (
            <label
              key={value}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 h-14 rounded-input border font-inter text-[15px] capitalize cursor-pointer transition-colors',
                'has-[:checked]:border-gold has-[:checked]:bg-gold-soft has-[:checked]:text-ink',
                'border-border bg-surface text-text hover:border-gold/50'
              )}
            >
              <input type="radio" value={value} className="sr-only" {...register('willingToRegister')} />
              {value}
            </label>
          ))}
        </div>
        {errors.willingToRegister && (
          <p className="text-xs font-inter text-red-600">{errors.willingToRegister.message}</p>
        )}
      </fieldset>

      <Input
        id="rwa-fullName"
        label="Full Name"
        type="text"
        placeholder="Full name"
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <Input
        id="rwa-relationName"
        label="S/o / W/o"
        type="text"
        placeholder="Father's or husband's name"
        error={errors.relationName?.message}
        {...register('relationName')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="rwa-blockName"
          label="Block Name"
          type="text"
          placeholder="e.g. Block A"
          error={errors.blockName?.message}
          {...register('blockName')}
        />
        <Input
          id="rwa-plotNo"
          label="Plot No."
          type="text"
          placeholder="e.g. 145"
          error={errors.plotNo?.message}
          {...register('plotNo')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="rwa-plotSize"
          label="Plot Size (square yards)"
          type="number"
          step="any"
          placeholder="e.g. 200"
          error={errors.plotSizeSqYd?.message}
          {...register('plotSizeSqYd')}
        />
        <Input
          id="rwa-phone"
          label="Contact Number"
          type="tel"
          placeholder="10-digit mobile number"
          maxLength={10}
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FILE_FIELDS.map(({ name, label, accept }) => (
          <Input
            key={name}
            id={`rwa-${name}`}
            label={label}
            type="file"
            accept={accept}
            error={errors[name]?.message as string | undefined}
            className="h-auto py-3 file:mr-3 file:rounded-lg file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 file:text-xs file:font-inter file:font-semibold file:text-ink hover:file:bg-gold/25"
            {...register(name)}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-ink font-inter font-bold py-3.5 px-6 rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        {isSubmitting ? (
          <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
        ) : (
          <UploadCloud className="w-4 h-4" />
        )}
        {isSubmitting ? 'Submitting…' : 'Submit Registration'}
      </button>
    </form>
  );
}
