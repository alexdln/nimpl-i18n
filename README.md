# @nimpl/i18n

<PackageLinks npmName="@nimpl/i18n" githubName="nimpl-i18n" />

i18n library designed for React Server Components with maximum optimization (due to the transfer of logic to the assembly stage and/or server side).

<!---robin-->

Read the documentation in a convenient interface at [nimpl.dev/docs/i18n](https://nimpl.dev/docs/i18n)

<!---/robin-->

## Installation

```bash
npm i @nimpl/i18n
```

## Why This Library?

Most i18n libraries either load the entire dictionary on the client or disable static optimization when working with Server Components.

This library resolves translations on the server. Client components only receive the specific precompiled keys they need through the `Transmitter` wrapper - not the whole dictionary. Pages remain statically generated with translations baked into the HTML.

## Quick Start

### 1. Create i18n Configuration

Create a configuration file (e.g., `src/i18n.ts`):

```ts
import { initialize } from "@nimpl/i18n/initialize";
import fs from "fs/promises";

export const { getTranslation, ServerTranslation, Transmitter, revalidate } = initialize({
  load: async (language) => {
    const data = await fs.readFile(`./translations/${language}.json`, "utf-8");
    return JSON.parse(data);
  },
  getLanguage: async () => {
    // Use next/root-params, @nimpl/getters, @nimpl/context or implement your own language detection
    const { params } = await import("@nimpl/getters/get-params").then(m => m.getParams());
    return params.lang as string;
  },
  languages: ["en", "de", "fr"],
  cache: true,
});
```

### 2. Set Up Routes

```
app/
  [lang]/
    layout.tsx
    page.tsx
```

```tsx
// app/[lang]/layout.tsx
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Use Translations

```tsx
// app/[lang]/page.tsx
import { getTranslation } from "@/i18n";

export default async function Page() {
  const { t } = await getTranslation();

  return <h1>{t("home.title")}</h1>;
}
```

## API

### initialize

Creates configured i18n functions. Call once and export the returned functions.

```ts
import { initialize } from "@nimpl/i18n/initialize";

export const { getTranslation, ServerTranslation, Transmitter, revalidate } = initialize(config);
```

#### Config Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `load` | `(language: string) => Promise<object>` | Yes | Async function that returns translations for a language |
| `getLanguage` | `() => Promise<string>` | Yes | Function to determine current language |
| `languages` | `string[]` | Yes | Array of supported language codes |
| `cache` | `boolean` | No | Enable translation caching (recommended for production) |

### getTranslation

Server-side function for translations in React Server Components.

```tsx
import { getTranslation } from "@/i18n";

export default async function Page() {
  const { t, language } = await getTranslation();

  return <h1>{t("home.title")}</h1>;
}
```

With explicit language (useful for `generateMetadata`):

```tsx
export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { t } = await getTranslation({ language: params.lang });

  return { title: t("home.meta.title") };
}
```

With namespace:

```tsx
const { t } = await getTranslation({ namespace: "home" });
t("title"); // Equivalent to t("home.title")
```

### Transmitter

Server component that passes translations to client components. Wrap client components that need translations.

```tsx
import { Transmitter } from "@/i18n";
import Counter from "./Counter";

export default async function Page() {
  return (
    <Transmitter terms={["counter", "shared.buttons"]}>
      <Counter />
    </Transmitter>
  );
}
```

With explicit language:

```tsx
<Transmitter terms={["counter"]} language="fr">
  <Counter />
</Transmitter>
```

### ServerTranslation

Server component for complex translations with embedded JSX.

```tsx
import { ServerTranslation } from "@/i18n";

// Translation: "Read our <link>documentation</link> for more info"
export default async function Page() {
  return (
    <ServerTranslation
      term="home.description"
      components={{ link: <a href="/docs" /> }}
    />
  );
}
```

With variables:

```tsx
// Translation: "We have <b>{{count}}</b> products"
<ServerTranslation
  term="products.count"
  components={{ b: <strong /> }}
  query={{ count: 42 }}
/>
```

### useTranslation

Client-side hook. Requires `Transmitter` in a parent Server Component.

```tsx
"use client";

import { useTranslation } from "@nimpl/i18n/use-translation";

export default function Counter() {
  const { t } = useTranslation();

  return <button>{t("counter.increment")}</button>;
}
```

With namespace:

```tsx
const { t } = useTranslation({ namespace: "counter" });
```

### ClientTranslation

Client component for complex translations with embedded JSX.

```tsx
"use client";

import { ClientTranslation } from "@nimpl/i18n/client-translation";

// Translation: "Read our <link>documentation</link>"
export default function Info() {
  return (
    <ClientTranslation
      term="info.description"
      components={{ link: <a href="/docs" /> }}
    />
  );
}
```

### revalidate

Refresh cached translations for a language.

```tsx
import { revalidate } from "@/i18n";

// Foreground revalidation (blocks until complete)
await revalidate("en");

// Background revalidation (non-blocking)
await revalidate("en", true);
```

## Variable Interpolation

Use `{{variable}}` syntax in translations:

```json
{
  "greeting": "Hello, {{name}}!",
  "items": "You have {{count}} items"
}
```

```tsx
t("greeting", { query: { name: "Alex" } });
// → "Hello, Alex!"

t("items", { query: { count: 5 } });
// → "You have 5 items"
```

Use `removeUnusedQueries` to strip undefined variables:

```tsx
// Translation: "Hello, {{name}}! Role: {{role}}"
t("welcome", { query: { name: "Alex" }, removeUnusedQueries: true });
// → "Hello, Alex! Role: "
```

### Server-Side Query Injection

Pass dynamic values to client translations from the server to improve client performance:

```tsx
<Transmitter
  terms={[
    "pricing",
    ["welcome", { query: { stage: process.env.NODE_ENV } }],
  ]}
>
  <ClientComponent />
</Transmitter>
```

## Namespaces

Access nested keys with dot notation or colon prefix:

```tsx
// Dot notation
t("header.nav.home");

// Namespace in options
const { t } = await getTranslation({ namespace: "header" });
t("nav.home");

// Colon prefix (overrides default namespace)
t("footer:copyright");
```

## Notes

- Client components (`useTranslation`, `ClientTranslation`) inherit language from server parents
- The `terms` array accepts namespace prefixes (e.g., `"nav"`) or specific keys (e.g., `"nav.home"`)
- Use `next/root-params`, `@nimpl/getters` or `@nimpl/context` for automatic route parameter detection

## Examples

- [Base example](https://github.com/alexdln/nimpl-i18n/tree/main/examples/base)

## License

MIT
