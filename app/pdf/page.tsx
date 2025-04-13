"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PDFPage() {
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePDF = () => {
    if (!pdfRef.current) return;

    html2canvas(pdfRef.current, {
      backgroundColor: "#ffffff",
      useCORS: true,
      scale: 2,
      ignoreElements: (el) => {
        const style = window.getComputedStyle(el);
        return style.backgroundColor.includes("oklch");
      },
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
            borderRadius: "12px"
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

          <div
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
              <strong>Room:</strong> Kitchen
            </p>
            <p>
              <strong>Item:</strong> Microwave
            </p>
            <p>
              <strong>Cost:</strong> $120
            </p>
          </div>

          <div
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
              <strong>Room:</strong> Living Room
            </p>
            <p>
              <strong>Item:</strong> TV
            </p>
            <p>
              <strong>Cost:</strong> $450
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={generatePDF}>Download PDF</Button>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

