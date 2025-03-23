import React, { useState, useEffect } from "react";
import { Briefcase, Calendar, DollarSign, AlertCircle } from "lucide-react";

// Self-contained data - no need to pass in any data
const projectsData = [
  {
    id: 1,
    title: "E-commerce Website",
    description: "Custom online store development with product catalog, payment integration, and admin dashboard.",
    deadline: "Apr 30, 2025",
    amount: "$2,800",
    milestones: [
      { 
        name: "UI Design", 
        complete: true, 
        position: 20,
        brief: "Design mockups for all pages including product listings, checkout, and admin views.",
        deadline: "Feb 15, 2025",
        feedback: "Excellent work, approved with minor color adjustments."
      },
      { 
        name: "Frontend", 
        complete: true, 
        position: 40,
        brief: "Build responsive UI with React components, implement cart functionality.",
        deadline: "Mar 10, 2025",
        feedback: "Great implementation, animations are smooth. Exceeded expectations."
      },
      { 
        name: "Backend", 
        complete: true, 
        position: 60,
        brief: "Set up API endpoints, database schema, and payment gateway integration.",
        deadline: "Apr 5, 2025",
        feedback: "API works well. Consider optimizing database queries in the future."
      },
      { 
        name: "Testing", 
        complete: false, 
        position: 80,
        brief: "Perform unit, integration, and user acceptance testing across all features.",
        deadline: "Apr 25, 2025",
        feedback: "In progress"
      }
    ],
    progress: 75
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Cross-platform mobile application with user authentication, notifications, and API integration.",
    deadline: "May 15, 2025",
    amount: "$3,500",
    milestones: [
      { 
        name: "Wireframes", 
        complete: true, 
        position: 15,
        brief: "Create low-fidelity wireframes for all screens and user flows.",
        deadline: "Feb 20, 2025",
        feedback: "Approved with suggestions for navigation improvements."
      },
      { 
        name: "UI Design", 
        complete: true, 
        position: 30,
        brief: "Design high-fidelity mockups with brand guidelines and component library.",
        deadline: "Mar 15, 2025",
        feedback: "Fantastic design work. Client extremely pleased with the visual direction."
      },
      { 
        name: "Core Features", 
        complete: false, 
        position: 50,
        brief: "Implement authentication, user profiles, and primary app functionality.",
        deadline: "Apr 10, 2025",
        feedback: "Awaiting review"
      },
      { 
        name: "API Integration", 
        complete: false, 
        position: 70,
        brief: "Connect to backend services, implement data caching and offline functionality.",
        deadline: "Apr 30, 2025",
        feedback: "Not started"
      },
      { 
        name: "Testing", 
        complete: false, 
        position: 90,
        brief: "Conduct cross-device testing, performance optimization, and user testing.",
        deadline: "May 10, 2025",
        feedback: "Not started"
      }
    ],
    progress: 40
  },
  {
    id: 3,
    title: "Corporate Website Redesign",
    description: "Complete overhaul of corporate website with focus on UX, performance, and conversion optimization.",
    deadline: "Apr 15, 2025",
    amount: "$4,200",
    milestones: [
      { 
        name: "UX Research", 
        complete: true, 
        position: 15,
        brief: "Conduct user interviews, analyze competitors, create user personas and journeys.",
        deadline: "Feb 5, 2025",
        feedback: "Comprehensive research that provided valuable insights for the design phase."
      },
      { 
        name: "Wireframing", 
        complete: true, 
        position: 30,
        brief: "Create low and high-fidelity wireframes for key pages and user flows.",
        deadline: "Feb 25, 2025",
        feedback: "Wireframes approved with minor adjustments to the navigation structure."
      },
      { 
        name: "Visual Design", 
        complete: true, 
        position: 45,
        brief: "Create brand-aligned visual design system and page layouts.",
        deadline: "Mar 15, 2025",
        feedback: "Design system is exceptional and perfectly aligns with brand guidelines."
      },
      { 
        name: "Frontend", 
        complete: false, 
        position: 65,
        brief: "Develop responsive frontend with focus on accessibility and performance.",
        deadline: "Apr 5, 2025",
        feedback: "In progress - looking great so far!"
      },
      { 
        name: "CMS Integration", 
        complete: false, 
        position: 85,
        brief: "Integrate with headless CMS and set up content workflows.",
        deadline: "Apr 10, 2025",
        feedback: "Not started"
      }
    ],
    progress: 58
  },
  {
    id: 4,
    title: "AI Content Generator",
    description: "Web application that leverages AI models to generate marketing content and social media posts.",
    deadline: "Jun 5, 2025",
    amount: "$6,200",
    milestones: [
      { 
        name: "Requirements", 
        complete: true, 
        position: 10,
        brief: "Document functional requirements, content types, and quality metrics.",
        deadline: "Mar 1, 2025",
        feedback: "Detailed requirements that clearly outline all necessary features."
      },
      { 
        name: "UI Design", 
        complete: true, 
        position: 30,
        brief: "Design intuitive interface for content configuration and generation.",
        deadline: "Mar 20, 2025",
        feedback: "Beautiful and easy-to-use interface design approved with no changes."
      },
      { 
        name: "AI Integration", 
        complete: false, 
        position: 50,
        brief: "Implement API connections to language models and content optimization.",
        deadline: "Apr 25, 2025",
        feedback: "Currently in development - integration with main API complete."
      },
      { 
        name: "Content Rules", 
        complete: false, 
        position: 70,
        brief: "Develop brand voice rules and content filtering mechanisms.",
        deadline: "May 15, 2025",
        feedback: "Not started"
      },
      { 
        name: "Testing", 
        complete: false, 
        position: 90,
        brief: "Perform quality testing and content accuracy validation.",
        deadline: "Jun 1, 2025",
        feedback: "Not started"
      }
    ],
    progress: 34
  }
];

