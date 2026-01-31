import { ServerTranslation } from "@src/i18n";

export default function HomeContent() {
    return (
        <section style={{ marginTop: 60, marginBottom: 60 }}>
            <p>
                <ServerTranslation
                    term="homeContent.title"
                    components={{
                        link: ({ children }) => (
                            <a href="https://github.com/alexdln/nimpl-i18n/examples/base/src/app/%5Blang%5D/page.tsx">
                                {children}
                            </a>
                        ),
                    }}
                />
            </p>
        </section>
    );
}
