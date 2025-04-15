import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImagesSelected: (base64Images: string[]) => void;
  initialImages?: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImagesSelected,
  initialImages = []
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    processFiles(Array.from(files));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    processFiles(Array.from(files));
  };

  const processFiles = (files: File[]) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
    const maxSize = 10 * 1024 * 1024; // 10 MB
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Unsupported File Type",
          description: `"${file.name}" is not a supported image type (JPG, PNG, HEIC).`,
          variant: "destructive"
        });
        return false;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `"${file.name}" exceeds the 10MB limit.`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const newImages = [...images, e.target.result.toString()];
          setImages(newImages);
          onImagesSelected(newImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    onImagesSelected(newImages);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-slate-700">Upload Photo or Receipt</label>
        <span className="text-xs text-slate-500">Optional</span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image} 
                alt={`Uploaded ${index + 1}`} 
                className="h-24 w-full object-cover rounded-md border border-slate-200"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <i className="ri-close-line text-xs"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      <div 
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
          isDragging ? 'border-primary-400 bg-primary-50' : 'border-slate-300 border-dashed'
        } rounded-md`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <i className="ri-upload-cloud-2-line text-3xl text-slate-400"></i>
          <div className="flex text-sm text-slate-600">
            <Button
              type="button"
              variant="link"
              className="relative bg-white font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              onClick={handleBrowseClick}
            >
              Upload a file
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/heic,image/heif"
                multiple
              />
            </Button>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-slate-500">
            PNG, JPG, HEIC up to 10MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
