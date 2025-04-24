"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { validateHandicapPermit } from "@/ai/flows/validate-handicap-permit";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<{ isValidPermit: boolean; reason?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileInputClick = () => {
    // Clear previous image when file input is clicked
    setImage(null);
    setImageUrl(null);
    setValidationResult(null)
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Failed to read image file.");
        setImage(null);
        setImageUrl(null);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const handleValidation = async () => {
    if (!imageUrl) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    
    try {
      const result = await validateHandicapPermit({ base64Image: imageUrl });
      setValidationResult(result);

      // If the permit is not valid, store the result in local storage
      if (!result.isValidPermit && result.reason) {
        const violation = {
            id: Date.now().toString(),
            photoUrl: imageUrl,
            isValidPermit: result.isValidPermit,
            reason: result.reason
        }
        const storedViolations = localStorage.getItem("violations");
        const currentViolations = storedViolations ? JSON.parse(storedViolations) : [];
        currentViolations.push(violation);
        localStorage.setItem("violations", JSON.stringify(currentViolations));
      }

      
    } catch (error) {


      console.error("Error during validation:", error);
      alert("Failed to validate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md space-y-4 p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Handicap Spotter</CardTitle>
          <CardDescription className="text-center">
            Upload an image to validate handicap parking permit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              onClick={handleFileInputClick}
            />
            
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="mt-4 w-full h-64 object-contain rounded-md shadow-md"
              />
              
            )}
          </div>
          <Button onClick={handleValidation} disabled={loading} className="w-full">
            {loading ? "Validating..." : "Validate Permit"}
          </Button>
          {validationResult && (
            <Alert variant={validationResult.isValidPermit ? "default" : "destructive"}>
              {validationResult.isValidPermit ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Valid Permit</AlertTitle>
                  <AlertDescription>The parking permit is valid.</AlertDescription>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Invalid Permit</AlertTitle>
                  <AlertDescription>{validationResult.reason || "The parking permit is invalid."}</AlertDescription>
                </>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

