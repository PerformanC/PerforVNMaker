# PerforVNMaker

High-performance Visual Novel Maker with code generation technology.

## Project status

This project is usable for *small* VNs, but due to the leak of `save / load` system, it's not recommended to use it for big VNs.

Due to the fast development of Perfor, we highly believe that this project can be already used as of now, but shouldn't be released as a stable version.

## Using Perfor?

In case you made, plans to, or are making a VN with PerforVNM, please contact us at either our email `performancorg@gmail.com` or in [our Discord server](https://discord.gg/uPveNfTuCJ), we would love to hear your feedback, feature requests and to work on your side to a better experience.

And thank you for using PerforVNM.

## Feature support

You can read the [OS support](OS_SUPPORT.md) file to see the features supported by PerforVNM for each OS.

## Usage

### Minimum requirements

We as of now, don't have a minimum requirement for PerforVNM, but we recommend having NodeJS `v16.6.0`+, but it will probably work with older versions.

### API usage

PerforVNM was made to be used by independent artists, with no ability of coding, so it has a pretty simple API, and it's pretty easy to use.

You can either check [our documentation](docs/) or [our test file](src/perforvnm.js) to see how to use the API.



PerforVNM follows the idea of `code once, run everywhere`, so the usage will be pretty simple, and without worries about *future* cross-platform problems.

PerforVNM is a library, and you should use it directly from the source code, so you can have the latest version of it.

You can take a look at the usage of the Perfor API in the [PerforVNM API documentation](docs/) folder.

### Code generation

PerforVNM is a code generator, so it will generate code for you, and you can use it to build your app.

To generate the code, you'll need to use the `node .` command and it will generate the code for you.

After that, you can build the code, and you'll have your app.

### Building the code

OBS: Android example.

After generating the output code, you'll only need to build the app.

WARNING: The process of building may require more resources, so we recommend you have at least 8GB of RAM and a good CPU.

To build the code, you'll need to have Android Studio installed, and you'll need to have the Android SDK installed.

You'll need to set up the Android SDK in the `local.properties` file (in the Android folder) with the following content:

```text
sdk.dir = /path/to/Sdk
```

After that, you're ready to build the code, which can be easily done with the help of `gradlew`:

```cmd
./gradlew assembleRelease
```

or

```cmd
./gradlew assembleDebug
```

After that, you'll have your APK file in either `app/build/outputs/apk/release` or `app/build/outputs/apk/debug` folder.

## Code generation vs Engine

A big different between PerforVNM and other Visual Novel Makers is that PerforVNM is a code generator *for* visual novels, not an engine itself.

We must follow PerformanC's philosophy, and using an engine, such as Skia, would be against our philosophy, due to a few reasons:

### Resource usage

PerforVNM is highly optimized to use the least amount of resources, and using an engine causes extra overhead that we don't want.

Engines are packed into the APK, and they take up a lot of space, and they use a lot of resources, and we don't want that. (The latest version of PerforVNM generates 1.8MB APKs on release mode, against 50MB+ of engines)

### Portability

Unfair to compare engines with PerforVNM, Perfor is new, and engines are old, but we're working on making PerforVNM as portable as possible, and we're working on making PerforVNM as powerful as engines (in terms of creating VN apps).

But in the end, PerforVNM can be easily modified by us, creating sources to generate code for new OSes, differently from engines, which takes a lot of time to be ported to new OSes.

### Technology improvement

Engines, compared to PerforVNM, will always have a disadvantage in terms of technology, because we use a more powerful technology, that allows us to create more powerful apps, and we can easily improve our technology, while engines can't easily do that.

### Not haters, helpers

We don't hate engines, but we, PerformanC, want a better world where we won't need high-end devices to run basic apps, and we want to help the world to achieve that goal, and we believe that PerforVNM is a step toward that goal.

PerforVNM is not like other PerformanC software, with the support of the VN community, we can change the world, not by simply making VNs lighter, but by seeing that anything can run anywhere fastly.

## Discord Server & Feedback

You can join [our Discord server](https://discord.gg/uPveNfTuCJ) to talk with the team, and community, and to give us feedback. We would also love to talk with you, don't be shy.

## License

PerforVNM is licensed under PerformanC's License, which is a modified version of the MIT License, focusing on the protection of the source code and the rights of the PerformanC team over the source code.

If you wish to use some part of the source code, you must contact us first, and if we agree, you can use the source code, but you must give us credit for the source code you use.

OBS: The generated code is not affected by the license above unless taken to be used for another code generator, transpiler or engine.
