# PerforVNMaker

[![Discord Server](https://img.shields.io/discord/1036045973039890522?color=5865F2&logo=discord&logoColor=white)](https://discord.gg/uPveNfTuCJ) [![Package size](https://packagephobia.now.sh/badge?p=@performanc/perforvnmaker)](https://packagephobia.now.sh/result?p=@performanc/perforvnmaker)

Visual Novels by optimized code generation technology.

## About

PerforVNM (PerforVNMaker) is a Visual Novel Maker, which uses code generation technology to create VNs based on JavaScript APIs, allowing the creation of lightweight and fast VNs. It generates native code for each supported platform, without any external dependencies (save sdp, ssp).

## Project status

The current stage of PerforVNM is WIP (Work In Progress), since it's still limited to the Android System. Although it's stable, it's not recommended to use it in production.

The current features can be found in [OS_SUPPORT.md](OS_SUPPORT.md) file, which also contains the current supported OSes.

## Usage

### Minimum requirements

- NodeJS: `v13`
- Android: `4.0`

### Installation

To install PerforVNM, you can use `npm`, `yarn`, `pnpm` or `bun` to install the `@performanc/perforvnmaker` package.

### API

The documentation for the JavaScript API can be found in the [docs](docs/) folder, for most questions, the [test file](tests/vn.js) can be used as an example.

### Code generation

Perfor's ability to generate code, which makes it a code generator, allows it to create the best code possible, even compared to hand-made VNs codes.

After creating the VN JavaScript file, you simply needs to run it with either `NodeJs` or `Bun`, and it will generate the code for you in the selected output Android folder.

## Advantages over engines

The main advantage of PerforVNM is that it's a code generator, but the advantages over engines are not very known, so here's a list of the advantages of Perfor over engines:

### Resource usage

The biggest advantage of PerforVNMaker is that it can create VNs with a very low resource usage, for reference, the [test VN](tests/vn.js) created an APK of 1.8MB, while the same VN created with Ren'Py created an APK of 40MB~.

### Portability

Due to the code generation technology, PerforVNM can be ported to any OS, and it's not limited to Android, as of now, it's only available on Android, but we're working on porting it to other OSes.

But it's supported in Android 4.0+, launched in 2011, while Ren'Py is only supported in Android 5+, launched in 2014. Although the difference is small, Android 5 devices can suffer with resource usage, so it will be a problem.

### Technology improvement

On the modern society, technology is everywhere, and it's a necessity to improve it, and to make it more accessible, and that's what we do.

Perfor uses the most modern technology available, and we're always improving it, bringing art to technology, and technology to art, and both to the people.

## Goals

Any change with a good support can make huge a difference, more optimized apps, games, can make a huge impact on the environment, with less energy consumption, less resources needed, and less powerful devices needed.

It's important to make technology more accessible, and to make it more optimized, and that's what we do, bring VNs to even the oldest devices available, with the most minimum hardware requirements possible.

The PerformanC Organization Team is focused on making the world a livable place, so that younger generations can live in a better world, with technology on their side.

## Discord Server & Feedback

Feel free to join [our Discord server](https://discord.gg/uPveNfTuCJ) to talk with the team, and community, and to give us feedback. We would also love to talk with you, don't be shy.

## License

PerforVNM is licensed under PerformanC's License, which is a modified version of the MIT License, focusing on the protection of the source code and the rights of the PerformanC team over the source code.

If you wish to use some part of the source code, you must contact us first, and if we agree, you can use the source code, but you must give us credit for the source code you use.

OBS: The generated code is not affected by the license above unless taken to be used for another code generator, transpiler or engine.
