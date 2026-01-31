"use client";

import { useState } from "react";
import { useTranslation } from "@nimpl/i18n/use-translation";
import { ClientTranslation } from "@nimpl/i18n/client-translation";

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
                            hookLink: ({ children }) => (
                                <a href="https://github.com/alexdln/nimpl-i18n?tab=readme-ov-file#client-components">
                                    {children}
                                </a>
                            ),
                            componentLink: ({ children }) => (
                                <a href="https://github.com/alexdln/nimpl-i18n?tab=readme-ov-file#client-components">
                                    {children}
                                </a>
                            ),
                        }}
                    />
                </p>
            </div>
        </div>
    );
}
