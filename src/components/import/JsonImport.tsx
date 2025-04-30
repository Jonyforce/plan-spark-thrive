
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { ProjectOrStudy } from '@/types/project';
import { useToast } from '@/components/ui/use-toast';
import { validateJsonSchema } from '@/utils/jsonValidator';

interface JsonImportProps {
  onImport: (data: ProjectOrStudy) => void;
}

export const JsonImport: React.FC<JsonImportProps> = ({ onImport }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [jsonPreview, setJsonPreview] = useState<ProjectOrStudy | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    setError(null);
    setJsonPreview(null);
  };

  const handleValidate = () => {
    try {
      setError(null);
      
      if (!jsonInput.trim()) {
        setError('Please enter JSON data');
        return;
      }
      
      const parsedJson = JSON.parse(jsonInput);
      const validationResult = validateJsonSchema(parsedJson);
      
      if (validationResult.valid) {
        setJsonPreview(parsedJson as ProjectOrStudy);
        toast({
          title: "JSON validated successfully",
          description: "Your JSON data is valid and ready to be imported",
        });
      } else {
        setError(validationResult.error || 'Invalid JSON structure');
      }
    } catch (e) {
      setError('Invalid JSON format. Please check your syntax.');
    }
  };

  const handleImport = () => {
    if (jsonPreview) {
      onImport(jsonPreview);
      toast({
        title: "Import successful",
        description: `Successfully imported ${jsonPreview.name}`,
      });
    }
  };

  const demoProjectJson = {
    id: "demo-project",
    name: "Website Redesign",
    description: "Complete redesign of company website",
    status: "in-progress",
    progress: 45,
    tags: ["design", "development", "high-priority"],
    type: "project",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    phases: [
      {
        id: "phase-1",
        name: "Research & Planning",
        status: "completed",
        progress: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        steps: []
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import JSON</CardTitle>
          <CardDescription>
            Paste your JSON structure to import a project or study plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Paste your JSON here..." 
            className="min-h-[300px] font-mono text-sm"
            value={jsonInput}
            onChange={handleInputChange}
          />
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          {jsonPreview && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Valid JSON</AlertTitle>
              <AlertDescription className="text-green-700">
                Ready to import: {jsonPreview.name} ({jsonPreview.type})
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setJsonInput(JSON.stringify(demoProjectJson, null, 2))}>
            Load Demo
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleValidate}>
              Validate
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!jsonPreview}
              className="bg-brand-500 hover:bg-brand-600"
            >
              <Upload className="mr-2 h-4 w-4" /> Import
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
