import { getTranslation } from "@src/i18n";

import LocaleSelect from "../../components/LocaleSelect";
import Nav from "../../components/Nav";
import Intro from "../../components/Intro";
import HomeContent from "../../components/HomeContent";
import Additional from "../../components/Additional";

export default async function Home() {
    return (
        <main>
            <LocaleSelect />
            <Nav />
            <Intro page="home" />
            <HomeContent />
            <Additional page="home" />
        </main>
    );
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
    const { t } = await getTranslation({ language: params.lang });

    return {
        title: t("homePage.meta.title"),
    };
}
