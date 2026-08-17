'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

const styles = {
  wrapper:
    'flex-1 flex flex-col items-center justify-center gap-12 px-5 md:px-10 lg:gap-22 lg:px-16',

  grid: 'flex flex-col-reverse items-center gap-8 w-full max-w-3xl md:grid md:grid-cols-2 md:gap-12 md:items-center lg:gap-20',
  textCol: 'flex flex-col gap-1 text-center md:text-left',
  greeting: 'text-xl text-gray-400 dark:text-gray-500 md:text-2xl',
  typingRow: 'text-2xl leading-snug sm:text-3xl lg:text-4xl',
  typingText: 'text-yellow-400 dark:text-yellow-400',
  cursor: 'inline-block w-0.5 h-6 sm:h-7 lg:h-9 bg-gray-900 dark:bg-gray-100 ml-1 align-middle',
  staticText: 'text-gray-900 dark:text-gray-100',
  photoCol: 'flex justify-center',
  photoWrapper: 'w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-2xl overflow-hidden',
  photo: 'w-full h-full object-cover',
  description: 'text-center text-gray-500 dark:text-gray-300 text-sm sm:text-base leading-relaxed',
  scrollBtn:
    'mt-2 text-gray-300 dark:text-gray-600 cursor-pointer hover:text-gray-400 dark:hover:text-gray-500 transition-colors',
} as const;

const rotatingWords = [
  '신입 프론트엔드',
  '음악을 좋아하는',
  'React가 주력인',
  '사진 찍기가 취미인',
  '걱정하기보단 그냥 하는',
  '긍정적인 마인드를 가진',
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const word = rotatingWords[index];
    setDisplayedText('');
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      charIndex++;
      setDisplayedText(word.slice(0, charIndex));
      if (charIndex === word.length) clearInterval(typeInterval);
    }, 80);

    return () => clearInterval(typeInterval);
  }, [index]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <div className={styles.textCol}>
          <p className={styles.greeting}>안녕하세요!</p>
          {/* 페이지의 유일한 h1 — preflight가 heading 기본 스타일을 지우므로 외형은 그대로다 */}
          <h1 className={styles.typingRow}>
            <span className={styles.typingText}>{displayedText}</span>
            <motion.span
              aria-hidden
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
              }}
              className={styles.cursor}
            />
            <br />
            <span className={styles.staticText}>개발자 이세민입니다.</span>
          </h1>
        </div>
        <div className={styles.photoCol}>
          <div className={styles.photoWrapper}>
            <Image
              src="/lsm.jpeg"
              alt="이세민"
              width={144}
              height={144}
              className={styles.photo}
              priority
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <p className={styles.description}>
          <i className="text-2xl text-gray-700 dark:text-gray-100">소통, 책임, 신뢰</i>
          <br />
          <br />
          적극적이고 원활한 소통, 자신이 맡은 업무에 대한 책임감 그리고 팀원에 대한 신뢰가 중요하다
          생각합니다.
        </p>
        <motion.button
          className={styles.scrollBtn}
          onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          aria-label="스크롤 내리기"
        >
          <ChevronDown size={24} />
        </motion.button>
      </div>
    </div>
  );
}
