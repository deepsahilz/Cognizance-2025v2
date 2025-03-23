import React, { useState, useEffect } from 'react';
// Note: You'll need to install framer-motion: npm install framer-motion
import { motion, AnimatePresence } from 'framer-motion';

const FindProjects = () => {
  // State for loading animation
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [projectType, setProjectType] = useState('all');
  const [experienceLevel, setExperienceLevel] = useState({
    entry: true,
    intermediate: true,
    expert: true
  });
  const [clientHistory, setClientHistory] = useState({
    noHires: false,
    fewHires: true,
    manyHires: true
  });
  const [budget, setBudget] = useState(5000);
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(5000);
  const [skills, setSkills] = useState({
    webDev: true,
    mobileDev: true,
    uiUx: false,
    contentWriting: false,
    digitalMarketing: false
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');

  // Mock project data
  const [projectsList, setProjectsList] = useState([
    {
      id: 1,
      title: "React Native Developer for Mobile App",
      postedAgo: "2 hours ago",
      price: "$2,500 - $5,000",
      timeline: "2-4 weeks",
      level: "Intermediate",
      priceType: "Fixed Price",
      description: "We are looking for a React Native developer to build a cross-platform mobile application for our fitness startup. The app will include user authentication, workout tracking, and social features. Experience with Redux and Firebase is required.",
      skills: ["React Native", "JavaScript", "Firebase", "Redux", "UI/UX"],
      clientCountry: "United States",
      clientRating: 4.9,
      saved: false
    },
    {
      id: 2,
      title: "WordPress Website Redesign",
      postedAgo: "5 hours ago",
      price: "$1,000 - $1,500",
      timeline: "1-2 weeks",
      level: "Entry Level",
      priceType: "Fixed Price",
      description: "We need a WordPress developer to redesign our existing company website. The site should be mobile-responsive and optimized for performance. You'll be working with our design team who will provide the mockups.",
      skills: ["WordPress", "PHP", "HTML/CSS", "JavaScript", "Responsive Design"],
      clientCountry: "Canada",
      clientRating: 4.2,
      saved: false
    },
    {
      id: 3,
      title: "Data Analysis and Visualization Expert",
      postedAgo: "1 day ago",
      price: "$50 - $65 / hr",
      timeline: "3+ months",
      level: "Expert",
      priceType: "Hourly Rate",
      description: "We're seeking a data analyst to help us analyze customer behavior data and create insightful dashboards. You should be proficient in Python, R, or similar tools and have experience with data visualization libraries. Knowledge of machine learning is a plus.",
      skills: ["Python", "R", "Data Visualization", "Tableau", "Machine Learning"],
      clientCountry: "Germany",
      clientRating: 5.0,
      saved: false
    },
    {
      id: 4,
      title: "Content Writer for Tech Blog",
      postedAgo: "2 days ago",
      price: "$25 - $35 / hr",
      timeline: "Ongoing",
      level: "Intermediate",
      priceType: "Hourly Rate",
      description: "We're looking for a content writer with knowledge of technology trends to create engaging blog posts for our B2B SaaS company. Topics will include AI, cloud computing, cybersecurity, and digital transformation. Must have excellent research skills.",
      skills: ["Content Writing", "SEO", "Technology", "Blog Writing", "Research"],
      clientCountry: "Australia",
      clientRating: 4.7,
      saved: false
    }
  ]);

  // Handler for saving a project
  const toggleSaveProject = (id) => {
    // In a real app, this would interact with your state management or API
    console.log(`Project ${id} save toggled`);
  };

  // State for active project animation
  const [activeProjectId, setActiveProjectId] = useState(null);

  // Handler for applying to a project
  const applyToProject = (id) => {
    // Set active project for animation
    setActiveProjectId(id);
    
    // Reset after animation
    setTimeout(() => {
      setActiveProjectId(null);
      // In a real app, this would navigate to application page or open modal
      console.log(`Applying to project ${id}`);
    }, 500);
  };

  // Handler for resetting filters
  const resetFilters = () => {
    setSearchTerm('');
    setProjectType('all');
    setExperienceLevel({
      entry: true,
      intermediate: true,
      expert: true
    });
    setClientHistory({
      noHires: false,
      fewHires: true,
      manyHires: true
    });
    setBudget(5000);
    setMinBudget(0);
    setMaxBudget(5000);
    setSkills({
      webDev: true,
      mobileDev: true,
      uiUx: false,
      contentWriting: false,
      digitalMarketing: false
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="bg-[#0F172A] min-h-screen text-[#F8FAFC]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-[#0B1120] flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: [0.8, 1.1, 1],
              }}
              transition={{ duration: 1, times: [0, 0.7, 1] }}
            >
              <div className="w-16 h-16 mb-4 relative">
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ borderRadius: "50%" }}
                />
                <div className="absolute inset-2 bg-[#0B1120] rounded-full"></div>
              </div>
              <motion.p 
                className="text-[#3EDBD3] font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading Projects...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <motion.aside 
            className="lg:w-72 bg-[#1E293B] rounded-lg shadow-md p-6 h-fit border border-[#3EDBD3]/20"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="relative mb-6">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">🔍</span>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-[#0B1120] border border-[#3EDBD3]/30 rounded-lg focus:outline-none focus:border-[#3EDBD3] text-[#F8FAFC]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Project Type</h3>
                <span className="text-sm cursor-pointer">▼</span>
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="project-type"
                    checked={projectType === 'all'}
                    onChange={() => setProjectType('all')}
                    className="mr-2"
                  />
                  <span>All projects</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="project-type"
                    checked={projectType === 'fixed'}
                    onChange={() => setProjectType('fixed')}
                    className="mr-2"
                  />
                  <span>Fixed price</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="project-type"
                    checked={projectType === 'hourly'}
                    onChange={() => setProjectType('hourly')}
                    className="mr-2"
                  />
                  <span>Hourly rate</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Experience Level</h3>
                <span className="text-sm cursor-pointer">▼</span>
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={experienceLevel.entry}
                    onChange={() => setExperienceLevel({...experienceLevel, entry: !experienceLevel.entry})}
                    className="mr-2"
                  />
                  <span>Entry Level</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={experienceLevel.intermediate}
                    onChange={() => setExperienceLevel({...experienceLevel, intermediate: !experienceLevel.intermediate})}
                    className="mr-2"
                  />
                  <span>Intermediate</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={experienceLevel.expert}
                    onChange={() => setExperienceLevel({...experienceLevel, expert: !experienceLevel.expert})}
                    className="mr-2"
                  />
                  <span>Expert</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Client History</h3>
                <span className="text-sm cursor-pointer">▼</span>
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={clientHistory.noHires}
                    onChange={() => setClientHistory({...clientHistory, noHires: !clientHistory.noHires})}
                    className="mr-2"
                  />
                  <span>No hires yet</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={clientHistory.fewHires}
                    onChange={() => setClientHistory({...clientHistory, fewHires: !clientHistory.fewHires})}
                    className="mr-2"
                  />
                  <span>1-9 hires</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={clientHistory.manyHires}
                    onChange={() => setClientHistory({...clientHistory, manyHires: !clientHistory.manyHires})}
                    className="mr-2"
                  />
                  <span>10+ hires</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Budget</h3>
                <span className="text-sm cursor-pointer">▼</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full mb-4"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minBudget}
                  onChange={(e) => setMinBudget(parseInt(e.target.value))}
                  className="w-full p-2 bg-[#0B1120] border border-[#3EDBD3]/30 rounded text-[#F8FAFC]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                  className="w-full p-2 bg-[#0B1120] border border-[#3EDBD3]/30 rounded text-[#F8FAFC]"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Skills</h3>
                <span className="text-sm cursor-pointer">▼</span>
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={skills.webDev}
                    onChange={() => setSkills({...skills, webDev: !skills.webDev})}
                    className="mr-2"
                  />
                  <span>Web Development</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={skills.mobileDev}
                    onChange={() => setSkills({...skills, mobileDev: !skills.mobileDev})}
                    className="mr-2"
                  />
                  <span>Mobile App Development</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={skills.uiUx}
                    onChange={() => setSkills({...skills, uiUx: !skills.uiUx})}
                    className="mr-2"
                  />
                  <span>UI/UX Design</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={skills.contentWriting}
                    onChange={() => setSkills({...skills, contentWriting: !skills.contentWriting})}
                    className="mr-2"
                  />
                  <span>Content Writing</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={skills.digitalMarketing}
                    onChange={() => setSkills({...skills, digitalMarketing: !skills.digitalMarketing})}
                    className="mr-2"
                  />
                  <span>Digital Marketing</span>
                </label>
              </div>
            </div>

            <motion.button
              className="w-full bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7] text-[#0F172A] py-2 rounded font-medium hover:opacity-90 transition-opacity"
              whileTap={{ scale: 0.95 }}
              whileHover={{ 
                boxShadow: "0 0 8px rgba(62, 219, 211, 0.5)",
              }}
            >
              Apply Filters
            </motion.button>
            <motion.button
              onClick={resetFilters}
              className="w-full text-[#3EDBD3] py-2 mt-2 font-medium hover:underline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset All
            </motion.button>
          </motion.aside>

          {/* Projects Section */}
          <motion.section 
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}>
              <div className="text-lg font-semibold mb-4 sm:mb-0">
                528 projects found
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-2 bg-[#0B1120] border border-[#3EDBD3]/30 rounded text-[#F8FAFC]"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest First</option>
                    <option value="budget-high">Budget: High to Low</option>
                    <option value="budget-low">Budget: Low to High</option>
                  </select>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 border border-[#3EDBD3]/30 rounded ${viewMode === 'grid' ? 'bg-[#3EDBD3]/20 text-[#3EDBD3]' : 'text-[#94A3B8]'}`}
                  >
                    🔲
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 border border-[#3EDBD3]/30 rounded ${viewMode === 'list' ? 'bg-[#3EDBD3]/20 text-[#3EDBD3]' : 'text-[#94A3B8]'}`}
                  >
                    📝
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Projects List */}
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {projectsList.map((project, index) => (
                <motion.div 
                  key={project.id} 
                  className={`bg-[#1E293B] rounded-lg shadow-md p-6 border ${activeProjectId === project.id ? 'border-[#FF6EC7]' : 'border-[#3EDBD3]/10'}`}
                  animate={activeProjectId === project.id ? {
                    borderColor: ["rgba(255,110,199,0.3)", "rgba(255,110,199,1)", "rgba(255,110,199,0.3)"],
                    boxShadow: ["0 0 0 rgba(255,110,199,0)", "0 0 20px rgba(255,110,199,0.5)", "0 0 0 rgba(255,110,199,0)"]
                  } : {}}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(62, 219, 211, 0.1)",
                    borderColor: "rgba(62, 219, 211, 0.3)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#3EDBD3] mb-1">{project.title}</h3>
                      <p className="text-[#94A3B8]">Posted {project.postedAgo}</p>
                    </div>
                    <div className="text-[#FF6EC7] font-semibold mt-2 sm:mt-0">
                      {project.price}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-[#94A3B8] text-sm mb-4">
                    <span className="flex items-center gap-1">⏱️ {project.timeline}</span>
                    <span className="flex items-center gap-1">👨‍💼 {project.level}</span>
                    <span className="flex items-center gap-1">💵 {project.priceType}</span>
                  </div>

                  <p className="mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="bg-[#0B1120] px-3 py-1 rounded text-sm border border-[#4A7BF7]/30 text-[#4A7BF7]">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-[#3EDBD3]/10">
                    <div className="text-sm mb-4 sm:mb-0">
                      <span>Client from {project.clientCountry}</span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span>{'★'.repeat(Math.round(project.clientRating))}</span>
                        <span>{project.clientRating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <motion.button
                        onClick={() => toggleSaveProject(project.id)}
                        className="text-xl text-[#94A3B8] hover:text-[#FF6EC7] mr-4"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {project.saved ? '❤️' : '♡'}
                      </motion.button>
                      <motion.button
                        onClick={() => applyToProject(project.id)}
                        className="bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7] text-[#0F172A] px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 8px rgba(62, 219, 211, 0.5)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Apply Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <motion.div 
              className="flex justify-center mt-8 gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <motion.button 
                className="w-10 h-10 border border-[#3EDBD3]/30 rounded flex items-center justify-center hover:bg-[#0B1120] text-[#94A3B8]"
                whileHover={{ scale: 1.1, borderColor: "rgba(62, 219, 211, 0.5)" }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </motion.button>
              <motion.button 
                className="w-10 h-10 border border-[#3EDBD3] rounded flex items-center justify-center bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7] text-[#0F172A]"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 8px rgba(62, 219, 211, 0.5)"
                }}
                whileTap={{ scale: 0.9 }}
              >
                1
              </motion.button>
              <motion.button 
                className="w-10 h-10 border border-[#3EDBD3]/30 rounded flex items-center justify-center hover:bg-[#0B1120] text-[#94A3B8]"
                whileHover={{ scale: 1.1, borderColor: "rgba(62, 219, 211, 0.5)" }}
                whileTap={{ scale: 0.9 }}
              >
                2
              </motion.button>
              <motion.button 
                className="w-10 h-10 border border-[#3EDBD3]/30 rounded flex items-center justify-center hover:bg-[#0B1120] text-[#94A3B8]"
                whileHover={{ scale: 1.1, borderColor: "rgba(62, 219, 211, 0.5)" }}
                whileTap={{ scale: 0.9 }}
              >
                3
              </motion.button>
              <motion.button 
                className="w-10 h-10 border border-[#3EDBD3]/30 rounded flex items-center justify-center hover:bg-[#0B1120] text-[#94A3B8]"
                whileHover={{ scale: 1.1, borderColor: "rgba(62, 219, 211, 0.5)" }}
                whileTap={{ scale: 0.9 }}
              >
                4
              </motion.button>
              <motion.button 
                className="w-10 h-10 border border-[#3EDBD3]/30 rounded flex items-center justify-center hover:bg-[#0B1120] text-[#94A3B8]"
                whileHover={{ scale: 1.1, borderColor: "rgba(62, 219, 211, 0.5)" }}
                whileTap={{ scale: 0.9 }}
              >
                5
              </motion.button>
              <motion.button 
                className="w-10 h-10 border border-[#3EDBD3]/30 rounded flex items-center justify-center hover:bg-[#0B1120] text-[#94A3B8]"
                whileHover={{ scale: 1.1, borderColor: "rgba(62, 219, 211, 0.5)" }}
                whileTap={{ scale: 0.9 }}
              >
                →
              </motion.button>
            </motion.div>
          </motion.section>
        </div>
      </main>
    </motion.div>
  );
};

export default FindProjects;