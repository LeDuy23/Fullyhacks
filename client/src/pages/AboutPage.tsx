import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  icon: string;
}

const AboutPage: React.FC = () => {
  const [, setLocation] = useLocation();

  const teamMembers: TeamMember[] = [
    {
      name: "Duy Le",
      role: "CS Student",
      bio: "My name is Duy, I am a Junior in computer science and I am interested in AI and fintech, specifically in quantitative finance. In my free time I like to golf and gamble.",
      icon: "ri-user-3-line"
    },
    {
      name: "Jacob Fishel",
      role: "CS Student",
      bio: "My name is Jacob, I am a Junior in computer science and I am interested in AI and machine learning, specifically computer vision. In my free time I'm either gaming or hanging out with my friends.",
      icon: "ri-user-3-line"
    },
    {
      name: "Philip Ma",
      role: "CS Student",
      bio: "My name is Philip Ma. I'm a 3rd year computer science student with an interest in Fintech. I love reading and working out in my free time too.",
      icon: "ri-user-3-line"
    },
    {
      name: "Bryan Orozco",
      role: "CS Student",
      bio: "My name is Bryan, I am a sophomore studying Computer science and am interested in working with large scale data and game development.",
      icon: "ri-user-3-line"
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
            className="mt-6 bg-white text-primary-700 hover:bg-primary-50 font-bold shadow-lg"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Home
          </Button>
        </div>
      </div>

      {/* Team Members */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Meet Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 border-t-4 border-primary-500">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <i className={`${member.icon} text-4xl`}></i>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-slate-800 mb-2">{member.name}</h3>
              <p className="text-primary-600 text-center font-medium mb-4">{member.role}</p>
              <p className="text-slate-600 text-center">{member.bio}</p>
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
              claim documents in various formats to help organize inventory information in a clear, structured way.
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
      <div className="bg-primary-700 py-12 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to start your claim?</h2>
          <p className="text-white mb-8 max-w-2xl mx-auto">
            Let us help you document your lost items and generate professional insurance claims.
          </p>
          <Button 
            onClick={() => setLocation("/personal-info")} 
            size="lg"
            className="bg-white text-primary-700 hover:bg-primary-50 px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl border-2 border-white"
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