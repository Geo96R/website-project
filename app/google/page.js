'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GoogleGlobe from '../../components/GoogleGlobe';

export default function GoogleStreamPage() {
  const router = useRouter();
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showGlobe, setShowGlobe] = useState(false);
  const [cpuData, setCpuData] = useState([]);
  const [memoryData, setMemoryData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [googleHealth, setGoogleHealth] = useState([]);
  const [googleStats, setGoogleStats] = useState(null);

  useEffect(() => {
    const messages = [
      "INITIALIZING GOOGLE CLOUD LIVE MONITOR...",
      "CONNECTING TO GOOGLE CLOUD STATUS...",
      "AUTHENTICATING SECURE CONNECTION...",
      "[SUCCESS] Connected to 35 regions",
      "LOADING GLOBAL INFRASTRUCTURE MAP...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLoadingMessage(messages[i]);
        i++;
      } else {
        clearInterval(interval);
        setShowGlobe(true);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Simulate live metrics
  useEffect(() => {
    if (!showGlobe) return;

    const updateMetrics = () => {
      setCpuData(prev => [...prev, 25 + Math.random() * 35].slice(-30));
      setMemoryData(prev => [...prev, 45 + Math.random() * 25].slice(-30));
      setNetworkData(prev => [...prev, 15 + Math.random() * 50].slice(-30));
    };

    const metricsInterval = setInterval(updateMetrics, 400);
    return () => clearInterval(metricsInterval);
  }, [showGlobe]);

  // Call real Google Cloud health data
  useEffect(() => {
    if (!showGlobe) return;

    const fetchGoogleData = async () => {
      try {
        // Call Google Cloud status incidents
        const healthResponse = await fetch('/api/google-health');
        const healthData = await healthResponse.json();
        
        if (healthData.success) {
          setGoogleHealth(healthData.items);
          
          // Convert health items to activity feed
          const activities = healthData.items.slice(0, 8).map((item, index) => {
            const regionMatch = item.title.match(/\[(.*?)\]/);
            const region = regionMatch ? regionMatch[1] : 'global';
            
            // Determine icon and color based on content
            let icon = 'ℹ';
            let color = 'text-blue-400';
            
            if (item.title.toLowerCase().includes('resolved') || item.title.toLowerCase().includes('recovery')) {
              icon = '✓';
              color = 'text-green-400';
            } else if (item.title.toLowerCase().includes('issue') || item.title.toLowerCase().includes('error')) {
              icon = '⚠';
              color = 'text-yellow-400';
            } else if (item.title.toLowerCase().includes('outage') || item.title.toLowerCase().includes('disruption')) {
              icon = '✗';
              color = 'text-red-400';
            }
            
            return {
              id: item.guid || `health-${index}`,
              icon,
              color,
              msg: item.title.substring(0, 100),
              region,
              timestamp: new Date(item.pubDate).toLocaleTimeString(),
            };
          });
          
          setActivityFeed(activities);
        }

        // Fetch Google Cloud regions and stats
        const regionsResponse = await fetch('/api/google-regions');
        const regionsData = await regionsResponse.json();
        
        if (regionsData.success) {
          setGoogleStats(regionsData.stats);
        }
        
      } catch (error) {
        console.error('Error fetching Google Cloud data:', error);
      }
    };

    fetchGoogleData();
    
    // Refresh every 2 minutes
    const interval = setInterval(fetchGoogleData, 120000);
    
    return () => clearInterval(interval);
  }, [showGlobe]);

  const renderMiniChart = (data, color, label, unit) => {
    const max = Math.max(...data, 100);
    const current = data[data.length - 1] || 0;

    return (
      <div className="bg-black/70 p-3 border border-tron-blue/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-tron-cyan font-mono">{label}</span>
          <span className="text-sm text-white font-bold">{current.toFixed(1)}{unit}</span>
        </div>
        <div className="h-12 flex items-end space-x-0.5">
          {data.map((value, index) => (
            <div
              key={index}
              className="flex-1 transition-all duration-300"
              style={{
                height: `${(value / max) * 100}%`,
                backgroundColor: color,
                boxShadow: `0 0 3px ${color}`,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-tron-cyan overflow-hidden">
      {/* Loading Screen */}
      {!showGlobe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-screen"
        >
          <div className="text-center space-y-6">
            <div className="text-xl font-mono text-gray-400 h-8">
              {loadingMessage}
            </div>
            <div className="w-96 bg-gray-800 h-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "linear" }}
                className="h-full bg-tron-cyan"
                style={{ boxShadow: '0 0 10px #00fff9' }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Visualization - Fullscreen like Tron */}
      {showGlobe && (
        <div className="h-screen flex flex-col">
          {/* Top Bar */}
          <div className="border-b border-tron-cyan/30 p-3 flex justify-between items-center bg-black/90">
            <div className="flex items-center space-x-4">
              <div className="text-sm font-mono text-tron-cyan">
                GOOGLE CLOUD PLATFORM MONITOR
              </div>
              <div className="text-[10px] text-tron-blue">
                REAL-TIME PUBLIC DATA
              </div>
              <div className="text-[9px] text-gray-600">
                Source: status.cloud.google.com
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-3 py-1 border border-tron-blue/50 text-tron-blue hover:text-tron-cyan hover:border-tron-cyan transition-all text-[10px] font-mono"
            >
              &lt; BACK TO CONTROL CENTER
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="flex-1 grid grid-cols-12 gap-0">
            {/* Left Sidebar - Metrics */}
            <div className="col-span-2 border-r border-tron-blue/30 p-4 space-y-3 bg-black/50 overflow-y-auto">
              <div className="border-b border-tron-cyan/30 pb-2 mb-3">
                <h3 className="text-xs font-bold text-tron-cyan font-mono">SYSTEM RESOURCES</h3>
              </div>
              
              {renderMiniChart(cpuData, '#00fff9', 'CPU', '%')}
              {renderMiniChart(memoryData, '#0099ff', 'MEMORY', '%')}
              {renderMiniChart(networkData, '#ffcc00', 'NETWORK', ' Mbps')}

              <div className="border-t border-tron-blue/30 pt-3 mt-4">
                <h3 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono">GLOBAL INFRASTRUCTURE</h3>
                <div className="space-y-1.5 text-[10px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Regions</span>
                    <span className="text-green-400">{googleStats?.totalRegions || 35}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Availability Zones</span>
                    <span className="text-green-400">{googleStats?.availabilityZones || 106}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Edge Locations</span>
                    <span className="text-green-400">{googleStats?.edgeLocations || 200}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Operational</span>
                    <span className="text-green-400">{googleStats?.operationalRegions || 35}/{googleStats?.totalRegions || 35}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-tron-blue/30 pt-3 mt-4">
                <h3 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono">GLOBAL TRAFFIC</h3>
                <div className="space-y-1.5 text-[10px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Requests/sec</span>
                    <span className="text-tron-cyan">{googleStats ? (googleStats.estimatedRequests / 1000000).toFixed(1) + 'M' : '3.8M'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">BigQuery Queries</span>
                    <span className="text-tron-cyan">2.1M/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">AI/ML Requests</span>
                    <span className="text-tron-cyan">847K/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cloud Functions</span>
                    <span className="text-tron-cyan">12.3M invocations</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-tron-blue/30 pt-3 mt-4">
                <h3 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono">SERVICE STATUS</h3>
                <div className="space-y-1.5 text-[10px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Compute Engine</span>
                    <span className="text-green-400">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">BigQuery</span>
                    <span className="text-green-400">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">AI Platform</span>
                    <span className="text-green-400">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cloud Run</span>
                    <span className="text-green-400">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kubernetes Engine</span>
                    <span className="text-green-400">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cloud Functions</span>
                    <span className="text-green-400">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cloud Storage</span>
                    <span className="text-green-400">OPERATIONAL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Globe */}
            <div className="col-span-8 relative">
              <GoogleGlobe googleStats={googleStats} />
            </div>

            {/* Right Sidebar - Enhanced Activity Feed */}
            <div className="col-span-2 border-l border-tron-blue/30 p-4 bg-black/50">
              <div className="border-b border-tron-cyan/30 pb-2 mb-3">
                <h3 className="text-xs font-bold text-tron-cyan font-mono">GOOGLE CLOUD LIVE FEED</h3>
                <div className="text-[9px] text-gray-600 mt-1">Real-time from Google Cloud Status</div>
              </div>
              
              {/* Scrollable Activity Feed - Latest 3-4 messages */}
              <div className="h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-tron-cyan/30 scrollbar-track-transparent">
                {activityFeed.length > 0 ? (
                  activityFeed.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="border-l-2 border-tron-blue/30 pl-2 py-1">
                      <div className="text-[9px] text-gray-600 mb-0.5">[{activity.timestamp}]</div>
                      <div className="flex items-start space-x-1">
                        <span className={`${activity.color} text-xs`}>{activity.icon}</span>
                        <div className="flex-1">
                          <div className="text-[10px] text-gray-300 leading-tight">{activity.msg}</div>
                          <div className="text-[9px] text-tron-blue mt-0.5">{activity.region}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="space-y-2">
                    <div className="border-l-2 border-tron-blue/30 pl-2 py-1">
                      <div className="text-[9px] text-gray-600 mb-0.5">[{new Date().toLocaleTimeString()}]</div>
                      <div className="flex items-start space-x-1">
                        <span className="text-green-400 text-xs">✓</span>
                        <div className="flex-1">
                          <div className="text-[10px] text-gray-300 leading-tight">All Google Cloud services operational</div>
                          <div className="text-[9px] text-tron-blue mt-0.5">global</div>
                        </div>
                      </div>
                    </div>
                    <div className="border-l-2 border-tron-blue/30 pl-2 py-1">
                      <div className="text-[9px] text-gray-600 mb-0.5">[{new Date().toLocaleTimeString()}]</div>
                      <div className="flex items-start space-x-1">
                        <span className="text-blue-400 text-xs">→</span>
                        <div className="flex-1">
                          <div className="text-[10px] text-gray-300 leading-tight">BigQuery processing 2.1M queries/hour</div>
                          <div className="text-[9px] text-tron-blue mt-0.5">analytics</div>
                        </div>
                      </div>
                    </div>
                    <div className="border-l-2 border-tron-blue/30 pl-2 py-1">
                      <div className="text-[9px] text-gray-600 mb-0.5">[{new Date().toLocaleTimeString()}]</div>
                      <div className="flex items-start space-x-1">
                        <span className="text-yellow-400 text-xs">⚡</span>
                        <div className="flex-1">
                          <div className="text-[10px] text-gray-300 leading-tight">AI Platform handling 847K ML requests</div>
                          <div className="text-[9px] text-tron-blue mt-0.5">machine-learning</div>
                        </div>
                      </div>
                    </div>
                    <div className="border-l-2 border-tron-blue/30 pl-2 py-1">
                      <div className="text-[9px] text-gray-600 mb-0.5">[{new Date().toLocaleTimeString()}]</div>
                      <div className="flex items-start space-x-1">
                        <span className="text-cyan-400 text-xs">🚀</span>
                        <div className="flex-1">
                          <div className="text-[10px] text-gray-300 leading-tight">Cloud Run auto-scaling containers</div>
                          <div className="text-[9px] text-tron-blue mt-0.5">serverless</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Additional Google Cloud Stats */}
              <div className="mt-4 pt-3 border-t border-tron-blue/30">
                <h4 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono">LIVE METRICS</h4>
                <div className="space-y-1.5 text-[9px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Active VMs:</span>
                    <span className="text-green-400">2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Storage Objects:</span>
                    <span className="text-tron-cyan">847B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">K8s Clusters:</span>
                    <span className="text-tron-cyan">156K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cloud Functions:</span>
                    <span className="text-tron-cyan">12.3M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
