'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Aside, { type Section } from '@/components/Aside';
import Hero from '@/components/sections/Hero';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import { saveMainScroll, consumeReturnIntent } from '@/lib/scrollMemory';
import { ACTIVE_LINE_ROOT_MARGIN, resolveActiveSection } from '@/lib/activeSection';

const sections: Section[] = ['home', 'skills', 'projects', 'contact'];
const isSection = (value: string): value is Section => sections.includes(value as Section);

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const resolvedInitialPosition = useRef(false);

  // 새로고침·뒤로가기 위치는 브라우저 네이티브 복원에 맡긴다(JS로 하면 하이드레이션
  // 이후라 항상 늦다). 여기서는 SPA 이동으로 넘어온 1회성 요청만 처리하며, 읽는 즉시
  // 지워지는 값이라 Strict Mode의 이펙트 이중 실행에 소비되지 않도록 ref로 가드한다.
  useLayoutEffect(() => {
    if (resolvedInitialPosition.current) return;
    resolvedInitialPosition.current = true;

    const intent = consumeReturnIntent();
    if (intent && 'section' in intent && isSection(intent.section)) {
      document.getElementById(intent.section)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    } else if (intent && 'scrollY' in intent) {
      window.scrollTo(0, intent.scrollY);
    }

    // 위치가 확정된 뒤 동기적으로 맞춘다 — 옵저버의 첫 콜백을 기다리면 한 프레임 어긋난다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveSection(resolveActiveSection(sections, 'home'));
  }, []);

  // 상세페이지에서 "목록으로" 돌아올 때 쓸 수 있도록 현재 위치를 계속 기록해둔다.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        saveMainScroll(window.scrollY);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
        { rootMargin: ACTIVE_LINE_ROOT_MARGIN, threshold: 0 },
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
    <div>
      <Aside activeSection={activeSection} onSectionChange={scrollToSection} />
      {/* pb-16: 하단 탭바에 콘텐츠가 가리지 않도록 (lg 이상은 좌측 사이드바로 전환) */}
      <main className="pb-16 lg:pb-0 lg:ml-16">
        {/* min-h-screen + flex — 좁은 화면에서 콘텐츠가 한 화면을 넘으면 잘리지 않고 늘어나되,
            자식이 flex-1로 남은 높이를 채운다(h-full은 부모 높이가 auto면 무시되므로 쓰지 않는다) */}
        <section id="home" className="min-h-screen flex flex-col">
          <Hero />
        </section>
        <section id="skills" className="min-h-screen flex flex-col">
          <Skills />
        </section>
        <section id="projects" className="flex flex-col">
          <Projects />
        </section>
        <section id="contact" className="min-h-screen flex flex-col">
          <Contact />
        </section>
      </main>
    </div>
  );
}
