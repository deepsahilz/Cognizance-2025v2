import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  DollarSign, 
  FileText, 
  Settings, 
  TrendingUp, 
  Briefcase, 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  Users,
  Star,
  CheckCircle,
  Clock,
  Search
} from "lucide-react";

// Sample data for spending trends
const spendingData = [
  { month: "Jan", spent: 2800 },
  { month: "Feb", spent: 3200 },
  { month: "Mar", spent: 2600 },
  { month: "Apr", spent: 4100 },
];

// Sample data for invoices
const invoices = [
  { id: "#INV-9876", freelancer: "Alex Morgan", status: "Paid", amount: "$1,200" },
  { id: "#INV-9877", freelancer: "Sara Wilson", status: "Pending", amount: "$850" },
  { id: "#INV-9878", freelancer: "Jason Lee", status: "Overdue", amount: "$1,500" },
];

// Sample data for ongoing projects
const projects = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    description: "Complete UI/UX overhaul and backend optimization for improved conversion rates.",
    deadline: "Apr 30, 2025",
    amount: "$2,800",
    freelancer: "Alex Morgan",
    freelancerImg: "/api/placeholder/100/100",
    progress: 75,
    status: "In Progress"
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Cross-platform mobile application with user authentication, notifications, and API integration.",
    deadline: "May 15, 2025",
    amount: "$3,500",
    freelancer: "Sara Wilson",
    freelancerImg: "/api/placeholder/100/100",
    progress: 40,
    status: "In Progress"
  }
];

// Sample data for freelancers
const freelancers = [
  {
    id: 1, 
    name: "Alex Morgan", 
    role: "Full Stack Developer",
    image: "/api/placeholder/100/100",
    rating: 4.9,
    projectsCompleted: 12,
    ongoingProjects: 1,
    hourlyRate: "$45",
    availability: "Part-time"
  },
  {
    id: 2, 
    name: "Sara Wilson", 
    role: "UI/UX Designer",
    image: "/api/placeholder/100/100",
    rating: 4.8,
    projectsCompleted: 8,
    ongoingProjects: 1,
    hourlyRate: "$38",
    availability: "Full-time"
  },
  {
    id: 3, 
    name: "Jason Lee", 
    role: "Mobile Developer",
    image: "/api/placeholder/100/100",
    rating: 4.7,
    projectsCompleted: 6,
    ongoingProjects: 0,
    hourlyRate: "$42",
    availability: "Available"
  }
];

