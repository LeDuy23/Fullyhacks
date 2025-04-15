import React from "react";
import { Link, useLocation } from "wouter";
import { useClaimContext } from "@/context/ClaimContext";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [, setLocation] = useLocation();
  const { language, setLanguage } = useClaimContext();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleRecallDocuments = () => {
    alert("Recall documents feature will be implemented here");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="ri-shield-check-fill text-primary-600 text-2xl"></i>
            <Link href="/">
              <h1 className="text-xl font-semibold text-slate-800 cursor-pointer">
                InsureClaim
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-1">
              <button 
                className="px-3 py-1 text-sm rounded-md hover:bg-slate-100 text-slate-600"
                onClick={() => alert("Help section will be implemented here")}
              >
                Help
              </button>
              <button 
                className="px-3 py-1 text-sm rounded-md hover:bg-slate-100 text-slate-600"
                onClick={handleRecallDocuments}
              >
                Recall Documents
              </button>
            </div>
            <div className="relative">
              <select
                className="flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-slate-100 bg-transparent text-slate-700 border-none appearance-none pr-8 focus:outline-none focus:ring-0"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="EN">EN</option>
                <option value="ES">ES</option>
                <option value="FR">FR</option>
                <option value="DE">DE</option>
                <option value="ZH">ZH</option>
                <option value="JA">JA</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-1 top-1/2 transform -translate-y-1/2"></i>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <i className="ri-shield-check-fill text-primary-600"></i>
              <span className="text-sm text-slate-600">© 2023 InsureClaim</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-slate-600 hover:text-primary-600">Help</a>
              <a href="#" className="text-sm text-slate-600 hover:text-primary-600">Privacy</a>
              <a href="#" className="text-sm text-slate-600 hover:text-primary-600">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;
