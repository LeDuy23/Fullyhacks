"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { db, ref, get } from "@/lib/firebaseConfig"; // Import Firebase functions

interface SummaryItem {
  id: string;  // Firebase ID is a string
  room: string;
  description: string;
  cost: string;
  file?: string | null; // Store file as a string (file name or URL)
}

export default function SummaryPage() {
  const [items, setItems] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<SummaryItem | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch data from Firebase (replace with your Firebase reference)
        const itemsRef = ref(db, "items");
        const snapshot = await get(itemsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const itemsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setItems(itemsArray);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []); // Runs once when the component is mounted

  const handleEdit = (item: SummaryItem) => {
    setEditingId(item.id);
    setEditedItem({ ...item });
  };

  const handleSave = () => {
    if (editedItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === editedItem.id ? editedItem : i))
      );
      setEditingId(null);
      setEditedItem(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/tuffy.png')" }}>

      {/* Floating Spaceship */}
  <img
    src="/lebron.png"
    alt="lebron"
    className="absolute w-40 animate-fly z-0 pointer-events-none"
    style={{ top: "20%", left: "-100px" }}
  />
      <h1 className="text-2xl font-bold text-center mb-6">Summary of Your Items</h1>

      <div className="max-w-4xl mx-auto space-y-6 overflow-y-auto max-h-[80vh]">
        {loading ? (
          <div className="text-center">Loading items...</div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="shadow-md relative">
              <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start">
                {item.file && (
                  <div className="w-full md:w-48 h-48 bg-gray-200 flex items-center justify-center">
                    {/* If file is a string (filename or URL), render the image */}
                    <Image
                      src={`/images/${item.file}`} // Assuming the file is stored in public/images folder
                      alt="Item"
                      width={192}
                      height={192}
                      className="object-cover rounded"
                    />
                  </div>
                )}

                {editingId === item.id ? (
                  <div className="flex flex-col space-y-2 w-full">
                    <Label>Room</Label>
                    <Input
                      value={editedItem?.room || ""}
                      onChange={(e) =>
                        setEditedItem((prev) => prev && { ...prev, room: e.target.value })
                      }
                    />
                    <Label>Description</Label>
                    <Textarea
                      value={editedItem?.description || ""}
                      onChange={(e) =>
                        setEditedItem((prev) => prev && { ...prev, description: e.target.value })
                      }
                    />
                    <Label>Cost ($)</Label>
                    <Input
                      type="number"
                      value={editedItem?.cost || ""}
                      onChange={(e) =>
                        setEditedItem((prev) => prev && { ...prev, cost: e.target.value })
                      }
                    />
                    <Button className="mt-2 w-fit" onClick={handleSave}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 w-full">
                    <div className="absolute top-2 right-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                    </div>
                    <p><strong>Room:</strong> {item.room}</p>
                    <p><strong>Item:</strong> {item.description}</p>
                    <p><strong>Cost:</strong> ${item.cost}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex flex-col items-center mt-10 gap-4">
        <p className="text-xl font-semibold animate-bounce text-blue-600">You're almost done!</p>
        <Button onClick={() => window.location.href = "/pdf"}>Generate report</Button>
      </div>
    </div>
  );
}
