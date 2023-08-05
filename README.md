# PerforVNMaker - Visual Novel Maker

Visual Novel Maker with code generation technology.

## Project status

Although this project is already decently stable, it's still under development, with features and API changes being and going to be made.

## Making a VN with us?

If made, or are making a VN with Perfor, please contact us, we would love to hear your feedback and feature requests, and to work beside you to hear our user needs.

To that, feel free to join [our Discord server](https://discord.gg/uPveNfTuCJ) to talk with us.

And thank you for using PerforVNM.

## Feature support

You can read the [OS support](OS_SUPPORT.md) file to see the features supported by PerforVNM for each OS.

## Usage

For usage example, it's recommended that you look at our [test file](src/perforvnm.js), which is a test file that we use to test the code generation quality.

This code will generate an Android native code, with a menu, and a scene with a character (with animation), a scenario and a speech.

PerforVNM already takes care of saving the file in the right place for you, so you don't have to worry about that.

Now to build the code, cd into the android folder, and run the command `./gradlew assembleRelease` for release APK and `./gradlew assembleDebug` for debug APK.

After being built, you can access the APK file in the folder `app/build/outputs/apk/`.

## Code generation vs Engine

Engines are everywhere, used by everyone, but why we don't use them?

While they allow the creation of cross-platform applications with extreme ease, they have some problems, such as performance.

PerforVNM is focused on not having space for competitors in terms of performance, and for us to reach that goal, we must make the codes as native as possible, and engines don't allow that.

We know that engines are easier to use, but we're working on making PerforVNM as easy to use as engines, and we're working on making PerforVNM as powerful as engines (in terms of creating VN apps).

## Support

We want our users to have the best experience possible using our software, so if you have any problem or question, you can contact us on [our Discord server](https://discord.gg/uPveNfTuCJ), and we will help you with anything you need.

Feel free to join if you want someone to talk to, or if you want to help us with the project.

## Feedback

We're made by the community, and we want to make the community happy, so we want to hear your feedback, and we want to hear your feature requests and even your complaints.

Please honor us with your feedback, and we will honor you with our best work.

So, feel free to join [our Discord server](https://discord.gg/uPveNfTuCJ) to create a post in `#feedback`.

## License

PeforVNM is licensed under PerformanC's License, which is a modified version of the MIT License, focusing on the protection of the source code and the rights of the PerformanC team over the source code.

If you wish to use some part of the source code, you must contact us first, and if we agree, you can use the source code, but you must give us credit for the source code you use.

OBS: The generated code is not affected by the license above unless taken to be used for another code generator, transpiler or engine.
