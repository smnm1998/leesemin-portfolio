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
        // 위아래를 50%씩 깎아 뷰포트 정중앙에 걸친 섹션만 잡는다. threshold로 "섹션의 n%가
        // 보이는가"를 보면, 뷰포트보다 긴 섹션(좁은 화면의 Projects)은 그 비율에 영원히
        // 도달하지 못해 활성화되지 않는다. resolveActiveSection()의 기준과도 일치한다.
        { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
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
