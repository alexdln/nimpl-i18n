"use client";

import { useState } from "react";
import useTranslation from "@nimpl/i18n/useTranslation";
import ClientTranslation from "@nimpl/i18n/ClientTranslation";

export default function AdditionalContacts() {
    const { t } = useTranslation();
    const [isOpened, setIsOpened] = useState(false);

    return (
        <div>
            <button onClick={() => setIsOpened(!isOpened)}>{t("additionalContacts.viewContacts")}</button>
            <div style={{ display: isOpened ? "block" : "none" }}>
                <p>{t("additionalContacts.additionalContacts")}</p>
                <p>
                    <ClientTranslation
                        term="additionalContacts.headerAbove"
                        components={{
                            hookLink: (
                                <a href="https://github.com/alexdln/nimpl-i18n?tab=readme-ov-file#client-components" />
                            ),
                            componentLink: (
                                <a href="https://github.com/alexdln/nimpl-i18n?tab=readme-ov-file#client-components" />
                            ),
                        }}
                    />
                </p>
            </div>
        </div>
    );
}
