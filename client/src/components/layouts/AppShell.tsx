import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useClaimContext } from "@/context/ClaimContext";
import { useTranslationContext } from "@/context/TranslationContext";
import { languages } from "@/components/LanguageCurrencySelector";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [, setLocation] = useLocation();
  const { language, setLanguage } = useClaimContext();
  const { t } = useTranslationContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get the language name for display
  const currentLanguageName = languages.find(l => l.code === language)?.name || "English";
  
  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    setDropdownOpen(false);
    
    // Apply application-wide language change effect here
    // This could include reloading content, updating translations, etc.
    document.documentElement.lang = langCode.toLowerCase();
    
    // NOTE: In a real application, we would load language-specific content here
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
            
            {/* Enhanced Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-slate-100 text-slate-700 focus:outline-none"
              >
                <span className="hidden sm:inline">{currentLanguageName}</span>
                <span className="sm:hidden">{language}</span>
                <i className={`ri-arrow-${dropdownOpen ? 'up' : 'down'}-s-line ml-1`}></i>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 py-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-20">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${
                        language === lang.code ? 'bg-slate-50 text-primary-600 font-medium' : 'text-slate-700'
                      }`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
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
