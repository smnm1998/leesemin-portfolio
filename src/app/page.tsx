'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Aside, { type Section } from '@/components/Aside';
import Hero from '@/components/sections/Hero';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import {
  saveMainScroll,
  saveActiveSection,
  consumeTargetSection,
  consumeTargetScroll,
} from '@/lib/scrollMemory';

const sections: Section[] = ['home', 'skills', 'projects', 'contact'];
const isSection = (value: string): value is Section => sections.includes(value as Section);

// 현재 스크롤 위치 기준으로 활성 섹션을 즉시 계산한다. IntersectionObserver는 첫 콜백이
// 비동기라 그걸 기다리면 기본값(소개)이 한 프레임 보였다 사라진다.
function resolveActiveSection(): Section {
  const viewportMiddle = window.innerHeight / 2;

  for (const id of sections) {
    const rect = document.getElementById(id)?.getBoundingClientRect();
    if (rect && rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) return id;
  }

  return 'home';
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const resolvedInitialPosition = useRef(false);

  // 문서 자체가 스크롤되므로, 새로고침·뒤로가기의 위치 복원은 브라우저 네이티브 기능이
  // 첫 페인트 전에 알아서 처리한다(여기서 아무것도 하지 않는 게 정답 — JS로 복원하면
  // 하이드레이션 이후에나 실행돼서 잘못된 위치가 잠깐 보인다).
  //
  // 여기서 처리할 건 SPA 내비게이션으로 넘어온 "명시적 요청"뿐이다. 두 마커 모두 읽는 즉시
  // 지워지는 1회성이라, ref로 가드해 Strict Mode의 이펙트 이중 실행에 소비되지 않게 한다.
  useLayoutEffect(() => {
    if (resolvedInitialPosition.current) return;
    resolvedInitialPosition.current = true;

    const target = consumeTargetSection();
    if (target && isSection(target)) {
      document.getElementById(target)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    } else {
      const targetScroll = consumeTargetScroll();
      if (targetScroll !== null) window.scrollTo(0, targetScroll);
    }

    // 스크롤 위치가 확정된 뒤 활성 섹션을 동기적으로 맞춘다(페인트 전에 flush됨).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveSection(resolveActiveSection());
  }, []);

  useEffect(() => {
    saveActiveSection(activeSection);
  }, [activeSection]);

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
    <div>
      <Aside activeSection={activeSection} onSectionChange={scrollToSection} />
      <main className="ml-16">
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
