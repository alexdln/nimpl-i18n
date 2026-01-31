import { getTranslation } from "@src/i18n";
import LocaleSelect from "../../../components/LocaleSelect";
import Nav from "../../../components/Nav";
import Intro from "../../../components/Intro";
import ContactsContent from "../../../components/ContactsContent";
import Additional from "../../../components/Additional";

export default async function Contacts() {
    return (
        <main>
            <LocaleSelect />
            <Nav />
            <Intro page="contacts" />
            <ContactsContent />
            <Additional page="contacts" />
        </main>
    );
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
    const { t } = await getTranslation({ language: params.lang });

    return {
        title: t("contactsPage.meta.title"),
    };
}
