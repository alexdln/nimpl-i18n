import { getTranslation, ServerTranslation, Transmitter } from "@src/i18n";
import AdditionalHome from "../AdditionalHome";
import AdditionalContacts from "../AdditionalContacts";

export default async function Additional({ page }: { page: string }) {
    const { t } = await getTranslation();

    return (
        <section style={{ marginTop: 60, marginBottom: 60 }}>
            <p>{t("additional.needClientSideLogic")}</p>
            <p>
                <ServerTranslation
                    term="additional.toTransfer"
                    components={{
                        link: ({ children }) => (
                            <a href="https://github.com/alexdln/nimpl-i18n?tab=readme-ov-file#client-components">
                                {children}
                            </a>
                        ),
                    }}
                />
            </p>
            <p>{t("additional.additinalBonus")}</p>
            <p>
                {t("additional.onThisPage", {
                    query: {
                        component: page === "home" ? "AdditionalHome" : "AdditionalContacts",
                    },
                })}
            </p>
            {page === "home" ? (
                <Transmitter terms={["additionalHome"]}>
                    <AdditionalHome />
                </Transmitter>
            ) : (
                <Transmitter terms={["additionalContacts"]}>
                    <AdditionalContacts />
                </Transmitter>
            )}
        </section>
    );
}
