import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const AboutPage: React.FC = () => {
  const [, setLocation] = useLocation();

  const teamMembers: TeamMember[] = [
    {
      name: "Duy Le",
      role: "Full Stack Developer",
      bio: "My name is Duy, I am a Junior in computer science and I am interested in AI and fintech, specifically in quantitative finance. In my free time I like to golf and gamble.",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      name: "Jacob Fishel",
      role: "Machine Learning Engineer",
      bio: "My name is Jacob, I am a Junior in computer science and I am interested in AI and machine learning, specifically computer vision. In my free time I'm either gaming or hanging out with my friends.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      name: "Philip Ma",
      role: "Backend Developer",
      bio: "My name is Philip Ma. I'm a 3rd year computer science student with an interest in Fintech. I love reading and working out in my free time too.",
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-16 bg-gradient-to-b from-primary-600 to-primary-800">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=1769&auto=format&fit=crop")' }}></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Our Team</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            ClaimAssist was developed for the Cal State Fullerton Hackathon by a team of passionate CS students.
          </p>
          <Button 
            onClick={() => setLocation("/")} 
            variant="outline" 
            className="mt-6 border-white text-white hover:bg-white/10"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Home
          </Button>
        </div>
      </div>

      {/* Team Members */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Meet Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{member.name}</h3>
                <p className="text-primary-600 mb-4">{member.role}</p>
                <p className="text-slate-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Description */}
      <div className="bg-slate-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Our Project</h2>
          
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-slate-800">ClaimAssist: Built for CSUF Hackathon</h3>
            <p className="text-slate-600 mb-6">
              ClaimAssist was developed during the Cal State Fullerton Hackathon as a solution to help 
              victims of wildfires document and process their insurance claims more efficiently. 
              The devastation caused by wildfires often leaves people with the overwhelming task of 
              documenting all their lost possessions for insurance purposes.
            </p>
            <p className="text-slate-600 mb-6">
              Our team recognized this challenge and built ClaimAssist to streamline the documentation process. 
              The application helps users catalog lost items, provides AI assistance for finding replacement costs, 
              offers currency conversion for international purchases, and generates professionally formatted 
              claim forms tailored to specific insurance companies.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">React</span>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">TypeScript</span>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">OpenAI</span>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">Node.js</span>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">Express</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary-700 text-white py-12 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start your claim?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Let us help you document your lost items and generate professional insurance claims.
          </p>
          <Button 
            onClick={() => setLocation("/personal-info")} 
            size="lg"
            className="bg-white text-primary-700 hover:bg-primary-50"
          >
            <i className="ri-file-list-3-line mr-2"></i>
            Start My Claim
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;