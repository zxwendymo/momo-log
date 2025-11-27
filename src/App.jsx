import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Calendar, Home, Plus, X, Sparkles, Loader2, Heart, ChevronLeft, ChevronRight, CloudSun, StickyNote, Quote, Download, Search } from 'lucide-react';

// --- Gemini API ---
const apiKey = ""; 

const callGemini = async (prompt, imageBase64 = null) => {
  const model = "gemini-2.5-flash-preview-09-2025";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let contents = [];
  if (imageBase64) {
    const cleanBase64 = imageBase64.split(',')[1];
    contents = [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
      ]
    }];
  } else {
    contents = [{ parts: [{ text: prompt }] }];
  }
  
  const maxRetries = 3;
  let delay = 1000;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents }) });
      if (!response.ok) throw new Error(`API Error`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI 在发呆...";
    } catch (error) {
      if (i === maxRetries - 1) return "网络有点小情绪。";
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
};

// --- Icons ---
const Icons = {
  Bear: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 drop-shadow-sm transition-transform hover:scale-110">
      <circle cx="6" cy="6" r="3.5" className="fill-[#D7C4BB]" /> 
      <circle cx="18" cy="6" r="3.5" className="fill-[#D7C4BB]" /> 
      <circle cx="12" cy="13" r="8.5" className="fill-[#E6D2C9]" /> 
      <circle cx="12" cy="14.5" r="2.5" className="fill-[#F5E6E0]" /> 
      <circle cx="10" cy="12" r="1" className="fill-[#5C4033]" />
      <circle cx="14" cy="12" r="1" className="fill-[#5C4033]" />
      <ellipse cx="12" cy="14" rx="1" ry="0.6" className="fill-[#5C4033]" />
      <path d="M7 17c1.5 1 3.5 1 5 0" className="stroke-[#E6D2C9] stroke-width-[2]" /> 
    </svg>
  ),
  Rabbit: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 drop-shadow-sm transition-transform hover:scale-110">
      <ellipse cx="9" cy="7" rx="2.5" ry="6" className="fill-[#FFF5E6]" /> 
      <ellipse cx="15" cy="7" rx="2.5" ry="6" className="fill-[#FFF5E6]" /> 
      <path d="M9 7c0 0 0 3 0 0" className="stroke-[#FFD1DC] stroke-width-[2]" strokeLinecap="round" />
      <path d="M15 7c0 0 0 3 0 0" className="stroke-[#FFD1DC] stroke-width-[2]" strokeLinecap="round" />
      <circle cx="12" cy="14" r="8" className="fill-[#FFFAF0]" /> 
      <circle cx="10" cy="13" r="1" className="fill-[#5C4033]" />
      <circle cx="14" cy="13" r="1" className="fill-[#5C4033]" />
      <path d="M11 15l1 1l1-1" className="stroke-[#FFB7B2] stroke-width-[1.5]" strokeLinecap="round" />
      <circle cx="7" cy="15" r="1.5" className="fill-[#FFB7B2] opacity-50" /> 
      <circle cx="17" cy="15" r="1.5" className="fill-[#FFB7B2] opacity-50" />
    </svg>
  ),
  Cat: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 drop-shadow-sm transition-transform hover:scale-110">
      <path d="M5 6l3 5h8l3-5l-4 3H9z" className="fill-[#E0E0E0]" /> 
      <circle cx="12" cy="13" r="8.5" className="fill-[#F2F2F2]" /> 
      <path d="M5 6l2 4" className="stroke-[#E0E0E0] stroke-width-[2]" />
      <path d="M19 6l-2 4" className="stroke-[#E0E0E0] stroke-width-[2]" />
      <path d="M9 13c1 0 1-1 2-1s1 1 2 0" className="stroke-[#888] stroke-width-[1.5] stroke-linecap-round" /> 
      <path d="M13 13c1 0 1-1 2-1s1 1 2 0" className="stroke-[#888] stroke-width-[1.5] stroke-linecap-round" />
      <path d="M11 16l1-0.5l1 0.5" className="stroke-[#FFB7B2] stroke-width-[1.5]" />
    </svg>
  ),
  Fox: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 drop-shadow-sm transition-transform hover:scale-110">
      <path d="M3 5l5 6l4-2l4 2l5-6l-7 16z" className="fill-[#E6A07C]" />
      <path d="M12 21c4-1 6-7 6-10H6c0 3 2 9 6 10z" className="fill-[#FFF5E6]" />
      <circle cx="9.5" cy="15" r="1" className="fill-[#5C4033]" />
      <circle cx="14.5" cy="15" r="1" className="fill-[#5C4033]" />
      <circle cx="12" cy="17.5" r="1.2" className="fill-[#5C4033]" />
    </svg>
  ),
  Chick: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 drop-shadow-sm transition-transform hover:scale-110">
      <circle cx="12" cy="13" r="8" className="fill-[#FFF9C4]" />
      <path d="M12 4l1 3h-2z" className="fill-[#FFF9C4]" /> 
      <circle cx="9" cy="12" r="1" className="fill-[#5C4033]" />
      <circle cx="15" cy="12" r="1" className="fill-[#5C4033]" />
      <path d="M11 14l1 1l1-1" className="fill-[#FFB74D]" /> 
      <circle cx="7" cy="14" r="1.5" className="fill-[#FFCC80] opacity-40" />
    </svg>
  ),
  Frog: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 drop-shadow-sm transition-transform hover:scale-110">
      <circle cx="7" cy="8" r="3" className="fill-[#C8E6C9]" />
      <circle cx="17" cy="8" r="3" className="fill-[#C8E6C9]" />
      <ellipse cx="12" cy="14" rx="9" ry="7" className="fill-[#DcedC8]" />
      <circle cx="7" cy="8" r="1" className="fill-[#5C4033]" />
      <circle cx="17" cy="8" r="1" className="fill-[#5C4033]" />
      <path d="M10 14h4" className="stroke-[#81C784] stroke-width-[2] stroke-linecap-round" />
      <circle cx="6" cy="15" r="1.5" className="fill-[#A5D6A7] opacity-60" />
      <circle cx="18" cy="15" r="1.5" className="fill-[#A5D6A7] opacity-60" />
    </svg>
  ),
  Deer: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 drop-shadow-sm transition-transform hover:scale-110">
      <path d="M6 5l3 4M18 5l-3 4" className="stroke-[#BCAAA4] stroke-width-[2] stroke-linecap-round"/>
      <circle cx="12" cy="13" r="8" className="fill-[#EFEBE9]" />
      <path d="M7 10a5 5 0 0 0 10 0" className="fill-[#D7CCC8] opacity-30" />
      <circle cx="12" cy="16" r="1.5" className="fill-[#8D6E63]" />
      <circle cx="9" cy="13" r="1" className="fill-[#5C4033]" />
      <circle cx="15" cy="13" r="1" className="fill-[#5C4033]" />
    </svg>
  ),
  Koala: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 drop-shadow-sm transition-transform hover:scale-110">
      <circle cx="5" cy="8" r="3.5" className="fill-[#CFD8DC]" />
      <circle cx="19" cy="8" r="3.5" className="fill-[#CFD8DC]" />
      <circle cx="12" cy="13" r="8" className="fill-[#ECEFF1]" />
      <ellipse cx="12" cy="14" rx="2" ry="2.5" className="fill-[#78909C]" />
      <path d="M8 11h2M14 11h2" className="stroke-[#546E7A] stroke-width-[1.5] stroke-linecap-round" />
    </svg>
  ),
  Whale: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 drop-shadow-sm transition-transform hover:scale-110">
      <path d="M3 14c0-5 4-8 9-8c6 0 10 4 10 9c0 1-2 2-5 2H5c-2 0-2-3-2-3z" className="fill-[#E1F5FE]" />
      <circle cx="8" cy="13" r="1" className="fill-[#0277BD]" />
      <path d="M16 9c0-2-1-3-1-3" className="stroke-[#B3E5FC] stroke-width-[2]" strokeLinecap="round"/>
      <circle cx="16" cy="15" r="2" className="fill-[#B3E5FC] opacity-50" />
    </svg>
  ),
  Dog: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 drop-shadow-sm transition-transform hover:scale-110">
      <path d="M4 8c0 0 1 5 3 6" className="stroke-[#D7CCC8] stroke-width-[4] stroke-linecap-round" />
      <path d="M20 8c0 0-1 5-3 6" className="stroke-[#D7CCC8] stroke-width-[4] stroke-linecap-round" />
      <circle cx="12" cy="13" r="8" className="fill-[#FFF3E0]" />
      <ellipse cx="12" cy="14.5" rx="3" ry="2" className="fill-[#FFE0B2]" />
      <circle cx="9" cy="12" r="1" className="fill-[#5C4033]" />
      <circle cx="15" cy="12" r="1" className="fill-[#5C4033]" />
      <circle cx="12" cy="14" r="1.2" className="fill-[#5D4037]" />
    </svg>
  ),
};

