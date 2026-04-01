import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
    title: "이세민 포트폴리오",
    description: "프론트엔드 개발자 이세민 포트폴리오",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            try {
                                const t = JSON.parse(localStorage.getItem('theme') || '{}');
                                if (t.state?.isDark) document.documentElement.classList.add('dark');
                            } catch {}
                        `,
                    }}
                />
            </head>
            <body className="antialiased">
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
