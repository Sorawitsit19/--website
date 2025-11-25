import React, { useState, useEffect } from 'react';
import { Menu, X, Play, ChevronRight, MapPin, Search, Wind, Droplets, ArrowRight } from 'lucide-react';

const HuatakheWebsite = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Content Data
  const culturalItems = [
    {
      id: 'rahad',
      title: 'ระหัดวิดน้ำ',
      icon: <Droplets className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1599580669865-0b046714e056?q=80&w=1000&auto=format&fit=crop", 
      desc: "ระหัดวิดน้ำ คือภูมิปัญญาชาวบ้านในอดีตแห่งทุ่งลาดกระบัง ใช้สำหรับวิดน้ำเข้านา โดยใช้แรงคนถีบหรือเครื่องยนต์ สะท้อนวิถีเกษตรกรรมริมน้ำที่หล่อเลี้ยงชุมชนหัวตะเข้มาช้านาน ปัจจุบันหาชมได้ยากและเป็นสัญลักษณ์แห่งความอุดมสมบูรณ์",
      details: "โครงสร้างทำจากไม้เนื้อแข็ง ประกอบกันเป็นวงล้อ มีใบพัดสำหรับตักน้ำ การทำงานต้องอาศัยจังหวะที่สอดคล้องกับกระแสน้ำ เป็นวิศวกรรมพื้นบ้านที่น่าทึ่ง"
    },
    {
      id: 'kite',
      title: 'ว่าวจุฬา',
      icon: <Wind className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1534234828563-02511c75628d?q=80&w=1000&auto=format&fit=crop",
      desc: "ว่าวจุฬา เป็นว่าวไทยที่มีเอกลักษณ์ทรงห้าแฉกขนาดใหญ่ การเล่นว่าวในย่านหัวตะเข้เป็นกิจกรรมที่สะท้อนถึงช่วงเวลาแห่งความสุขในฤดูร้อนและลมว่าวที่พัดผ่านทุ่งโล่ง",
      details: "โครงสร้างทำจากไม้ไผ่เหลาอย่างประณีต ปิดด้วยกระดาษสา การขึ้นโครงต้องอาศัยความชำนาญเพื่อให้ว่าวสมดุล กินลมดี และมีความสง่างามเมื่ออยู่บนท้องฟ้า"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#4A3B32] selection:bg-[#B8860B] selection:text-white relative overflow-hidden">
      
      {/* --- Fonts Injection (Sarabun & Playfair Display) --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        body { font-family: 'Sarabun', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        .bg-woven {
          background-color: #fdfbf7;
          background-image: repeating-linear-gradient(45deg, #f0e6d2 25%, transparent 25%, transparent 75%, #f0e6d2 75%, #f0e6d2), repeating-linear-gradient(45deg, #f0e6d2 25%, #fdfbf7 25%, #fdfbf7 75%, #f0e6d2 75%, #f0e6d2);
          background-position: 0 0, 10px 10px;
          background-size: 20px 20px;
        }

        .text-gradient-gold {
          background: linear-gradient(to right, #B8860B, #FFD700, #B8860B);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .wood-border {
          border: 8px solid #5D4037;
          border-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h30v30H0z' fill='%235D4037'/%3E%3C/svg%3E") 30 stretch;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
        }
      `}</style>

      {/* --- Navigation Bar --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#5D4037]/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 border-2 flex items-center justify-center rounded-full ${isScrolled ? 'border-[#FFD700]' : 'border-white'}`}>
              <span className={`font-serif text-2xl font-bold ${isScrolled ? 'text-[#FFD700]' : 'text-white'}`}>H</span>
            </div>
            <h1 className={`text-2xl font-bold tracking-wider ${isScrolled ? 'text-[#FFD700]' : 'text-white'}`}>
              หัวตะเข้
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['หน้าแรก', 'ประวัติ', 'สถานที่', 'ของดีชุมชน'].map((item) => (
              <a key={item} href="#" className={`text-sm tracking-widest uppercase hover:text-[#FFD700] transition-colors ${isScrolled ? 'text-gray-200' : 'text-white'}`}>
                {item}
              </a>
            ))}
            <button className="bg-[#B8860B] hover:bg-[#8B6508] text-white px-6 py-2 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg border border-[#FFD700]">
              <Search size={16} />
              <span>ค้นหา</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#5D4037] text-white py-4 px-6 flex flex-col gap-4 shadow-xl">
             {['หน้าแรก', 'ประวัติ', 'สถานที่', 'ของดีชุมชน'].map((item) => (
              <a key={item} href="#" className="py-2 border-b border-white/10">{item}</a>
            ))}
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=2070&auto=format&fit=crop" 
            alt="Huatakhe Old Market" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#FDFBF7]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <p className="text-[#FFD700] tracking-[0.3em] uppercase mb-4 text-sm animate-pulse">
            วิถีชีวิตริมน้ำ ลาดกระบัง
          </p>
          <h1 className="font-serif text-6xl md:text-8xl text-white mb-6 drop-shadow-2xl font-bold leading-tight">
            ชุมชนเก่า<br/><span className="text-gradient-gold">หัวตะเข้</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            สัมผัสเสน่ห์ตลาดไม้โบราณ อายุกว่า ๑๐๐ ปี ดื่มด่ำบรรยากาศริมคลองประเวศบุรีรมย์ แหล่งรวมงานศิลปะและวิถีชีวิตดั้งเดิม
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-[#B8860B] text-white px-8 py-4 rounded-sm flex items-center justify-center gap-3 hover:bg-[#8B6508] transition-all duration-300 shadow-xl border border-[#FFD700]">
              <MapPin size={20} />
              <span>เยี่ยมชมสถานที่</span>
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-sm hover:bg-white/20 transition-all duration-300">
              เรียนรู้ประวัติศาสตร์
            </button>
          </div>
        </div>

        {/* Decorative Element Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FDFBF7] to-transparent"></div>
      </header>

      {/* --- About Section (Woven Pattern) --- */}
      <section className="py-24 bg-woven relative">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#B8860B] rotate-2 opacity-20 group-hover:rotate-0 transition-all duration-500 rounded-lg"></div>
            <div className="relative overflow-hidden rounded-lg shadow-2xl wood-border">
              <img 
                src="https://images.unsplash.com/photo-1590623223297-39158019315b?q=80&w=2070&auto=format&fit=crop" 
                alt="Wooden Architecture" 
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="h-[2px] w-12 bg-[#B8860B]"></div>
              <span className="text-[#B8860B] font-bold tracking-widest uppercase">มนต์เสน่ห์แห่งลาดกระบัง</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#5D4037] font-bold leading-tight">
              สถาปัตยกรรมไม้<br/>ผสานสายน้ำ
            </h2>
            <p className="text-gray-600 leading-loose text-lg">
              ชุมชนหัวตะเข้เป็นชุมชนเก่าแก่ที่ยังคงรักษาเอกลักษณ์ของบ้านไม้ริมน้ำ
              หลังคาสังกะสี และทางเดินไม้ที่ทอดยาวขนานไปกับลำคลอง 
              ที่นี่ไม่ใช่เพียงแค่สถานที่ท่องเที่ยว แต่คือ "ลมหายใจ" ของอดีต
              ที่ยังคงเต้นอยู่ในจังหวะของปัจจุบัน
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
               <div className="p-4 bg-white/80 border border-[#B8860B]/20 rounded shadow-sm text-center">
                 <h3 className="text-3xl font-bold text-[#B8860B] mb-1">๑๐๐+</h3>
                 <p className="text-gray-500 text-sm">ปีแห่งประวัติศาสตร์</p>
               </div>
               <div className="p-4 bg-white/80 border border-[#B8860B]/20 rounded shadow-sm text-center">
                 <h3 className="text-3xl font-bold text-[#B8860B] mb-1">๓</h3>
                 <p className="text-gray-500 text-sm">คลองมาบรรจบ</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Cultural Highlights (Interactive) --- */}
      <section className="py-24 bg-[#5D4037] text-white relative overflow-hidden">
        {/* Decorative Thai Pattern Overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z"/></svg>
        </div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-[#FFD700]">ภูมิปัญญาและอัตลักษณ์</h2>
            <p className="text-white/70 max-w-2xl mx-auto">สัญลักษณ์ที่สะท้อนถึงวิถีชีวิตและความเป็นมาของชาวหัวตะเข้</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {culturalItems.map((item) => (
              <div key={item.id} className="group relative bg-[#4A3B32] rounded-xl overflow-hidden shadow-2xl border border-[#FFD700]/20 hover:border-[#FFD700] transition-all duration-300">
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all z-10"></div>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute bottom-4 right-4 z-20 bg-[#FFD700] text-[#5D4037] p-2 rounded-full shadow-lg">
                    {item.icon}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-[#FFD700]">{item.title}</h3>
                  <p className="text-gray-300 mb-6 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                  <button 
                    onClick={() => setActiveModal(item)}
                    className="w-full py-3 border border-white/30 rounded text-sm uppercase tracking-widest hover:bg-[#FFD700] hover:text-[#5D4037] hover:border-[#FFD700] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    เรียนรู้เพิ่มเติม <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Video Presentation Section --- */}
      <section className="py-24 bg-[#FDFBF7] relative">
        <div className="container mx-auto px-6">
           <div className="flex flex-col items-center text-center mb-12">
              <span className="text-[#B8860B] font-bold tracking-widest uppercase mb-2">วิดีโอแนะนำ</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#5D4037]">หัวตะเข้...วันนี้</h2>
              <div className="w-24 h-1 bg-[#B8860B] mt-6"></div>
           </div>

           <div className="max-w-4xl mx-auto">
             <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl wood-border bg-black group cursor-pointer">
               {/* Decorative corners */}
               <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#FFD700] z-20 m-4"></div>
               <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#FFD700] z-20 m-4"></div>
               
               {/* Youtube Embed (Simulated with iframe) */}
               <iframe 
                 className="w-full h-full relative z-10"
                 src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=SimulatedVideoID" 
                 title="YouTube video player" 
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                 allowFullScreen
               ></iframe>
             </div>
             <div className="mt-8 text-center">
                <p className="text-gray-500 italic">"สัมผัสบรรยากาศจริง ผ่านมุมมองที่สวยงาม"</p>
             </div>
           </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#2D241E] text-white py-16 border-t-4 border-[#B8860B]">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border-2 border-[#FFD700] flex items-center justify-center rounded-full">
                <span className="font-serif text-2xl font-bold text-[#FFD700]">H</span>
              </div>
              <h3 className="text-2xl font-bold">ชุมชนหัวตะเข้</h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              แหล่งเรียนรู้วิถีถิ่น ตลาดเก่าริมน้ำ และศิลปะร่วมสมัย<br/>
              เขตลาดกระบัง กรุงเทพมหานคร
            </p>
          </div>
          
          <div>
            <h4 className="text-[#FFD700] font-bold uppercase tracking-widest mb-6">เมนูนำทาง</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14}/> ประวัติชุมชน</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14}/> แผนที่ท่องเที่ยว</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14}/> ร้านค้าแนะนำ</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14}/> กิจกรรม Workshop</a></li>
            </ul>
          </div>

          <div>
             <h4 className="text-[#FFD700] font-bold uppercase tracking-widest mb-6">ติดต่อสอบถาม</h4>
             <ul className="space-y-4 text-gray-400">
               <li className="flex items-start gap-3">
                 <MapPin className="text-[#B8860B] mt-1" />
                 <span>ซอยลาดกระบัง 17 แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพฯ 10520</span>
               </li>
               <li className="flex items-center gap-3">
                 <Play className="text-[#B8860B]" size={20} />
                 <span>Facebook: ชุมชนคนรักหัวตะเข้</span>
               </li>
             </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2024 Huatakhe Community. All rights reserved. Designed with Thai Heritage in mind.</p>
        </div>
      </footer>

      {/* --- Modal Popup for Cultural Items --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FDFBF7] rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl relative animate-scale-up">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-auto">
                <img src={activeModal.image} alt={activeModal.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center bg-woven">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#B8860B]">{activeModal.icon}</span>
                  <h3 className="text-3xl font-bold text-[#5D4037] font-serif">{activeModal.title}</h3>
                </div>
                <div className="h-1 w-20 bg-[#FFD700] mb-6"></div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {activeModal.desc}
                </p>
                 <div className="bg-[#5D4037]/5 p-4 rounded border-l-4 border-[#B8860B]">
                    <h4 className="font-bold text-[#5D4037] mb-2">เกร็ดความรู้</h4>
                    <p className="text-sm text-gray-600 italic">
                      {activeModal.details}
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind Custom Animations Configuration (Inline Style for demo purposes usually in tailwind.config) */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default HuatakheWebsite;