const MOODS = [
  { id: 'happy', icon: Icons.Bear, label: '暖暖熊' },
  { id: 'excited', icon: Icons.Rabbit, label: '元气兔' },
  { id: 'smart', icon: Icons.Fox, label: '机智狐' },
  { id: 'lazy', icon: Icons.Cat, label: '懒懒猫' },
  { id: 'playful', icon: Icons.Dog, label: '修勾' },
  { id: 'sun', icon: Icons.Chick, label: '小鸡啄米' },
  { id: 'rain', icon: Icons.Frog, label: '听雨蛙' },
  { id: 'calm', icon: Icons.Deer, label: '森之鹿' },
  { id: 'tired', icon: Icons.Koala, label: '睡睡考拉' },
  { id: 'sad', icon: Icons.Whale, label: '深海鲸' },
];

// --- Helpers ---
const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getPastDateStr = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const MOCK_ENTRIES = [
  {
    id: '1',
    date: getTodayStr(), // Today
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=600',
    location: 'Cinque Terre',
    mood: 'happy',
    tags: ['#看海', '#治愈'],
    text: '海风吹过的时候，时间好像变慢了。喜欢这种淡淡的蓝色。🌊',
  },
  {
    id: '2',
    date: getPastDateStr(3), // 3 Days ago
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
    location: 'My Room',
    mood: 'calm',
    tags: ['#午后', '#Reading'],
    text: '阳光洒在书页上，是今天最温柔的时刻。',
  },
  {
    id: '3',
    date: getTodayStr(), // Today Text Only
    image: null,
    location: 'Subway',
    mood: 'tired',
    tags: ['#Commute'],
    text: '今天地铁上人好多，但是耳机里放着喜欢的歌，感觉也还不错。🎵',
  }
];

