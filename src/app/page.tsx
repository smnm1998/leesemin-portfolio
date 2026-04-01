"use client";

import { useState, useEffect } from "react";
import Aside, { type Section } from "@/components/Aside";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

const sections: Section[] = ["home", "skills", "projects", "contact"];

export default function Home() {
    const [activeSection, setActiveSection] = useState<Section>("home");

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
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Aside
                activeSection={activeSection}
                onSectionChange={scrollToSection}
            />
            <main className="flex-1 overflow-y-auto">
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
