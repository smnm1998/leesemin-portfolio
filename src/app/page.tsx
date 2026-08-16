'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Aside, { type Section } from '@/components/Aside';
import Hero from '@/components/sections/Hero';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import { readMainScroll, saveMainScroll } from '@/lib/scrollMemory';

const sections: Section[] = ['home', 'skills', 'projects', 'contact'];

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const mainRef = useRef<HTMLElement>(null);

  // 해시 없이(뒤로가기 등) 돌아왔을 때만 마지막 스크롤 위치를 페인트 전에 복원
  useLayoutEffect(() => {
    if (window.location.hash) return;
    const saved = readMainScroll();
    if (saved && mainRef.current) {
      mainRef.current.scrollTop = saved;
    }
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        saveMainScroll(main.scrollTop);
        ticking = false;
      });
    };

    main.addEventListener('scroll', onScroll, { passive: true });
    return () => main.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.5 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (id: Section) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Aside activeSection={activeSection} onSectionChange={scrollToSection} />
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        <section id="home" className="h-screen">
          <Hero />
        </section>
        <section id="skills" className="h-screen">
          <Skills />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="contact" className="h-screen">
          <Contact />
        </section>
      </main>
    </div>
  );
}
