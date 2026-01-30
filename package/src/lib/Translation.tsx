/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";

export type TranslationProps = {
    term: string;
    text: string;
    components?: { [key: string]: React.ComponentType<{ children?: React.ReactNode }> };
};

type ParsedTag = {
    name: string;
    type: "open" | "close" | "self";
};

const parseTag = (tag: string): ParsedTag => {
    const isSelfClosing = tag.endsWith("/>");
    const isClosing = tag[1] === "/";
    const start = isClosing ? 2 : 1;
    const end = isSelfClosing
        ? tag.indexOf(" ") !== -1 && tag.indexOf(" ") < tag.length - 2
            ? tag.indexOf(" ")
            : tag.length - 2
        : tag.length - 1;
    return {
        name: tag.slice(start, end),
        type: isSelfClosing ? "self" : isClosing ? "close" : "open",
    };
};

const splitByTags = (text: string): { parts: string[]; tags: string[] } => {
    const parts: string[] = [];
    const tags: string[] = [];
    let current = "";
    let i = 0;

    while (i < text.length) {
        if (text[i] === "<") {
            const closeIndex = text.indexOf(">", i);
            if (closeIndex !== -1) {
                parts.push(current);
                current = "";
                tags.push(text.slice(i, closeIndex + 1));
                i = closeIndex + 1;
                continue;
            }
        }
        current += text[i];
        i++;
    }
    parts.push(current);

    return { parts, tags };
};

export const Translation = ({ term, text, components }: TranslationProps): React.ReactNode[] => {
    const { parts: textParts, tags } = splitByTags(text);
    const parts = textParts.map((el, i) => <React.Fragment key={`p-${i}`}>{el}</React.Fragment>);

    if (components) {
        const openedTags: { tag: string; position: number }[] = [];
        tags.forEach((tag, tagIndex) => {
            const { name: tagName, type: tagType } = parseTag(tag);
            if (tagType === "self") {
                const Component = components[tagName as keyof typeof components];
                if (Component) {
                    parts.splice(tagIndex + 1, 1, <Component key={`c-${tagIndex}`} />);
                } else {
                    console.warn(`Unknown component for term "${term}" - ${tagName}`);
                }
            } else if (tagType === "close") {
                const openedTagIndex = openedTags.findIndex((i) => i.tag === tagName);
                if (openedTagIndex !== -1) {
                    const lastOpenedIndex = openedTags.length - 1 - openedTagIndex;
                    const openedTagsLength = openedTags.length;
                    for (let i = openedTagsLength; i > lastOpenedIndex; i--) {
                        const targetIndex = i - 1;
                        const targetTag = openedTags[targetIndex];
                        const Component = components[targetTag.tag as keyof typeof components];
                        if (Component) {
                            const children = parts
                                .slice(targetTag.position + 1, tagIndex + 1)
                                .filter((child) =>
                                    Boolean(
                                        child &&
                                        typeof child === "object" &&
                                        "props" in child &&
                                        (child.props as any).children,
                                    ),
                                );
                            parts.splice(
                                targetTag.position + 1,
                                tagIndex - targetTag.position,
                                <Component key={`${tagIndex}-${targetIndex}`}>{children}</Component>,
                            );
                        } else {
                            console.warn(`Unknown component for term "${term}" - ${targetTag}`);
                        }
                        openedTags.splice(targetIndex, 1);
                    }
                }
            } else {
                openedTags.push({ tag: tagName, position: tagIndex });
            }
        });
    }

    return parts;
};
