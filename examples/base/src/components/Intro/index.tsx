import getTranslation from "@nimpl/i18n/getTranslation";
import ServerTranslation from "@nimpl/i18n/ServerTranslation";

export default async function Intro({ page }: { page: string }) {
    const { t } = await getTranslation();

    return (
        <section style={{ marginTop: 60, marginBottom: 60 }}>
            <h1>{t("intro.title", { query: { page } })}</h1>
            <p>
                <ServerTranslation
                    term="intro.description"
                    components={{
                        getterLink: (
                            <a href="https://github.com/alexdln/nimpl-i18n?tab=readme-ov-file#server-components" />
                        ),
                        componentLink: (
                            <a href="https://github.com/alexdln/nimpl-i18n?tab=readme-ov-file#server-components" />
                        ),
                    }}
                />
            </p>
        </section>
    );
}
