import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import CurrencySelector from "@/components/LanguageCurrencySelector";
import StepNavigator from "@/components/StepNavigator";

const Home: React.FC = () => {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/personal-info");
  };

  const handleRecallDocuments = () => {
    alert("Recall documents feature will be implemented here");
  };

  return (
    <>
      <StepNavigator />
      
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <i className="ri-shield-check-fill text-primary-600 text-5xl mb-4"></i>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Document Your Lost or Damaged Items</h2>
              <p className="text-slate-600">We'll help you create a detailed inventory for your insurance claim.</p>
            </div>

            <CurrencySelector />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="ri-information-line text-blue-500"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Why document your items?</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Proper documentation helps you:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Remember all your lost or damaged possessions</li>
                      <li>Provide proof with photos and receipts</li>
                      <li>Easily share information with your insurance company</li>
                      <li>Get fair compensation for your losses</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Button 
                onClick={handleGetStarted} 
                className="w-full md:w-auto"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRecallDocuments}
                className="w-full md:w-auto"
              >
                Recall Previous Documents
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
