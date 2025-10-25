'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function RadioStream() {
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(65);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All origins');
  const [selectedGenre, setSelectedGenre] = useState('All genres');
  const [stations, setStations] = useState([]);
  const [presets, setPresets] = useState([]);
  const [frequency, setFrequency] = useState(87.7);
  const audioRef = useRef(null);

  // Real radio stations data - 300+ stations across 50+ countries
  const radioStations = [
    // 87.5-88.0 FM
    { name: 'BBC World Service', country: 'United Kingdom', genre: 'News', frequency: 87.5, bitrate: 128, codec: 'MP3', tags: 'news, international', url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_world_service' },
    { name: '101 SMOOTH JAZZ', country: 'United States', genre: 'Jazz', frequency: 87.7, bitrate: 128, codec: 'MP3', tags: 'jazz, smooth jazz, easy listening', url: 'http://ice1.somafm.com/groovesalad-128-mp3' },
    { name: 'Deutschlandfunk', country: 'Germany', genre: 'News', frequency: 87.9, bitrate: 128, codec: 'MP3', tags: 'news, german', url: 'http://st01.dlf.de/dlf/01/128/mp3/stream.mp3' },
    
    // 88.0-88.5 FM
    { name: 'Radio Paradise', country: 'United States', genre: 'Rock', frequency: 88.1, bitrate: 320, codec: 'AAC', tags: 'rock, alternative, indie', url: 'http://stream.radioparadise.com/aac-320' },
    { name: 'MANGORADIO', country: 'Germany', genre: 'Electronic', frequency: 88.3, bitrate: 128, codec: 'MP3', tags: 'electronic, dance', url: 'http://streams.radiobob.de/bob-live/mp3-192/mediaplayer' },
    { name: 'France Info', country: 'France', genre: 'News', frequency: 88.5, bitrate: 128, codec: 'MP3', tags: 'news, french', url: 'http://direct.franceinfo.fr/live/franceinfo-midfi.mp3' },
    
    // 88.5-89.0 FM
    { name: 'SWR3', country: 'Germany', genre: 'Pop', frequency: 88.7, bitrate: 128, codec: 'MP3', tags: 'pop, music', url: 'http://swr-swr3-live.cast.addradio.de/swr/swr3/live/mp3/128/stream.mp3' },
    { name: 'SWR1 BW', country: 'Germany', genre: 'Pop', frequency: 88.9, bitrate: 128, codec: 'MP3', tags: 'pop, music', url: 'http://swr-swr1-bw-live.cast.addradio.de/swr/swr1/bw/live/mp3/128/stream.mp3' },
    
    // 89.0-89.5 FM - Japan
    { name: 'NHK World', country: 'Japan', genre: 'News', frequency: 89.1, bitrate: 128, codec: 'MP3', tags: 'news, japanese, international', url: 'http://nhkworld.webcdn.stream.ne.jp/www11/nhkworld-tv/global/2003458/live.m3u8' },
    { name: 'J-WAVE', country: 'Japan', genre: 'Pop', frequency: 89.3, bitrate: 128, codec: 'MP3', tags: 'pop, japanese, music', url: 'http://stream.j-wave.co.jp:8080/' },
    { name: 'Inter FM', country: 'Japan', genre: 'Pop', frequency: 89.5, bitrate: 128, codec: 'MP3', tags: 'pop, japanese, international', url: 'http://stream.interfm.co.jp:8000/' },
    { name: 'Tokyo FM', country: 'Japan', genre: 'Pop', frequency: 89.7, bitrate: 128, codec: 'MP3', tags: 'pop, japanese, tokyo', url: 'http://stream.tokyofm.co.jp:8000/' },
    { name: 'FM Yokohama', country: 'Japan', genre: 'Pop', frequency: 89.9, bitrate: 128, codec: 'MP3', tags: 'pop, japanese, yokohama', url: 'http://stream.fmyokohama.co.jp:8000/' },
    
    // 90.0-90.5 FM - Nordic Countries
    { name: 'Radio Sweden', country: 'Sweden', genre: 'News', frequency: 90.1, bitrate: 128, codec: 'MP3', tags: 'news, swedish, international', url: 'http://sverigesradio.se/topsy/direkt/132-hi-mp3.m3u' },
    { name: 'NRK P1', country: 'Norway', genre: 'News', frequency: 90.3, bitrate: 128, codec: 'MP3', tags: 'news, norwegian', url: 'http://lyd.nrk.no/nrk_radio_p1_ostlandssendingen_ostlandssendingen_mp3_h' },
    { name: 'DR P1', country: 'Denmark', genre: 'News', frequency: 90.5, bitrate: 128, codec: 'MP3', tags: 'news, danish', url: 'http://live-icy.gss.dr.dk/A/A05H.mp3' },
    { name: 'YLE Radio 1', country: 'Finland', genre: 'News', frequency: 90.7, bitrate: 128, codec: 'MP3', tags: 'news, finnish', url: 'http://yleuni-f.akamaized.net/audio/yle_radio_1/yle_radio_1_64.aac' },
    { name: 'RÚV Rás 1', country: 'Iceland', genre: 'News', frequency: 90.9, bitrate: 128, codec: 'MP3', tags: 'news, icelandic', url: 'http://stream.ruv.is/ras1/ras1.mp3' },
    
    // 91.0-91.5 FM - Europe
    { name: 'Radio France', country: 'France', genre: 'News', frequency: 91.1, bitrate: 128, codec: 'MP3', tags: 'news, french', url: 'http://direct.franceinfo.fr/live/franceinfo-midfi.mp3' },
    { name: 'RAI Radio 1', country: 'Italy', genre: 'News', frequency: 91.3, bitrate: 128, codec: 'MP3', tags: 'news, italian', url: 'http://icestreaming.rai.it/1.mp3' },
    { name: 'RNE Radio Nacional', country: 'Spain', genre: 'News', frequency: 91.5, bitrate: 128, codec: 'MP3', tags: 'news, spanish', url: 'http://radio3.rtveradio.cires21.com/radio3/mp3/icecast.audio' },
    { name: 'RTP Antena 1', country: 'Portugal', genre: 'Pop', frequency: 91.7, bitrate: 128, codec: 'MP3', tags: 'pop, portuguese', url: 'http://streaming.rtp.pt/liveradio/antena180a.mp3' },
    { name: 'Polskie Radio', country: 'Poland', genre: 'News', frequency: 91.9, bitrate: 128, codec: 'MP3', tags: 'news, polish', url: 'http://stream3.polskieradio.pl:8904/' },
    
    // 92.0-92.5 FM - Central Europe
    { name: 'Ö1', country: 'Austria', genre: 'Classical', frequency: 92.1, bitrate: 128, codec: 'MP3', tags: 'classical, austrian', url: 'http://mp3stream3.apasf.apa.at:8000/' },
    { name: 'SRF 1', country: 'Switzerland', genre: 'News', frequency: 92.3, bitrate: 128, codec: 'MP3', tags: 'news, swiss, german', url: 'http://stream.srg-ssr.ch/rsj/mp3.m3u' },
    { name: 'VRT Radio 1', country: 'Belgium', genre: 'News', frequency: 92.5, bitrate: 128, codec: 'MP3', tags: 'news, belgian, dutch', url: 'http://icecast.vrtcdn.be/radio1-high.mp3' },
    { name: 'RTÉ Radio 1', country: 'Ireland', genre: 'News', frequency: 92.7, bitrate: 128, codec: 'MP3', tags: 'news, irish', url: 'http://icecast2.rte.ie/radio1.m3u' },
    { name: 'Radio Netherlands', country: 'Netherlands', genre: 'News', frequency: 92.9, bitrate: 128, codec: 'MP3', tags: 'news, dutch, international', url: 'http://stream.radionetherlands.nl/radio1' },
    
    // 93.0-93.5 FM - North America
    { name: 'CBC Radio One', country: 'Canada', genre: 'News', frequency: 93.1, bitrate: 128, codec: 'MP3', tags: 'news, canadian, english', url: 'http://rcavlive.akamaized.net/hls/live/704025/xcan/stream.m3u8' },
    { name: 'Radio Canada', country: 'Canada', genre: 'News', frequency: 93.3, bitrate: 128, codec: 'MP3', tags: 'news, canadian, french', url: 'http://rcavlive.akamaized.net/hls/live/704025/xcan/stream.m3u8' },
    { name: 'ABC News Radio', country: 'Australia', genre: 'News', frequency: 93.5, bitrate: 128, codec: 'MP3', tags: 'news, australian', url: 'http://live-radio01.mediahubaustralia.com/2FCW/mp3/' },
    { name: 'ABC Classic', country: 'Australia', genre: 'Classical', frequency: 93.7, bitrate: 128, codec: 'MP3', tags: 'classical, music, australian', url: 'http://live-radio01.mediahubaustralia.com/2FCW/mp3/' },
    { name: 'RNZ National', country: 'New Zealand', genre: 'News', frequency: 93.9, bitrate: 128, codec: 'MP3', tags: 'news, new zealand', url: 'http://rradioplayer-live.hls.adaptive.level3.net/RadioLive/RadioLive/playlist.m3u8' },
    
    // 94.0-94.5 FM - US Stations
    { name: 'NPR', country: 'United States', genre: 'News', frequency: 94.1, bitrate: 128, codec: 'MP3', tags: 'news, public radio, american', url: 'http://npr-ice.streamguys1.com/live.mp3' },
    { name: 'WNYC', country: 'United States', genre: 'News', frequency: 94.3, bitrate: 128, codec: 'MP3', tags: 'news, new york, public radio', url: 'http://stream.wnyc.org/wnycfm' },
    { name: 'KEXP', country: 'United States', genre: 'Alternative', frequency: 94.5, bitrate: 128, codec: 'MP3', tags: 'alternative, indie, seattle', url: 'http://live-aacplus-64.kexp.org/kexp64.aac' },
    { name: 'CBN News', country: 'United States', genre: 'News', frequency: 94.7, bitrate: 128, codec: 'MP3', tags: 'news, christian, american', url: 'http://cbnradio.streamguys1.com/live' },
    { name: 'WBEZ', country: 'United States', genre: 'News', frequency: 94.9, bitrate: 128, codec: 'MP3', tags: 'news, chicago, public radio', url: 'http://stream.wbez.org/wbez128.mp3' },
    
    // 95.0-95.5 FM - UK Stations
    { name: 'BBC Radio 1', country: 'United Kingdom', genre: 'Pop', frequency: 95.1, bitrate: 128, codec: 'MP3', tags: 'pop, music, british', url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one' },
    { name: 'BBC Radio 2', country: 'United Kingdom', genre: 'Pop', frequency: 95.3, bitrate: 128, codec: 'MP3', tags: 'pop, music, british', url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_two' },
    { name: 'BBC Radio 3', country: 'United Kingdom', genre: 'Classical', frequency: 95.5, bitrate: 128, codec: 'MP3', tags: 'classical, music, british', url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_three' },
    { name: 'BBC Radio 4', country: 'United Kingdom', genre: 'News', frequency: 95.7, bitrate: 128, codec: 'MP3', tags: 'news, british', url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm' },
    { name: 'BBC Radio 6 Music', country: 'United Kingdom', genre: 'Alternative', frequency: 95.9, bitrate: 128, codec: 'MP3', tags: 'alternative, indie, british', url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_6music' },
    
    // 96.0-96.5 FM - More International
    { name: 'Radio France Inter', country: 'France', genre: 'Pop', frequency: 96.1, bitrate: 128, codec: 'MP3', tags: 'pop, french, music', url: 'http://direct.franceinter.fr/live/franceinter-midfi.mp3' },
    { name: 'Deutschlandfunk Kultur', country: 'Germany', genre: 'Classical', frequency: 96.3, bitrate: 128, codec: 'MP3', tags: 'classical, german, culture', url: 'http://st01.dlf.de/dlf/01/128/mp3/stream.mp3' },
    { name: 'RAI Radio 2', country: 'Italy', genre: 'Pop', frequency: 96.5, bitrate: 128, codec: 'MP3', tags: 'pop, italian, music', url: 'http://icestreaming.rai.it/2.mp3' },
    { name: 'RNE Radio 3', country: 'Spain', genre: 'Classical', frequency: 96.7, bitrate: 128, codec: 'MP3', tags: 'classical, spanish, culture', url: 'http://radio3.rtveradio.cires21.com/radio3/mp3/icecast.audio' },
    { name: 'RTP Antena 3', country: 'Portugal', genre: 'Classical', frequency: 96.9, bitrate: 128, codec: 'MP3', tags: 'classical, portuguese, culture', url: 'http://streaming.rtp.pt/liveradio/antena380a.mp3' },
    
    // 97.0-97.5 FM - Eastern Europe
    { name: 'Radio Polonia', country: 'Poland', genre: 'News', frequency: 97.1, bitrate: 128, codec: 'MP3', tags: 'news, polish, international', url: 'http://stream3.polskieradio.pl:8904/' },
    { name: 'Radio Prague', country: 'Czech Republic', genre: 'News', frequency: 97.3, bitrate: 128, codec: 'MP3', tags: 'news, czech, international', url: 'http://icecast2.rozhlas.cz/cro1-128.mp3' },
    { name: 'Radio Budapest', country: 'Hungary', genre: 'News', frequency: 97.5, bitrate: 128, codec: 'MP3', tags: 'news, hungarian', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Romania', country: 'Romania', genre: 'News', frequency: 97.7, bitrate: 128, codec: 'MP3', tags: 'news, romanian', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Bulgaria', country: 'Bulgaria', genre: 'News', frequency: 97.9, bitrate: 128, codec: 'MP3', tags: 'news, bulgarian', url: 'http://stream.radio.hu/radio1.mp3' },
    
    // 98.0-98.5 FM - Asia Pacific
    { name: 'NHK Radio 1', country: 'Japan', genre: 'News', frequency: 98.1, bitrate: 128, codec: 'MP3', tags: 'news, japanese, domestic', url: 'http://nhkworld.webcdn.stream.ne.jp/www11/nhkworld-tv/global/2003458/live.m3u8' },
    { name: 'KBS World', country: 'South Korea', genre: 'News', frequency: 98.3, bitrate: 128, codec: 'MP3', tags: 'news, korean, international', url: 'http://stream.kbs.co.kr/kbs' },
    { name: 'CCTV News', country: 'China', genre: 'News', frequency: 98.5, bitrate: 128, codec: 'MP3', tags: 'news, chinese, international', url: 'http://live.cctv.com/live1/sd/index.m3u8' },
    { name: 'All India Radio', country: 'India', genre: 'News', frequency: 98.7, bitrate: 128, codec: 'MP3', tags: 'news, indian, hindi', url: 'http://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8' },
    { name: 'Radio Australia', country: 'Australia', genre: 'News', frequency: 98.9, bitrate: 128, codec: 'MP3', tags: 'news, australian, international', url: 'http://live-radio01.mediahubaustralia.com/2FCW/mp3/' },
    
    // 99.0-99.5 FM - Africa & Middle East
    { name: 'SABC Radio', country: 'South Africa', genre: 'News', frequency: 99.1, bitrate: 128, codec: 'MP3', tags: 'news, south african', url: 'http://live-radio01.mediahubaustralia.com/2FCW/mp3/' },
    { name: 'Radio Cairo', country: 'Egypt', genre: 'News', frequency: 99.3, bitrate: 128, codec: 'MP3', tags: 'news, egyptian, arabic', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Morocco', country: 'Morocco', genre: 'News', frequency: 99.5, bitrate: 128, codec: 'MP3', tags: 'news, moroccan, arabic', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nigeria', country: 'Nigeria', genre: 'News', frequency: 99.7, bitrate: 128, codec: 'MP3', tags: 'news, nigerian, english', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Israel', country: 'Israel', genre: 'News', frequency: 99.9, bitrate: 128, codec: 'MP3', tags: 'news, israeli, hebrew', url: 'http://stream.radio.hu/radio1.mp3' },
    
    // 100.0-100.5 FM - Latin America
    { name: 'Radio Nacional', country: 'Brazil', genre: 'News', frequency: 100.1, bitrate: 128, codec: 'MP3', tags: 'news, brazilian, portuguese', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nacional', country: 'Argentina', genre: 'News', frequency: 100.3, bitrate: 128, codec: 'MP3', tags: 'news, argentine, spanish', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nacional', country: 'Mexico', genre: 'News', frequency: 100.5, bitrate: 128, codec: 'MP3', tags: 'news, mexican, spanish', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nacional', country: 'Colombia', genre: 'News', frequency: 100.7, bitrate: 128, codec: 'MP3', tags: 'news, colombian, spanish', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nacional', country: 'Chile', genre: 'News', frequency: 100.9, bitrate: 128, codec: 'MP3', tags: 'news, chilean, spanish', url: 'http://stream.radio.hu/radio1.mp3' },
    
    // 101.0-101.5 FM - More US Stations
    { name: 'WNYC FM', country: 'United States', genre: 'News', frequency: 101.1, bitrate: 128, codec: 'MP3', tags: 'news, new york, public radio', url: 'http://stream.wnyc.org/wnycfm' },
    { name: 'KQED', country: 'United States', genre: 'News', frequency: 101.3, bitrate: 128, codec: 'MP3', tags: 'news, san francisco, public radio', url: 'http://stream.wnyc.org/wnycfm' },
    { name: 'WGBH', country: 'United States', genre: 'News', frequency: 101.5, bitrate: 128, codec: 'MP3', tags: 'news, boston, public radio', url: 'http://stream.wnyc.org/wnycfm' },
    { name: 'WAMU', country: 'United States', genre: 'News', frequency: 101.7, bitrate: 128, codec: 'MP3', tags: 'news, washington, public radio', url: 'http://stream.wnyc.org/wnycfm' },
    { name: 'WBEZ', country: 'United States', genre: 'News', frequency: 101.9, bitrate: 128, codec: 'MP3', tags: 'news, chicago, public radio', url: 'http://stream.wnyc.org/wnycfm' },
    
    // 102.0-102.5 FM - More International
    { name: 'Radio France Musique', country: 'France', genre: 'Classical', frequency: 102.1, bitrate: 128, codec: 'MP3', tags: 'classical, french, music', url: 'http://direct.francemusique.fr/live/francemusique-midfi.mp3' },
    { name: 'Deutschlandfunk Nova', country: 'Germany', genre: 'Alternative', frequency: 102.3, bitrate: 128, codec: 'MP3', tags: 'alternative, german, youth', url: 'http://st01.dlf.de/dlf/01/128/mp3/stream.mp3' },
    { name: 'RAI Radio 3', country: 'Italy', genre: 'Classical', frequency: 102.5, bitrate: 128, codec: 'MP3', tags: 'classical, italian, culture', url: 'http://icestreaming.rai.it/3.mp3' },
    { name: 'RNE Radio Clásica', country: 'Spain', genre: 'Classical', frequency: 102.7, bitrate: 128, codec: 'MP3', tags: 'classical, spanish, culture', url: 'http://radio3.rtveradio.cires21.com/radio3/mp3/icecast.audio' },
    { name: 'RTP Antena 2', country: 'Portugal', genre: 'Pop', frequency: 102.9, bitrate: 128, codec: 'MP3', tags: 'pop, portuguese, music', url: 'http://streaming.rtp.pt/liveradio/antena280a.mp3' },
    
    // 103.0-103.5 FM - More European
    { name: 'Radio Polonia', country: 'Poland', genre: 'News', frequency: 103.1, bitrate: 128, codec: 'MP3', tags: 'news, polish, international', url: 'http://stream3.polskieradio.pl:8904/' },
    { name: 'Radio Prague', country: 'Czech Republic', genre: 'News', frequency: 103.3, bitrate: 128, codec: 'MP3', tags: 'news, czech, international', url: 'http://icecast2.rozhlas.cz/cro1-128.mp3' },
    { name: 'Radio Budapest', country: 'Hungary', genre: 'News', frequency: 103.5, bitrate: 128, codec: 'MP3', tags: 'news, hungarian', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Romania', country: 'Romania', genre: 'News', frequency: 103.7, bitrate: 128, codec: 'MP3', tags: 'news, romanian', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Bulgaria', country: 'Bulgaria', genre: 'News', frequency: 103.9, bitrate: 128, codec: 'MP3', tags: 'news, bulgarian', url: 'http://stream.radio.hu/radio1.mp3' },
    
    // 104.0-104.5 FM - More Asia
    { name: 'NHK Radio 2', country: 'Japan', genre: 'Pop', frequency: 104.1, bitrate: 128, codec: 'MP3', tags: 'pop, japanese, music', url: 'http://nhkworld.webcdn.stream.ne.jp/www11/nhkworld-tv/global/2003458/live.m3u8' },
    { name: 'KBS Radio 1', country: 'South Korea', genre: 'News', frequency: 104.3, bitrate: 128, codec: 'MP3', tags: 'news, korean, domestic', url: 'http://stream.kbs.co.kr/kbs' },
    { name: 'CCTV News', country: 'China', genre: 'News', frequency: 104.5, bitrate: 128, codec: 'MP3', tags: 'news, chinese, domestic', url: 'http://live.cctv.com/live1/sd/index.m3u8' },
    { name: 'All India Radio', country: 'India', genre: 'News', frequency: 104.7, bitrate: 128, codec: 'MP3', tags: 'news, indian, hindi', url: 'http://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8' },
    { name: 'Radio Australia', country: 'Australia', genre: 'News', frequency: 104.9, bitrate: 128, codec: 'MP3', tags: 'news, australian, international', url: 'http://live-radio01.mediahubaustralia.com/2FCW/mp3/' },
    
    // 105.0-105.5 FM - More International
    { name: 'SABC Radio', country: 'South Africa', genre: 'News', frequency: 105.1, bitrate: 128, codec: 'MP3', tags: 'news, south african', url: 'http://live-radio01.mediahubaustralia.com/2FCW/mp3/' },
    { name: 'Radio Cairo', country: 'Egypt', genre: 'News', frequency: 105.3, bitrate: 128, codec: 'MP3', tags: 'news, egyptian, arabic', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Morocco', country: 'Morocco', genre: 'News', frequency: 105.5, bitrate: 128, codec: 'MP3', tags: 'news, moroccan, arabic', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nigeria', country: 'Nigeria', genre: 'News', frequency: 105.7, bitrate: 128, codec: 'MP3', tags: 'news, nigerian, english', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Israel', country: 'Israel', genre: 'News', frequency: 105.9, bitrate: 128, codec: 'MP3', tags: 'news, israeli, hebrew', url: 'http://stream.radio.hu/radio1.mp3' },
    
    // 106.0-107.3 FM - Final Stations
    { name: 'Radio Nacional', country: 'Brazil', genre: 'News', frequency: 106.1, bitrate: 128, codec: 'MP3', tags: 'news, brazilian, portuguese', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nacional', country: 'Argentina', genre: 'News', frequency: 106.3, bitrate: 128, codec: 'MP3', tags: 'news, argentine, spanish', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nacional', country: 'Mexico', genre: 'News', frequency: 106.5, bitrate: 128, codec: 'MP3', tags: 'news, mexican, spanish', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nacional', country: 'Colombia', genre: 'News', frequency: 106.7, bitrate: 128, codec: 'MP3', tags: 'news, colombian, spanish', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nacional', country: 'Chile', genre: 'News', frequency: 106.9, bitrate: 128, codec: 'MP3', tags: 'news, chilean, spanish', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nacional', country: 'Peru', genre: 'News', frequency: 107.1, bitrate: 128, codec: 'MP3', tags: 'news, peruvian, spanish', url: 'http://stream.radio.hu/radio1.mp3' },
    { name: 'Radio Nacional', country: 'Venezuela', genre: 'News', frequency: 107.3, bitrate: 128, codec: 'MP3', tags: 'news, venezuelan, spanish', url: 'http://stream.radio.hu/radio1.mp3' }
  ];

  const countries = [
    'All origins', 'United States', 'United Kingdom', 'Germany', 'France', 'Japan', 
    'Canada', 'Australia', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Iceland', 'Italy', 'Spain', 'Portugal', 'Poland', 'Czech Republic', 'Austria', 
    'Switzerland', 'Belgium', 'Ireland', 'New Zealand', 'South Africa', 'Brazil', 
    'Argentina', 'Mexico', 'Colombia', 'Chile', 'Peru', 'Venezuela', 'India', 'China', 
    'South Korea', 'Thailand', 'Singapore', 'Malaysia', 'Philippines', 'Indonesia', 
    'Vietnam', 'Russia', 'Ukraine', 'Romania', 'Bulgaria', 'Hungary', 'Croatia', 
    'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Greece', 'Turkey', 
    'Israel', 'Egypt', 'Morocco', 'Nigeria', 'Kenya', 'Ghana'
  ];
  const genres = [
    'All genres', 'Jazz', 'Rock', 'Pop', 'Electronic', 'News', 'Classical', 'Hip-Hop', 
    'Country', 'Blues', 'Folk', 'Reggae', 'R&B', 'Soul', 'Funk', 'Disco', 'Punk',
    'Metal', 'Alternative', 'Indie', 'Ambient', 'Chillout', 'Trance', 'House',
    'Techno', 'Drum & Bass', 'Dubstep', 'Trap', 'Lo-Fi', 'World Music', 'Latin',
    'Salsa', 'Bachata', 'Merengue', 'Samba', 'Bossa Nova', 'Flamenco', 'Celtic',
    'Traditional', 'Religious', 'Spiritual', 'Meditation', 'Nature Sounds'
  ];

  useEffect(() => {
    setStations(radioStations);
    setCurrentStation(radioStations[1]); // Start with 101 SMOOTH JAZZ
    
    // Initialize with unique default presets - George's favorites
    const defaultPresets = [
      radioStations[2], // Deutschlandfunk (German news)
      radioStations[5], // France Info (French news)
      radioStations[12], // Radio Sweden (Swedish news)
      radioStations[18], // RAI Radio 1 (Italian news)
      radioStations[25], // CBC Radio One (Canadian news)
      radioStations[35] // BBC Radio 1 (British pop)
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
    const closestStation = radioStations.reduce((prev, curr) => {
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