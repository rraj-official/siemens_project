'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import LoadingDots from '@/components/ui/loadingdots';
import { FormDropdown } from './ui/form-dropdown';
import Image from 'next/image';

// Create a simple schema for form structure
const formSchema = z.object({
  rotorReferenceNumber: z.string().optional(),
  setSize: z.string().optional(),
  closestRotor: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RotorData {
  headers: string[][];
  rows: string[][];
}

const Body = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [rotorMapping, setRotorMapping] = useState<number[][]>([]);
  const [closestRotorOptions, setClosestRotorOptions] = useState<string[]>([]);
  const [displayRotor, setDisplayRotor] = useState<string | null>(null);
  const [rotorData, setRotorData] = useState<RotorData | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Fetch rotor mapping data on component mount
  useEffect(() => {
    const fetchRotorMapping = async () => {
      try {
        const response = await fetch('/api/rotorMapping');
        const data = await response.json();
        setRotorMapping(data);
      } catch (err) {
        console.error('Error loading rotor mapping data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load rotor mapping data'));
      }
    };
    
    fetchRotorMapping();
  }, []);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rotorReferenceNumber: '',
      setSize: '',
      closestRotor: '',
    },
  });

  // Watch for changes in rotorReferenceNumber and setSize
  const selectedRotorRef = form.watch('rotorReferenceNumber');
  const selectedSetSize = form.watch('setSize');
  const selectedClosestRotor = form.watch('closestRotor');

  // Update closestRotor options when rotorReferenceNumber or setSize changes
  useEffect(() => {
    if (selectedRotorRef && selectedSetSize && rotorMapping.length > 0) {
      const rotorIndex = parseInt(selectedRotorRef) - 10000;
      const setSize = parseInt(selectedSetSize);
      
      if (rotorIndex >= 0 && rotorIndex < rotorMapping.length && setSize > 0) {
        // Get the first k values from the array at index rotorIndex
        const options = rotorMapping[rotorIndex]
          .slice(0, setSize)
          .map(rotor => rotor.toString());
        
        setClosestRotorOptions(options);
      }
    }
  }, [selectedRotorRef, selectedSetSize, rotorMapping]);

  // Function to parse CSV data
  const parseCSV = (csvText: string): RotorData => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers: string[][] = [];
    const rows: string[][] = [];

    // First two lines are headers
    headers.push(lines[0].split(','));
    headers.push(lines[1].split(','));

    // Rest are data rows
    for (let i = 2; i < lines.length; i++) {
      rows.push(lines[i].split(','));
    }

    return { headers, rows };
  };

  // Function to fetch and process rotor data
  const fetchRotorData = async (rotorNumber: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rotorData?rotorNumber=${rotorNumber}`);
      const data = await response.json();
      
      // Parse CSV data
      setRotorData(parseCSV(data.csvData));
      setDisplayRotor(rotorNumber);
      setShowResults(true);
    } catch (err) {
      console.error('Error loading rotor data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load rotor data'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle analyze button click
  const handleAnalyze = () => {
    if (selectedClosestRotor) {
      fetchRotorData(selectedClosestRotor);
    } else {
      setError(new Error('Please select a rotor from the dropdown'));
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4 sm:mb-8 mb-0">
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
                  options={["10000","10001", "10002", "10003", "10004", "10005", "10006", "10007", "10008", "10009"]}
                  placeholder="Rotor Reference Number"
                />
                <FormDropdown
                  form={form}
                  name="setSize"
                  label="Select Closest Set Size"
                  options={["1", "2", "3", "4", "5", "6", "7", "8", "9"]}
                  placeholder="Set Size"
                />
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    selectedRotorRef && selectedSetSize ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {selectedRotorRef && selectedSetSize && (
                    <FormDropdown
                      form={form}
                      name="closestRotor"
                      label="Select Rotor with closest speed"
                      options={closestRotorOptions}
                      placeholder="Rotor Speed"
                    />
                  )}
                </div>
                <Button
                  type="button"
                  disabled={isLoading}
                  className="inline-flex justify-center
                 max-w-[200px] mx-auto w-full bg-[#009999]"
                  onClick={handleAnalyze}
                >
                  {isLoading ? (
                    <LoadingDots color="white" />
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

            {/* Table */}
            {showResults && displayRotor && (
              <div className="mt-6 overflow-x-auto">
                <h2 className="text-xl font-bold mb-2">Balancing Data</h2>
                <table className="w-full border-collapse border border-gray-300">
                  {rotorData?.headers.map((header, idx) => (
                    <tr key={`header-${idx}`} className="bg-gray-100">
                      {header.map((cell, cellIdx) => (
                        <th key={`header-${idx}-${cellIdx}`} className="border border-gray-300 p-2 text-sm">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  ))}
                  {rotorData?.rows.map((row, idx) => (
                    <tr key={`row-${idx}`}>
                      {row.map((cell, cellIdx) => (
                        <td key={`cell-${idx}-${cellIdx}`} className="border border-gray-300 p-2 text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </table>
              </div>
            )}
          </Form>
        </div>
        <div className="col-span-1">
          {/* Two Graphs */}
          {showResults && displayRotor && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold">Rotor Analysis Graphs</h2>
              
              <div className="w-full flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Response Runs</p>
                  <div className="w-full h-96 relative border border-gray-300 rounded overflow-hidden">
                    <Image 
                      src={`/api/rotorImage?rotorNumber=${displayRotor}&image=1`}
                      alt={`Rotor ${displayRotor} Response Runs`}
                      fill
                      sizes="100vw"
                      priority
                      style={{ objectFit: 'contain' }}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Reference Runs & Final Runs</p>
                  <div className="w-full h-96 relative border border-gray-300 rounded overflow-hidden">
                    <Image 
                      src={`/api/rotorImage?rotorNumber=${displayRotor}&image=2`}
                      alt={`Rotor ${displayRotor} Reference Runs & Final Runs`}
                      fill
                      sizes="100vw"
                      priority
                      style={{ objectFit: 'contain' }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
