import React, { useState, useEffect } from "react";
import { Bell, DollarSign, FileText, Settings, TrendingUp, CreditCard, Calendar } from "lucide-react";
import ActiveProjects from "./ActiveProjects"; // Import the new component

const earningsData = [
  { month: "Jan", earnings: 1200 },
  { month: "Feb", earnings: 1500 },
  { month: "Mar", earnings: 1800 },
  { month: "Apr", earnings: 2100 },
];

const invoices = [
  { id: "#12345", client: "Acme Corp", status: "Paid", amount: "$500" },
  { id: "#12346", client: "Beta Ltd", status: "Pending", amount: "$750" },
  { id: "#12347", client: "Gamma Inc", status: "Overdue", amount: "$900" },
];

const projects = [
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
  }
];

const AnimatedDashboard = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleItems, setVisibleItems] = useState({});
  
  // Sample user data
  const user = {
    name: "Alex Morgan",
    email: "alex@example.com",
    role: "Full Stack Developer",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"]
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      checkVisibility();
    };

    const checkVisibility = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        // Improved trigger point - element is visible when it enters the viewport by 20%
        const triggerPoint = window.innerHeight * 0.8;
        const isVisible = rect.top < triggerPoint;
        
        if (isVisible) {
          // Use a staggered delay based on index
          setTimeout(() => {
            setVisibleItems(prev => ({ ...prev, [index]: true }));
          }, index * 150); // 150ms staggered delay for each element
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check with a slight delay to allow for initial render
    setTimeout(checkVisibility, 300);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced animation classes with different directions based on position
  const getAnimationClass = (index) => {
    if (!visibleItems[index]) {
      // Different entrance animations based on position
      if (index % 2 === 0) {
        return 'opacity-0 -translate-y-12'; // Slide up from bottom
      } else if (index % 3 === 0) {
        return 'opacity-0 translate-x-12'; // Slide in from right
      } else {
        return 'opacity-0 -translate-x-12'; // Slide in from left
      }
    }
    return 'opacity-100 translate-y-0 translate-x-0'; // Final visible state
  };

  // Add a ripple animation effect for clicked elements
  const [ripples, setRipples] = useState({});
  
  const handleRipple = (index) => {
    setRipples(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setRipples(prev => ({ ...prev, [index]: false }));
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-6xl mx-auto">
        {/* First section - Freelancer Profile */}
        <div className="mb-6">
          <div 
            className={`p-6 bg-[#1E293B] rounded-lg shadow-md border border-[#3EDBD3]/10 scroll-animate transition-all duration-700 ease-out ${getAnimationClass(0)} relative overflow-hidden`}
            onClick={() => handleRipple(0)}
          >
            {ripples[0] && <div className="absolute inset-0 bg-[#3EDBD3]/5 animate-ripple rounded-lg"></div>}
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Picture with Glowing Effect */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#3EDBD3]/30 shadow-lg relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3EDBD3]/20 to-[#4A7BF7]/20 animate-pulse"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="Alex Morgan" 
                    className="w-full h-full object-cover relative z-10"
                  />
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7] rounded-full blur opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -right-1 bg-[#4A7BF7] w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0F172A] z-10">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              
              {/* Profile Information */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-[#F8FAFC] mb-1 flex items-center justify-center md:justify-start">
                      {user.name}
                      <span className="inline-flex ml-2 items-center px-2 py-0.5 rounded text-xs font-medium bg-[#3EDBD3]/10 text-[#3EDBD3]">
                        Pro
                      </span>
                    </h1>
                    <p className="text-[#94A3B8] mb-3">{user.role}</p>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start mt-2 md:mt-0 space-x-2">
                    <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#0F172A] rounded-lg">
                      <span className="text-lg font-bold text-[#3EDBD3]">98%</span>
                      <span className="text-xs text-[#94A3B8]">Success</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#0F172A] rounded-lg">
                      <span className="text-lg font-bold text-[#4A7BF7]">12</span>
                      <span className="text-xs text-[#94A3B8]">Projects</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-3 py-2 bg-[#0F172A] rounded-lg">
                      <span className="text-lg font-bold text-[#FF6EC7]">5</span>
                      <span className="text-xs text-[#94A3B8]">Years</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0F172A] p-4 rounded">
                    <h3 className="text-md font-semibold text-[#F8FAFC] mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#3EDBD3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Contact Info
                    </h3>
                    <p className="text-[#F8FAFC] flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {user.email}
                    </p>
                    <p className="text-[#F8FAFC] flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      (555) 123-4567
                    </p>
                  </div>
                  
                  <div className="bg-[#0F172A] p-4 rounded">
                    <h3 className="text-md font-semibold text-[#F8FAFC] mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#4A7BF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills?.map((skill, index) => (
                        <span 
                          key={index} 
                          className={`px-2 py-1 rounded-full text-xs ${
                            index % 3 === 0 ? 'bg-[#3EDBD3]/10 text-[#3EDBD3] border border-[#3EDBD3]/20' :
                            index % 3 === 1 ? 'bg-[#4A7BF7]/10 text-[#4A7BF7] border border-[#4A7BF7]/20' :
                            'bg-[#FF6EC7]/10 text-[#FF6EC7] border border-[#FF6EC7]/20'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button className="flex items-center px-3 py-2 rounded bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7] text-white hover:shadow-lg transition-all duration-300 hover:from-[#4A7BF7] hover:to-[#3EDBD3]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second section - Earnings and Invoices side by side */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
          {/* Earnings Summary */}
          <div 
            className={`p-4 bg-[#1E293B] rounded-lg shadow-md border border-[#3EDBD3]/10 scroll-animate transition-all duration-700 ease-out hover:shadow-[0_10px_25px_-15px_rgba(62,219,211,0.5)] transform hover:-translate-y-2 transition-transform duration-300 ${getAnimationClass(1)} w-full md:w-1/2 max-w-md relative overflow-hidden`}
            onClick={() => handleRipple(1)}
          >
            {ripples[1] && <div className="absolute inset-0 bg-[#3EDBD3]/5 animate-ripple rounded-lg"></div>}
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-[#3EDBD3]/10 mr-3">
                <DollarSign className="text-[#3EDBD3]" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-[#F8FAFC]">Earnings Summary</h2>
            </div>
            <p className="text-2xl font-bold text-[#3EDBD3]">$5,600</p>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-[#94A3B8]">Monthly Average</p>
                <p className="text-[#F8FAFC]">$1,400</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[#94A3B8]">Growth</p>
                <div className="flex items-center">
                  <TrendingUp className="text-[#3EDBD3] w-4 h-4 mr-1" />
                  <p className="text-[#3EDBD3]">+15%</p>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-1 h-16 items-end">
              {earningsData.map((item, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div 
                    className="w-8 bg-gradient-to-t from-[#3EDBD3] to-[#4A7BF7] rounded-t-sm transition-all duration-300 group-hover:from-[#4A7BF7] group-hover:to-[#FF6EC7]" 
                    style={{ 
                      height: `${(item.earnings / 2100) * 60}px`,
                      opacity: visibleItems[1] ? (0.7 + (index * 0.1)) : 0,
                      transform: visibleItems[1] ? 'scaleY(1)' : 'scaleY(0)',
                      transformOrigin: 'bottom',
                      transition: `opacity 500ms ${index * 150}ms, transform 500ms ${index * 150}ms`
                    }}
                  ></div>
                  <p className="text-xs text-[#94A3B8] mt-1 group-hover:text-[#F8FAFC] transition-colors duration-300">{item.month}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Management */}
          <div 
            className={`p-4 bg-[#1E293B] rounded-lg shadow-md border border-[#3EDBD3]/10 scroll-animate transition-all duration-700 ease-out hover:shadow-[0_10px_25px_-15px_rgba(255,110,199,0.5)] transform hover:-translate-y-2 transition-transform duration-300 ${getAnimationClass(2)} w-full md:w-1/2 max-w-md relative overflow-hidden`}
            onClick={() => handleRipple(2)}
          >
            {ripples[2] && <div className="absolute inset-0 bg-[#FF6EC7]/5 animate-ripple rounded-lg"></div>}
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-[#FF6EC7]/10 mr-3">
                <CreditCard className="text-[#FF6EC7]" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-[#F8FAFC]">Invoices</h2>
            </div>
            <div className="space-y-3">
              {invoices.map((invoice, index) => (
                <div 
                  key={invoice.id} 
                  className="bg-[#0F172A] p-3 rounded group hover:bg-[#0B1120] transition-colors duration-300 transform hover:scale-102 hover:translate-x-1 transition-transform"
                  style={{
                    opacity: visibleItems[2] ? 1 : 0,
                    transform: visibleItems[2] ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `opacity 500ms ${300 + (index * 150)}ms, transform 500ms ${300 + (index * 150)}ms`
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[#F8FAFC] group-hover:text-[#F8FAFC] transition-colors duration-300">{invoice.id}</span>
                    <span className={`font-bold ${
                      invoice.status === 'Paid' ? 'text-[#3EDBD3]' : 
                      invoice.status === 'Pending' ? 'text-[#4A7BF7]' : 
                      'text-[#FF6EC7]'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8] text-sm mt-1">
                    <span className="group-hover:text-[#F8FAFC] transition-colors duration-300">{invoice.client}</span>
                    <span>{invoice.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Third section - Active Projects (moved to separate component) */}
        {/* <ActiveProjects 
          projects={projects} 
          visibleItems={visibleItems} 
          handleRipple={handleRipple} 
          ripples={ripples} 
        /> */}

        {/* Fourth section - Notifications and Settings side by side */}
        <div className="flex flex-col md:flex-row justify-center gap-6">
          {/* Notifications */}
          <div 
            className={`p-4 bg-[#1E293B] rounded-lg shadow-md border border-[#3EDBD3]/10 scroll-animate transition-all duration-700 ease-out hover:shadow-[0_10px_25px_-15px_rgba(255,110,199,0.5)] transform hover:-translate-y-2 transition-transform duration-300 ${getAnimationClass(4)} w-full md:w-1/2 max-w-md relative overflow-hidden`}
            onClick={() => handleRipple(4)}
          >
            {ripples[4] && <div className="absolute inset-0 bg-[#FF6EC7]/5 animate-ripple rounded-lg"></div>}
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-[#FF6EC7]/10 mr-3">
                <Bell className="text-[#FF6EC7]" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-[#F8FAFC]">Notifications</h2>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((item, index) => (
                <div 
                  key={index}
                  className="bg-[#0F172A] p-3 rounded group hover:bg-[#0B1120] transition-colors duration-300 transform hover:translate-x-1 transition-transform"
                  style={{
                    opacity: visibleItems[4] ? 1 : 0,
                    transform: visibleItems[4] ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `opacity 500ms ${300 + (index * 150)}ms, transform 500ms ${300 + (index * 150)}ms`
                  }}
                >
                  {index === 0 && (
                    <>
                      <p className="text-[#F8FAFC] group-hover:text-[#3EDBD3] transition-colors duration-300">New Payment Received</p>
                      <p className="text-[#94A3B8] text-sm">$500 - Acme Corp</p>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <p className="text-[#FF6EC7]">Invoice #12346 is overdue</p>
                      <p className="text-[#94A3B8] text-sm">Due 3 days ago</p>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <p className="text-[#F8FAFC] group-hover:text-[#3EDBD3] transition-colors duration-300">New project proposal</p>
                      <p className="text-[#94A3B8] text-sm">From Gamma Inc</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Settings & Payment Methods */}
          <div 
            className={`p-4 bg-[#1E293B] rounded-lg shadow-md border border-[#3EDBD3]/10 scroll-animate transition-all duration-700 ease-out hover:shadow-[0_10px_25px_-15px_rgba(74,123,247,0.5)] transform hover:-translate-y-2 transition-transform duration-300 ${getAnimationClass(5)} w-full md:w-1/2 max-w-md relative overflow-hidden`}
            onClick={() => handleRipple(5)}
          >
            {ripples[5] && <div className="absolute inset-0 bg-[#4A7BF7]/5 animate-ripple rounded-lg"></div>}
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-[#4A7BF7]/10 mr-3">
                <Settings className="text-[#4A7BF7]" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-[#F8FAFC]">Settings & Payments</h2>
            </div>
            <div className="bg-[#0F172A] p-3 rounded mb-3">
              <p className="text-[#F8FAFC] font-medium">Payment Methods</p>
              <div 
                className="flex items-center mt-3 group"
                style={{
                  opacity: visibleItems[5] ? 1 : 0,
                  transform: visibleItems[5] ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 500ms 300ms, transform 500ms 300ms`
                }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7] flex items-center justify-center mr-3 group-hover:from-[#4A7BF7] group-hover:to-[#3EDBD3] transition-all duration-300">
                  <span className="text-white font-medium">P</span>
                </div>
                <span className="text-[#94A3B8] group-hover:text-[#F8FAFC] transition-colors duration-300">PayPal</span>
              </div>
              <div 
                className="flex items-center mt-3 group"
                style={{
                  opacity: visibleItems[5] ? 1 : 0,
                  transform: visibleItems[5] ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 500ms 450ms, transform 500ms 450ms`
                }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4A7BF7] to-[#FF6EC7] flex items-center justify-center mr-3 group-hover:from-[#FF6EC7] group-hover:to-[#4A7BF7] transition-all duration-300">
                  <span className="text-white font-medium">S</span>
                </div>
                <span className="text-[#94A3B8] group-hover:text-[#F8FAFC] transition-colors duration-300">Stripe</span>
              </div>
            </div>
            <button 
              className="mt-3 bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7] text-white font-medium py-2 px-4 rounded hover:shadow-lg transition-all duration-300 hover:from-[#4A7BF7] hover:to-[#3EDBD3]"
              style={{
                opacity: visibleItems[5] ? 1 : 0,
                transform: visibleItems[5] ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 500ms 600ms, transform 500ms 600ms`
              }}
            >
              Manage
            </button>
          </div>
        </div>
      </div>
      
      {/* Add Ripple Animation CSS */}
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

export default AnimatedDashboard;