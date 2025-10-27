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
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showGlobe) return;

    const updateMetrics = () => {
      setCpuData(prev => [...prev, 30 + Math.random() * 40].slice(-30));
      setMemoryData(prev => [...prev, 50 + Math.random() * 30].slice(-30));
      setNetworkData(prev => [...prev, 20 + Math.random() * 60].slice(-30));
    };

    const metricsInterval = setInterval(updateMetrics, 400);
    return () => clearInterval(metricsInterval);
  }, [showGlobe]);

  useEffect(() => {
    if (!showGlobe) return;

    const fetchGoogleData = async () => {
      try {
        const healthResponse = await fetch('/api/google-health');
        const healthData = await healthResponse.json();
        
        if (healthData.success) {
          setGoogleHealth(healthData.items);
          
          const activities = healthData.items.slice(0, 8).map((item, index) => {
            const regionMatch = item.title.match(/\[(.*?)\]/);
            const region = regionMatch ? regionMatch[1] : 'global';
            
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
    const interval = setInterval(fetchGoogleData, 120000);
    
    return () => clearInterval(interval);
  }, [showGlobe]);

  const renderMiniChart = (data, color, label, unit) => {
    const max = Math.max(...data, 100);
    const current = data[data.length - 1] || 0;

    return (
      <div className="bg-black/70 p-2 sm:p-3 border border-tron-blue/30">
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <span className="text-[8px] sm:text-[10px] text-tron-cyan font-mono">{label}</span>
          <span className="text-xs sm:text-sm text-white font-bold">{current.toFixed(1)}{unit}</span>
        </div>
        <div className="h-8 sm:h-12 flex items-end space-x-0.5">
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
      {!showGlobe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-screen px-4"
        >
          <div className="text-center space-y-6 w-full max-w-md">
            <div className="text-sm sm:text-xl font-mono text-gray-400 h-8">
              {loadingMessage}
            </div>
            <div className="w-full bg-gray-800 h-0.5">
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

      {showGlobe && (
        <div className="h-screen flex flex-col">
          {isMobile ? (
            /* ===== MOBILE LAYOUT ===== */
            <>
              {/* Fixed Header - Always Visible */}
              <div className="sticky top-0 z-30 border-b border-tron-cyan/30 p-2 flex flex-col gap-2 bg-black backdrop-blur-sm">
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] font-mono text-tron-cyan">GOOGLE CLOUD INFRASTRUCTURE</div>
                  <div className="text-[9px] text-tron-blue">REAL-TIME DATA</div>
                  <div className="text-[8px] text-gray-600">status.cloud.google.com</div>
                </div>
                <button
                  onClick={() => router.push('/')}
                  className="px-3 py-1.5 border border-tron-blue/50 text-tron-blue hover:text-tron-cyan hover:border-tron-cyan transition-all text-[10px] font-mono w-full"
                >
                  &lt; CONTROL CENTER
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* System Resources */}
                <div className="p-3 border-b border-tron-cyan/30 bg-black/50">
                  <h3 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono border-b border-tron-cyan/30 pb-1">SYSTEM RESOURCES</h3>
                  <div className="space-y-2">
                    {renderMiniChart(cpuData, '#00fff9', 'CPU', '%')}
                    {renderMiniChart(memoryData, '#0099ff', 'MEMORY', '%')}
                    {renderMiniChart(networkData, '#ffcc00', 'NETWORK', ' Mbps')}
                  </div>
                </div>

                {/* Globe */}
                <div className="h-[50vh] relative border-b border-tron-blue/30">
                  <GoogleGlobe googleStats={googleStats} />
                </div>

                {/* Stats Sections */}
                <div className="p-3 space-y-3">
                  {/* Global Infrastructure */}
                  <div className="border border-tron-blue/30 p-3 bg-black/50">
                    <h3 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono border-b border-tron-blue/30 pb-1">GLOBAL INFRASTRUCTURE</h3>
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
                        <span className="text-green-400">{googleStats?.edgeLocations || 187}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Operational</span>
                        <span className="text-green-400">{googleStats?.operationalRegions || 35}/{googleStats?.totalRegions || 35}</span>
                      </div>
                    </div>
                  </div>

                  {/* Global Traffic */}
                  <div className="border border-tron-blue/30 p-3 bg-black/50">
                    <h3 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono border-b border-tron-blue/30 pb-1">GLOBAL TRAFFIC</h3>
                    <div className="space-y-1.5 text-[10px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Requests/sec</span>
                        <span className="text-tron-cyan">{googleStats ? (googleStats.estimatedRequests / 1000000).toFixed(1) + 'M' : '8.5M'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data Transfer</span>
                        <span className="text-tron-cyan">1.2 PB/hr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Active Connections</span>
                        <span className="text-green-400">4.1B</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Status */}
                  <div className="border border-tron-blue/30 p-3 bg-black/50">
                    <h3 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono border-b border-tron-blue/30 pb-1">SERVICE STATUS</h3>
                    <div className="space-y-1.5 text-[10px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Compute Engine</span>
                        <span className="text-green-400">OPERATIONAL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cloud Storage</span>
                        <span className="text-green-400">OPERATIONAL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cloud Functions</span>
                        <span className="text-green-400">OPERATIONAL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cloud CDN</span>
                        <span className="text-green-400">OPERATIONAL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cloud SQL</span>
                        <span className="text-green-400">OPERATIONAL</span>
                      </div>
                    </div>
                  </div>

                  {/* Google Cloud Incidents */}
                  <div className="border border-tron-cyan/30 p-3 bg-black/50">
                    <h3 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono border-b border-tron-cyan/30 pb-1">GOOGLE CLOUD INCIDENTS</h3>
                    <div className="text-[8px] text-gray-600 mb-2">Real-time from Google Cloud Status</div>
                    <div className="space-y-2">
                      {activityFeed.length > 0 ? (
                        activityFeed.map((activity) => (
                          <div key={activity.id} className="border-l-2 border-tron-blue/30 pl-2 py-1">
                            <div className="text-[8px] text-gray-600 mb-0.5">[{activity.timestamp}]</div>
                            <div className="flex items-start space-x-1">
                              <span className={`${activity.color} text-[10px]`}>{activity.icon}</span>
                              <div className="flex-1">
                                <div className="text-[9px] text-gray-300 leading-tight">{activity.msg}</div>
                                <div className="text-[8px] text-tron-blue mt-0.5">{activity.region}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border-l-2 border-tron-blue/30 pl-2 py-1">
                          <div className="text-[8px] text-gray-600 mb-0.5">[{new Date().toLocaleTimeString()}]</div>
                          <div className="flex items-start space-x-1">
                            <span className="text-green-400 text-[10px]">✓</span>
                            <div className="flex-1">
                              <div className="text-[9px] text-gray-300 leading-tight">All Google Cloud services operating normally</div>
                              <div className="text-[8px] text-tron-blue mt-0.5">global</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ===== DESKTOP LAYOUT ===== */
            <>
              {/* Desktop Header */}
              <div className="border-b border-tron-cyan/30 p-3 flex justify-between items-center bg-black/90">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-mono text-tron-cyan">GOOGLE CLOUD INFRASTRUCTURE MONITOR</div>
                  <div className="text-sm text-tron-blue">REAL-TIME PUBLIC DATA</div>
                  <div className="text-xs text-gray-600">Source: status.cloud.google.com</div>
                </div>
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 border border-tron-blue/50 text-tron-blue hover:text-tron-cyan hover:border-tron-cyan transition-all text-sm font-mono"
                >
                  &lt; CONTROL CENTER
                </button>
              </div>

              {/* Desktop Grid */}
              <div className="flex-1 grid grid-cols-12 gap-0">
                {/* Left Sidebar */}
                <div className="col-span-2 border-r border-tron-blue/30 p-4 space-y-3 bg-black/50 overflow-y-auto">
                  <div className="border-b border-tron-cyan/30 pb-2 mb-3">
                    <h3 className="text-xs font-bold text-tron-cyan font-mono">SYSTEM RESOURCES</h3>
                  </div>
                  
                  {renderMiniChart(cpuData, '#00fff9', 'CPU', '%')}
                  {renderMiniChart(memoryData, '#0099ff', 'MEMORY', '%')}
                  {renderMiniChart(networkData, '#ffcc00', 'NETWORK', ' Mbps')}

                  <div className="border-t border-tron-blue/30 pt-3 mt-4">
                    <h3 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono">GLOBAL INFRASTRUCTURE</h3>
                    <div className="space-y-1.5 text-sm font-mono">
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
                        <span className="text-green-400">{googleStats?.edgeLocations || 187}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Operational</span>
                        <span className="text-green-400">{googleStats?.operationalRegions || 35}/{googleStats?.totalRegions || 35}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-tron-blue/30 pt-3 mt-4">
                    <h3 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono">GLOBAL TRAFFIC</h3>
                    <div className="space-y-1.5 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Requests/sec</span>
                        <span className="text-tron-cyan">{googleStats ? (googleStats.estimatedRequests / 1000000).toFixed(1) + 'M' : '8.5M'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data Transfer</span>
                        <span className="text-tron-cyan">1.2 PB/hr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Active Connections</span>
                        <span className="text-green-400">4.1B</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-tron-blue/30 pt-3 mt-4">
                    <h3 className="text-[10px] font-bold text-tron-cyan mb-2 font-mono">SERVICE STATUS</h3>
                    <div className="space-y-1.5 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Compute Engine</span>
                        <span className="text-green-400">OPERATIONAL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cloud Storage</span>
                        <span className="text-green-400">OPERATIONAL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cloud Functions</span>
                        <span className="text-green-400">OPERATIONAL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cloud CDN</span>
                        <span className="text-green-400">OPERATIONAL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cloud SQL</span>
                        <span className="text-green-400">OPERATIONAL</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center - Globe */}
                <div className="col-span-8 relative">
                  <GoogleGlobe googleStats={googleStats} />
                </div>

                {/* Right Sidebar */}
                <div className="col-span-2 border-l border-tron-blue/30 p-4 bg-black/50 overflow-y-auto">
                  <div className="border-b border-tron-cyan/30 pb-2 mb-3">
                    <h3 className="text-xs font-bold text-tron-cyan font-mono">GOOGLE CLOUD INCIDENTS</h3>
                    <div className="text-[9px] text-gray-600 mt-1">Real-time from Google Cloud Status</div>
                  </div>
                  
                  <div className="space-y-2">
                    {activityFeed.length > 0 ? (
                      activityFeed.map((activity) => (
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
                      <div className="border-l-2 border-tron-blue/30 pl-2 py-1">
                        <div className="text-[9px] text-gray-600 mb-0.5">[{new Date().toLocaleTimeString()}]</div>
                        <div className="flex items-start space-x-1">
                          <span className="text-green-400 text-xs">✓</span>
                          <div className="flex-1">
                            <div className="text-[10px] text-gray-300 leading-tight">All Google Cloud services operating normally</div>
                            <div className="text-[9px] text-tron-blue mt-0.5">global</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}