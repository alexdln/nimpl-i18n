import { getTranslation, ServerTranslation } from "@src/i18n";

export default async function Intro({ page }: { page: string }) {
    const { t } = await getTranslation();

    return (
        <section style={{ marginTop: 60, marginBottom: 60 }}>
            <h1>{t("intro.title", { query: { page } })}</h1>
            <p>
                <ServerTranslation
                    term="intro.description"
                    components={{
                        getterLink: ({ children }) => (
                            <a href="https://github.com/alexdln/nimpl-i18n?tab=readme-ov-file#server-components">
                                {children}
                            </a>
                        ),
                        componentLink: ({ children }) => (
                            <a href="https://github.com/alexdln/nimpl-i18n?tab=readme-ov-file#server-components">
                                {children}
                            </a>
                        ),
                    }}
                />
            </p>
        </section>
    );
}