const EmployerDashboard = () => {
  // Sample employer data
  const employer = {
    name: "Michael Stevens",
    email: "michael@companyname.com",
    role: "Product Manager",
    company: "TechInnovate Solutions",
    plan: "Business Pro",
    totalSpent: "$18,700",
    activeProjects: 2,
    completedProjects: 15
  };

  // Animation for cards
  const [visibleCards, setVisibleCards] = useState([]);
  
  // Refs for scroll animation
  const sectionRefs = useRef([]);
  const [visibleSections, setVisibleSections] = useState([]);
  
  useEffect(() => {
    // Simple animation to make cards appear sequentially
    const timer = setTimeout(() => {
      setVisibleCards(['profile']);
    }, 100);
    
    const timer2 = setTimeout(() => {
      setVisibleCards(prev => [...prev, 'spending']);
    }, 200);
    
    const timer3 = setTimeout(() => {
      setVisibleCards(prev => [...prev, 'invoices']);
    }, 300);
    
    const timer4 = setTimeout(() => {
      setVisibleCards(prev => [...prev, 'projects']);
    }, 400);
    
    const timer5 = setTimeout(() => {
      setVisibleCards(prev => [...prev, 'freelancers']);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);
  
  // Scroll animation
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => [...prev, entry.target.id]);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sectionRefs.current.forEach(section => {
      if (section) observer.observe(section);
    });
    
    return () => {
      sectionRefs.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 pt-6">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back, {employer.name}</h1>
          <p className="text-gray-400">Here's what's happening with your projects today.</p>
        </div>
        
        {/* Dashboard Content */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <div 
            ref={el => sectionRefs.current[0] = el}
            id="profile-section"
            className={`bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 transform transition-all duration-700 ${
              visibleSections.includes('profile-section') 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center text-4xl font-bold text-white">
                    {employer.name.charAt(0)}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center border-2 border-gray-800">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center justify-center md:justify-start">
                      {employer.name}
                      <span className="inline-flex ml-2 items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-400">
                        {employer.plan}
                      </span>
                    </h2>
                    <p className="text-gray-400 mb-1">{employer.role} at {employer.company}</p>
                    <p className="text-teal-400 text-sm flex items-center justify-center md:justify-start">
                      <CheckCircle className="h-3 w-3 mr-1" /> Verified Account
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start mt-3 md:mt-0 space-x-2">
                    <div className="flex flex-col items-center justify-center px-3 py-2 bg-gray-900 rounded-lg">
                      <span className="text-lg font-bold text-blue-400">{employer.totalSpent}</span>
                      <span className="text-xs text-gray-400">Total Spent</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-3 py-2 bg-gray-900 rounded-lg">
                      <span className="text-lg font-bold text-purple-400">{employer.activeProjects}</span>
                      <span className="text-xs text-gray-400">Active</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-3 py-2 bg-gray-900 rounded-lg">
                      <span className="text-lg font-bold text-teal-400">{employer.completedProjects}</span>
                      <span className="text-xs text-gray-400">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spending Summary */}
            <div 
              ref={el => sectionRefs.current[1] = el}
              id="spending-section"
              className={`bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 transition-all duration-700 ${
                visibleSections.includes('spending-section') 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-blue-500/10 mr-3">
                  <DollarSign className="text-blue-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Financial Overview</h3>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Spending</p>
                  <p className="text-2xl font-bold text-white">$3,175</p>
                </div>
                <div className="flex items-center bg-green-500/10 text-green-400 px-2 py-1 rounded">
                  <TrendingUp size={16} className="mr-1" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Monthly Trend</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100">
                      {/* Jan - Purple (22.0%, 79.2°) */}
                      <path 
                        d="M 50 50 L 50 0 A 50 50 0 0 1 99.2 57.4 Z" 
                        fill="#8B5CF6" 
                      />
                      {/* Feb - Blue (25.2%, 90.7°) */}
                      <path 
                        d="M 50 50 L 99.2 57.4 A 50 50 0 0 1 65.5 97.6 Z" 
                        fill="#3B82F6" 
                      />
                      {/* Mar - Teal (20.5%, 73.8°) */}
                      <path 
                        d="M 50 50 L 65.5 97.6 A 50 50 0 0 1 0 50 Z" 
                        fill="#14B8A6" 
                      />
                      {/* Apr - Green (32.3%, 116.3°) */}
                      <path 
                        d="M 50 50 L 0 50 A 50 50 0 0 1 50 0 Z" 
                        fill="#10B981" 
                      />
                      {/* Center circle */}
                      <circle cx="50" cy="50" r="25" fill="#1F2937" />
                    </svg>
                  </div>
                  
                  <div className="ml-8 space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-400">Jan - $2,800</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-400">Feb - $3,200</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-400">Mar - $2,600</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-400">Apr - $4,100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices */}
            <div 
              ref={el => sectionRefs.current[2] = el}
              id="invoices-section"
              className={`bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 transition-all duration-700 ${
                visibleSections.includes('invoices-section') 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-500/10 mr-3">
                    <CreditCard className="text-purple-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Recent Invoices</h3>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm">View All</button>
              </div>
              
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="bg-gray-900 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{invoice.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'Paid' ? 'bg-green-500/10 text-green-400' : 
                        invoice.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-400">{invoice.freelancer}</span>
                      <span className="text-white font-medium">{invoice.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Notifications Section */}
          <div 
            ref={el => sectionRefs.current[3] = el}
            id="notifications-section"
            className={`bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 transition-all duration-700 ${
              visibleSections.includes('notifications-section') 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-10 opacity-0'
            }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-500/10 mr-3">
                  <Bell className="text-red-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Recent Notifications</h3>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-sm">View All</button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-900 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Payment Received</span>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">Alex Morgan has completed payment for invoice #INV-9876.</p>
              </div>
              
              <div className="bg-gray-900 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 border-l-4 border-yellow-500">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Project Update</span>
                  <span className="text-xs text-gray-400">Yesterday</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">Sara Wilson submitted new designs for the Mobile App project.</p>
              </div>
              
              <div className="bg-gray-900 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 border-l-4 border-red-500">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Overdue Invoice</span>
                  <span className="text-xs text-gray-400">2 days ago</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">Invoice #INV-9878 for Jason Lee is now overdue.</p>
              </div>
            </div>
          </div>
          
          {/* Payments & Settings Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Methods */}
            <div 
              ref={el => sectionRefs.current[4] = el}
              id="payment-section" 
              className={`bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 transition-all duration-700 ${
                visibleSections.includes('payment-section') 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-500/10 mr-3">
                    <CreditCard className="text-green-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm">Add New</button>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-900 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-blue-500/10 mr-3">
                        <CreditCard className="text-blue-400" size={16} />
                      </div>
                      <div>
                        <p className="text-white font-medium">Visa ending in 4242</p>
                        <p className="text-gray-400 text-xs">Expires 09/26</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">Default</span>
                  </div>
                </div>
                
                <div className="bg-gray-900 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-purple-500/10 mr-3">
                        <CreditCard className="text-purple-400" size={16} />
                      </div>
                      <div>
                        <p className="text-white font-medium">Mastercard ending in 8888</p>
                        <p className="text-gray-400 text-xs">Expires 12/25</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-blue-400 text-xs">Set Default</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Settings */}
            <div 
              ref={el => sectionRefs.current[5] = el}
              id="settings-section"
              className={`bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 transition-all duration-700 ${
                visibleSections.includes('settings-section') 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}>
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-blue-500/10 mr-3">
                  <Settings className="text-blue-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Account Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <div>
                    <p className="text-white">Two-Factor Authentication</p>
                    <p className="text-gray-400 text-xs">Additional security for your account</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 mr-2">
                    <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                    <span className="absolute inset-0 rounded-full bg-green-500 transition-colors duration-300 cursor-pointer"></span>
                    <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 transform translate-x-6 cursor-pointer"></span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <div>
                    <p className="text-white">Email Notifications</p>
                    <p className="text-gray-400 text-xs">Get updates about project activity</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 mr-2">
                    <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                    <span className="absolute inset-0 rounded-full bg-green-500 transition-colors duration-300 cursor-pointer"></span>
                    <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 transform translate-x-6 cursor-pointer"></span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white">Automatic Payments</p>
                    <p className="text-gray-400 text-xs">Automatically pay invoices when due</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 mr-2">
                    <input type="checkbox" className="opacity-0 w-0 h-0" />
                    <span className="absolute inset-0 rounded-full bg-gray-600 transition-colors duration-300 cursor-pointer"></span>
                    <span className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 cursor-pointer"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Active Projects */}
          <div 
            ref={el => sectionRefs.current[6] = el}
            id="projects-section"
            className={`bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 transition-all duration-700 ${
              visibleSections.includes('projects-section') 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-teal-500/10 mr-3">
                  <Briefcase className="text-teal-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Active Projects</h3>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                <span>View All Projects</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-900 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-4 lg:mb-0">
                      <h4 className="text-lg font-medium text-white">{project.title}</h4>
                      <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                      
                      <div className="flex items-center mt-3 text-sm">
                        <div className="flex items-center text-gray-400 mr-4">
                          <Calendar size={14} className="mr-1 text-blue-400" />
                          <span>Due: {project.deadline}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-400">
                          <DollarSign size={14} className="mr-1 text-purple-400" />
                          <span>{project.amount}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start lg:items-end">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white mr-2">
                          {project.freelancer.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-300">{project.freelancer}</span>
                      </div>
                      
                      <div className="w-full lg:max-w-xs mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button className="px-3 py-1 bg-blue-500 rounded-md text-white text-sm hover:bg-blue-600 transition-colors duration-300">
                          Details
                        </button>
                        <button className="px-3 py-1 bg-gray-700 rounded-md text-white text-sm hover:bg-gray-600 transition-colors duration-300">
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Team & Freelancers */}
          <div 
            ref={el => sectionRefs.current[7] = el}
            id="freelancers-section"
            className={`bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 transition-all duration-700 ${
              visibleSections.includes('freelancers-section') 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-500/10 mr-3">
                  <Users className="text-blue-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Your Freelancer Team</h3>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-sm">Find More Freelancers</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {freelancers.map((freelancer) => (
                <div key={freelancer.id} className="bg-gray-900 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-xl font-bold text-white mb-3">
                    {freelancer.name.charAt(0)}
                  </div>
                  
                  <h4 className="text-white font-medium">{freelancer.name}</h4>
                  <p className="text-gray-400 text-sm">{freelancer.role}</p>
                  
                  <div className="flex items-center mt-2">
                    <Star size={14} className="text-yellow-400" />
                    <span className="ml-1 text-white">{freelancer.rating}</span>
                  </div>
                  
                  <div className="mt-4 w-full grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-gray-800 p-2 rounded">
                      <p className="text-gray-400">Projects</p>
                      <p className="text-white font-medium">{freelancer.projectsCompleted}</p>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <p className="text-gray-400">Hourly Rate</p>
                      <p className="text-white font-medium">{freelancer.hourlyRate}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 w-full">
                    <button className="w-full px-3 py-2 bg-blue-500 rounded-md text-white text-sm hover:bg-blue-600 transition-colors duration-300">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;