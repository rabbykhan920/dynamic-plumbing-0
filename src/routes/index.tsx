import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronRight, Instagram, Mail, Menu, Phone, Play, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import heroImage from "@/assets/dynamic-hero.jpg";
import aboutImage from "@/assets/dynamic-about.jpg";
import beforeImage from "@/assets/dynamic-before.jpg";
import afterImage from "@/assets/dynamic-after.jpg";
import project1 from "@/assets/project-01.jpg";
import project2 from "@/assets/project-02.jpg";
import project3 from "@/assets/project-03.jpg";
import project4 from "@/assets/project-04.jpg";

const phoneHref = "tel:+17862518453";
const emailHref = "mailto:dynamicplumbinganddesign@gmail.com";
const instagramHref = "https://www.instagram.com/dynamic_plumbing_and_design";

const navItems = [
  ["Home", "home"], ["About", "about"], ["Services", "services"], ["Reels", "reels"],
  ["Gallery", "gallery"], ["Before & After", "before-after"], ["Contact", "contact"],
] as const;

const services = [
  { n: "01", title: "Leak Detection & Repair", body: "Pinpointing hidden leaks and restoring affected plumbing with a precise, considered approach.", image: project4 },
  { n: "02", title: "Drain Cleaning", body: "Clearing slow or blocked drains to help water flow freely through your plumbing system.", image: project2 },
  { n: "03", title: "Faucet & Fixture Repair", body: "Repairing and replacing faucets and fixtures with close attention to fit and finish.", image: project1 },
  { n: "04", title: "Toilet Repair & Replacement", body: "Resolving common toilet issues and installing replacement units when needed.", image: aboutImage },
  { n: "05", title: "Water Heater Services", body: "Service and support for water heating systems to help restore dependable hot water.", image: project3 },
  { n: "06", title: "Pipe Repair", body: "Addressing damaged or compromised piping with practical, durable repair solutions.", image: afterImage },
  { n: "07", title: "Emergency Plumbing", body: "Responsive plumbing help when urgent problems require immediate attention.", image: beforeImage },
  { n: "08", title: "General Plumbing", body: "Thoughtful plumbing support for everyday repairs, updates, and new installations.", image: heroImage },
];

const galleryImages = [
  { src: project1, label: "Bath Fixture" }, { src: project2, label: "Rainfall System" },
  { src: project3, label: "Water Heating" }, { src: project4, label: "Kitchen Fixture" },
  { src: aboutImage, label: "Precision Install" }, { src: afterImage, label: "Pipework Detail" },
  { src: heroImage, label: "Signature Interior" }, { src: beforeImage, label: "Project Detail" },
  { src: project2, label: "Chrome Finish" },
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Dynamic Plumbing | Plumbing Without Limits" },
    { name: "description", content: "Dynamic Plumbing meets your desires and needs with leak repair, drain cleaning, fixtures, water heaters, pipe repair, and general plumbing services." },
    { property: "og:title", content: "Dynamic Plumbing | Plumbing Without Limits" },
    { property: "og:description", content: "Modern plumbing service shaped around your needs." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

const reveal = { initial: { opacity: 0, y: 38 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .2 }, transition: { duration: .8, ease: [0.22, 1, 0.36, 1] as const } };

function Index() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const reduced = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), reduced ? 50 : 1150);
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const current = [...navItems].reverse().find(([, id]) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top < 240 : false;
      });
      if (current) setActiveSection(current[1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, [reduced]);

  return <div className="site-shell">
    <AnimatePresence>{loading && <Loader />}</AnimatePresence>
    <CustomCursor />
    <Header scrolled={scrolled} open={menuOpen} setOpen={setMenuOpen} active={activeSection} />
    <main>
      <Hero />
      <About />
      <Services />
      <Reels />
      <BeforeAfter />
      <Gallery />
      <Info />
      <Contact />
    </main>
    <Footer />
  </div>;
}

function Loader() {
  return <motion.div className="loader" exit={{ opacity: 0, y: "-100%" }} transition={{ duration: .65, ease: [0.76,0,0.24,1] }}>
    <motion.p initial={{ opacity: 0, letterSpacing: ".05em" }} animate={{ opacity: 1, letterSpacing: ".32em" }} transition={{ duration: .65 }}>DYNAMIC PLUMBING</motion.p>
    <div className="loader-line"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .9, ease: "easeInOut" }} /></div>
  </motion.div>;
}

