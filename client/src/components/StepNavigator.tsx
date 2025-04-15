import React from "react";
import { useLocation } from "wouter";

interface Step {
  number: number;
  name: string;
  path: string;
}

const steps: Step[] = [
  { number: 1, name: "Welcome", path: "/" },
  { number: 2, name: "Personal Info", path: "/personal-info" },
  { number: 3, name: "Room Selection", path: "/room-selection" },
  { number: 4, name: "Item Details", path: "/item-details" },
  { number: 5, name: "Review Items", path: "/review" },
  { number: 6, name: "Choose Template", path: "/template-selection" },
];

const StepNavigator: React.FC = () => {
  const [location] = useLocation();
  
  // Determine current step based on the location
  const getCurrentStepIndex = (): number => {
    const currentStep = steps.findIndex(step => 
      location === step.path || (step.path !== "/" && location.startsWith(step.path))
    );
    return currentStep !== -1 ? currentStep : 0;
  };
  
  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="container mx-auto mt-6 px-4">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <ol className="grid grid-cols-1 md:grid-cols-6 gap-2 text-sm">
          {steps.map((step, index) => (
            <li key={step.number} className="flex items-center">
              <span 
                className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 ${
                  index < currentStepIndex 
                    ? "bg-green-600 text-white"
                    : index === currentStepIndex
                      ? "bg-primary-600 text-white"
                      : "bg-slate-200 text-slate-600"
                }`}
              >
                {index < currentStepIndex ? (
                  <i className="ri-check-line text-sm"></i>
                ) : (
                  step.number
                )}
              </span>
              <span 
                className={
                  index < currentStepIndex
                    ? "text-green-600"
                    : index === currentStepIndex
                      ? "text-primary-600 font-medium"
                      : "text-slate-600"
                }
              >
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default StepNavigator;
