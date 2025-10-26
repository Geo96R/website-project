'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import PixelAvatar from '../../components/PixelAvatar';

export default function CV() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isDecoding, setIsDecoding] = useState(true);
  const [decodedTexts, setDecodedTexts] = useState({});
  const [showContent, setShowContent] = useState(false);
  const [hasDecodedOnce, setHasDecodedOnce] = useState(false);
  const [openSkillDropdown, setOpenSkillDropdown] = useState(null);

  // Alien language characters for the decoding effect on the CV page.
  const alienChars = 'αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ∫∑∏∂∇∆∞√≤≥≠≈≡∝∈∉⊂⊃∪∩∧∨¬∀∃∴∵→←↑↓↔↕↖↗↘↙';

  // Calculate age from July 11, 1996(This is my date but you change for your self)
  const calculateAge = () => {
    const birthDate = new Date('1996-07-11');
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Your real CV content. You can change the content to your own.
  const cvContent = {
    overview: {
      title: 'SYSTEM OVERVIEW',
      content: `DevOps Engineer with 1 year 8 months of experience at Kadabra Inc, 
      leading global infrastructure across Asia, Europe, and Americas. 
      Specializing in scalable, secure, and fully automated systems. 
      Expert in containerization, cloud platforms, and automation technologies. 
      Proven track record of managing 7000+ services with 99.99% uptime.`,
      stats: [
        { label: 'Experience', value: '1y 8m', color: 'tron-cyan' },
        { label: 'Services', value: '7000+', color: 'tron-blue' },
        { label: 'Uptime', value: '99.99%', color: 'green-400' }
      ]
    },
    experience: {
      title: 'EXPERIENCE MATRIX',
      content: [
        {
          company: 'Kadabra Inc.',
          position: 'DevOps Engineer | System Admin Tech Lead',
          period: 'Mar 2024 - Present',
          location: 'Herzliya, Israel',
          achievements: [
            'Oversee global infrastructure across Asia, Europe, and Americas',
            'Migrated large-scale environments from traditional servers to Docker and Kubernetes',
            'Developed Bash, Python, Jenkins and Ansible based pipelines',
            'Tech Lead a team of System Administrators',
            'Implemented DevSecOps systems with ModSecurity and Zero Trust principles',
            'Managed 7000+ containerized services across 30+ servers worldwide',
            'Reduced deployment time by 75% through CI/CD pipeline optimization',
            'Implemented monitoring solutions reducing downtime by 90%',
            'Designed multi-cloud disaster recovery strategies'
          ]
        },
        {
          company: 'OMC',
          position: 'NOC Engineer',
          period: '2023',
          location: 'Kiryat Motzkin, Israel',
          achievements: [
            'Monitored services using Nagios and Zabbix',
            'Provided Tier 1 support for 60,000+ customers across 21 global data centers',
            'Developed comprehensive documentation for NOC engineers',
            'Configured network monitoring systems and load balancing',
            'Ensured minimal downtime for critical infrastructure operations',
            'Collaborated with Infrastructure engineers on network configurations'
          ]
        },
        {
          company: 'Hot',
          position: 'Helpdesk Technician',
          period: '2022 - 2023',
          location: 'Haifa, Israel',
          achievements: [
            'Resolved technical issues in fast-paced, high-tech environment',
            'Monitored and resolved client network problems via phone, AnyDesk, and RDP',
            'Promoted to Mentor within three months',
            'Guided technical course graduates integration',
            'Delivered exceptional support in high-pressure situations',
            'Mentored new team members and improved team efficiency'
          ]
        }
      ]
    },
    // Skills section. You can change the skills to your own or add more just add "," followed by double quotes of the skill
    skills: {
      title: 'SKILLS MATRIX',
      content: [
        { name: 'Docker', category: 'Containerization', details: ['Containerization', 'Orchestration', 'Docker Compose'] },
        { name: 'Kubernetes', category: 'Orchestration', details: ['Container Orchestration', 'Cluster Management', 'Helm Charts'] },
        { name: 'Python', category: 'Programming', details: ['Automation', 'Scripting', 'API Development'] },
        { name: 'Bash', category: 'Scripting', details: ['Shell Scripting', 'Automation', 'System Administration'] },
        { name: 'Ansible', category: 'Automation', details: ['Configuration Management', 'Infrastructure as Code', 'Playbooks'] },
        { name: 'Jenkins', category: 'CI/CD', details: ['Continuous Integration', 'Pipeline Automation', 'Build Management'] },
        { name: 'Terraform', category: 'IaC', details: ['Infrastructure as Code', 'Cloud Provisioning', 'State Management'] },
        { name: 'AWS', category: 'Cloud', details: ['EC2', 'S3', 'RDS', 'Lambda', 'CloudFormation', 'IAM Roles', 'EKS', 'CloudWatch', 'WorkMail', 'SES', 'VPC', 'Route53'] },
        { name: 'GCP', category: 'Cloud', details: ['Compute Engine', 'Cloud Storage', 'Kubernetes Engine'] },
        { name: 'Prometheus', category: 'Monitoring', details: ['Metrics Collection', 'Alerting', 'Grafana Integration'] },
        { name: 'Grafana', category: 'Visualization', details: ['Dashboard Creation', 'Data Visualization', 'Monitoring'] },
        { name: 'ELK Stack', category: 'Logging', details: ['Elasticsearch', 'Logstash', 'Kibana'] },
        { name: 'Git', category: 'Version Control', details: ['Repository Management', 'Branching', 'CI/CD Integration'] },
        { name: 'Linux', category: 'System Administration', details: ['CentOS', 'Ubuntu', 'Amazon Linux', 'Rocky', 'Debian'] },
        { name: 'Nginx', category: 'Web Server', details: ['Load Balancing', 'Reverse Proxy', 'SSL Configuration'] },
        { name: 'MySQL', category: 'Database', details: ['Database Administration', 'Query Optimization', 'Backup Management'] },
        { name: 'MariaDB', category: 'Database', details: ['Database Administration', 'Performance Tuning', 'Replication'] },
        { name: 'Apache', category: 'Web Server', details: ['Virtual Hosts', 'SSL Configuration', 'Module Management'] },
        { name: 'WordPress', category: 'CMS', details: ['Site Management', 'Plugin Development', 'Performance Optimization'] },
        { name: 'Cloudflare', category: 'CDN', details: ['DNS Management', 'DDoS Protection', 'SSL/TLS'] },
        { name: 'ModSecurity', category: 'Security', details: ['Web Application Firewall', 'Security Rules', 'Threat Protection'] },
        { name: 'Nagios', category: 'Monitoring', details: ['System Monitoring', 'Alert Management', 'Performance Tracking'] },
        { name: 'Zabbix', category: 'Monitoring', details: ['Infrastructure Monitoring', 'Custom Metrics', 'Reporting'] }
      ]
    },
    datacenters: {
      title: 'GLOBAL INFRASTRUCTURE',
      content: [
        { name: 'AWS', status: 'Active', color: 'orange' },
        { name: 'DigitalOcean', status: 'Active', color: 'blue' },
        { name: 'Linode', status: 'Active', color: 'green' },
        { name: 'Vultr', status: 'Active', color: 'purple' },
        { name: 'Contabo', status: 'Active', color: 'red' },
        { name: 'Lightsail', status: 'Active', color: 'yellow' }
      ]
    },
    // Not much to say here..
    profile: {
      title: 'PROFILE MATRIX',
      content: {
        email: 'GeorgeTAWork96@gmail.com',
        linkedin: 'https://www.linkedin.com/in/george-tatevosov-1a585a2b4/',
        location: 'Haifa, Israel',
        age: calculateAge(),
        status: 'Currently working at Kadabra',
        experience: '1 year 8 months at Kadabra Inc'
      }
    }
  };

  // Decode only once on page load(To avoid spaming this each reload of /cv when you change to profile/skills/etc)
  useEffect(() => {
    if (isDecoding && !hasDecodedOnce) {
      const texts = {
        header: 'GEORGE .TATEVOSOV',
        subtitle: 'DevOps Engineer | System Admin Team Lead',
        navOverview: 'OVERVIEW',
        navExperience: 'EXPERIENCE',
        navSkills: 'SKILLS',
        navDatacenters: 'DATACENTERS',
        navProfile: 'PROFILE',
        profileTitle: 'PROFILE .AVATAR',
        profileName: 'George Tatevosov',
        profileTitle2: 'DevOps Engineer',
        quickAccessTitle: 'QUICK .ACCESS',
        statusLabel: 'Status:',
        statusValue: 'Currently working at Kadabra',
        experienceLabel: 'Experience:',
        experienceValue: '1y 8m',
        locationLabel: 'Location:',
        locationValue: 'Haifa, Israel',
        ageLabel: 'Age:',
        ageValue: `${calculateAge()}`,
        title: cvContent[activeSection]?.title || 'SYSTEM INITIALIZING...'
      };

      let currentIndex = 0;
      const maxLength = Math.max(...Object.values(texts).map(text => text.length));
      
      const interval = setInterval(() => {
        const newDecodedTexts = {};
        let allComplete = true;

        Object.keys(texts).forEach(key => {
          const targetText = texts[key];
          const currentLength = Math.min(currentIndex, targetText.length);
          
          if (currentLength < targetText.length) {
            const randomChar = alienChars[Math.floor(Math.random() * alienChars.length)];
            newDecodedTexts[key] = targetText.substring(0, currentLength) + randomChar;
            allComplete = false;
          } else {
            newDecodedTexts[key] = targetText;
          }
        });

        setDecodedTexts(newDecodedTexts);
        currentIndex++;

        if (allComplete || currentIndex > maxLength) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDecoding(false);
            setShowContent(true);
            setHasDecodedOnce(true);
          }, 500);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isDecoding, hasDecodedOnce, activeSection]);

  // Don't reset decoding when section changes - only change content
  useEffect(() => {
    if (hasDecodedOnce) {
      setShowContent(true);
    }
  }, [activeSection, hasDecodedOnce]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    
    // scroll to the content section - improved for mobile
    setTimeout(() => {
      const contentElement = document.querySelector('.cv-content-section');
      if (contentElement) {
        // use different scroll behavior for mobile
        const isMobile = window.innerWidth <= 768;
        contentElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: isMobile ? 'start' : 'center',
          inline: 'nearest'
        });
      }
    }, 200); // increased delay for mobile
  };

  const handleSkillClick = (skillIndex) => {
    if (openSkillDropdown === skillIndex) {
      setOpenSkillDropdown(null); // Close if already open
    } else {
      setOpenSkillDropdown(skillIndex); // Open this skill
    }
  };

  return (
    <div className="min-h-screen bg-black text-tron-cyan font-mono">
      {/* Header */}
      <div className="border-b border-tron-cyan/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-tron-cyan">
              {isDecoding ? (
                <span className="animate-pulse">{decodedTexts.header || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
              ) : (
                <span className="text-tron-cyan">{decodedTexts.header}</span>
              )}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {isDecoding ? (
                <span className="animate-pulse">{decodedTexts.subtitle || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
              ) : (
                <span>{decodedTexts.subtitle}</span>
              )}
            </p>
          </div>
          <Link 
            href="/"
            className="px-4 py-2 border border-tron-cyan text-tron-cyan hover:bg-tron-cyan hover:text-black transition-colors"
          >
            &lt; CONTROL CENTER
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 cv-content-section">
        
        {/* Left Sidebar - Visual Layout */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Navigation Sections */}
          <div className="border border-tron-cyan/50 p-4 bg-black/50">
            <h3 className="text-lg font-bold text-tron-cyan mb-3">NAVIGATION <span className="text-tron-blue">.SECTIONS</span></h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'overview', label: 'OVERVIEW', active: activeSection === 'overview' },
                { id: 'experience', label: 'EXPERIENCE', active: activeSection === 'experience' },
                { id: 'skills', label: 'SKILLS', active: activeSection === 'skills' },
                { id: 'datacenters', label: 'DATACENTERS', active: activeSection === 'datacenters' },
                { id: 'profile', label: 'PROFILE', active: activeSection === 'profile' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  className={`p-3 border text-center transition-all duration-300 ${
                    item.active
                      ? 'border-tron-cyan bg-tron-cyan/10 text-tron-cyan shadow-lg shadow-tron-cyan/20'
                      : 'border-tron-blue/30 hover:border-tron-cyan hover:bg-tron-cyan/5'
                  }`}
                >
                  <div className="text-sm font-bold">
                    {isDecoding ? (
                      <span className="animate-pulse">
                        {decodedTexts[`nav${item.label.charAt(0) + item.label.slice(1).toLowerCase()}`] || 'αβγδεζηθικλμνξοπρστυφχψω'}
                      </span>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Animated Profile Avatar - Pixelated Human - FIXED LAYOUT */}
          <div className="border border-tron-blue/50 p-4 bg-black/50">
            <h3 className="text-lg font-bold text-tron-cyan mb-3">
              {isDecoding ? (
                <span className="animate-pulse">{decodedTexts.profileTitle || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
              ) : (
                <span>PROFILE <span className="text-tron-blue">.AVATAR</span></span>
              )}
            </h3>
            
            {/* FIXED LAYOUT: Info on left, Avatar on right */}
            <div className="flex items-center space-x-4">
              {/* Left side - Info */}
              <div className="flex-1">
                <div className="text-sm text-tron-cyan mb-1">
                  {isDecoding ? (
                    <span className="animate-pulse">{decodedTexts.profileName || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
                  ) : (
                    <span>{decodedTexts.profileName}</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  {isDecoding ? (
                    <span className="animate-pulse">{decodedTexts.profileTitle2 || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
                  ) : (
                    <span>{decodedTexts.profileTitle2}</span>
                  )}
                </div>
                <div className="text-xs text-tron-blue">
                  {isDecoding ? (
                    <span className="animate-pulse">{decodedTexts.ageLabel || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
                  ) : (
                    <span>{decodedTexts.ageLabel}</span>
                  )}
                  <span className="ml-1">
                    {isDecoding ? (
                      <span className="animate-pulse">{decodedTexts.ageValue || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
                    ) : (
                      <span>{decodedTexts.ageValue}</span>
                    )}
                  </span>
                </div>
                <div className="text-xs text-tron-blue">
                  {isDecoding ? (
                    <span className="animate-pulse">{decodedTexts.locationLabel || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
                  ) : (
                    <span>{decodedTexts.locationLabel}</span>
                  )}
                  <span className="ml-1">
                    {isDecoding ? (
                      <span className="animate-pulse">{decodedTexts.locationValue || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
                    ) : (
                      <span>{decodedTexts.locationValue}</span>
                    )}
                  </span>
                </div>
                <div className="text-xs text-tron-blue mt-2">
                  <div className="font-semibold text-tron-cyan mb-1">Languages:</div>
                  <div>Hebrew - Fluent in all forms</div>
                  <div>Russian - Fluent in all forms</div>
                  <div>English - Fluent in all forms</div>
                  <div>French - Intermediate B2 in progress</div>
                </div>
              </div>
              
              <div className="w-32 h-32 border-2 border-tron-cyan/30 bg-gradient-to-br from-tron-cyan/10 to-tron-blue/10 flex items-center justify-center relative overflow-hidden">
                <PixelAvatar 
                  frameW={128}
                  frameH={128}
                  rows={{ idle: 0, typing: 1, glance: 2 }}
                  frames={{ idle: 8, typing: 12, glance: 8 }}
                  fps={12}
                  accent="cyan"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Contact Quick Info */}
          <div className="border border-tron-cyan/50 p-4 bg-black/50">
            <h3 className="text-lg font-bold text-tron-cyan mb-3">
              {isDecoding ? (
                <span className="animate-pulse">{decodedTexts.quickAccessTitle || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
              ) : (
                <span>QUICK <span className="text-tron-blue">.ACCESS</span></span>
              )}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {isDecoding ? (
                    <span className="animate-pulse">{decodedTexts.statusLabel || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
                  ) : (
                    <span>{decodedTexts.statusLabel}</span>
                  )}
                </span>
                <span className="text-green-400">
                  {isDecoding ? (
                    <span className="animate-pulse">{decodedTexts.statusValue || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
                  ) : (
                    <span>{decodedTexts.statusValue}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {isDecoding ? (
                    <span className="animate-pulse">{decodedTexts.experienceLabel || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
                  ) : (
                    <span>{decodedTexts.experienceLabel}</span>
                  )}
                </span>
                <span className="text-tron-cyan">
                  {isDecoding ? (
                    <span className="animate-pulse">{decodedTexts.experienceValue || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
                  ) : (
                    <span>{decodedTexts.experienceValue}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          
          {/* Alien Language Decoding Header */}
          <div className="border border-tron-cyan/50 p-6 bg-black/50 mb-6">
            <div className="text-center">
              <div className="text-2xl font-mono text-tron-cyan mb-2">
                {isDecoding ? (
                  <span className="animate-pulse">{decodedTexts.title || 'αβγδεζηθικλμνξοπρστυφχψω'}</span>
                ) : (
                  <span className="text-tron-cyan">{cvContent[activeSection]?.title}</span>
                )}
              </div>
              <div className="text-sm text-gray-400">
                {isDecoding ? 'DECODING ALIEN TRANSMISSION...' : 'TRANSMISSION COMPLETE'}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <AnimatePresence mode="wait">
            {showContent && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="border border-tron-cyan/50 p-6 bg-black/50"
              >
                {activeSection === 'overview' && (
                  <div>
                    <h2 className="text-2xl font-bold text-tron-cyan mb-4">SYSTEM <span className="text-tron-blue">.OVERVIEW</span></h2>
                    <p className="text-gray-300 leading-relaxed mb-6">{cvContent.overview.content}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {cvContent.overview.stats.map((stat, index) => (
                        <div key={index} className="border border-tron-blue/30 p-4 text-center">
                          <div className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</div>
                          <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div>
                    <h2 className="text-2xl font-bold text-tron-cyan mb-4">EXPERIENCE <span className="text-tron-blue">.MATRIX</span></h2>
                    <div className="space-y-6">
                      {cvContent.experience.content.map((job, index) => (
                        <div key={index} className="border-l-2 border-tron-blue/30 pl-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-tron-cyan">{job.position}</h3>
                              <div className="text-sm text-tron-blue">{job.company}</div>
                            </div>
                            <div className="text-right text-sm text-gray-400">
                              <div>{job.period}</div>
                              <div>{job.location}</div>
                            </div>
                          </div>
                          <ul className="space-y-1 text-sm text-gray-300">
                            {job.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-tron-cyan mr-2">▶</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div>
                    <h2 className="text-2xl font-bold text-tron-cyan mb-4">SKILLS <span className="text-tron-blue">.MATRIX</span></h2>
                    <div className="mb-6 p-3 border border-tron-cyan/30 bg-tron-cyan/5 rounded">
                      <p className="text-tron-cyan text-sm font-semibold" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.3)' }}>
                        Click once on a skill for info, click again to close.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cvContent.skills.content.map((skill, index) => (
                        <div
                          key={index}
                          className={`border p-3 transition-colors relative cursor-pointer ${
                            openSkillDropdown === index 
                              ? 'border-tron-cyan bg-tron-cyan/10' 
                              : 'border-tron-blue/30 hover:border-tron-cyan'
                          }`}
                          onClick={() => handleSkillClick(index)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-tron-cyan font-semibold">{skill.name}</span>
                            <span className="text-tron-blue text-sm">{skill.category}</span>
                          </div>
                          
                          {/* Clickable dropdown */}
                          <AnimatePresence>
                            {openSkillDropdown === index && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 bg-black/95 border border-tron-cyan/30 p-2 rounded-b z-50 mt-1"
                              >
                                <div className="text-xs text-gray-300">
                                  {skill.details.map((detail, i) => (
                                    <div key={i} className="mb-1">
                                      <span className="text-tron-cyan">•</span> {detail}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'datacenters' && (
                  <div>
                    <h2 className="text-2xl font-bold text-tron-cyan mb-4">GLOBAL <span className="text-tron-blue">.INFRASTRUCTURE</span></h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {cvContent.datacenters.content.map((dc, index) => (
                        <div key={index} className="border border-tron-blue/30 p-4 hover:border-tron-cyan transition-colors text-center">
                          <h3 className="text-lg font-semibold text-tron-cyan mb-2">{dc.name}</h3>
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            dc.color === 'orange' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                            dc.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            dc.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            dc.color === 'purple' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            dc.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {dc.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-tron-cyan mb-4">PROFILE <span className="text-tron-blue">.MATRIX</span></h2>
                    <div className="space-y-4">
                      <div className="border border-tron-blue/30 p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-tron-cyan">📧</span>
                          <span className="text-tron-cyan font-semibold">Email:</span>
                        </div>
                        <a href={`mailto:${cvContent.profile.content.email}`} className="text-tron-blue hover:text-tron-cyan transition-colors">
                          {cvContent.profile.content.email}
                        </a>
                      </div>
                      <div className="border border-tron-blue/30 p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-tron-cyan">💼</span>
                          <span className="text-tron-cyan font-semibold">LinkedIn:</span>
                        </div>
                        <a href={cvContent.profile.content.linkedin} target="_blank" rel="noopener noreferrer" className="text-tron-blue hover:text-tron-cyan transition-colors">
                          {cvContent.profile.content.linkedin}
                        </a>
                      </div>
                      <div className="border border-tron-blue/30 p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-tron-cyan">📍</span>
                          <span className="text-tron-cyan font-semibold">Location:</span>
                        </div>
                        <span className="text-gray-300">{cvContent.profile.content.location}</span>
                      </div>
                      <div className="border border-tron-blue/30 p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-tron-cyan">🎂</span>
                          <span className="text-tron-cyan font-semibold">Age:</span>
                        </div>
                        <span className="text-gray-300">{cvContent.profile.content.age} years old</span>
                      </div>
                      <div className="border border-tron-blue/30 p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-tron-cyan">⚡</span>
                          <span className="text-tron-cyan font-semibold">Status:</span>
                        </div>
                        <span className="text-green-400">{cvContent.profile.content.status}</span>
                      </div>
                    </div>
                  </div>
                )}
      </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}