// --- Components ---

const GrainOverlay = ({ isExporting }) => (
  <div className={`pointer-events-none fixed inset-0 z-[100] mix-blend-multiply ${isExporting ? 'opacity-0' : 'opacity-[0.06]'}`}
       style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
  </div>
);

const WeatherWidget = () => (
    <div className="flex items-center gap-2 px-3 py-1 bg-[#F9F7F2] rounded-full border border-[#EBE8E0] shadow-sm">
        <CloudSun size={14} className="text-[#A89F91]" />
        <span className="text-[10px] font-serif text-[#8D7B68] tracking-widest">24°C • SEOUL</span>
    </div>
);

const TabBar = ({ currentTab, onTabChange, onAdd }) => (
  <div className="fixed bottom-0 left-0 right-0 pb-6 pt-4 bg-gradient-to-t from-[#F9F7F2] to-transparent z-50 flex justify-center items-center pointer-events-none">
    <div className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-full flex items-center gap-10 shadow-[0_4px_20px_-5px_rgba(141,123,104,0.15)] border border-[#EBE8E0] pointer-events-auto">
      <button onClick={() => onTabChange('home')} className={`${currentTab === 'home' ? 'text-[#8D7B68]' : 'text-[#C4Bdb5]'} transition-colors`}>
        <Home size={20} />
      </button>
      <button onClick={onAdd} className="bg-[#8D7B68] text-[#F9F7F2] w-10 h-10 rounded-full flex items-center justify-center shadow-md transform hover:scale-105 transition-all hover:bg-[#786958]">
        <Plus size={20} />
      </button>
      <button onClick={() => onTabChange('calendar')} className={`${currentTab === 'calendar' ? 'text-[#8D7B68]' : 'text-[#C4Bdb5]'} transition-colors`}>
        <Calendar size={20} />
      </button>
    </div>
  </div>
);

// Style 1: Polaroid Card (For Entries with Images)
const PolaroidCard = ({ entry }) => {
  const moodObj = MOODS.find(m => m.id === entry.mood) || MOODS[0];
  const MoodIcon = moodObj.icon;
  
  return (
    <div className="mb-8 mx-2 bg-white p-3 pb-6 shadow-[0_2px_15px_-4px_rgba(141,123,104,0.1)] rotate-[-1deg] hover:rotate-0 transition-transform duration-300 ease-out border border-[#EBE8E0] rounded-[2px]">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-[#F4F1EA] opacity-90 rotate-1 shadow-sm z-10 border-l border-r border-[#EBE8E0]/50"></div>
      
      <div className="aspect-[4/3] w-full overflow-hidden bg-[#F4F4F4] mb-4 relative grayscale-[0.05] contrast-[0.98]">
        <img src={entry.image} alt="Memory" className="w-full h-full object-cover" />
        <div className="absolute bottom-2 right-2 bg-black/20 backdrop-blur-[1px] px-1.5 py-0.5 rounded-[2px]">
            <span className="text-white/95 text-[9px] font-serif tracking-widest">
                {new Date(entry.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '.')}
            </span>
        </div>
      </div>

      <div className="px-2">
        <div className="flex justify-between items-start mb-3">
             <div className="flex gap-2 flex-wrap">
                {entry.tags?.map(tag => (
                    <span key={tag} className="text-[10px] text-[#A89F91] font-serif bg-[#F9F7F2] px-1.5 py-0.5 rounded-[2px] border border-[#EBE8E0]">
                        {tag}
                    </span>
                ))}
             </div>
             <div className="opacity-100 scale-90 origin-top-right">
                <MoodIcon />
             </div>
        </div>
        <p className="text-[#6B5D52] text-xs leading-6 font-serif tracking-wide whitespace-pre-wrap">{entry.text}</p>
        <div className="mt-4 flex items-center justify-between border-t border-[#F4F1EA] pt-2">
             <div className="flex items-center gap-1 text-[#C4Bdb5] text-[10px]">
                <MapPin size={10} />
                <span className="font-serif italic">{entry.location}</span>
             </div>
             <Heart size={12} className="text-[#E6C9BB] hover:fill-[#E6C9BB] transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

// Style 2: Note Card (For Text-Only Entries)
const NoteCard = ({ entry }) => {
    const moodObj = MOODS.find(m => m.id === entry.mood) || MOODS[0];
    const MoodIcon = moodObj.icon;

    return (
        <div className="mb-6 mx-4 bg-[#FFFDF5] p-5 shadow-[0_2px_8px_-2px_rgba(141,123,104,0.1)] border border-[#EBE8E0] relative rounded-[1px] group">
            {/* Pin Effect */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-[#E6C9BB] shadow-sm z-10 border border-[#D7C4BB]"></div>
            
            <div className="flex justify-between items-center mb-4 border-b border-[#F4F1EA] pb-2 border-dashed">
                <span className="font-serif text-[#A89F91] text-[10px] tracking-widest">
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
                </span>
                <div className="scale-75 opacity-80 group-hover:scale-90 transition-transform"><MoodIcon /></div>
            </div>

            <div className="relative">
                <Quote size={12} className="absolute -top-1 -left-1 text-[#E6C9BB] opacity-30" />
                <p className="font-serif text-[#6B5D52] text-xs leading-7 tracking-wide whitespace-pre-wrap pl-2 relative z-10">
                    {entry.text}
                </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-end">
                {entry.tags?.map(tag => (
                    <span key={tag} className="text-[9px] text-[#C4Bdb5] font-serif italic">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

// --- Postcard Decoration (Hand-drawn Style) ---
const PostcardDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Paper Texture for Export */}
        <div className="absolute inset-0 opacity-[0.4]" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")` }}>
        </div>

        {/* Top Right Doodle: Flower */}
        <div className="absolute top-2 right-2 opacity-30 transform rotate-12 scale-125">
             <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                 <path d="M50 50 L50 20 M50 50 L80 50 M50 50 L50 80 M50 50 L20 50" stroke="#E6C9BB" strokeWidth="2" strokeLinecap="round"/>
                 <circle cx="50" cy="50" r="10" fill="#FFE4E1" opacity="0.5"/>
                 <path d="M50 30 Q60 20 70 30 T50 50" stroke="#D7C4BB" strokeWidth="1" fill="none"/>
                 <path d="M50 30 Q40 20 30 30 T50 50" stroke="#D7C4BB" strokeWidth="1" fill="none"/>
             </svg>
        </div>

        {/* Bottom Left Doodle: Abstract Lines (Lee Kyutae style) */}
        <div className="absolute bottom-4 left-4 opacity-40">
             <svg width="80" height="40" viewBox="0 0 100 50" fill="none">
                 <path d="M10 25 Q30 10 50 25 T90 25" stroke="#A89F91" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4"/>
                 <circle cx="20" cy="35" r="2" fill="#8D7B68"/>
                 <circle cx="28" cy="15" r="1" fill="#8D7B68"/>
             </svg>
        </div>
        
        {/* Vintage Title */}
        <div className="absolute bottom-2 right-4">
             <span className="font-serif italic text-[#C4Bdb5] text-[10px] tracking-widest">captured by momo</span>
        </div>

        {/* Frame Border */}
        <div className="absolute inset-2 border border-[#EBE8E0] rounded-[2px] opacity-50"></div>
    </div>
);

const CalendarView = ({ entries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isExporting, setIsExporting] = useState(false); // State to control export view
  const calendarRef = useRef(null);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const days = Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1);
  const blanks = Array.from({ length: getFirstDayOfMonth(currentDate) }, (_, i) => i);
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getSelectedDateStr = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedEntries = entries.filter(e => e.date === getSelectedDateStr());

  // --- Image Saving Logic ---
  const loadHtml2Canvas = () => {
    return new Promise((resolve, reject) => {
        if (window.html2canvas) return resolve(window.html2canvas);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => resolve(window.html2canvas);
        script.onerror = reject;
        document.head.appendChild(script);
    });
  };

  const handleSaveImage = async () => {
      setIsExporting(true); // 1. Enter Export Mode (Re-renders UI)
      
      // 2. Wait for React to render the export view
      await new Promise(r => setTimeout(r, 200)); 

      try {
          await loadHtml2Canvas();
          if (!calendarRef.current) return;
          
          const canvas = await window.html2canvas(calendarRef.current, {
              useCORS: true,
              scale: 5, // Higher resolution
              backgroundColor: '#FDFBF7',
          });
          
          const link = document.createElement('a');
          link.download = `momo-postcard-${currentDate.getFullYear()}-${currentDate.getMonth()+1}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
      } catch (err) {
          console.error("Save failed:", err);
          alert("保存图片失败");
      } finally {
          setIsExporting(false); // 3. Exit Export Mode
      }
  };

  return (
    <div className="animate-fade-in flex flex-col">
      {/* Calendar Content to Capture 
         Optimized Layout for Export Mode: Less padding, smaller gap, larger grid
      */}
      <div 
        ref={calendarRef} 
        className={`bg-[#FDFBF7] relative transition-all duration-300 ${isExporting ? 'p-4 pb-8' : 'pb-6 px-2'}`}
      >
        {/* Export Decoration Layer - Only visible during export */}
        {isExporting && <PostcardDecoration />}

        {/* Header */}
        <div className={`flex justify-between items-center mb-6 pt-2 relative z-10 ${isExporting ? 'px-0 justify-center mb-4' : 'px-4'}`}>
            {!isExporting && <button onClick={prevMonth} className="text-[#C4Bdb5] hover:text-[#8D7B68]"><ChevronLeft size={18}/></button>}
            
            <div className="text-center relative">
                <h2 className={`font-serif text-[#6B5D52] tracking-widest ${isExporting ? 'text-2xl mb-1' : 'text-xl'}`}>
                    {currentDate.toLocaleString('en-US', { month: 'long' })}
                    {isExporting && <span className="block text-xs text-[#A89F91] mt-0 tracking-[0.3em] font-normal">{currentDate.getFullYear()}</span>}
                </h2>
                {!isExporting && <div className="w-8 h-[1px] bg-[#D4Ccc5] mx-auto mt-2"></div>}
                
                {/* Download Button - Hidden during export */}
                {!isExporting && (
                    <button 
                        onClick={handleSaveImage}
                        className="absolute -right-12 top-1 text-[#C4Bdb5] hover:text-[#8D7B68] transition-colors p-1"
                        title="Save as Image"
                    >
                        <Download size={16} />
                    </button>
                )}
            </div>

            {!isExporting && <button onClick={nextMonth} className="text-[#C4Bdb5] hover:text-[#8D7B68]"><ChevronRight size={18}/></button>}
        </div>

        {/* Grid - Tighter Gap during export for larger cells */}
        <div className={`grid grid-cols-7 relative z-10 ${isExporting ? 'gap-1.5 px-1' : 'gap-2 px-2 mb-2'}`}>
            {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className={`text-center font-serif mb-1 text-[#A89F91] ${isExporting ? 'text-[10px] font-bold' : 'text-[10px]'}`}>{d}</div>)}
            {blanks.map(i => <div key={`blank-${i}`} />)}
            {days.map(day => {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const dateStr = `${year}-${month}-${dayStr}`;
            
            const entry = entries.find(e => e.date === dateStr);
            // Hide selection ring during export
            const isSelected = !isExporting && selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
            
            return (
                <div 
                    key={day} 
                    onClick={() => !isExporting && setSelectedDate(new Date(year, parseInt(month)-1, day))}
                    className="aspect-square relative flex items-center justify-center group cursor-pointer"
                >
                    {entry ? (
                        <div className={`w-full h-full p-[3px] bg-white border border-[#EBE8E0] shadow-sm transform ${isSelected ? 'scale-105 rotate-0 z-10 ring-1 ring-[#8D7B68]' : 'rotate-[-2deg]'} ${!isExporting && 'group-hover:rotate-0'} transition-all duration-300 relative`}>
                            {entry.image ? (
                                <img src={entry.image} className="w-full h-full object-cover grayscale-[0.1]" crossOrigin="anonymous" />
                            ) : (
                                // Text note texture
                                <div className="w-full h-full bg-[#FFFDF5] flex items-center justify-center flex-col gap-1 p-1">
                                    <div className="w-full h-[1px] bg-[#EBE8E0]"></div>
                                    <div className="w-full h-[1px] bg-[#EBE8E0]"></div>
                                    <div className="w-2/3 h-[1px] bg-[#EBE8E0] self-start"></div>
                                </div>
                            )}
                            {/* Tiny selection indicator dot if selected */}
                            {isSelected && <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#8D7B68] rounded-full"></div>}
                        </div>
                    ) : (
                        <span className={`font-serif w-6 h-6 flex items-center justify-center rounded-full transition-colors ${isExporting ? 'text-[10px] font-bold' : 'text-[10px]'} ${isSelected ? 'bg-[#8D7B68] text-[#F9F7F2]' : 'text-[#D4Ccc5] group-hover:bg-[#F4F1EA]'}`}>{day}</span>
                    )}
                </div>
            )
            })}
        </div>
      </div>

      <div className="bg-[#FDFBF7] border-t border-[#F4F1EA] p-4 min-h-[200px]">
          <h3 className="text-[10px] text-[#A89F91] font-serif tracking-[0.2em] mb-4 text-center uppercase">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </h3>
          
          {selectedEntries.length > 0 ? (
              <div className="space-y-4 animate-slide-up">
                  {selectedEntries.map(entry => (
                      entry.image ? (
                          <PolaroidCard key={entry.id} entry={entry} />
                      ) : (
                          <NoteCard key={entry.id} entry={entry} />
                      )
                  ))}
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center h-32 text-[#D4Ccc5] gap-2">
                  <StickyNote size={20} className="opacity-50" />
                  <span className="text-[10px] font-serif italic">No memories yet</span>
              </div>
          )}
      </div>
    </div>
  );
};

const AddModal = ({ onClose, onSave }) => {
  const [text, setText] = useState('');
  const [location, setLocation] = useState(''); 
  const [date, setDate] = useState(getTodayStr()); // Added Date State
  const [mood, setMood] = useState(MOODS[0].id);
  const [preview, setPreview] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAiHelp = async () => {
    setIsAiLoading(true);
    const prompt = preview 
        ? "你是Lee Kyutae风格的记录者。请看图写一句极简、治愈、带点淡淡忧伤或温暖的中文手账文案。不要超过30字。" 
        : "给我一句关于今天微小幸福的灵感文案，风格要像欧阳娜娜的Vlog旁白。";
    try {
        const res = await callGemini(prompt, preview);
        setText(res.trim());
    } catch(e) {} finally { setIsAiLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#F9F7F2]/90 backdrop-blur-sm">
        <div className="w-full max-w-sm bg-[#FDFBF7] p-6 rounded-[4px] shadow-xl border border-[#EBE8E0] relative animate-slide-up flex flex-col max-h-[90vh]">
            <button onClick={onClose} className="absolute top-4 right-4 text-[#C4Bdb5] hover:text-[#8D7B68]"><X size={20} /></button>
            
            <h3 className="text-center font-serif text-[#6B5D52] mb-6 tracking-widest text-sm">N E W &nbsp; L O G</h3>
            
            <div className="overflow-y-auto no-scrollbar flex-1">
                {/* Image Placeholder */}
                <div 
                    onClick={() => fileInputRef.current.click()}
                    className="w-full aspect-video bg-[#F4F1EA] border border-dashed border-[#D4Ccc5] flex flex-col items-center justify-center cursor-pointer mb-6 hover:bg-[#EBE8E0] transition-colors relative"
                >
                    {preview ? <img src={preview} className="w-full h-full object-cover p-2 bg-white shadow-sm" /> : <Camera className="text-[#C4Bdb5]" size={24} />}
                    <span className="text-[10px] text-[#C4Bdb5] mt-2 font-serif">{preview ? 'Change Photo' : 'Add Photo (Optional)'}</span>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                        const file = e.target.files[0];
                        if(file) { const r = new FileReader(); r.onload = () => setPreview(r.result); r.readAsDataURL(file); }
                    }} />
                    {preview && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setPreview(null); fileInputRef.current.value = ''; }}
                            className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-[#8D7B68] hover:bg-white"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>

                <textarea 
                    value={text} 
                    onChange={e => setText(e.target.value)}
                    placeholder="记录微小的瞬间..."
                    className="w-full h-20 bg-transparent resize-none text-xs text-[#6B5D52] font-serif placeholder-[#D4Ccc5] focus:outline-none mb-2 leading-loose tracking-wide text-center"
                />
                
                <div className="flex justify-center gap-2 mb-6">
                    <button onClick={handleAiHelp} disabled={isAiLoading} className="flex items-center gap-1 px-3 py-1 bg-[#F4F1EA] rounded-full text-[10px] text-[#8D7B68] hover:bg-[#EBE8E0]">
                        {isAiLoading ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} AI 灵感
                    </button>
                </div>
                
                {/* Date Input Field - NEW */}
                <div className="mb-4 flex items-center justify-center border-b border-[#F4F1EA] pb-2 w-3/4 mx-auto">
                    <Calendar size={12} className="text-[#C4Bdb5] mr-2" />
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="text-center text-xs text-[#6B5D52] font-serif placeholder-[#D4Ccc5] bg-transparent focus:outline-none w-full uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ colorScheme: 'light' }} // Ensures calendar icon inside input matches theme roughly
                    />
                </div>

                <div className="mb-6 flex items-center justify-center border-b border-[#F4F1EA] pb-2 w-3/4 mx-auto">
                    <MapPin size={12} className="text-[#C4Bdb5] mr-2" />
                    <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="添加地点 (例如: 首尔)"
                        className="text-center text-xs text-[#6B5D52] font-serif placeholder-[#D4Ccc5] bg-transparent focus:outline-none w-full"
                    />
                </div>

                <div className="mb-2 text-center">
                    <span className="text-[9px] text-[#C4Bdb5] font-serif tracking-widest uppercase mb-2 block">- Select Mood -</span>
                    <div className="grid grid-cols-5 gap-y-4 gap-x-2">
                        {MOODS.map(m => {
                            const Icon = m.icon;
                            return (
                                <button key={m.id} onClick={() => setMood(m.id)} className={`flex flex-col items-center gap-1 transition-all duration-300 ${mood === m.id ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-100'}`}>
                                    <Icon />
                                    <span className="text-[9px] text-[#8D7B68] font-serif scale-75 whitespace-nowrap">{m.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            <button onClick={() => { 
                onSave({ 
                    id: Date.now(), 
                    date: date, // Use selected date
                    image: preview || null,
                    text, 
                    mood, 
                    location: location || 'Unknown',
                    tags: ['#Daily'] 
                }); 
                onClose(); 
            }} className="w-full py-3 mt-4 bg-[#8D7B68] text-[#F9F7F2] text-xs font-serif tracking-widest hover:bg-[#786958]">
                S A V E
            </button>
        </div>
    </div>
  )
}

// --- Main ---
export default function App() {
  const [tab, setTab] = useState('home');
  const [modal, setModal] = useState(false);
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [searchTerm, setSearchTerm] = useState(''); // 新增搜索状态

  // 筛选逻辑：根据标签、内容或地点进行搜索
  const filteredEntries = entries.filter(entry => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    // Check tags
    const matchesTag = entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(term));
    // Check text content
    const matchesText = entry.text && entry.text.toLowerCase().includes(term);
    // Check location
    const matchesLocation = entry.location && entry.location.toLowerCase().includes(term);

    return matchesTag || matchesText || matchesLocation;
  });

  return (
    // Updated Root Container: relative h-[100dvh] for mobile scrolling fix
    <div className="relative h-[100dvh] w-full bg-[#F9F7F2] font-sans flex justify-center overflow-hidden text-[#6B5D52] selection:bg-[#E6C9BB] selection:text-white">
      <GrainOverlay isExporting={false} />
      
      <div className="w-full h-full sm:max-w-[390px] sm:h-[85vh] sm:rounded-[4px] relative shadow-2xl flex flex-col overflow-hidden sm:border sm:border-[#EBE8E0]">
        
        {/* Header */}
        <div className="pt-12 pb-4 px-6 flex justify-between items-end sticky top-0 z-40 bg-[#F9F7F2]/80 backdrop-blur-sm transition-all">
           <div className="flex flex-col">
               <span className="text-2xl font-serif text-[#5C4033] tracking-widest italic">momo.</span>
               <span className="text-[9px] text-[#A89F91] tracking-[0.4em] uppercase mt-1 ml-1">Daily Log</span>
           </div>
           <WeatherWidget />
        </div>

        {/* Content - added touch scrolling support */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-0 pb-32 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
           {tab === 'home' ? (
             <div className="animate-fade-in pt-2 px-4">
                {/* --- 新增搜索栏开始 --- */}
                <div className="mb-6 mt-2 relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search size={14} className="text-[#C4Bdb5] group-focus-within:text-[#8D7B68] transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search memories (tags, text, location)..."
                        className="w-full bg-[#FFFDF5] border border-[#EBE8E0] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#6B5D52] placeholder-[#D4Ccc5] focus:outline-none focus:border-[#D7C4BB] focus:bg-white font-serif tracking-wide transition-all shadow-[0_2px_10px_-4px_rgba(141,123,104,0.05)]"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-3 flex items-center text-[#D4Ccc5] hover:text-[#8D7B68]"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
                {/* --- 新增搜索栏结束 --- */}

                {filteredEntries.length > 0 ? (
                    filteredEntries.map(e => (
                        e.image ? <PolaroidCard key={e.id} entry={e} /> : <NoteCard key={e.id} entry={e} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 opacity-50 gap-2">
                        <Search size={24} className="text-[#D4Ccc5]" />
                        <p className="text-[10px] font-serif text-[#A89F91] tracking-widest">No moments found</p>
                    </div>
                )}
             </div>
           ) : (
             <CalendarView entries={entries} />
           )}
        </div>

        {/* Tab Bar */}
        <TabBar currentTab={tab} onTabChange={setTab} onAdd={() => setModal(true)} />
        
        {modal && <AddModal onClose={() => setModal(false)} onSave={e => setEntries([e, ...entries])} />}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@300;400;700&display=swap');
        .font-serif { font-family: 'Playfair Display', 'Noto Serif SC', serif; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}
