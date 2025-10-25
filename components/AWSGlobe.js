'use client';

import { useEffect, useRef } from 'react';

export default function AWSGlobe({ awsStats }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let root, chart;
    let starsScene, satellitesScene;
    let rotationAnimation;

    const initGlobe = async () => {
      try {
        if (!containerRef.current) return;

        // Load dependencies
        const am5 = await import('@amcharts/amcharts5');
        const am5map = await import('@amcharts/amcharts5/map');
        const am5geodata_worldLow = await import('@amcharts/amcharts5-geodata/worldLow');
        const am5themes_Animated = await import('@amcharts/amcharts5/themes/Animated');
        const THREE = await import('three');

        // Create root
        root = am5.Root.new(containerRef.current);
        
        // Set themes
        root.setThemes([am5themes_Animated.default.new(root)]);
        
        // Remove amCharts logo
        if (root._logo) {
          root._logo.dispose();
        }

        // Create map chart - FIXED positioning and zoom disabled
        chart = root.container.children.push(
          am5map.MapChart.new(root, {
            projection: am5map.geoOrthographic(),
            panX: "rotateX",
            panY: "rotateY",
            rotationX: -10,
            rotationY: 0,
            wheelY: "none", // DISABLE ZOOM
            wheelX: "none", // DISABLE ZOOM
            pinchZoom: false, // DISABLE PINCH ZOOM
            maxZoomLevel: 1, // LOCK ZOOM
            minZoomLevel: 1, // LOCK ZOOM
            scale: 0.88, // 10% larger than 0.8
            centerX: am5.percent(50),
            centerY: am5.percent(50),
            x: am5.percent(50),
            y: am5.percent(50),
          })
        );

        // Disable all zoom interactions
        chart.chartContainer.wheelable = false;
        chart.chartContainer.events.on("wheel", function(ev) {
          ev.originalEvent.preventDefault();
          ev.originalEvent.stopPropagation();
        });

        // Create polygon series for countries
        const polygonSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow.default,
          })
        );

        // Style countries - TRON blue
        polygonSeries.mapPolygons.template.setAll({
          fill: am5.color(0x0099ff),
          stroke: am5.color(0x000000),
          strokeWidth: 0.5,
          tooltipText: "{name}",
        });

        // Hover state
        polygonSeries.mapPolygons.template.states.create("hover", {
          fill: am5.color(0x00fff9),
        });

        // Graticule (grid lines)
        const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {
          step: 15
        }));
        graticuleSeries.mapLines.template.setAll({
          stroke: am5.color(0x00fff9),
          strokeOpacity: 0.1,
          strokeWidth: 0.5,
        });

        // Background (ocean)
        const backgroundSeries = chart.series.unshift(
          am5map.MapPolygonSeries.new(root, {})
        );
        backgroundSeries.mapPolygons.template.setAll({
          fill: am5.color(0x001122),
          fillOpacity: 0.8,
          strokeOpacity: 0,
        });
        backgroundSeries.data.push({
          geometry: am5map.getGeoRectangle(90, 180, -90, -180),
        });

        // AWS Regions - simplified labels
        const awsRegions = [
          // US Regions
          { lat: 39.0458, lon: -77.6413, name: "us-east-1", label: "Virginia" },
          { lat: 40.0150, lon: -83.0114, name: "us-east-2", label: "Ohio" },
          { lat: 37.3541, lon: -121.9552, name: "us-west-1", label: "N.California" },
          { lat: 45.5152, lon: -122.6784, name: "us-west-2", label: "Oregon" },
          // Canada
          { lat: 45.5017, lon: -73.5673, name: "ca-central-1", label: "Montreal" },
          // Europe
          { lat: 53.3498, lon: -6.2603, name: "eu-west-1", label: "Ireland" },
          { lat: 51.5074, lon: -0.1278, name: "eu-west-2", label: "London" },
          { lat: 48.8566, lon: 2.3522, name: "eu-west-3", label: "Paris" },
          { lat: 50.1109, lon: 8.6821, name: "eu-central-1", label: "Frankfurt" },
          { lat: 59.3293, lon: 18.0686, name: "eu-north-1", label: "Stockholm" },
          // Asia Pacific
          { lat: 35.6762, lon: 139.6503, name: "ap-northeast-1", label: "Tokyo" },
          { lat: 37.5665, lon: 126.9780, name: "ap-northeast-2", label: "Seoul" },
          { lat: 1.3521, lon: 103.8198, name: "ap-southeast-1", label: "Singapore" },
          { lat: -33.8688, lon: 151.2093, name: "ap-southeast-2", label: "Sydney" },
          { lat: 19.0760, lon: 72.8777, name: "ap-south-1", label: "Mumbai" },
          // Middle East
          { lat: 26.0667, lon: 50.5577, name: "me-south-1", label: "Bahrain" },
          // South America
          { lat: -23.5505, lon: -46.6333, name: "sa-east-1", label: "São Paulo" },
          // Africa
          { lat: -33.9249, lon: 18.4241, name: "af-south-1", label: "Cape Town" },
        ];

        // Create point series for AWS regions
        const pointSeries = chart.series.push(
          am5map.MapPointSeries.new(root, {})
        );

        // AWS region markers with better labels
        awsRegions.forEach((region) => {
          pointSeries.data.push({
            geometry: { type: "Point", coordinates: [region.lon, region.lat] },
            title: region.label,
            id: region.name,
          });
        });

        // Style AWS markers - simpler, more readable
        pointSeries.bullets.push(function(root, series, dataItem) {
          const container = am5.Container.new(root, {});
          
          // Red dot
          const circle = am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0xff0044),
            stroke: am5.color(0xff6688),
            strokeWidth: 2,
            strokeOpacity: 0.5,
          });
          
          // Subtle pulse
          circle.animate({
            key: "scale",
            from: 1,
            to: 1.2,
            duration: 2000,
            easing: am5.ease.out(am5.ease.cubic),
            loops: Infinity,
          });
          
          container.children.push(circle);
          
          // Simplified label - larger font, better contrast
          const label = am5.Label.new(root, {
            text: "{title}",
            populateText: true,
            fontSize: 12,
            fontWeight: "600",
            fill: am5.color(0xffffff),
            centerX: am5.percent(50),
            centerY: am5.percent(100),
            dy: -14,
            background: am5.Rectangle.new(root, {
              fill: am5.color(0x000000),
              fillOpacity: 0.85,
              cornerRadius: 3,
            }),
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 6,
            paddingRight: 6,
          });
          
          container.children.push(label);
          
          return am5.Bullet.new(root, {
            sprite: container,
          });
        });

        // City locations for satellite paths
        const cityLocations = [
          { lat: 40.7128, lon: -74.0060, name: "New York" },
          { lat: 51.5074, lon: -0.1278, name: "London" },
          { lat: 35.6762, lon: 139.6503, name: "Tokyo" },
          { lat: 48.8566, lon: 2.3522, name: "Paris" },
          { lat: -33.8688, lon: 151.2093, name: "Sydney" },
          { lat: 1.3521, lon: 103.8198, name: "Singapore" },
          { lat: 37.7749, lon: -122.4194, name: "San Francisco" },
          { lat: -23.5505, lon: -46.6333, name: "São Paulo" },
          { lat: 55.7558, lon: 37.6173, name: "Moscow" },
          { lat: 39.9042, lon: 116.4074, name: "Beijing" },
          { lat: 19.0760, lon: 72.8777, name: "Mumbai" },
          { lat: 25.2048, lon: 55.2708, name: "Dubai" },
          { lat: -26.2041, lon: 28.0473, name: "Johannesburg" },
          { lat: 30.0444, lon: 31.2357, name: "Cairo" },
          { lat: 52.5200, lon: 13.4050, name: "Berlin" },
          { lat: 43.6532, lon: -79.3832, name: "Toronto" },
        ];

        // SLOWER, SMOOTHER ROTATION
        let isInteracting = false;
        let rotationSpeed = 0.2; // Much slower rotation
        
        // Start rotation animation
        const startRotation = () => {
          if (rotationAnimation) {
            rotationAnimation.stop();
          }
          
          rotationAnimation = chart.animate({
            key: "rotationX",
            from: chart.get("rotationX"),
            to: chart.get("rotationX") + 36000,
            duration: 10000000, // Much slower
            loops: Infinity,
            easing: am5.ease.linear,
          });
        };

        // Handle interaction
        chart.chartContainer.events.on("pointerdown", () => {
          isInteracting = true;
          if (rotationAnimation) {
            rotationAnimation.stop();
          }
        });

        chart.chartContainer.events.on("globalpointerup", () => {
          isInteracting = false;
          // Resume rotation immediately
          setTimeout(() => {
            if (!isInteracting) {
              startRotation();
            }
          }, 50);
        });

        // Start initial rotation
        startRotation();

        // ===== THREE.JS STARS BACKGROUND =====
        const starsCanvas = document.createElement('canvas');
        starsCanvas.style.position = 'absolute';
        starsCanvas.style.top = '0';
        starsCanvas.style.left = '0';
        starsCanvas.style.width = '100%';
        starsCanvas.style.height = '100%';
        starsCanvas.style.pointerEvents = 'none';
        starsCanvas.style.zIndex = '0';
        containerRef.current.style.position = 'relative';
        containerRef.current.insertBefore(starsCanvas, containerRef.current.firstChild);

        const starsRenderer = new THREE.WebGLRenderer({ 
          canvas: starsCanvas,
          alpha: true,
          antialias: true 
        });
        starsRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);

        starsScene = new THREE.Scene();
        const starsCamera = new THREE.PerspectiveCamera(
          45,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000
        );
        starsCamera.position.z = 3;

        // Create stars
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 1500;
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
          const radius = 4 + Math.random() * 10;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          starPositions[i * 3 + 2] = radius * Math.cos(phi);
          
          const brightness = 0.5 + Math.random() * 0.5;
          starColors[i * 3] = brightness * 0.8;
          starColors[i * 3 + 1] = brightness * 0.9;
          starColors[i * 3 + 2] = brightness;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        
        const starsMaterial = new THREE.PointsMaterial({
          size: 0.015,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
        });
        
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        starsScene.add(stars);

        // ===== THREE.JS SATELLITES - PROPERLY SYNCED =====
        const satellitesCanvas = document.createElement('canvas');
        satellitesCanvas.style.position = 'absolute';
        satellitesCanvas.style.top = '0';
        satellitesCanvas.style.left = '0';
        satellitesCanvas.style.width = '100%';
        satellitesCanvas.style.height = '100%';
        satellitesCanvas.style.pointerEvents = 'none';
        satellitesCanvas.style.zIndex = '2';
        containerRef.current.appendChild(satellitesCanvas);

        const satellitesRenderer = new THREE.WebGLRenderer({ 
          canvas: satellitesCanvas,
          alpha: true,
          antialias: true 
        });
        satellitesRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);

        satellitesScene = new THREE.Scene();
        const satellitesCamera = new THREE.PerspectiveCamera(
          45,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000
        );
        satellitesCamera.position.z = 3; // Match the globe distance

        // Satellites group that rotates with globe
        const satellitesGroup = new THREE.Group();
        satellitesScene.add(satellitesGroup);

        let satellites = [];

        // FIXED: Better lat/lon to 3D conversion matching globe scale
        const latLonToVector3 = (lat, lon, radius = 1.05) => {
          // Adjusted to match the globe's visual size
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          
          return new THREE.Vector3(
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
          );
        };

        // Create satellite function
        const createSatellite = () => {
          // Pick two different cities
          const fromCity = cityLocations[Math.floor(Math.random() * cityLocations.length)];
          let toCity = cityLocations[Math.floor(Math.random() * cityLocations.length)];
          
          // Ensure they're different and have some distance
          while (toCity === fromCity) {
            toCity = cityLocations[Math.floor(Math.random() * cityLocations.length)];
          }

          // Get 3D positions - closer to globe surface
          const fromPos = latLonToVector3(fromCity.lat, fromCity.lon, 1.08);
          const toPos = latLonToVector3(toCity.lat, toCity.lon, 1.08);

          // Create arc with reasonable height
          const midPoint = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5);
          const distance = fromPos.distanceTo(toPos);
          const arcHeight = Math.min(0.3, 0.1 + distance * 0.08); // Limited arc height
          midPoint.normalize().multiplyScalar(1.08 + arcHeight);

          const curve = new THREE.QuadraticBezierCurve3(fromPos, midPoint, toPos);
          const points = curve.getPoints(40);
          
          // Path line
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ddff,
            transparent: true,
            opacity: 0.2,
            linewidth: 1,
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          satellitesGroup.add(line);

          // Satellite dot - smaller
          const satGeometry = new THREE.SphereGeometry(0.008, 6, 6);
          const satMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffcc00,
            transparent: true,
            opacity: 0.9,
          });
          const satellite = new THREE.Mesh(satGeometry, satMaterial);
          satellitesGroup.add(satellite);

          // Glowing trail - smaller
          const trailGeometry = new THREE.SphereGeometry(0.012, 6, 6);
          const trailMaterial = new THREE.MeshBasicMaterial({
            color: 0xffcc00,
            transparent: true,
            opacity: 0.3,
          });
          const trail = new THREE.Mesh(trailGeometry, trailMaterial);
          satellitesGroup.add(trail);

          // Store satellite data
          satellites.push({
            mesh: satellite,
            trail: trail,
            line: line,
            curve: curve,
            progress: 0,
            speed: 0.002 + Math.random() * 0.003, // Slower speed
          });

          // Remove after completion
          setTimeout(() => {
            satellitesGroup.remove(line);
            satellitesGroup.remove(satellite);
            satellitesGroup.remove(trail);
            satellites = satellites.filter(s => s.mesh !== satellite);
          }, 30000);
        };

        // Create initial satellites
        for (let i = 0; i < 6; i++) {
          setTimeout(() => createSatellite(), i * 800);
        }
        
        // Keep creating new satellites
        setInterval(createSatellite, 3000);

        // FIXED SYNC: Track rotation properly
        let lastFrameTime = Date.now();
        
        // Animation loop with proper sync
        const animate = () => {
          requestAnimationFrame(animate);
          
          const currentTime = Date.now();
          const deltaTime = (currentTime - lastFrameTime) / 1000;
          lastFrameTime = currentTime;
          
          // Rotate stars slowly
          stars.rotation.y += 0.0002;
          stars.rotation.x += 0.0001;
          
          // CRITICAL FIX: Sync satellites with globe using the ACTUAL rotation values
          const currentRotationX = chart.get("rotationX") || 0;
          const currentRotationY = chart.get("rotationY") || 0;
          
          // Direct sync - satellites follow globe rotation exactly
          satellitesGroup.rotation.y = (currentRotationX * Math.PI) / 180;
          satellitesGroup.rotation.x = -(currentRotationY * Math.PI) / 180;
          
          // Animate satellites along their paths
          satellites.forEach(sat => {
            sat.progress += sat.speed;
            if (sat.progress <= 1) {
              const pos = sat.curve.getPoint(sat.progress);
              sat.mesh.position.copy(pos);
              sat.trail.position.copy(pos);
              
              // Fade effects
              sat.line.material.opacity = Math.sin(sat.progress * Math.PI) * 0.2;
              sat.trail.material.opacity = (1 - sat.progress) * 0.3;
              sat.mesh.material.opacity = 0.9 - (sat.progress * 0.2);
            }
          });
          
          starsRenderer.render(starsScene, starsCamera);
          satellitesRenderer.render(satellitesScene, satellitesCamera);
        };
        
        animate();

        // Handle window resize
        const handleResize = () => {
          if (!containerRef.current) return;
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          
          starsCamera.aspect = width / height;
          starsCamera.updateProjectionMatrix();
          starsRenderer.setSize(width, height);
          
          satellitesCamera.aspect = width / height;
          satellitesCamera.updateProjectionMatrix();
          satellitesRenderer.setSize(width, height);
        };
        
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (rotationAnimation) {
            rotationAnimation.stop();
          }
        };

      } catch (error) {
        console.error('Error initializing globe:', error);
      }
    };

    initGlobe();

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: '600px' }} />

      {/* Stats Overlay */}
      <div className="absolute top-6 right-6 space-y-3 text-right font-mono z-20">
        <div className="text-cyan-400 text-sm backdrop-blur-sm bg-black/50 px-3 py-1 rounded">
          ACTIVE CONNECTIONS: 
          <span className="text-white font-bold text-lg ml-2">
            {awsStats?.estimatedRequests ? (awsStats.estimatedRequests / 1000).toFixed(1) + 'K' : '5.2M'}/sec
          </span>
        </div>
        <div className="text-cyan-400 text-sm backdrop-blur-sm bg-black/50 px-3 py-1 rounded">
          DATA TRANSFERRED: 
          <span className="text-white font-bold text-lg ml-2">847 TB/hr</span>
        </div>
        <div className="text-cyan-400 text-sm backdrop-blur-sm bg-black/50 px-3 py-1 rounded">
          REGIONS ONLINE: 
          <span className="text-green-400 font-bold text-lg ml-2">
            {awsStats?.operationalRegions || 18}/{awsStats?.totalRegions || 18}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 font-mono text-xs z-20">
        <div className="backdrop-blur-sm bg-black/50 px-3 py-2 rounded space-y-1">
          <div className="text-cyan-400">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            AWS REGIONS
          </div>
          <div className="text-cyan-400">
            <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
            DATA TRANSFER
          </div>
        </div>
      </div>
    </div>
  );
}