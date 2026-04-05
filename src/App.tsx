import { useState, useEffect, FormEvent, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Share2, 
  Calendar, 
  Mail, 
  Phone, 
  Instagram, 
  Facebook, 
  ChevronRight,
  Menu,
  X,
  Star,
  Users,
  Award,
  Clock,
  Printer,
  Smartphone,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Contact', href: '#contact' },
];

const SERVICES = [
  {
    title: 'Weddings',
    description: 'Elegant photo booth fun that adds excitement and lasting memories to your special day.',
    icon: <Star className="w-6 h-6 text-gold-500" />
  },
  {
    title: 'Birthdays',
    description: 'Celebrate in style with fun photos, instant sharing, and a memorable guest experience.',
    icon: <Users className="w-6 h-6 text-gold-500" />
  },
  {
    title: 'Corporate Events',
    description: 'A clean and professional setup that brings entertainment and engagement to your event.',
    icon: <Award className="w-6 h-6 text-gold-500" />
  },
  {
    title: 'Private Parties',
    description: 'Perfect for anniversaries, baby showers, graduations, and all special celebrations.',
    icon: <Calendar className="w-6 h-6 text-gold-500" />
  },
  {
    title: 'Unlimited Photos',
    description: 'Your guests can capture as many moments as they want throughout the event.',
    icon: <Camera className="w-6 h-6 text-gold-500" />
  },
  {
    title: 'Instant Sharing',
    description: 'Share photos instantly with AirDrop, text, email, and print options.',
    icon: <Share2 className="w-6 h-6 text-gold-500" />
  }
];