const ActiveProjects = () => {
  // Self-contained state management
  const [visible, setVisible] = useState(false);
  const [ripple, setRipple] = useState(false);
  
  // Component-specific index - now hardcoded since we don't need it to be dynamic
  const componentIndex = 0;
  
  // Handle ripple effect within the component
  const handleLocalRipple = () => {
    setRipple(true);
    setTimeout(() => {
      setRipple(false);
    }, 600);
  };
  
  // Set visibility after component mounts - simulating scroll animation
  useEffect(() => {
    // Short delay to allow for initial render
    const timer = setTimeout(() => {
      setVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return ( 
    <div className="w-full  pb-[10rem] px-10 bg-[#1E293B] ">
      <div 
        className={`p-6 bg-[#1E293B]   border-[#3EDBD3]/10 scroll-animate transition-all duration-700 ease-out hover:shadow-[0_10px_25px_-15px_rgba(74,123,247,0.5)] transform hover:-translate-y-2 transition-transform duration-300 ${
          visible ? 'opacity-100 translate-y-0 translate-x-0' : 'opacity-0 -translate-y-12'
        } w-full relative overflow-hidden`}
        onClick={handleLocalRipple}
      >
        {ripple && <div className="absolute inset-0 bg-[#4A7BF7]/5 animate-ripple rounded-lg"></div>}
        <div className="flex items-center mb-5">
          <div className="p-2  rounded-full bg-[#4A7BF7]/10 mr-3">
            <Briefcase className="text-[#4A7BF7]" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-[#F8FAFC] py-10">Active Projects</h2>
          <span className=" text-[#94A3B8] text-sm ml-20">&nbsp;&nbsp;&nbsp;{projectsData.length} ongoing projects</span>
        </div>
        
        {/* Grid of project cards - 1 column on small screens, 2 columns on medium+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsData.map((project, idx) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              idx={idx} 
              visible={visible}
            />
          ))}
        </div>
      </div>
      
      {/* Add the ripple animation style */}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 600ms ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const ProjectCard = ({ project, idx, visible }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div 
      className="bg-[#0F172A] p-4 rounded group hover:bg-[#0B1120] transition-colors duration-300 flex flex-col h-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 600ms ${400 + (idx * 150)}ms, transform 600ms ${400 + (idx * 150)}ms`
      }}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-[#F8FAFC] group-hover:text-[#3EDBD3] transition-colors duration-300">{project.title}</h3>
      
      {/* Description */}
      <p className="text-[#94A3B8] mt-2 line-clamp-2">{project.description}</p>
      
      {/* Deadline and Amount */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center text-[#94A3B8]">
          <Calendar size={16} className="mr-1 text-[#4A7BF7]" />
          <span>Deadline: <span className="text-[#F8FAFC]">{project.deadline}</span></span>
        </div>
        
        <div className="flex items-center text-[#F8FAFC]">
          <DollarSign size={16} className="mr-1 text-[#3EDBD3]" />
          <span className="font-semibold">{project.amount}</span>
        </div>
      </div>
      
      {/* Progress Bar with Milestones */}
      <div className="mt-4 mb-4 flex-1">
        <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        
        <div className="relative">
          {/* Base Progress Bar */}
          <div className="w-full bg-[#0B1120] h-4 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7] h-4 rounded-full transition-all duration-700 group-hover:from-[#4A7BF7] group-hover:to-[#3EDBD3]" 
              style={{ 
                width: visible ? `${project.progress}%` : '0%',
                transition: `width 1000ms ${500 + (idx * 150)}ms ease-out`
              }}
            ></div>
          </div>
          
          {/* Simple milestone markers (simplified for grid layout) */}
          <div className="flex justify-between mt-2">
            <span className="text-xs text-[#94A3B8]">
              {project.milestones.filter(m => m.complete).length} / {project.milestones.length} milestones
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              project.progress >= 70 
                ? 'bg-[#3EDBD3]/20 text-[#3EDBD3]' 
                : project.progress >= 30 
                  ? 'bg-[#4A7BF7]/20 text-[#4A7BF7]' 
                  : 'bg-[#FF6EC7]/20 text-[#FF6EC7]'
            }`}>
              {project.progress >= 70 ? 'On Track' : project.progress >= 30 ? 'In Progress' : 'Just Started'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Toggle for Milestone Details */}
      <div className="mt-2 text-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-1.5 rounded-md text-xs bg-[#0B1120] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-300 flex items-center justify-center w-full"
        >
          {expanded ? 'Hide Details' : 'Show Milestones'}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`ml-1 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
      
      {/* Collapsed Milestone View */}
      {expanded && (
        <div 
          className="mt-4 overflow-hidden transition-all duration-300"
          style={{
            maxHeight: expanded ? '1000px' : '0px',
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'translateY(0)' : 'translateY(-10px)'
          }}
        >
          <h4 className="text-sm font-semibold text-[#4A7BF7] pb-2 mb-2 border-b border-[#3EDBD3]/20">Milestones</h4>
          
          <div className="space-y-2">
            {project.milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`p-2 rounded ${
                  milestone.complete 
                    ? 'bg-[#3EDBD3]/10' 
                    : 'bg-[#FF6EC7]/10'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
                    milestone.complete ? 'bg-[#3EDBD3]' : 'bg-[#FF6EC7]'
                  }`}></div>
                  <div className="flex-1">
                    <h5 className={`text-xs font-semibold ${
                      milestone.complete ? 'text-[#3EDBD3]' : 'text-[#FF6EC7]'
                    }`}>{milestone.name}</h5>
                    <div className="flex flex-wrap items-center text-xs mt-1">
                      <Calendar size={10} className="mr-1 text-[#94A3B8]" />
                      <span className="text-[#94A3B8] mr-2">{milestone.deadline}</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                        milestone.complete 
                          ? 'bg-[#3EDBD3]/20 text-[#3EDBD3]' 
                          : 'bg-[#FF6EC7]/20 text-[#FF6EC7]'
                      }`}>
                        {milestone.complete ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="mt-4 flex justify-between">
        <button className="flex items-center px-3 py-2 rounded bg-gradient-to-r from-[#4A7BF7] to-[#3EDBD3] text-white hover:shadow-lg transition-all duration-300 hover:from-[#3EDBD3] hover:to-[#4A7BF7] text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Start Chat
        </button>
        
        <button className="flex items-center px-3 py-2 rounded border border-[#FF6EC7]/30 text-[#FF6EC7] hover:bg-[#FF6EC7]/10 transition-colors duration-300 text-sm">
          <AlertCircle size={14} className="mr-1.5" />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ActiveProjects;