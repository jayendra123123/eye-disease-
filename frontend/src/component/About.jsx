import React from 'react';
import { Brain, Users, Target, Sparkles, Github, Linkedin, Mail, Award } from 'lucide-react';

export default function About() {
  // Team members data - Add your team information here
  const teamMembers = [
    {
      name: "Team Member 1",
      role: "ML Engineer",
      description: "Led the development of AI models and backend architecture",
      image: "jaswanth.jpg", // Replace with actual image URL
      github: "https://github.com/Jaswanth5996",
      linkedin: "https://www.linkedin.com/in/jaswanth-kanchipati/",
      email: "jaswanth@gmail.com"
    },
    {
      name: "Team Member 2",
      role: "ML Engineer",
      description: "Designed and implemented the user interface and user experience",
      image: "photomineee.jpg",
      github: "https://github.com/paardhulaveti",
      linkedin: "https://linkedin.com/in/paardhulaveti",
      email: "paardhavlaveti@gmail.com"
    },
    {
      name: "Team Member 3",
      role: "Frontend Developer",
      description: "Handled data preprocessing and model training optimization",
      image: "prpr.jpeg",
      github: "https://github.com/jayendra123123",
      linkedin: "https://www.linkedin.com/in/jayendra-malla-1a77b6256/",
      email: "jayendramalla26@gmail.com"
    },
    {
      name: "Team Member 3",
      role: "Frontend Developer",
      description: "Handled data preprocessing and model training optimization",
      image: "prpr.jpeg",
      github: "https://github.com/jayendra123123",
      linkedin: "https://www.linkedin.com/in/jayendra-malla-1a77b6256/",
      email: "jayendramalla26@gmail.com"
    }
    // Add more team members as needed
  ];

  const projectStats = [
    { icon: Brain, label: "AI Models", value: "2" },
    { icon: Target, label: "Diseases Detected", value: "4" },
    { icon: Award, label: "Accuracy", value: "90%+" },
    { icon: Sparkles, label: "Technologies", value: "10+" }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64 border-l-4 border-t-4 border-white opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-64 h-64 border-r-4 border-b-4 border-white opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6">
            <div className="p-6 border-4 border-white">
              <Brain className="w-20 h-20" />
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tight mb-4">ABOUT DEEPEYE</h1>
          <div className="w-32 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 tracking-widest">AI-POWERED EYE DISEASE DETECTION</p>
        </div>

        {/* Project Description */}
        <div className="border-4 border-white/20 p-10 mb-16 hover:border-white/50 transition-all duration-300 animate-fade-in">
          <h2 className="text-4xl font-black tracking-tight mb-8 flex items-center gap-4">
            <Target className="w-10 h-10" />
            THE PROJECT
          </h2>
          <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
            <p>
              <span className="text-white font-bold">DeepEye</span> is a cutting-edge medical imaging application that leverages 
              artificial intelligence to detect eye diseases from retinal images. Our system combines deep learning models with 
              a modern web interface to provide real-time disease classification and medical recommendations.
            </p>
            <p>
              Using state-of-the-art Convolutional Neural Networks (MobileNet and ResNet), DeepEye can identify four critical 
              eye conditions: <span className="text-white font-bold">Cataract</span>, <span className="text-white font-bold">Diabetic Retinopathy</span>, 
              <span className="text-white font-bold"> Glaucoma</span>, and <span className="text-white font-bold">Normal</span> eye conditions 
              with high accuracy and confidence scores.
            </p>
            <p>
              The full-stack application features a Python FastAPI backend powered by TensorFlow/Keras for machine learning inference, 
              and a responsive React frontend styled with Tailwind CSS for an intuitive user experience. Our ensemble prediction mode 
              combines multiple models to improve diagnostic accuracy.
            </p>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {projectStats.map((stat, index) => (
            <div 
              key={index}
              className="border-2 border-white/30 p-8 text-center hover:border-white hover:bg-white/5 transition-all duration-300 transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <stat.icon className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-black mb-2">{stat.value}</div>
              <div className="text-sm tracking-widest text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="border-4 border-white/20 p-10 animate-fade-in">
          <h2 className="text-4xl font-black tracking-tight mb-12 flex items-center gap-4">
            <Users className="w-10 h-10" />
            OUR TEAM
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="border-2 border-white/30 p-6 hover:border-white transition-all duration-300 transform hover:scale-105 group"
              >
                {/* Member Image */}
                <div className="mb-6 overflow-hidden border-2 border-white/50 group-hover:border-white transition-colors">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>

                {/* Member Info */}
                <h3 className="text-2xl font-black tracking-tight mb-2">{member.name}</h3>
                <div className="text-sm tracking-widest text-gray-500 mb-4 uppercase">{member.role}</div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{member.description}</p>

                {/* Social Links */}
                <div className="flex gap-4 pt-4 border-t border-white/20">
                  {member.github && (
                    <a 
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border-2 border-white/30 hover:bg-white hover:text-black transition-all duration-300"
                      title="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border-2 border-white/30 hover:bg-white hover:text-black transition-all duration-300"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.email && (
                    <a 
                      href={`mailto:${member.email}`}
                      className="p-2 border-2 border-white/30 hover:bg-white hover:text-black transition-all duration-300"
                      title="Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center text-xs tracking-widest text-gray-600 border-t border-white/10 pt-8">
          <p>⚠️ AI-ASSISTED MEDICAL TOOL • NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE</p>
          <p className="mt-2">© {new Date().getFullYear()} DEEPEYE • BUILT WITH AI & INNOVATION</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