const GALLERY_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80',
    alt: 'Wedding event'
  },
  {
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
    alt: 'Party event'
  },
  {
    url: 'https://images.unsplash.com/photo-1511795409834-432f31197c76?auto=format&fit=crop&w=900&q=80',
    alt: 'Luxury event'
  },
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    alt: 'Photo booth style event'
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pageViews, setPageViews] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Handle scroll for navbar styling
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Handle page views
    const storedViews = localStorage.getItem('gtimePageViews');
    const currentViews = storedViews ? parseInt(storedViews) + 1 : 1;
    localStorage.setItem('gtimePageViews', currentViews.toString());
    setPageViews(currentViews);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setIsPlaying(true);
      // We need to wait for the state to update and audio element to load the new src
      // But we can also just use the ref directly if we want
    }
  };

  useEffect(() => {
    if (audioSrc && audioRef.current && isPlaying) {
      audioRef.current.play().catch(err => console.log("Audio play blocked:", err));
    }
  }, [audioSrc, isPlaying]);

  const toggleMusic = () => {
    if (!audioSrc) {
      fileInputRef.current?.click();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Audio play blocked by browser:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const date = formData.get('date');
    const message = formData.get('message');

    const subject = encodeURIComponent("New G Time Photo Booth Inquiry");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nEvent Date: ${date}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:Gtimephotobooth@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Audio Element */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="audio/*" 
        className="hidden" 
      />
      {audioSrc && (
        <audio 
          ref={audioRef} 
          loop 
          src={audioSrc} 
        />
      )}

      {/* Floating Audio Controller */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        {/* Reset/Change Music Button (only visible if music is loaded) */}
        {audioSrc && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 bg-black/80 backdrop-blur-md text-gold-500 rounded-full border border-gold-500/20 flex items-center justify-center shadow-lg"
            title="Change Music"
          >
            <Music size={18} />
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMusic}
          className="w-14 h-14 bg-gold-500 text-black rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center group relative"
        >
          <AnimatePresence mode="wait">
            {!audioSrc ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Music size={24} />
              </motion.div>
            ) : isPlaying ? (
              <motion.div
                key="playing"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
              >
                <Volume2 size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="paused"
                initial={{ opacity: 0, rotate: 180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -180 }}
              >
                <VolumeX size={24} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Visualizer Animation when playing */}
          {isPlaying && audioSrc && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 24, 12, 28, 8] }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="w-1 bg-gold-500 rounded-full"
                />
              ))}
            </div>
          )}
          
          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md text-gold-500 px-4 py-2 rounded-lg text-xs font-bold tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-gold-500/20">
            {!audioSrc ? 'UPLOAD MUSIC' : isPlaying ? 'PAUSE MUSIC' : 'PLAY MUSIC'}
          </div>
        </motion.button>
      </div>
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-black/90 backdrop-blur-md py-3 border-gold-500/20' 
            : 'bg-transparent py-5 border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-gold-500 tracking-wider font-serif">
            G TIME
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-gold-500 transition-colors uppercase tracking-widest"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact" 
              className="bg-gold-500 text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-gold-400 transition-all transform hover:-translate-y-0.5"
            >
              BOOK NOW
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black border-b border-gold-500/20 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {NAV_LINKS.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    className="text-lg font-medium text-white/80 hover:text-gold-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <a 
                  href="#contact" 
                  className="bg-gold-500 text-black px-6 py-3 rounded-full text-center font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  BOOK NOW
                </a>
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/10">
                  <a href="https://www.instagram.com/gtimephotobooth?igsh=MWU5aTRuYm1mN2dodw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold-500 transition-colors">
                    <Instagram size={24} />
                  </a>
                  <a href="https://www.facebook.com/people/G-Time-Photo-Booth/61574501916717/?mibextid=wwXIfr&rdid=EEAwXUyZ165yRXP7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1JRoakVEBC%2F%3Fmibextid%3DwwXIfr" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold-500 transition-colors">
                    <Facebook size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80" 
            alt="Luxury Ballroom Event Setting"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          {/* Gold lights effect at the top */}
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-gold-500/30 via-gold-500/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#0a0a0a]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-gold-500 mb-6 tracking-tight text-shadow-gold">
              G Time Photo Booth
            </h1>
            <h2 className="text-xl md:text-3xl text-white/90 font-light mb-8 tracking-wide">
              Capture the Moment. Keep the Memory.
            </h2>
            <p className="max-w-2xl mx-auto text-white/70 text-lg mb-10 leading-relaxed">
              Add fun and excitement to your event with our premium photo booth experience. 
              Easy setup, unlimited photos, and instant digital sharing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#contact" 
                className="w-full sm:w-auto bg-gold-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gold-400 transition-all transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              >
                Book Your Event
              </a>
              <a 
                href="#services" 
                className="w-full sm:w-auto border-2 border-gold-500 text-gold-500 px-10 py-4 rounded-full font-bold text-lg hover:bg-gold-500 hover:text-black transition-all transform hover:-translate-y-1"
              >
                View Services
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold-500/50"
        >
          <div className="w-6 h-10 border-2 border-gold-500/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gold-500 rounded-full" />
          </div>
        </motion.div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-gold-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Our Story</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6">About Us</h3>
            <div className="w-20 h-1 bg-gold-500 mb-8" />
            <p className="max-w-3xl text-white/60 text-lg leading-relaxed">
              A luxury photo booth experience designed to make every celebration unforgettable.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-[#111] border border-gold-500/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Camera size={120} className="text-gold-500" />
            </div>
            <p className="text-xl text-white/80 leading-relaxed text-center italic font-light">
              "G Time Photo Booth delivers a premium, easy-to-use photo booth experience for weddings, 
              birthdays, corporate events, and private parties. We help your guests have fun, capture 
              beautiful memories, and share their moments instantly. Our setup is simple, professional, 
              and built to bring energy and elegance to your event."
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-gold-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">What We Offer</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Services</h3>
            <div className="w-20 h-1 bg-gold-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <motion.div 
                key={service.title}
                whileHover={{ y: -10 }}
                className="bg-[#111] border border-gold-500/10 p-8 rounded-3xl hover:border-gold-500/40 transition-all group"
              >
                <div className="w-14 h-14 bg-gold-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold text-gold-500 mb-4">{service.title}</h4>
                <p className="text-white/60 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-gold-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Visuals</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6">Gallery</h3>
            <div className="w-20 h-1 bg-gold-500 mb-8" />
            <p className="max-w-3xl text-white/60 text-lg leading-relaxed">
              A premium look for premium events.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GALLERY_IMAGES.map((image, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.02 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-gold-500/20 group"
              >
                <img 
                  src={image.url} 
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-gold-500 font-medium">{image.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-gold-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Get In Touch</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6">Contact Us</h3>
            <div className="w-20 h-1 bg-gold-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="bg-[#111] border border-gold-500/10 rounded-3xl p-8 md:p-12">
              <h4 className="text-2xl font-serif font-bold text-gold-500 mb-8">Let's Make Your Event Unforgettable</h4>
              <p className="text-white/70 mb-10 text-lg">
                G Time Photo Booth is ready to bring a classy, fun, and memorable experience to your event.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-sm text-white/40 uppercase tracking-widest mb-1">Email Us</p>
                    <a href="mailto:Gtimephotobooth@gmail.com" className="text-lg text-white hover:text-gold-500 transition-colors">
                      Gtimephotobooth@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-sm text-white/40 uppercase tracking-widest mb-1">Call Us</p>
                    <a href="tel:9147683466" className="text-lg text-white hover:text-gold-500 transition-colors">
                      (914) 768-3466
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-sm text-white/40 uppercase tracking-widest mb-1">Sharing Options</p>
                    <p className="text-lg text-white">AirDrop, Text, Email, Print</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-sm text-white/40 uppercase tracking-widest mb-1">Event Types</p>
                    <p className="text-lg text-white">Weddings, Birthdays, Corporate, Private Parties</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/40 uppercase tracking-widest mb-2">Page Views</p>
                  <div className="inline-flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-gold-500/20">
                    <Clock className="w-4 h-4 text-gold-500" />
                    <span className="text-gold-500 font-bold">{pageViews.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/gtimephotobooth?igsh=MWU5aTRuYm1mN2dodw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all">
                    <Instagram size={20} />
                  </a>
                  <a href="https://www.facebook.com/people/G-Time-Photo-Booth/61574501916717/?mibextid=wwXIfr&rdid=EEAwXUyZ165yRXP7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1JRoakVEBC%2F%3Fmibextid%3DwwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all">
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#111] border border-gold-500/10 rounded-3xl p-8 md:p-12">
              <h4 className="text-2xl font-serif font-bold text-gold-500 mb-8">Send a Message</h4>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-white/40 uppercase tracking-widest ml-1">Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="Your Name"
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/40 uppercase tracking-widest ml-1">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="Your Email"
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-white/40 uppercase tracking-widest ml-1">Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="Phone Number"
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/40 uppercase tracking-widest ml-1">Event Date</label>
                    <input 
                      type="date" 
                      name="date"
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all text-white/60"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    name="message"
                    required
                    placeholder="Tell us about your event..."
                    rows={4}
                    className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 focus:border-gold-500 outline-none transition-all resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gold-500 text-black py-5 rounded-2xl font-bold text-lg hover:bg-gold-400 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
                >
                  Send Inquiry <ChevronRight size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h4 className="text-2xl font-serif font-bold text-gold-500 mb-4 tracking-widest">G TIME</h4>
          <p className="text-white/40 mb-2">Capture the Moment. Keep the Memory.</p>
          <p className="text-white/60 mb-6">
            <a href="tel:9147683466" className="hover:text-gold-500 transition-colors">(914) 768-3466</a>
            <span className="mx-3 text-white/20">|</span>
            <a href="mailto:Gtimephotobooth@gmail.com" className="hover:text-gold-500 transition-colors">Gtimephotobooth@gmail.com</a>
          </p>
          <div className="flex justify-center gap-8 mb-8">
            {NAV_LINKS.map(link => (
              <a key={link.name} href={link.href} className="text-sm text-white/60 hover:text-gold-500 transition-colors uppercase tracking-widest">
                {link.name}
              </a>
            ))}
          </div>
          <div className="flex justify-center gap-4 mb-8">
            <a href="https://www.instagram.com/gtimephotobooth?igsh=MWU5aTRuYm1mN2dodw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all">
              <Instagram size={20} />
            </a>
            <a href="https://www.facebook.com/people/G-Time-Photo-Booth/61574501916717/?mibextid=wwXIfr&rdid=EEAwXUyZ165yRXP7&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1JRoakVEBC%2F%3Fmibextid%3DwwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-all">
              <Facebook size={20} />
            </a>
          </div>
          <div className="w-full h-px bg-white/5 mb-8" />
          <p className="text-xs text-white/30 tracking-widest uppercase">
            © {new Date().getFullYear()} G Time Photo Booth. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
