# @nimpl/i18n

(Former [next-translation](https://www.npmjs.com/package/next-translation))

i18n library designed primarily with server components in mind and maximum optimization (due to the transfer of logic to the assembly stage and/or server side).

Visit https://nimpl.dev/docs/i18n to view the full documentation.

## Why one more library?

Server components are a recent feature in React. Existing translation libraries are not yet well-optimized for them. If they support it, then only by disabling Next.js static optimization.

This library is an attempt to create a highly optimized solution exclusively using the current capabilities of React.js, Next.js and node.js.

## Features

Support for loading translations during page rendering (_instead of the application build step_), allowing for up-to-date translations with ISR or SSR;

Support for revalidation logic, i.e. you can specify how often translations should be updated (_or that they should not be updated at all_);

Optimized caching system - not a single extra request will be sent, even with parallel building (which is now enabled by default);

Passing only those translations to the client that are needed on the client;

Embedding parameters in client translations on the server;

Support for html entities.

## Installation

**Using npm:**

```bash
npm i @nimpl/i18n
```

**Using yarn:**

```bash
yarn add @nimpl/i18n
```

## Additionally

Create tasks with wishes, ideas, difficulties, etc. All of them will definitely be considered and thought over.

## License

[MIT](https://github.com/alexdln/nimpl-i18n/blob/main/LICENSE)
