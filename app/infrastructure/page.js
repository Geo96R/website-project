'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function InfrastructureStreamPage() {
  const router = useRouter();
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [deployStage, setDeployStage] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [stageSteps, setStageSteps] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const messages = [
      "INITIALIZING INFRASTRUCTURE MONITOR...",
      "CONNECTING TO KUBERNETES CLUSTER...",
      "AUTHENTICATING SECURE CONNECTION...",
      "[SUCCESS] Connected to cluster",
      "LOADING INFRASTRUCTURE TOPOLOGY...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLoadingMessage(messages[i]);
        i++;
      } else {
        clearInterval(interval);
        setShowContent(true);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleDeploy = () => {
    if (isDeploying) return;
    
    setIsDeploying(true);
    setDeployProgress(0);
    setDeployStage(null);
    setStageSteps([]);

    const stages = [
      { 
        name: 'Git Commit', 
        icon: '📝', 
        duration: 3000,
        steps: [
          'Staging modified files',
          'Creating commit with message',
          'Pushing to main branch',
          'Triggering GitHub Actions workflow'
        ]
      },
      { 
        name: 'GitHub Actions', 
        icon: '⚙️', 
        duration: 2500,
        steps: [
          'Workflow: build-and-deploy triggered',
          'Running on ubuntu-latest runner',
          'Checking out repository code',
          'Preparing build environment'
        ]
      },
      { 
        name: 'Checkout Code', 
        icon: '📥', 
        duration: 3000,
        steps: [
          'Using actions/checkout@v4',
          'Cloning geo96r/website-project',
          'Checking out commit SHA',
          'Workspace prepared for build'
        ]
      },
      { 
        name: 'Test Build', 
        icon: '🧪', 
        duration: 5000,
        steps: [
          'Building test image: test-build',
          'Validating Dockerfile syntax',
          'Testing build process',
          'Build successful - proceeding to production build'
        ]
      },
      { 
        name: 'Docker Build', 
        icon: '🐳', 
        duration: 4000,
        steps: [
          'Setting up Docker build environment',
          'Enabling buildkit caching features',
          'Configuring cache optimization',
          'Preparing for multi-stage build'
        ]
      },
      { 
        name: 'Login to GHCR', 
        icon: '🔐', 
        duration: 2500,
        steps: [
          'Authenticating to ghcr.io',
          'Using GITHUB_TOKEN for access',
          'Registry: ghcr.io/geo96r/website-project',
          'Authentication successful'
        ]
      },
      { 
        name: 'Extract Metadata', 
        icon: '🏷️', 
        duration: 2500,
        steps: [
          'Generating image tags',
          'Creating tags: latest, main, commit-SHA',
          'Adding metadata labels',
          'Tags prepared for push'
        ]
      },
      { 
        name: 'Build & Push', 
        icon: '🚀', 
        duration: 8000,
        steps: [
          'Building multi-stage Docker image',
          'Stage 1 (deps): Installing npm dependencies',
          'Stage 2 (builder): Building Next.js application',
          'Stage 3 (runner): Creating production image',
          'Pushing to ghcr.io/geo96r/website-project:latest',
          'Using build cache for optimization'
        ]
      },
      { 
        name: 'Trivy Scan', 
        icon: '🔍', 
        duration: 6000,
        steps: [
          'Running Trivy security scan',
          'Scanning for CRITICAL vulnerabilities',
          'Scanning for HIGH severity issues',
          'Checking base image layers',
          'Scanning installed packages',
          'Security scan completed: 0 vulnerabilities found'
        ]
      },
      { 
        name: 'Setup kubectl', 
        icon: '☸️', 
        duration: 3000,
        steps: [
          'Installing kubectl (latest)',
          'Using azure/setup-kubectl@v3',
          'Configuring KUBECONFIG',
          'Ready to deploy to K3s cluster'
        ]
      },
      { 
        name: 'Deploy to K3s', 
        icon: '🎯', 
        duration: 4000,
        steps: [
          'Executing: kubectl rollout restart',
          'Target: deployment/website-project',
          'Triggering rolling update',
          'New pods pulling latest image',
          'Old pods terminating gracefully'
        ]
      },
      { 
        name: 'Rollout Status', 
        icon: '⏳', 
        duration: 6000,
        steps: [
          'Monitoring pod status',
          'Waiting for new pods to be Ready',
          'Checking readiness probes',
          'Verifying liveness probes',
          'Ensuring all replicas are Running',
          'Rollout completed successfully'
        ]
      },
      { 
        name: 'Monitoring Active', 
        icon: '📊', 
        duration: 3000,
        steps: [
          'Grafana Cloud monitoring initialized',
          'Prometheus collecting metrics',
          'Loki aggregating logs',
          'OpenTelemetry sending traces',
          'Alloy receiver processing telemetry',
          'Observability pipeline active'
        ]
      },
    ];

    let currentStage = 0;
    let totalDuration = stages.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    const updateProgress = () => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        setDeployStage(stage);
        
        // Show steps one by one with delay
        let stepIndex = 0;
        const showSteps = () => {
          if (stepIndex < stage.steps.length) {
            setStageSteps(stage.steps.slice(0, stepIndex + 1));
            stepIndex++;
            setTimeout(showSteps, stage.duration / stage.steps.length);
          }
        };
        showSteps();

        const stageDuration = stage.duration;
        const progressInterval = setInterval(() => {
          elapsed += 50;
          setDeployProgress(Math.min((elapsed / totalDuration) * 100, 100));
        }, 50);

        setTimeout(() => {
          clearInterval(progressInterval);
          elapsed += stageDuration;
          setDeployProgress((elapsed / totalDuration) * 100);
          currentStage++;
          
          if (currentStage < stages.length) {
            updateProgress();
          } else {
            setTimeout(() => {
              setIsDeploying(false);
              setDeployStage(null);
              setDeployProgress(0);
              setStageSteps([]);
            }, 2000);
          }
        }, stageDuration);
      }
    };

    updateProgress();
  };

  if (!showContent) {
    return (
      <div className="min-h-screen bg-black text-tron-cyan flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-2xl mb-4">{loadingMessage}</div>
          <div className="animate-pulse text-tron-blue">...</div>
        </div>
      </div>
    );
  }

  const pipelineStages = [
    { name: 'Git Commit', icon: '📝' },
    { name: 'GitHub Actions', icon: '⚙️' },
    { name: 'Checkout Code', icon: '📥' },
    { name: 'Test Build', icon: '🧪' },
    { name: 'Docker Build', icon: '🐳' },
    { name: 'Login to GHCR', icon: '🔐' },
    { name: 'Extract Metadata', icon: '🏷️' },
    { name: 'Build & Push', icon: '🚀' },
    { name: 'Trivy Scan', icon: '🔍' },
    { name: 'Setup kubectl', icon: '☸️' },
    { name: 'Deploy to K3s', icon: '🎯' },
    { name: 'Rollout Status', icon: '⏳' },
    { name: 'Monitoring Active', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-black text-tron-cyan p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-tron-cyan font-mono">
              INFRASTRUCTURE <span className="text-tron-blue">.STREAM</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Interactive deployment pipeline</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-tron-blue text-tron-cyan hover:bg-tron-blue/10 transition-colors text-sm font-mono"
          >
            &lt; CONTROL CENTER
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Deployment Pipeline (Top to Bottom) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Deploy Button */}
            <div className="border border-tron-blue/30 p-6 bg-black/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-tron-cyan font-mono">DEPLOYMENT PIPELINE</h2>
                <button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className={`px-8 py-4 border-2 font-mono font-bold text-lg transition-all ${
                    isDeploying
                      ? 'border-yellow-400 text-yellow-400 cursor-not-allowed'
                      : 'border-tron-cyan text-tron-cyan hover:bg-tron-cyan hover:text-black'
                  }`}
                >
                  {isDeploying ? 'DEPLOYING...' : '▶ DEPLOY'}
                </button>
              </div>

              {/* Vertical Pipeline */}
              <div className="relative">
                {/* Stages */}
                <div className="space-y-6">
                  {pipelineStages.map((stage, index) => {
                    const isActive = deployStage?.name === stage.name;
                    const isCompleted = deployStage && 
                      pipelineStages.findIndex(s => s.name === deployStage.name) > index;
                    
                    return (
                      <motion.div
                        key={stage.name}
                        className="relative flex items-start"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ 
                          opacity: isActive || isCompleted ? 1 : 0.3,
                          x: 0 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Stage Circle */}
                        <div className={`relative z-10 w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl transition-all flex-shrink-0 bg-black ${
                          isActive
                            ? 'border-tron-cyan bg-tron-cyan/20 shadow-lg shadow-tron-cyan/50 scale-110'
                            : isCompleted
                            ? 'border-green-400 bg-green-400/20'
                            : 'border-tron-blue/30 bg-black/30'
                        }`}>
                          {isCompleted ? '✓' : stage.icon}
                        </div>

                        {/* Stage Info */}
                        <div className={`ml-6 flex-1 border-2 p-4 transition-all ${
                          isActive
                            ? 'border-tron-cyan bg-tron-cyan/10'
                            : isCompleted
                            ? 'border-green-400/50 bg-green-400/5'
                            : 'border-tron-blue/30 bg-black/30'
                        }`}>
                          <div className="font-mono font-bold text-base mb-3">{stage.name}</div>
                          <AnimatePresence mode="wait">
                            {isActive && stageSteps.length > 0 && (
                              <motion.div
                                key="active-steps"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="space-y-1.5"
                              >
                                {stageSteps.map((step, stepIndex) => (
                                  <motion.div
                                    key={stepIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: stepIndex * 0.1 }}
                                    className="text-xs text-gray-300 font-mono flex items-start"
                                  >
                                    <span className="text-tron-cyan mr-2">▸</span>
                                    <span>{step}</span>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                            {!isActive && isCompleted && (
                              <motion.div
                                key="completed-info"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-green-400 font-mono"
                              >
                                ✓ Completed successfully
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute left-4 w-4 h-4 bg-tron-cyan rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            style={{ boxShadow: '0 0 10px #00fff9' }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Bar */}
              {isDeploying && (
                <motion.div
                  className="mt-6 h-3 bg-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-tron-cyan"
                    style={{ boxShadow: '0 0 10px #00fff9' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${deployProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column - Component Status */}
          <div className="space-y-6">
            <div className="border border-tron-blue/30 p-4 bg-black/50">
              <h3 className="text-sm font-bold text-tron-cyan mb-4 font-mono border-b border-tron-blue/30 pb-2">
                COMPONENT STATUS
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'K3s Cluster', status: 'operational', details: 'Lightweight Kubernetes' },
                  { name: 'Contour', status: 'operational', details: 'Gateway API Controller' },
                  { name: 'Gateway API', status: 'operational', details: 'Networking Standard' },
                  { name: 'Envoy Proxy', status: 'operational', details: 'High-Performance Proxy' },
                  { name: 'Grafana Cloud', status: 'operational', details: 'Observability Platform' },
                  { name: 'Terraform', status: 'operational', details: 'Infrastructure as Code' },
                  { name: 'GitHub Actions', status: 'operational', details: 'CI/CD Pipeline' },
                  { name: 'Trivy Scanner', status: 'operational', details: 'Security Scanning' },
                ].map((component) => (
                  <div key={component.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-400">{component.name}</span>
                      <span className={`${component.status === 'operational' ? 'text-green-400' : 'text-red-400'}`}>
                        {component.status === 'operational' ? '●' : '○'}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono pl-2">{component.details}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-tron-blue/30 p-4 bg-black/50">
              <h3 className="text-sm font-bold text-tron-cyan mb-4 font-mono border-b border-tron-blue/30 pb-2">
                SECURITY FEATURES
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-green-400">• Network Policies (Pod Isolation)</div>
                <div className="text-green-400">• Pod Security Standards (Restricted)</div>
                <div className="text-green-400">• Non-Root Containers (UID 1001)</div>
                <div className="text-green-400">• Dropped Capabilities (ALL)</div>
                <div className="text-green-400">• Security Headers (CSP, X-Frame-Options)</div>
                <div className="text-green-400">• Cloudflare WAF (Edge Protection)</div>
                <div className="text-green-400">• Resource Limits (CPU/Memory)</div>
                <div className="text-green-400">• Seccomp Profile (RuntimeDefault)</div>
                <div className="text-green-400">• No Privilege Escalation</div>
                <div className="text-green-400">• Health Checks (Liveness/Readiness)</div>
                <div className="text-green-400">• Trivy Image Scanning (CI/CD)</div>
                <div className="text-green-400">• TLS/SSL (Full Strict Mode)</div>
                <div className="text-green-400">• Rate Limiting (Cloudflare)</div>
              </div>
            </div>

            <div className="border border-tron-blue/30 p-4 bg-black/50">
              <h3 className="text-sm font-bold text-tron-cyan mb-4 font-mono border-b border-tron-blue/30 pb-2">
                ARCHITECTURE
              </h3>
              <div className="space-y-3 text-sm font-mono">
                <div className="text-tron-cyan font-semibold" style={{ color: '#00fff9' }}>Internet</div>
                <div className="text-xs text-gray-500 pl-2">Public Traffic</div>
                <div className="text-tron-blue text-lg">↓</div>
                <div className="text-tron-cyan font-semibold">Cloudflare</div>
                <div className="text-xs text-gray-500 pl-2">WAF, DDoS Protection, CDN</div>
                <div className="text-tron-blue text-lg">↓</div>
                <div className="text-tron-cyan font-semibold">Contour/Envoy</div>
                <div className="text-xs text-gray-500 pl-2">Gateway API, TLS Termination</div>
                <div className="text-tron-blue text-lg">↓</div>
                <div className="text-tron-cyan font-semibold">K3s Cluster</div>
                <div className="text-xs text-gray-500 pl-2">Container Orchestration</div>
                <div className="text-tron-blue text-lg">↓</div>
                <div className="text-tron-cyan font-semibold">Application</div>
                <div className="text-xs text-gray-500 pl-2">Next.js Website</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
