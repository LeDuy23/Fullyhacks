"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("usd");
  const [email, setEmail] = useState("");

  const isValidEmail = (email: string) =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleStart = () => {
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address to continue.");
      return;
    }
    router.push("/form");
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/starbackground.jpg')" }}>
      {/* Animated spaceship */}
      <img
        src="/spaceship.png"
        alt="Spaceship"
        className="absolute w-50 animate-fly z-0"
        style={{ top: "20%", left: "-100px" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* About Us Button */}
      <div className="absolute top-4 left-4 z-20">
        <Link href="/about">
          <Button className="bg-black text-white border-white border hover:bg-white hover:text-black">
            About Us
          </Button>
        </Link>
      </div>

      {/* Main Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md bg-blue-950 text-white rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center">Welcome to FireSafe Claim Assist</h1>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-black bg-white"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Select Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="text-white">
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Select Currency</label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="text-white">
                    <SelectValue placeholder="Choose currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="mxn">MXN (₱)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-white text-black font-bold hover:bg-gray-300"
                onClick={handleStart}
              >
                Start Claim
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}