function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 240, damping: 28, mass: .45 });
  const ringY = useSpring(y, { stiffness: 240, damping: 28, mass: .45 });
  const [cursor, setCursor] = useState({ label: "", active: false, arrow: false });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const service = (e.target as HTMLElement).closest(".service-row");
      const label = service ? "EXPLORE" : target?.dataset["cursor"] ?? "";
      setCursor({ active: Boolean(target), label, arrow: Boolean(target && !label) });
    };
    window.addEventListener("mousemove", move); document.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); };
  }, [x, y]);
  return <>
    <motion.div className={`cursor-ring ${cursor.active ? "is-active" : ""} ${cursor.label ? "has-label" : ""}`} style={{ x: ringX, y: ringY }}>{cursor.label || (cursor.arrow ? "↗" : "")}</motion.div>
    <motion.div className="cursor-dot" style={{ x, y }} />
  </>;
}

function Header({ scrolled, open, setOpen, active }: { scrolled: boolean; open: boolean; setOpen: (v:boolean)=>void; active:string }) {
  return <motion.header initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1, duration: .7 }} className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
    <a href="#home" className="brand" aria-label="Dynamic Plumbing home"><b>DYNAMIC</b><span>PLUMBING</span></a>
    <nav className="desktop-nav" aria-label="Main navigation">{navItems.map(([label,id]) => <a key={id} className={active === id ? "active" : ""} href={`#${id}`}>{label}</a>)}</nav>
    <a href="#contact" className="gloss-button nav-cta button-outline"><span>GET IN TOUCH</span><ArrowUp size={15}/></a>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X/> : <Menu/>}</button>
    <AnimatePresence>{open && <motion.nav className="mobile-nav" initial={{ opacity:0, y:-12 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-12 }}>{navItems.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}<ArrowRight size={17}/></a>)}</motion.nav>}</AnimatePresence>
  </motion.header>;
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0,1], [0,150]);
  const titleY = useTransform(scrollYProgress, [0,1], [0,80]);
  const detailsY = useTransform(scrollYProgress, [0,1], [0,-55]);
  return <section id="home" ref={ref} className="hero">
    <motion.div className="hero-image-stage" style={{ y: imageY }}><motion.img initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 7, ease: "easeOut" }} src={heroImage} alt="Modern designer faucet and plumbing in a dark interior" width={1920} height={1080} className="hero-image" /></motion.div>
    <div className="hero-shade"/><div className="hero-beam" aria-hidden="true"/><div className="ambient-lines" aria-hidden="true" />
    <div className="hero-grain" aria-hidden="true"/>
    <div className="hero-particles" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i}/>)}</div>
    <motion.div className="hero-pipe hero-pipe-a" style={{ y: detailsY }} aria-hidden="true"><span/><i/></motion.div>
    <motion.div className="hero-pipe hero-pipe-b" style={{ y: titleY }} aria-hidden="true"><span/><i/></motion.div>
    <div className="hero-content">
      <motion.div className="hero-kicker" initial={{ opacity:0, x:-24 }} animate={{opacity:1,x:0}} transition={{delay:1.15,duration:.7}}><span/> DYNAMIC PLUMBING <i>PRECISION / PERFORMANCE</i></motion.div>
      <motion.div className="hero-editorial" style={{ y:titleY }}>
        <div className="hero-title-wrap"><motion.h1 initial={{ y:"108%" }} animate={{ y:0 }} transition={{delay:1.22,duration:1,ease:[.22,1,.36,1]}}>PLUMBING</motion.h1></div>
        <div className="hero-title-wrap hero-title-second"><motion.h1 className="outline-text" initial={{ y:"108%" }} animate={{ y:0 }} transition={{delay:1.36,duration:1,ease:[.22,1,.36,1]}}>WITHOUT LIMITS.</motion.h1></div>
      </motion.div>
      <motion.div className="hero-bottom" initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:1.65,duration:.75}}>
        <div className="hero-copy"><span>01 / THE DYNAMIC STANDARD</span><p>Dynamic Plumbing is where we meet your desires and needs in the plumbing industry.</p></div>
        <div className="hero-actions"><a className="gloss-button primary-button hero-primary" href="#contact"><span>GET IN TOUCH</span><ArrowUp size={18}/></a><a className="text-link button-outline hero-secondary" href="#services"><span>EXPLORE SERVICES</span><ArrowDown size={16}/></a></div>
      </motion.div>
    </div>
    <motion.div className="hero-detail-card hero-detail-top" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:1.75,duration:.8}}><span>FLOW / 01</span><strong>ENGINEERED<br/>WITH INTENT</strong><i/></motion.div>
    <motion.div className="hero-detail-card hero-detail-bottom" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:1.9,duration:.8}}><span>24 / 7</span><p>FORM<br/>MEETS<br/>FUNCTION</p></motion.div>
    <div className="hero-scroll"><span>SCROLL TO DISCOVER</span><i/></div>
  </section>;
}

