import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Image, FileText, Upload, Package, Receipt, User, X, FilePlus2, FileImage } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Define the validation schema
const documentationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  documentType: z.enum(["receipt", "photo", "warranty", "manual", "appraisal", "other"], {
    required_error: "Please select a document type",
  }),
  sourceType: z.enum(["email", "retailer", "photo_library", "manual_upload", "other"], {
    required_error: "Please select a source type",
  }),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
});

type DocumentationFormValues = z.infer<typeof documentationSchema>;

interface DocumentationUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
  userId: number;
  onSuccess?: () => void;
}

const DocumentationUploader: React.FC<DocumentationUploaderProps> = ({
  isOpen,
  onClose,
  itemId,
  userId,
  onSuccess,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Setup form with validation
  const form = useForm<DocumentationFormValues>({
    resolver: zodResolver(documentationSchema),
    defaultValues: {
      title: "",
      description: "",
      documentType: "receipt",
      sourceType: "manual_upload",
      sourceName: "",
      sourceUrl: "",
    },
  });

  // Mutation for uploading documentation
  const uploadDocumentationMutation = useMutation({
    mutationFn: async (data: {
      formData: DocumentationFormValues;
      files: File[];
    }) => {
      setUploading(true);
      
      // In a real implementation, this would:
      // 1. First upload the files to a storage service and get URLs
      // 2. Then create documentation records with those URLs
      
      // For this example, let's simulate file upload
      const uploadPromises = data.files.map(file => {
        return new Promise<string>((resolve) => {
          // Simulate upload delay
          setTimeout(() => {
            // In production, this would be a real URL from your storage service
            resolve(`https://storage.example.com/docs/${file.name}`);
          }, 1000);
        });
      });
      
      const fileUrls = await Promise.all(uploadPromises);
      
      // For each file, create a documentation record
      const createPromises = fileUrls.map((fileUrl, index) => {
        return apiRequest("POST", "/api/documentations", {
          itemId,
          userId,
          documentType: data.formData.documentType,
          sourceType: data.formData.sourceType,
          title: data.files.length > 1 
            ? `${data.formData.title} (${index + 1})` 
            : data.formData.title,
          description: data.formData.description,
          fileUrl,
          sourceName: data.formData.sourceName,
          sourceUrl: data.formData.sourceUrl,
          metadata: {
            originalFileName: data.files[index].name,
            fileSize: data.files[index].size,
            fileType: data.files[index].type,
            uploadDate: new Date().toISOString(),
          },
        });
      });
      
      await Promise.all(createPromises);
      return fileUrls.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["/api/items", itemId] });
      queryClient.invalidateQueries({ queryKey: ["/api/documentations", itemId] });
      
      toast({
        title: "Documentation added",
        description: `Successfully uploaded ${count} file${count !== 1 ? 's' : ''}.`,
      });
      
      resetForm();
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Create preview URLs for images
    const newPreviewUrls = files.map(file => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return "";
    });
    
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  // Handle removing a file
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Revoke object URL to avoid memory leaks
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = (formData: DocumentationFormValues) => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    uploadDocumentationMutation.mutate({ formData, files: selectedFiles });
  };

  // Reset the form and selected files
  const resetForm = () => {
    form.reset();
    setSelectedFiles([]);
    
    // Revoke all object URLs
    previewUrls.forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
    
    setPreviewUrls([]);
    setActiveTab("upload");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    if (!uploading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePlus2 className="h-5 w-5 text-blue-500" />
            Add Documentation
          </DialogTitle>
          <DialogDescription>
            Upload receipts, photos, or other documentation for this item.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-1.5">
              <FileImage className="h-4 w-4" />
              <span>Upload Files</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>Document Details</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="py-4">
            <div className="space-y-4">
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  selectedFiles.length > 0 ? 'border-slate-300 bg-slate-50' : 'border-slate-200'
                }`}
              >
                <div className="mx-auto flex flex-col items-center justify-center space-y-2">
                  <div className="bg-slate-100 rounded-full p-3 mb-2">
                    <Upload className="h-6 w-6 text-slate-500" />
                  </div>
                  <h3 className="text-slate-700 font-medium">Upload Documentation</h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    Drag and drop files here, or click to browse
                  </p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    Select Files
                  </Button>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-slate-50 p-2 border-b">
                    <Label className="text-sm font-medium">Selected Files ({selectedFiles.length})</Label>
                  </div>
                  <div className="p-2 max-h-[200px] overflow-y-auto">
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-2 bg-white rounded border"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {file.type.startsWith("image/") ? (
                              previewUrls[index] ? (
                                <div className="h-10 w-10 rounded overflow-hidden">
                                  <img 
                                    src={previewUrls[index]} 
                                    alt={file.name} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <Image className="h-5 w-5 text-green-500" />
                              )
                            ) : (
                              <FileText className="h-5 w-5 text-blue-500" />
                            )}
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-slate-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-red-500"
                            onClick={() => handleRemoveFile(index)}
                            disabled={uploading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 border-t flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("details")}
                      disabled={uploading}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Kitchen Appliance Receipt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="receipt">
                              <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-green-500" />
                                <span>Receipt</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="photo">
                              <div className="flex items-center gap-2">
                                <Image className="h-4 w-4 text-blue-500" />
                                <span>Photo</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="warranty">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-purple-500" />
                                <span>Warranty</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="manual">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-orange-500" />
                                <span>Manual</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="appraisal">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-red-500" />
                                <span>Appraisal</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="other">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-slate-500" />
                                <span>Other</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any additional details about this document" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4 p-4 bg-slate-50 rounded-md border">
                  <h3 className="text-sm font-medium flex items-center gap-1.5 text-slate-700">
                    <Package className="h-4 w-4 text-slate-500" />
                    <span>Source Information</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sourceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="retailer">Retailer Website</SelectItem>
                              <SelectItem value="photo_library">Photo Library</SelectItem>
                              <SelectItem value="manual_upload">Manual Upload</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Where this document came from
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sourceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source Name (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Amazon, Gmail, iCloud Photos" 
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Specific source of this document
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="sourceUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source URL (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/source" 
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Link to the original source (if available)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("upload")}
                    disabled={uploading}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={uploading || selectedFiles.length === 0}
                    className="flex items-center gap-1.5"
                  >
                    {uploading ? "Uploading..." : "Upload Documentation"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentationUploader;