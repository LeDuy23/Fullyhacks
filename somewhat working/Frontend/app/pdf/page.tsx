"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { db, ref, get } from "@/lib/firebaseConfig"; // Import Firebase functions
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage"; // Firebase Storage

interface Item {
  id: string;
  room: string;
  description: string;
  cost: string;
  file?: string | null; // file could be a filename or URL
}

export default function PDFPage() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // Fetch data from Firebase
    const fetchItems = async () => {
      try {
        const snapshot = await get(ref(db, "items"));
        const data = snapshot.val();
        if (data) {
          const fetchedItems: Item[] = await Promise.all(
            Object.keys(data).map(async (key) => {
              const item = { id: key, ...data[key] };
              if (item.file) {
                // Get the download URL from Firebase Storage
                const storage = getStorage();
                const fileRef = storageRef(storage, `images/${item.file}`);
                const downloadURL = await getDownloadURL(fileRef);
                item.file = downloadURL;
              }
              return item;
            })
          );
          setItems(fetchedItems);
        }
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };

    fetchItems();
  }, []); // Runs once when the component is mounted

  const generatePDF = () => {
    if (!pdfRef.current) return;

    html2canvas(pdfRef.current, {
      backgroundColor: "#ffffff",
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("claim-summary.pdf");
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/cosmos.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div
        className="relative z-10 p-6 text-black"
        style={{ minHeight: "100vh" }}
      >
        <div
          ref={pdfRef}
          style={{
            backgroundColor: "#1e1b4b", // very dark indigo
            color: "#ffffff",
            padding: "24px",
            fontFamily: "Arial, sans-serif",
            maxWidth: "800px",
            margin: "0 auto",
            borderRadius: "12px",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            Claim Summary
          </h1>

          {items.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                padding: "1rem",
                marginBottom: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <p>
                <strong>Room:</strong> {item.room}
              </p>
              <p>
                <strong>Item:</strong> {item.description}
              </p>
              <p>
                <strong>Cost:</strong> {item.cost}
              </p>
              {item.file && (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    marginBottom: "1.5rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f3f3f3",
                  }}
                >
                  <img
                    src={item.file} // Display the Firebase image URL
                    alt={item.description}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={generatePDF}>Download PDF</Button>
          <Button variant="outline" onClick={() => window.location.href = "/"}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