function SectionLabel({ n, children }: { n:string; children:React.ReactNode }) { return <div className="section-label"><span>{n}</span><p>{children}</p><i/></div>; }

function About() {
  return <section id="about" className="about section-pad">
    <motion.div {...reveal}><SectionLabel n="02">THE DYNAMIC STANDARD</SectionLabel></motion.div>
    <div className="about-grid">
      <motion.div {...reveal} className="about-copy"><h2>WHERE YOUR NEEDS<br/><span>MEET SMART PLUMBING.</span></h2><p>We approach every plumbing need with clarity, care, and a sharp eye for the details that shape the finished result.</p></motion.div>
      <motion.div {...reveal} className="about-visual" data-cursor="VIEW"><div className="image-index">D / 01</div><img src={aboutImage} alt="Precision plumbing fixture installation" loading="lazy" width={1280} height={1536}/><div className="image-caption">A considered approach<br/>to every connection.</div></motion.div>
    </div>
    <div className="values">{["QUALITY","PRECISION","SERVICE"].map((item,i) => <motion.div key={item} {...reveal} transition={{...reveal.transition,delay:i*.1}}><span>0{i+1}</span><h3>{item}</h3><i/></motion.div>)}</div>
  </section>;
}

function Services() {
  const [active, setActive] = useState(0);
  const activeService = services.at(active);
  if (!activeService) return null;
  return <section id="services" className="services section-pad">
    <motion.div {...reveal} className="services-head"><div><SectionLabel n="03">OUR SERVICES</SectionLabel><h2>BUILT AROUND<br/><span>WHAT YOU NEED.</span></h2></div><p>Select a service to explore our approach.</p></motion.div>
    <div className="service-experience">
      <div className="service-list">{services.map((service,i) => <motion.button layout key={service.title} onMouseEnter={()=>setActive(i)} onClick={()=>setActive(i)} className={`service-row ${active===i?"active":""}`} aria-expanded={active===i}>
        <span className="service-number">{service.n}</span><strong>{service.title}</strong><ChevronRight className="service-arrow"/>
        <AnimatePresence initial={false}>{active===i && <motion.p initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>{service.body}</motion.p>}</AnimatePresence>
      </motion.button>)}</div>
      <div className="service-preview" data-cursor="EXPLORE"><AnimatePresence mode="wait"><motion.img key={active} src={activeService.image} alt={activeService.title} initial={{opacity:0,scale:1.08}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:.55}} loading="lazy" width={1200} height={1400}/></AnimatePresence><div className="preview-meta"><span>{activeService.n}</span><p>DYNAMIC<br/>SERVICE</p></div></div>
    </div>
  </section>;
}

function Reels() {
  return <section id="reels" className="reels section-pad">
    <motion.div {...reveal} className="reels-head"><SectionLabel n="04">MOTION / WORK</SectionLabel><h2>OUR <span>REELS</span></h2><p>Real work. Real detail. Coming into frame.</p></motion.div>
    <div className="reel-track">{[1,2,3].map((n,i)=><motion.div key={n} className={`reel-card reel-${n}`} data-cursor="WATCH" initial={{opacity:0,y:70,rotate:i===0?-5:i===2?5:0}} whileInView={{opacity:1,y:0,rotate:i===0?-3:i===2?3:0}} viewport={{once:true}} transition={{delay:i*.13,duration:.8}} whileHover={{y:-16,rotate:0}}>
      {/* Replace with client's real reel */}
      <div className="reel-no">0{n}</div><div className="reel-sweep"/><div className="play"><Play fill="currentColor"/></div><div className="reel-bottom"><span>REEL 0{n}</span><i>9:16</i></div>
    </motion.div>)}</div>
  </section>;
}

