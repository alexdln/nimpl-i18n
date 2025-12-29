import getTranslation from "@nimpl/i18n/getTranslation";
import ServerTranslation from "@nimpl/i18n/ServerTranslation";
import I18nTransmitter from "@nimpl/i18n/I18nTransmitter";
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
                        link: <a href="https://github.com/alexdln/nimpl-i18n?tab=readme-ov-file#client-components" />,
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
                <I18nTransmitter terms={["additionalHome"]}>
                    <AdditionalHome />
                </I18nTransmitter>
            ) : (
                <I18nTransmitter terms={["additionalContacts"]}>
                    <AdditionalContacts />
                </I18nTransmitter>
            )}
        </section>
    );
}
