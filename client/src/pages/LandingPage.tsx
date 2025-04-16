import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const LandingPage: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative h-screen flex items-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1632937567821-5f059c2b9c24?q=80&w=1932&auto=format&fit=crop")',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/50 z-0"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-300 to-primary-500 text-transparent bg-clip-text">
              ClaimAssist
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Streamline your insurance claims after wildfire damage. Document lost items, 
              generate professional reports, and get your life back on track faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setLocation("/personal-info")} 
                size="lg"
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-6 text-lg"
              >
                <i className="ri-file-list-3-line mr-2"></i>
                Start My Claim
              </Button>
              <Button 
                onClick={() => setLocation("/about")} 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                <i className="ri-team-line mr-2"></i>
                About Our Team
              </Button>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="text-primary-400 text-3xl mb-3">
                <i className="ri-folder-shield-2-line"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Documentation</h3>
              <p className="text-gray-300">
                Easily document all your lost or damaged items with photos and detailed information.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="text-primary-400 text-3xl mb-3">
                <i className="ri-file-chart-line"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Insurance-Ready Reports</h3>
              <p className="text-gray-300">
                Generate professional PDF reports tailored for specific insurance companies.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="text-primary-400 text-3xl mb-3">
                <i className="ri-ai-generate"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Assistance</h3>
              <p className="text-gray-300">
                Get help finding replacement costs and identifying items with our AI assistant.
              </p>
            </div>
          </div>
        </div>

        {/* Arrow down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="ri-arrow-down-line text-white text-2xl"></i>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;