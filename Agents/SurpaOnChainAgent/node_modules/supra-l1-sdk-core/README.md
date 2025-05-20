# Supra-L1-SDK-Core

[![Discord][discord-image]][discord-url]

This SDK serves as the foundational layer of the [supra-l1-sdk](https://github.com/Entropy-Foundation/supra-l1-sdk/tree/master),
providing essential low-level implementations. This SDK provides core components which are leveraged
by the [supra-l1-sdk](https://github.com/Entropy-Foundation/supra-l1-sdk/tree/master) to deliver a
seamless and efficient developer experience for interacting with the Supra network.

## Installation

```ts
npm install supra-l1-sdk-core
```

## Testing

To run the full SDK tests, run:

```ts
pnpm test
```

## Building from source

To use the local build in a local project:

```ts
// run from the root of this package
pnpm build
// run on your local project
pnpm add PATH_TO_LOCAL_SDK_PACKAGE
```

## Contributing

If you found a bug or would like to request a feature, please file an [issue](https://github.com/Entropy-Foundation/legacy-aptos-sdk/issues/new/choose). If, based on the discussion on an issue you would like to offer a code change, please make a [pull request](./CONTRIBUTING.md). If neither of these describes what you would like to contribute, checkout out the [contributing guide](./CONTRIBUTING.md).

[discord-image]: https://img.shields.io/discord/850682587273625661?style=flat-square
[discord-url]: https://discord.gg/supralabs