function BeforeAfter() {
  const [position,setPosition] = useState(52);
  return <section id="before-after" className="comparison section-pad">
    <motion.div {...reveal} className="comparison-head"><SectionLabel n="05">TRANSFORMATION</SectionLabel><h2>BEFORE <span>/</span> AFTER</h2><p>Drag to reveal the difference.</p></motion.div>
    <motion.div {...reveal} className="compare-frame">
      <img src={afterImage} alt="Updated plumbing installation" loading="lazy" width={1600} height={1100}/>
      <div className="before-layer" style={{clipPath:`inset(0 ${100-position}% 0 0)`}}><img src={beforeImage} alt="Plumbing installation before update" loading="lazy" width={1600} height={1100}/></div>
      <span className="compare-label before-label">BEFORE</span><span className="compare-label after-label">AFTER</span>
      <input aria-label="Reveal before and after" className="compare-range" type="range" min="0" max="100" value={position} onChange={e=>setPosition(Number(e.target.value))}/>
      <div className="compare-line" style={{left:`${position}%`}}><div><ArrowLeft/><ArrowRight/></div></div>
    </motion.div>
  </section>;
}

function Gallery() {
  const [active,setActive] = useState(0);
  const move = (dir:number) => setActive(v => (v+dir+galleryImages.length)%galleryImages.length);
  const arranged = useMemo(() => galleryImages.map((_,i)=>((i-active+galleryImages.length)%galleryImages.length)),[active]);
  return <section id="gallery" className="gallery section-pad">
    <motion.div {...reveal} className="gallery-head"><SectionLabel n="06">SELECTED DETAILS</SectionLabel><h2>THE WORK,<br/><span>IN FOCUS.</span></h2><div className="gallery-count">{String(active+1).padStart(2,"0")} <i/> 09</div></motion.div>
    <div className="orbit-gallery" data-cursor="VIEW">{galleryImages.map((image,i)=>{
      const slot=arranged[i]; return <motion.div key={`${image.label}-${i}`} layout className={`orbit-item slot-${slot}`} onClick={()=>setActive(i)} transition={{type:"spring",stiffness:90,damping:18}}><img src={image.src} alt={image.label} loading="lazy" width={1200} height={1400}/><span>{image.label}</span></motion.div>
    })}</div>
    <div className="gallery-controls"><button onClick={()=>move(-1)}><ArrowLeft/> PREV</button><div/><button onClick={()=>move(1)}>NEXT <ArrowRight/></button></div>
  </section>;
}

function Info() {
  return <section className="info-strip section-pad"><motion.div {...reveal} className="info-title"><span>INFORMATION</span><h2>DYNAMIC<br/>PLUMBING</h2></motion.div><div className="info-panels"><motion.a {...reveal} href={phoneHref}><Phone/><span>PHONE</span><strong>+1 786-251-8453</strong><ArrowUp/></motion.a><motion.a {...reveal} href={emailHref}><Mail/><span>EMAIL</span><strong>dynamicplumbinganddesign@gmail.com</strong><ArrowUp/></motion.a></div></section>;
}

function Contact() {
  return <section id="contact" className="contact section-pad"><div className="contact-glow"/><motion.div {...reveal}><SectionLabel n="07">START A CONVERSATION</SectionLabel><h2>LET'S MAKE YOUR NEXT<br/>PLUMBING PROJECT <span>DYNAMIC.</span></h2><div className="contact-actions"><a className="gloss-button primary-button call-button" href={phoneHref}><Phone size={17}/><span>CALL NOW</span><ArrowUp/></a><a className="gloss-button button-outline" href={emailHref}><Mail size={17}/><span>SEND EMAIL</span><ArrowUp/></a><a className="gloss-button button-minimal" href={instagramHref} target="_blank" rel="noreferrer"><Instagram size={17}/><span>VISIT INSTAGRAM</span><ArrowUp/></a></div></motion.div></section>;
}

function Footer() {
  return <footer><div className="footer-top"><div><div className="footer-logo">DYNAMIC <span>PLUMBING</span></div><p>Dynamic Plumbing is where we meet your desires and needs in the plumbing industry.</p></div><div className="footer-links">{navItems.map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}</div><div className="footer-contact"><a href={phoneHref}>+1 786-251-8453</a><a href={emailHref}>dynamicplumbinganddesign@gmail.com</a><a href={instagramHref} target="_blank" rel="noreferrer">Instagram ↗</a></div></div><div className="footer-wordmark">DYNAMIC</div><div className="footer-bottom"><span>© 2026 DYNAMIC PLUMBING</span><span>PLUMBING WITHOUT LIMITS.</span><a href="#home" aria-label="Back to top">BACK TO TOP <ArrowUp/></a></div></footer>;
}