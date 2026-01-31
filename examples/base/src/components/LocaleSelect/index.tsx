import { getTranslation } from "@src/i18n";
import Link from "next/link";

const languages = ["en", "fr", "de"];

export default async function LocaleSelect() {
    const { t } = await getTranslation();

    return (
        <div style={{ marginTop: 20, marginBottom: 20 }}>
            <p>{t("selectLocale.title")}</p>
            <ul>
                {languages.map((language) => (
                    <li key={language}>
                        <Link href={`/${language}`}>{language}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
