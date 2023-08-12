# PerforVNMaker

[![Discord Server](https://img.shields.io/discord/1036045973039890522?color=5865F2&logo=discord&logoColor=white)](https://discord.gg/uPveNfTuCJ) [![Package size](https://packagephobia.now.sh/badge?p=@performanc/perforvnmaker)](https://packagephobia.now.sh/result?p=@performanc/perforvnmaker)

High-performance Visual Novel Maker with code generation technology.

## Project status

PerforVNM even though the fast development, leaks a few features that are essential for big VNs, but if you're making a small VN, we'll provide the best technologies for you.

OBS: Remember to always update PerforVNM.

## Using PerforVNM?

To provide the best experience for developers, our users' feedbacks are essential, so whenever you use or test our software, please give us feedback, so we can improve our software.

Please refer to the [Discord Server & Feedback](#discord-server--feedback) section to know how to give us feedback.

## Feature support

[OS support](OS_SUPPORT.md) file will give you all the information about the OSes and features supported by PerforVNM.

## Usage

### Minimum requirements

Since `ES6` is used, the minimum requirement for NodeJS is `v13` and above, and the minimum requirement for Android is `Android 4.0` and above.

We're working on making this requirement even lower.

### Installation

To install PerforVNM, you can use `npm`:

```bash
npm install @performanc/perforvnmaker
```

```bash
yarn add @performanc/perforvnmaker
```

### API usage

PerforVNM is made mainly to be used by independent artists & studios, and coding is not their main skill, so we provide an easy and self-explanatory API.

To take a look at the functions available, you can take a look at [our hand-made documentation](docs/), and as an example, you can take a look at [our test file](src/perforvnm.js).

### Code generation

PerforVNM generated native code, which makes it a code generator, allowing the best performance even compared to hand-made VNs.

It works by saving the information about the required scenes in a global variable and each `.finalize` generates optimized code.

To that, you can simply run `node .` and it will generate the code for you.

## Code generation vs Engine

A big difference between PerforVNM and other Visual Novel Makers is that PerforVNM is a code generator *for* visual novels, not an engine itself.

### Resource usage

A big advantage of code generation (without many dependencies) is that it produces a very lightweight code, and is independent of any engine.

With an APK of 1.8MB, we are the lightest VN Maker, and we're working on making it even lighter even with more features.

### Portability

While we're a new VNMs and are only available on Android 4.0+, we plan to make it available on as many OSes as possible, and we're working on that.

Engines are surely more portable since they support more OSes.

Remember: Code quality > Portability

### Technology improvement

We use the best technology available, and the best techniques to make the best code possible, and we're always improving our code generation technology. Compared to engines, which have tons of legacy code, and are not optimized for the best performance...

### Not haters, but not lovers (goals)

We don't hate engines, we love who made them, making technology even more accessible, but we think that they sometimes choose the wrong path, and that's why we're here.

The PerformanC organization creates fast and lightweight software, without many magic tricks, to allow people to make their software more accessible, and to make the best software possible.

## Discord Server & Feedback

You can join [our Discord server](https://discord.gg/uPveNfTuCJ) to talk with the team, and community, and to give us feedback. We would also love to talk with you, don't be shy.

## License

PerforVNM is licensed under PerformanC's License, which is a modified version of the MIT License, focusing on the protection of the source code and the rights of the PerformanC team over the source code.

If you wish to use some part of the source code, you must contact us first, and if we agree, you can use the source code, but you must give us credit for the source code you use.

OBS: The generated code is not affected by the license above unless taken to be used for another code generator, transpiler or engine.
