"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { db, ref, set } from "@/lib/firebaseConfig"; // Firebase import
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage import

interface Item {
  id: number;
  room: string;
  description: string;
  cost: string;
  file: File | null;
}

export default function FormPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([
    { id: 0, room: "", description: "", cost: "", file: null },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updated = [...items];
    if (e.target.files) updated[index].file = e.target.files[0];
    setItems(updated);
  };

  const handleFieldChange = (field: string, value: string, index: number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleNext = () => {
    pushDataToFirebase(); // Save data to Firebase
    router.push("/summary");
  };

  const handleBack = () => {
    const confirmBack = window.confirm(
      "Are you sure you want to go back? Progress will be lost."
    );
    if (confirmBack) router.back();
  };

  const addNewItem = () => {
    setItems([
      ...items,
      { id: items.length, room: "", description: "", cost: "", file: null },
    ]);
    setCurrentIndex(items.length);
  };

  const pushDataToFirebase = async () => {
    const itemsRef = ref(db, "items");
  
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let fileUrl = null;
  
      if (item.file) {
        const storage = getStorage();
        const storageItemRef = storageRef(storage, `items/${item.file.name}`);
        await uploadBytes(storageItemRef, item.file).then(async () => {
          fileUrl = await getDownloadURL(storageItemRef); // Fetch the file's URL after upload
        });
      }
  
      const newItemRef = ref(db, "items/" + i);
      set(newItemRef, {
        room: item.room,
        description: item.description,
        cost: item.cost,
        file: fileUrl, // Store the file URL in Firebase
      }).catch((error: unknown) => {
        console.error("Error saving data: ", error);
      });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-6 flex justify-center items-center relative overflow-hidden" style={{ backgroundImage: "url('/claim-page.jpg')" }}>
      {/* About Us Button */}
      <div className="absolute top-4 left-4 z-20">
        <Link href="/about">
          <Button variant="ghost" className="bg-black text-white border-white border hover:bg-white hover:text-black" onClick={(e) => {
            e.preventDefault();
            const confirmLeave = window.confirm("Are you sure you want to leave? Progress will be lost.");
            if (confirmLeave) router.push("/about");
          }}>
            About Us
          </Button>
        </Link>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <Button variant="outline" onClick={addNewItem}>
          <Plus className="w-5 h-5 mr-1" /> Add Item
        </Button>
      </div>

      <div className="relative w-full max-w-3xl overflow-hidden">
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {items.map((item, index) => (
            <Card key={index} className="min-w-full max-w-3xl p-6 shadow-xl space-y-6 shrink-0">
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Room</Label>
                  <Select value={item.room} onValueChange={(value) => handleFieldChange("room", value, index)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="living-room">Living Room</SelectItem>
                      <SelectItem value="bathroom">Bathroom</SelectItem>
                      <SelectItem value="bedroom">Bedroom</SelectItem>
                      <SelectItem value="backyard">Backyard</SelectItem>
                      <SelectItem value="garage">Garage</SelectItem>
                      <SelectItem value="laundry-room">Laundry Room</SelectItem>
                      <SelectItem value="basement">Basement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Item Description</Label>
                  <Textarea id="description" placeholder="e.g.,  48 inch lebron james human sized barbie doll " value={item.description} onChange={(e) => handleFieldChange("description", e.target.value, index)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost">Estimated Cost ($)</Label>
                    <Input id="cost" placeholder="400" type="number" min="0" value={item.cost} onChange={(e) => handleFieldChange("cost", e.target.value, index)} />
                  </div>
                  <div>
                    <Label htmlFor="receipt">Upload Photo/Receipt ( feature in progess! )</Label>
                    <Input id="receipt" type="file" onChange={(e) => handleFileChange(e, index)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Slide Arrows */}
      <div className="absolute inset-y-0 left-30 flex items-center z-30">
        <Button variant="ghost" size="icon" disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)}>
          <ArrowLeft className="w-600 h-600" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-30 flex items-center z-30">
        <Button variant="ghost" size="icon" disabled={currentIndex === items.length - 1} onClick={() => setCurrentIndex(currentIndex + 1)}>
          <ArrowRight className="w-600 h-600" />
        </Button>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button onClick={handleNext}>Next: Review Items</Button>
      </div>
    </div>
  );
}
