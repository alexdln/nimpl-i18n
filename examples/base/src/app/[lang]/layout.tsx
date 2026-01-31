import { notFound } from "next/navigation";

export const metadata = {
    title: "Next.js @nimpl/i18n Example",
    description: "",
};

type RootLayoutProps = { children: React.ReactNode; params: Promise<{ lang: string }> };

export default async function RootLayout({ children, params }: RootLayoutProps) {
    const { lang } = await params;
    if (!["en", "fr", "de"].includes(lang)) return notFound();

    return (
        <html lang={lang}>
            <body>{children}</body>
        </html>
    );
}

export async function generateStaticParams() {
    return [{ lang: "en" }, { lang: "fr" }, { lang: "de" }];
}
