'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function RadioStream() {
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All origins');
  const [selectedGenre, setSelectedGenre] = useState('All genres');
  const [stations, setStations] = useState([]);
  const [presets, setPresets] = useState([]);
  const [frequency, setFrequency] = useState(87.7);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  // Countries list - alphabetical
  const countries = [
    'All origins', 'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bangladesh', 'Belarus', 'Belgium', 'Brazil', 'Bulgaria', 'Cambodia', 'Canada', 'Chile', 'China',
    'Colombia', 'Croatia', 'Czech Republic', 'Denmark', 'Egypt', 'Estonia', 'Finland', 'France',
    'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
    'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia',
    'Lebanon', 'Lithuania', 'Luxembourg', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand',
    'Nigeria', 'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia',
    'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain',
    'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
    'United States', 'Uruguay', 'Venezuela', 'Vietnam'
  ];
  
  const genres = [
    'All genres', 'Jazz', 'Rock', 'Pop', 'Electronic', 'News', 'Classical', 'Hip-Hop', 
    'Country', 'Blues', 'Folk', 'Reggae', 'R&B', 'Soul', 'Funk', 'Disco', 'Punk',
    'Metal', 'Alternative', 'Indie', 'Ambient', 'Chillout', 'Trance', 'House',
    'Techno', 'Drum & Bass', 'Dubstep', 'Trap', 'Lo-Fi', 'World Music', 'Latin',
    'Salsa', 'Bachata', 'Merengue', 'Samba', 'Bossa Nova', 'Flamenco', 'Celtic',
    'Traditional', 'Religious', 'Spiritual', 'Meditation', 'Nature Sounds'
  ];

  // Fetch radio stations from our API route
  const fetchRadioStations = async (country = null, genre = null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (country && country !== 'All origins') params.append('country', country);
      if (genre && genre !== 'All genres') params.append('genre', genre);
      if (searchTerm) params.append('search', searchTerm);
      
      const apiUrl = `/api/radio-stations${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('Fetching from our API route:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API route failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.stations && Array.isArray(data.stations)) {
        setStations(data.stations);
        console.log(`Successfully loaded ${data.stations.length} stations`);
      } else {
        throw new Error(data.error || 'Invalid response from API');
      }
      
    } catch (error) {
      console.error('Error fetching radio stations:', error);
      // Fallback to working stations
      setStations([
        { name: 'BBC World Service', country: 'United Kingdom', genre: 'News', frequency: 87.5, bitrate: 128, codec: 'MP3', tags: 'news, international', url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_world_service' },
        { name: 'Radio Paradise', country: 'United States', genre: 'Rock', frequency: 88.1, bitrate: 320, codec: 'AAC', tags: 'rock, alternative, indie', url: 'http://stream.radioparadise.com/aac-320' },
        { name: 'SomaFM Groove Salad', country: 'United States', genre: 'Electronic', frequency: 88.3, bitrate: 128, codec: 'MP3', tags: 'electronic, ambient', url: 'http://ice1.somafm.com/groovesalad-128-mp3' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Load stations on mount and when filters change
  useEffect(() => {
    fetchRadioStations(selectedCountry, selectedGenre);
  }, [selectedCountry, selectedGenre, searchTerm]);

  // Initialize presets
  useEffect(() => {
    const defaultPresets = [
      { name: 'J-Club Powerplay HipHop', country: 'Germany', genre: 'Hip-Hop', frequency: 102.1, bitrate: 128, codec: 'MP3', tags: 'hip-hop, rap, german', url: 'http://streams.radiobob.de/bob-live/mp3-192/mediaplayer' },
      { name: 'RTL France', country: 'France', genre: 'Pop', frequency: 88.5, bitrate: 128, codec: 'MP3', tags: 'pop, french, music', url: 'http://streaming.radio.rtl.fr/rtl-1-44-128' },
      { name: 'BBC World Service', country: 'United Kingdom', genre: 'News', frequency: 87.5, bitrate: 128, codec: 'MP3', tags: 'news, international', url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_world_service' },
      { name: 'SomaFM Groove Salad', country: 'United States', genre: 'Electronic', frequency: 88.3, bitrate: 128, codec: 'MP3', tags: 'electronic, ambient', url: 'http://ice1.somafm.com/groovesalad-128-mp3' },
      { name: 'ORF Hitradio Ö3', country: 'Austria', genre: 'Pop', frequency: 87.5, bitrate: 128, codec: 'MP3', tags: 'pop, austrian, music', url: 'http://mp3stream3.apasf.apa.at:8000/' },
      { name: 'Galei Zahal', country: 'Israel', genre: 'News', frequency: 88.0, bitrate: 128, codec: 'MP3', tags: 'news, israeli, hebrew', url: 'http://stream.radio.hu/radio1.mp3' }
    ];
    setPresets(defaultPresets);
  }, []);

  const handleStationSelect = (station) => {
    setCurrentStation(station);
    if (audioRef.current) {
      audioRef.current.src = station.url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All origins' || station.country === selectedCountry;
    const matchesGenre = selectedGenre === 'All genres' || station.genre === selectedGenre;
    return matchesSearch && matchesCountry && matchesGenre;
  });

  const addToPreset = (station, slot) => {
    const newPresets = [...presets];
    newPresets[slot] = station;
    setPresets(newPresets);
  };

  const handleFrequencyChange = (newFreq) => {
    setFrequency(newFreq);
    // Find the closest station to the frequency
    const closestStation = stations.reduce((prev, curr) => {
      return Math.abs(curr.frequency - newFreq) < Math.abs(prev.frequency - newFreq) ? curr : prev;
    });
    
    // Auto-tune to closest station within 0.5 MHz
    if (Math.abs(closestStation.frequency - newFreq) <= 0.5) {
      handleStationSelect(closestStation);
    }
  };

  return (
    <div className="min-h-screen bg-black text-tron-cyan">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="none" />
      
      {/* Header */}
      <div className="border-b border-tron-cyan/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-tron-cyan font-mono">
              RADIO <span className="text-tron-blue">.TERMINAL</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Real Radio Stream Interface</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlayPause}
              className="px-4 py-2 border border-tron-cyan text-tron-cyan hover:bg-tron-cyan hover:text-black transition-colors"
            >
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        
        {/* Left Column - Station Info & Controls */}
        <div className="space-y-6">
          
          {/* Current Station Status */}
          <div className="border border-tron-cyan/50 p-6 bg-black/50">
            <h2 className="text-lg font-bold text-tron-cyan font-mono mb-4">
              STATION <span className="text-tron-blue">.STATUS</span>
            </h2>
            {currentStation && (
              <div className="space-y-3">
                <div className="text-2xl font-bold text-white">{currentStation.name}</div>
                <div className="text-sm text-gray-400">{currentStation.country} - {currentStation.genre}</div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Bitrate:</span>
                  <span className="text-tron-cyan">{currentStation.bitrate} kbps</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Codec:</span>
                  <span className="text-tron-blue">{currentStation.codec}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">{isPlaying ? 'Online' : 'Offline'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Frequency:</span>
                  <span className="text-tron-cyan">{currentStation.frequency} FM</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">Tags: {currentStation.tags}</div>
              </div>
            )}
          </div>

          {/* Frequency Scanner */}
          <div className="border border-tron-blue/50 p-6 bg-black/50">
            <h2 className="text-lg font-bold text-tron-cyan font-mono mb-4">
              FREQUENCY <span className="text-tron-blue">.SCANNER</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">87.5 FM</span>
                <input
                  type="range"
                  min="87.5"
                  max="107.3"
                  step="0.1"
                  value={frequency}
                  onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm text-gray-400">107.3 FM</span>
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-tron-cyan">{frequency} FM</span>
              </div>
            </div>
          </div>

          {/* Preset Slots */}
          <div className="border border-tron-cyan/50 p-6 bg-black/50">
            <h2 className="text-lg font-bold text-tron-cyan font-mono mb-4">
              PRESET <span className="text-tron-blue">.SLOTS</span>
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((slot) => (
                <button
                  key={slot}
                  onClick={() => presets[slot - 1] && handleStationSelect(presets[slot - 1])}
                  className="p-2 border border-tron-blue/30 text-xs hover:border-tron-cyan hover:bg-tron-cyan/10 transition-colors"
                >
                  <div className="text-tron-blue">[{slot}]</div>
                  <div className="text-gray-400 truncate">
                    {presets[slot - 1] ? presets[slot - 1].name : 'Empty'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Filters & Station Directory */}
        <div className="space-y-6">
          
          {/* Filters */}
          <div className="border border-tron-blue/50 p-6 bg-black/50">
            <h2 className="text-lg font-bold text-tron-cyan font-mono mb-4">
              FILTERS <span className="text-tron-blue">.CONTROL</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">SEARCH</label>
                <input
                  type="text"
                  placeholder="Station, tag, or language"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 bg-black border border-tron-cyan/30 text-tron-cyan focus:border-tron-cyan focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">COUNTRY</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-2 bg-black border border-tron-cyan/30 text-tron-cyan focus:border-tron-cyan focus:outline-none"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">GENRE</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full p-2 bg-black border border-tron-cyan/30 text-tron-cyan focus:border-tron-cyan focus:outline-none"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">VOLUME</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-tron-cyan w-12">Level: {volume}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Station Directory */}
          <div className="border border-tron-cyan/50 p-6 bg-black/50">
            <h2 className="text-lg font-bold text-tron-cyan font-mono mb-4">
              STATION <span className="text-tron-blue">.DIRECTORY</span>
              {loading && <span className="text-tron-blue ml-2">(LOADING...)</span>}
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredStations.map((station, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 border rounded cursor-pointer transition-colors ${
                    currentStation && currentStation.name === station.name
                      ? 'border-tron-cyan bg-tron-cyan/10 text-tron-cyan'
                      : 'border-tron-blue/30 hover:border-tron-cyan hover:bg-tron-cyan/5'
                  }`}
                  onClick={() => handleStationSelect(station)}
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{station.frequency} FM {station.name}</div>
                    <div className="text-xs text-gray-400">{station.country} - {station.genre}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const slot = prompt('Enter preset slot (1-6):');
                        if (slot && slot >= 1 && slot <= 6) {
                          addToPreset(station, parseInt(slot) - 1);
                        }
                      }}
                      className="text-xs text-tron-blue hover:text-tron-cyan"
                    >
                      SET
                    </button>
                    {currentStation && currentStation.name === station.name && (
                      <span className="text-green-400">●</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}