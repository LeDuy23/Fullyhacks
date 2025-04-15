import React, { useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Image, ShoppingBag, Copy, FileText, CreditCard, Home } from "lucide-react";

interface DocumentationSourceProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const DocumentationSource: React.FC<DocumentationSourceProps> = ({ 
  title, 
  description, 
  icon, 
  children 
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

interface RetailerLink {
  name: string;
  url: string;
  instructions: string;
}

const DocumentationHelper: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>("item-1");
  
  const handleAccordionChange = (value: string) => {
    setExpandedSection(value === expandedSection ? null : value);
  };

  const retailerLinks: RetailerLink[] = [
    {
      name: "Amazon",
      url: "https://www.amazon.com/gp/your-account/order-history",
      instructions: "Go to Your Orders > Download Order Reports to export purchases"
    },
    {
      name: "Walmart",
      url: "https://www.walmart.com/account/wmpurchasehistory",
      instructions: "Sign in > Purchase History > Select year > View order details"
    },
    {
      name: "Best Buy",
      url: "https://www.bestbuy.com/site/my-best-buy/order-history/",
      instructions: "Sign in > Purchase History > View receipts and download as PDFs"
    },
    {
      name: "Target",
      url: "https://www.target.com/circle/dashboard/history/all",
      instructions: "Sign in > Purchase History > View purchase details"
    },
    {
      name: "Home Depot",
      url: "https://www.homedepot.com/mycart/home",
      instructions: "Sign in > Purchase History > View receipts and export to PDF"
    },
    {
      name: "Lowe's",
      url: "https://www.lowes.com/mylowes/orders",
      instructions: "Sign in > Order History > Download receipts"
    },
    {
      name: "eBay",
      url: "https://www.ebay.com/myb/PurchaseHistory",
      instructions: "Go to Purchase History > View order details"
    }
  ];

  const emailSearchTerms = [
    "receipt", "order confirmation", "purchase", "invoice", 
    "warranty", "insurance", "home improvement", "renovation",
    "delivery confirmation", "shipping confirmation", "payment received"
  ];

  const photoSearchTerms = [
    "home", "living room", "bedroom", "kitchen", "bathroom", 
    "appliance", "furniture", "electronics", "renovation", 
    "home decor", "office", "desk", "garage", "tools"
  ];

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Find & Upload Existing Documentation</h2>
      <p className="text-slate-600 mb-4">
        Strengthen your claim by including existing documentation. Follow these steps to locate and upload
        receipts, photos, and other evidence of your possessions.
      </p>

      <Accordion 
        type="single" 
        collapsible 
        value={expandedSection || undefined}
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left font-medium">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-orange-500" />
              <span>Online Retailer Purchase History</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <DocumentationSource 
              title="Retailer Order History" 
              description="Many online retailers allow you to access your full purchase history."
              icon={<CreditCard className="h-5 w-5 text-slate-600" />}
            >
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Most major retailers keep records of your purchases that you can access online. 
                  Follow these links to find your purchase history:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {retailerLinks.map((retailer) => (
                    <div key={retailer.name} className="p-3 bg-white rounded border border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{retailer.name}</span>
                        <a 
                          href={retailer.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                        >
                          <span className="mr-1">Open</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-500">{retailer.instructions}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-orange-50 p-3 rounded-md border border-orange-200">
                  <p className="text-sm text-orange-700 flex items-start">
                    <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      After downloading your purchase history, you can upload the PDF receipts to the relevant items in your claim.
                    </span>
                  </p>
                </div>
              </div>
            </DocumentationSource>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left font-medium">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <span>Email Search Tips</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <DocumentationSource 
              title="Search Your Email" 
              description="Your email contains valuable records of purchases and warranties."
              icon={<Mail className="h-5 w-5 text-slate-600" />}
            >
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Emails often contain receipts, order confirmations, and warranty information.
                  Here's how to search effectively:
                </p>

                <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                  <h4 className="font-medium text-blue-700 mb-2">Search keywords to try:</h4>
                  <div className="flex flex-wrap gap-2">
                    {emailSearchTerms.map(term => (
                      <div key={term} className="bg-white px-2 py-1 rounded text-xs border border-blue-200 text-blue-700 flex items-center">
                        <span>{term}</span>
                        <button 
                          className="ml-1 text-blue-400 hover:text-blue-600"
                          title="Copy to clipboard"
                          onClick={() => navigator.clipboard.writeText(term)}
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Steps to follow:</h4>
                  <ol className="list-decimal ml-5 text-sm text-slate-600 space-y-1">
                    <li>Open your email app (Gmail, Outlook, etc.)</li>
                    <li>Use the search bar and try the keywords above</li>
                    <li>Look for confirmation emails from retailers</li>
                    <li>Download PDFs or take screenshots of relevant emails</li>
                    <li>Upload these to the appropriate items in your claim</li>
                  </ol>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => window.open("https://mail.google.com", "_blank")}>
                    Open Gmail <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => window.open("https://outlook.live.com", "_blank")}>
                    Open Outlook <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </DocumentationSource>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left font-medium">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-green-500" />
              <span>Photo Library Search</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <DocumentationSource 
              title="Search Your Photos" 
              description="Your photo library likely contains images of your belongings."
              icon={<Image className="h-5 w-5 text-slate-600" />}
            >
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Photos of your home and belongings provide valuable evidence for your claim. 
                  Modern photo apps have powerful search capabilities:
                </p>

                <div className="p-4 bg-green-50 rounded-md border border-green-100">
                  <h4 className="font-medium text-green-700 mb-2">Search terms to try in your photo app:</h4>
                  <div className="flex flex-wrap gap-2">
                    {photoSearchTerms.map(term => (
                      <div key={term} className="bg-white px-2 py-1 rounded text-xs border border-green-200 text-green-700 flex items-center">
                        <span>{term}</span>
                        <button 
                          className="ml-1 text-green-400 hover:text-green-600"
                          title="Copy to clipboard"
                          onClick={() => navigator.clipboard.writeText(term)}
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">How to find photos:</h4>
                  <ul className="list-disc ml-5 text-sm text-slate-600 space-y-1">
                    <li>Open your photo app (Google Photos, Apple Photos, etc.)</li>
                    <li>Use the search feature with the terms above</li>
                    <li>Look for photos of rooms in your home</li>
                    <li>Find pictures of valuable items</li>
                    <li>Check social media for additional photos you may have shared</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => window.open("https://photos.google.com", "_blank")}>
                    Open Google Photos <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => window.open("https://www.icloud.com/photos", "_blank")}>
                    Open iCloud Photos <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </DocumentationSource>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left font-medium">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-purple-500" />
              <span>Home Inventory Apps & Insurance Records</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <DocumentationSource 
              title="Additional Sources" 
              description="Check home inventory apps and insurance records you may already have."
              icon={<Home className="h-5 w-5 text-slate-600" />}
            >
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  You might have already documented your belongings in other places:
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <h4 className="font-medium text-sm mb-1">Check Your Insurance Company Website</h4>
                    <p className="text-xs text-slate-500">
                      If you previously filed claims or documented items with your insurance company, 
                      log in to your account on their website to access those records.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded border border-slate-200">
                    <h4 className="font-medium text-sm mb-1">Home Inventory Apps</h4>
                    <p className="text-xs text-slate-500">
                      If you've used apps like Sortly, Encircle, or Allstate Digital Locker, 
                      check those for existing inventory records.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded border border-slate-200">
                    <h4 className="font-medium text-sm mb-1">Cloud Storage Services</h4>
                    <p className="text-xs text-slate-500">
                      Check Google Drive, Dropbox, or other cloud storage for documents, 
                      spreadsheets, or folders related to home inventory.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded border border-slate-200">
                    <h4 className="font-medium text-sm mb-1">Previous Insurance Claims</h4>
                    <p className="text-xs text-slate-500">
                      If you've filed previous claims, you may have documentation from those 
                      that could be relevant to your current situation.
                    </p>
                  </div>
                </div>
              </div>
            </DocumentationSource>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 bg-slate-100 p-4 rounded-md border border-slate-300">
        <h3 className="text-md font-semibold text-slate-800 mb-2">Upload Documents & Photos</h3>
        <p className="text-sm text-slate-600 mb-3">
          After collecting your documentation, attach them to the appropriate items in your claim:
        </p>
        <ol className="list-decimal ml-5 text-sm text-slate-600 space-y-1 mb-3">
          <li>Navigate to the item details page for each item</li>
          <li>Use the "Upload Documentation" button</li>
          <li>Select the files you've collected (receipts, photos, warranties)</li>
          <li>Add any relevant notes about the documentation</li>
        </ol>
        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> Our system will automatically recognize potential duplicates 
            between your uploaded receipts and photos. You'll be asked to confirm if they're the same item.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentationHelper;