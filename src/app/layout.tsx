/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { NextIntlClientProvider } from 'next-intl';
import { TRPCReactProvider } from "@/trpc/react";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";

/**
 * This looks packed and daunting, but this will help our rankings in Google and build our identity
 */
export const metadata: Metadata = {
    title: {
        default: "OpenPromptBank",
        template: "%s | Say Goodbye To The Prompt Fiddling For Good"
    },
    description: "We're an AI prompt library platform where users can explore, rank, and contribute prompts for your favourite LLMs by various topics.",
    applicationName: "OpenPromptBank",
    authors: [
        { name: "trifledmatter", url: "https://github.com/trifledmatter" },
        { name: "desboisGIT", url: "https://github.com/desboisGIT" }
    ],
    keywords: [
        "ai", "prompts", "artificial intelligence", "machine learning", "AI tools", "AI prompts",
        "generative AI", "text generation", "AI content creation", "AI writing tools", "creative prompts",
        "prompt engineering", "AI chatbot", "AI assistants", "AI-powered tools", "deep learning",
        "AI content generation", "natural language processing", "NLP", "automated content creation",
        "chatbot prompts", "AI-based creativity", "AI innovation", "AI text generation", "smart AI tools",
        "AI art prompts", "AI development", "AI prompt generators", "AI-powered apps", "automated prompts",
        "custom AI prompts", "AI productivity tools", "AI-driven insights", "AI script generation",
        "AI for business", "AI content writing", "AI ideas", "AI story prompts", "AI-driven technology",
        "AI automation", "AI for creators", "AI SEO tools", "AI blogging tools", "AI-enhanced tools",
        "future of AI", "AI learning tools", "best AI tools", "creative AI applications", "AI advancements",
        "AI problem solving", "AI query tools", "AI text creation", "AI question prompts", "AI query generators",
        "AI innovation tools", "AI brainstorming", "prompt design", "AI framework", "AI personalization",
        "interactive AI", "AI-driven platforms", "AI-powered content", "AI insights", "AI-generated prompts",
        "best prompt tools", "how to use AI", "AI creative ideas", "AI for everyday use", "AI-powered workflows",
        "creative AI prompts", "AI writing assistants", "AI education tools", "AI training prompts",
        "AI-powered search", "next-generation AI", "AI task automation", "AI solutions for businesses",
        "cutting-edge AI tools", "AI text tools", "generative models", "AI creativity enhancer",
        "AI template generator", "AI innovation trends", "AI blog prompts", "AI marketing prompts",
        "AI-generated suggestions", "AI-enhanced workflows", "AI ideation tools", "AI-powered writing software"
    ],
    referrer: "no-referrer",
    creator: "OpenPromptBank Team",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "https://openpromptbank.com",
        languages: {
            "en-US": "https://openpromptbank.com/en-US/",
            "en-CA": "https://openpromptbank.com/en-CA/",
            "fr-FR": "https://openpromptbank.com/fr-FR/",
            "fr-CA": "https://openpromptbank.com/fr-CA/",
        }
    },
    icons: [{
        rel: "icon",
        url: "/branding/icon.svg"
    }],
    manifest: "https://openpromptbank.com/manifest.json",
    openGraph: {
        type: "website",
        url: "https://openpromptbank.com",
        title: "OpenPromptBank - Say Goodbye To The Prompt Fiddling For Good",
        description: "We're an AI prompt library platform where users can explore, rank, and contribute prompts for your favourite LLMs by various topics.",
        siteName: "OpenPromptBank",
        images: [
            {
                url: "https://openpromptbank.com/branding/thumbmail.webp",
                width: 1200,
                height: 630,
                alt: "Open Prompt Bank"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        site: "@OpenPromptBank",
        images: "https://openpromptbank.com/branding/thumbmail.webp",
    },
    abstract: "We're an AI prompt library platform where users can explore, rank, and contribute prompts for your favourite LLMs by various topics.",
    category: "Artificial Intelligence",
};

export default async function RootLayout({
    children,
    params: { locale }
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {

    setRequestLocale(locale)

    return (
        <html lang={locale} className={`${GeistSans.variable}`}>
            <body>
                <NextIntlClientProvider messages={await getMessages()}>
                    <TRPCReactProvider>{children}</TRPCReactProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
