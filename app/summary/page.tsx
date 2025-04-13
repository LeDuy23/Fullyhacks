"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SummaryItem {
  id: number;
  room: string;
  description: string;
  cost: string;
  file?: File | null;
}

export default function SummaryPage() {
  const [items, setItems] = useState<SummaryItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<SummaryItem | null>(null);

  useEffect(() => {
    const mockItems: SummaryItem[] = [
      {
        id: 0,
        room: "kitchen",
        description: "Microwave",
        cost: "120",
        file: null,
      },
      {
        id: 1,
        room: "living-room",
        description: "TV",
        cost: "450",
        file: null,
      },
    ];
    setItems(mockItems);
  }, []);

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
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/lebron.png')" }}>
      <h1 className="text-2xl font-bold text-center mb-6">Summary of Your Items</h1>

      <div className="max-w-4xl mx-auto space-y-6 overflow-y-auto max-h-[80vh]">
        {items.map((item) => (
          <Card key={item.id} className="shadow-md relative">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start">
              {item.file && (
                <div className="w-full md:w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <Image
                    src={URL.createObjectURL(item.file)}
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
                  <Button className="mt-2 w-fit" onClick={handleSave}>Save</Button>
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
        ))}
      </div>
    
      <div className="flex flex-col items-center mt-10 gap-4">
  <p className="text-xl font-semibold animate-bounce text-blue-600">You're almost done!</p>
  <Button onClick={() => window.location.href = "/pdf"}>Generate report</Button>
</div>
    </div>
  );
}
