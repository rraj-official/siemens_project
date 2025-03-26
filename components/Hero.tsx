'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { QrCard } from '@/components/QrCard';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import LoadingDots from '@/components/ui/loadingdots';
import { PromptSuggestion } from '@/components/PromptSuggestion';
import { Toaster } from 'react-hot-toast';
import { FormDropdown } from './ui/form-dropdown';

const promptSuggestions = [
  'A city view with clouds',
  'A beautiful glacier',
  'A forest overlooking a mountain',
  'A saharan desert',
];

// Create a simple schema for form structure
const formSchema = z.object({
  rotorReferenceNumber: z.string().optional(),
  setSize: z.string().optional(),
  rotorSpeed: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Body = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState(null);
  const [submittedURL, setSubmittedURL] = useState<string | null>(null);

  // Initialize the form without implementation logic
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rotorReferenceNumber: '',
      setSize: '',
      rotorSpeed: '',
    },
  });

  return (
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4 sm:mb-28 mb-0">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mt-10">
        <div className="col-span-1">
          <h1 className="text-3xl font-bold mb-10">Rotor Data Analysis</h1>
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-4">
                <FormDropdown
                  form={form}
                  name="rotorReferenceNumber"
                  label="Select Rotor Reference Number"
                  options={["10001", "10002", "10003", "10004", "10005", "10006", "10007", "10008", "10009"]}
                  placeholder="Rotor Reference Number"
                />
                <FormDropdown
                  form={form}
                  name="setSize"
                  label="Select Closest Set Size"
                  options={["1", "2", "3", "4", "5", "6", "7", "8"]}
                  placeholder="Set Size"
                />
                <FormDropdown
                  form={form}
                  name="rotorSpeed"
                  label="Select Rotor with closest speed."
                  options={["1007", "1008", "1009"]}
                  placeholder="Rotor Speed"
                />
                <Button
                  type="button"
                  disabled={isLoading}
                  className="inline-flex justify-center
                 max-w-[200px] mx-auto w-full bg-[#009999]"
                >
                  {isLoading ? (
                    <LoadingDots color="white" />
                  ) : response ? (
                    'Analyze'
                  ) : (
                    'Analyze'
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </Form>
        </div>
        <div className="col-span-1">
          {submittedURL && (
            <>
              <h1 className="text-3xl font-bold sm:mb-5 mb-5 mt-5 sm:mt-0 sm:text-center text-left">
                Your QR Code
              </h1>
              <div>
                <div className="flex flex-col justify-center relative h-auto items-center">
                  {response ? (
                    <QrCard
                      imageURL=""
                      time="0.00"
                    />
                  ) : (
                    <div className="relative flex flex-col justify-center items-center gap-y-2 w-[510px] border border-gray-300 rounded shadow group p-2 mx-auto animate-pulse bg-gray-400 aspect-square max-w-full" />
                  )}
                </div>
                {response && (
                  <div className="flex justify-center gap-5 mt-4">
                    <Button
                      onClick={() => {}}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {}}
                    >
                      ✂️ Share
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Body;
