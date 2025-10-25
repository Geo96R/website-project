'use client';

import { useEffect, useRef } from 'react';

export default function GoogleGlobe({ googleStats }) {
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

        // Style countries - Google Cloud blue
        polygonSeries.mapPolygons.template.setAll({
          fill: am5.color(0x4285f4), // Google blue
          stroke: am5.color(0x000000),
          strokeWidth: 0.5,
          tooltipText: "{name}",
        });

        // Hover state
        polygonSeries.mapPolygons.template.states.create("hover", {
          fill: am5.color(0x34a853), // Google green
        });

        // Graticule (grid lines)
        const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {
          step: 15
        }));
        graticuleSeries.mapLines.template.setAll({
          stroke: am5.color(0x34a853), // Google green
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

        // Google Cloud Regions - simplified labels
        const googleRegions = [
          // US Regions
          { lat: 37.7749, lon: -122.4194, name: "us-central1", label: "Iowa" },
          { lat: 40.7128, lon: -74.0060, name: "us-east1", label: "South Carolina" },
          { lat: 25.7617, lon: -80.1918, name: "us-east4", label: "Virginia" },
          { lat: 34.0522, lon: -118.2437, name: "us-west1", label: "Oregon" },
          { lat: 45.5152, lon: -122.6784, name: "us-west2", label: "Los Angeles" },
          { lat: 25.7617, lon: -80.1918, name: "us-west3", label: "Salt Lake City" },
          { lat: 33.4484, lon: -112.0740, name: "us-west4", label: "Las Vegas" },
          // Europe
          { lat: 50.1109, lon: 8.6821, name: "europe-west1", label: "Belgium" },
          { lat: 51.5074, lon: -0.1278, name: "europe-west2", label: "London" },
          { lat: 52.5200, lon: 13.4050, name: "europe-west3", label: "Frankfurt" },
          { lat: 48.8566, lon: 2.3522, name: "europe-west4", label: "Netherlands" },
          { lat: 41.9028, lon: 12.4964, name: "europe-west6", label: "Zurich" },
          { lat: 60.1699, lon: 24.9384, name: "europe-west8", label: "Milan" },
          { lat: 59.3293, lon: 18.0686, name: "europe-west9", label: "Paris" },
          { lat: 55.7558, lon: 37.6173, name: "europe-west10", label: "Warsaw" },
          { lat: 50.1109, lon: 8.6821, name: "europe-north1", label: "Finland" },
          // Asia Pacific
          { lat: 35.6762, lon: 139.6503, name: "asia-northeast1", label: "Tokyo" },
          { lat: 37.5665, lon: 126.9780, name: "asia-northeast2", label: "Osaka" },
          { lat: 1.3521, lon: 103.8198, name: "asia-southeast1", label: "Singapore" },
          { lat: -33.8688, lon: 151.2093, name: "asia-southeast2", label: "Sydney" },
          { lat: 19.0760, lon: 72.8777, name: "asia-south1", label: "Mumbai" },
          { lat: 22.3193, lon: 114.1694, name: "asia-east1", label: "Hong Kong" },
          { lat: 25.0330, lon: 121.5654, name: "asia-east2", label: "Taiwan" },
          // Other regions
          { lat: -23.5505, lon: -46.6333, name: "southamerica-east1", label: "São Paulo" },
          { lat: 26.0667, lon: 50.5577, name: "me-west1", label: "Tel Aviv" },
          { lat: -33.9249, lon: 18.4241, name: "africa-south1", label: "Johannesburg" },
        ];

        // Create point series for Google Cloud regions
        const pointSeries = chart.series.push(
          am5map.MapPointSeries.new(root, {})
        );

        // Google Cloud region markers with better labels
        googleRegions.forEach((region) => {
          pointSeries.data.push({
            geometry: { type: "Point", coordinates: [region.lon, region.lat] },
            title: region.label,
            id: region.name,
          });
        });

        // Style Google Cloud markers - Google colors
        pointSeries.bullets.push(function(root, series, dataItem) {
          const container = am5.Container.new(root, {});
          
          // Google blue dot
          const circle = am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0x4285f4), // Google blue
            stroke: am5.color(0x34a853), // Google green
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
          { lat: 1.3521, lon: 103.8198, name: "Singapore" },
          { lat: -33.8688, lon: 151.2093, name: "Sydney" },
          { lat: 37.7749, lon: -122.4194, name: "San Francisco" },
          { lat: 48.8566, lon: 2.3522, name: "Paris" },
          { lat: 52.5200, lon: 13.4050, name: "Berlin" },
          { lat: 19.0760, lon: 72.8777, name: "Mumbai" },
          { lat: 22.3193, lon: 114.1694, name: "Hong Kong" },
        ];

        // Auto-rotate the globe with proper interaction handling
        let isInteracting = false;
        let rotationSpeed = 0.2;
        
        // Start rotation animation
        const startRotation = () => {
          if (rotationAnimation) {
            rotationAnimation.stop();
          }
          
          rotationAnimation = chart.animate({
            key: "rotationX",
            from: chart.get("rotationX"),
            to: chart.get("rotationX") + 36000,
            duration: 10000000,
            loops: Infinity,
            easing: am5.ease.linear
          });
        };

        // Start initial rotation
        startRotation();

        // Handle interaction
        chart.chartContainer.events.on("pointerdown", () => {
          isInteracting = true;
          if (rotationAnimation) {
            rotationAnimation.stop();
          }
        });

        chart.chartContainer.events.on("globalpointerup", () => {
          isInteracting = false;
          setTimeout(() => {
            if (!isInteracting) {
              startRotation();
            }
          }, 2000);
        });

        // ===== ADD STARS (Three.js background layer) =====
        const starsCanvas = document.createElement('canvas');
        starsCanvas.style.position = 'absolute';
        starsCanvas.style.top = '0';
        starsCanvas.style.left = '0';
        starsCanvas.style.width = '100%';
        starsCanvas.style.height = '100%';
        starsCanvas.style.pointerEvents = 'none';
        starsCanvas.style.zIndex = '0'; // Behind amCharts globe
        containerRef.current.appendChild(starsCanvas);

        const starsRenderer = new THREE.WebGLRenderer({ 
          canvas: starsCanvas,
          alpha: true,
          antialias: true 
        });
        starsRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        starsRenderer.setClearColor(0x000000, 0);

        starsScene = new THREE.Scene();
        const starsCamera = new THREE.PerspectiveCamera(
          45,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000
        );
        starsCamera.position.z = 2.8;

        // Particle field (stars)
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 3000; // MORE stars
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
          const radius = 1.5 + Math.random() * 3; // Wider spread
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
          starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
          starPositions[i + 2] = radius * Math.cos(phi);
          
          // Mix of Google colors
          const colorChoice = Math.random();
          if (colorChoice > 0.7) {
            starColors[i] = 0.26; // Google blue
            starColors[i + 1] = 0.52;
            starColors[i + 2] = 0.96;
          } else {
            starColors[i] = 0.20; // Google green
            starColors[i + 1] = 0.66;
            starColors[i + 2] = 0.33;
          }
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        
        // Create circular star texture
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        const starTexture = new THREE.CanvasTexture(canvas);
        
        const starsMaterial = new THREE.PointsMaterial({
          size: 0.02,
          map: starTexture,
          transparent: true,
          opacity: 0.8,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        starsScene.add(stars);

        // ===== ADD SATELLITES (Three.js overlay layer) =====
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
        satellitesRenderer.setClearColor(0x000000, 0);

        satellitesScene = new THREE.Scene();
        const satellitesCamera = new THREE.PerspectiveCamera(
          45,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000
        );
        satellitesCamera.position.z = 2.8;

        // Create a group to hold all satellites so we can rotate them with the globe
        const satellitesGroup = new THREE.Group();
        satellitesScene.add(satellitesGroup);

        let satellites = [];
        let lastRotationX = chart.get("rotationX") || 0;
        let lastRotationY = chart.get("rotationY") || 0;

        // Helper function to convert lat/lon to 3D position (matching amCharts projection)
        const latLonToVector3 = (lat, lon, radius = 1.0) => {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          
          return new THREE.Vector3(
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
          );
        };

        const createSatellite = () => {
          // Pick two different random cities
          const from = cityLocations[Math.floor(Math.random() * cityLocations.length)];
          let to = cityLocations[Math.floor(Math.random() * cityLocations.length)];
          
          // Make sure they're different
          let attempts = 0;
          while (to === from && attempts < 10) {
            to = cityLocations[Math.floor(Math.random() * cityLocations.length)];
            attempts++;
          }

          // Convert to 3D positions using the correct projection
          const fromPos = latLonToVector3(from.lat, from.lon, 1.02);
          const toPos = latLonToVector3(to.lat, to.lon, 1.02);

          // Create arc midpoint with proper height
          const midPoint = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5);
          const distance = fromPos.distanceTo(toPos);
          const arcHeight = 0.2 + distance * 0.15; // Lower arcs
          midPoint.normalize().multiplyScalar(1 + arcHeight);

          // Create curved path
          const curve = new THREE.QuadraticBezierCurve3(fromPos, midPoint, toPos);
          const points = curve.getPoints(60);
          
          // Arc line - Google colors
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x34a853, // Google green
            transparent: true,
            opacity: 0.25,
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          satellitesGroup.add(line);

          // Satellite (moving dot) - Google colors
          const satGeometry = new THREE.SphereGeometry(0.008, 8, 8);
          const satMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4285f4, // Google blue
            transparent: true,
            opacity: 0.95,
          });
          const satellite = new THREE.Mesh(satGeometry, satMaterial);
          satellitesGroup.add(satellite);

          // Trail - Google colors
          const trailGeometry = new THREE.SphereGeometry(0.014, 8, 8);
          const trailMaterial = new THREE.MeshBasicMaterial({
            color: 0x4285f4, // Google blue
            transparent: true,
            opacity: 0.35,
          });
          const trail = new THREE.Mesh(trailGeometry, trailMaterial);
          satellitesGroup.add(trail);

          satellites.push({
            mesh: satellite,
            trail: trail,
            line: line,
            curve: curve,
            progress: 0,
            speed: 0.004 + Math.random() * 0.003,
          });

          // Remove after completion
          setTimeout(() => {
            satellitesGroup.remove(line);
            satellitesGroup.remove(satellite);
            satellitesGroup.remove(trail);
            satellites = satellites.filter(s => s.mesh !== satellite);
          }, 15000);
        };

        // Create satellites periodically - more frequent
        setInterval(createSatellite, 2000);
        for (let i = 0; i < 12; i++) {
          setTimeout(createSatellite, i * 300);
        }

        // Animation loop for stars and satellites
        const animate = () => {
          requestAnimationFrame(animate);
          
          // Rotate stars slowly
          stars.rotation.y += 0.0002;
          stars.rotation.x += 0.0001;
          
          // Sync satellite rotation with globe rotation
          const currentRotationX = chart.get("rotationX") || 0;
          const currentRotationY = chart.get("rotationY") || 0;
          
          // Apply rotation delta to satellites group
          const deltaX = (currentRotationX - lastRotationX) * (Math.PI / 180);
          const deltaY = (currentRotationY - lastRotationY) * (Math.PI / 180);
          
          satellitesGroup.rotation.y += deltaX;
          satellitesGroup.rotation.x -= deltaY;
          
          lastRotationX = currentRotationX;
          lastRotationY = currentRotationY;
          
          // Update satellites
          satellites.forEach(sat => {
            sat.progress += sat.speed;
            if (sat.progress <= 1) {
              const pos = sat.curve.getPoint(sat.progress);
              sat.mesh.position.copy(pos);
              sat.trail.position.copy(pos);
              sat.trail.material.opacity = (1 - sat.progress) * 0.4;
            }
          });
          
          starsRenderer.render(starsScene, starsCamera);
          satellitesRenderer.render(satellitesScene, satellitesCamera);
        };
        animate();

        // Handle resize
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
        };

      } catch (error) {
        console.error('Error initializing Google Cloud globe:', error);
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
    <div className="relative w-full h-full bg-black">
      <div ref={containerRef} className="w-full h-full" />

      {/* Stats Overlay */}
      <div className="absolute top-6 right-6 space-y-3 text-right font-mono">
        <div className="text-tron-cyan text-sm">
          ACTIVE CONNECTIONS: <span className="text-white font-bold text-lg">{googleStats?.estimatedRequests ? (googleStats.estimatedRequests / 1000).toFixed(1) + 'K' : '3.8M'}/sec</span>
        </div>
        <div className="text-tron-cyan text-sm">
          DATA TRANSFERRED: <span className="text-white font-bold text-lg">624 TB/hr</span>
        </div>
        <div className="text-tron-cyan text-sm">
          REGIONS ONLINE: <span className="text-white font-bold text-lg">{googleStats?.operationalRegions || 35}/{googleStats?.totalRegions || 35}</span>
        </div>
      </div>
    </div>
  );
}
