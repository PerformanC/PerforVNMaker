/*
  INFO: This file contains the code that sets up configurations for
    Flutter platforms, ensuring the application id, name, full name,
    among other information, are used. */

import fs from 'node:fs'

import helper from '../../main/helper.js'

/* TODO: Not use Sync to ensure speed */
export default function setConfigs() {
  fs.writeFileSync(`${visualNovel.info.paths.flutter}/pubspec.yaml`, helper.codePrepare(`
    name: ${visualNovel.info.id}
    description: "A new Flutter project."
    publish_to: 'none'

    version: ${visualNovel.info.version}

    environment:
      sdk: ^3.5.0

    dependencies:
      flutter:
        sdk: flutter
      url_launcher: ^6.3.0

    dev_dependencies:
      flutter_test:
        sdk: flutter

    flutter:
      assets:
${fs.readdirSync(visualNovel.info.paths.assets).map((file) => helper.codePrepare(`- assets/${file}`, 0, 8, false)).join('\n')}`, 4))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/macos/Runner/Configs/AppInfo.xcconfig`, helper.codePrepare(`
    PRODUCT_NAME = ${visualNovel.info.fullName}
    PRODUCT_BUNDLE_IDENTIFIER = ${visualNovel.info.applicationId}
    PRODUCT_COPYRIGHT = Copyright © 2024 ${visualNovel.info.developer}. All rights reserved.`, 4))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/macos/Runner.xcodeproj/xcshareddata/xcschemes/Runner.xcscheme`, helper.codePrepare(`
    <?xml version="1.0" encoding="UTF-8"?>
    <Scheme
      LastUpgradeVersion = "1510"
      version = "1.3">
      <BuildAction
          parallelizeBuildables = "YES"
          buildImplicitDependencies = "YES">
          <BuildActionEntries>
            <BuildActionEntry
                buildForTesting = "YES"
                buildForRunning = "YES"
                buildForProfiling = "YES"
                buildForArchiving = "YES"
                buildForAnalyzing = "YES">
                <BuildableReference
                  BuildableIdentifier = "primary"
                  BlueprintIdentifier = "33CC10EC2044A3C60003C045"
                  BuildableName = "${visualNovel.info.id}.app"
                  BlueprintName = "Runner"
                  ReferencedContainer = "container:Runner.xcodeproj">
                </BuildableReference>
            </BuildActionEntry>
          </BuildActionEntries>
      </BuildAction>
      <TestAction
          buildConfiguration = "Debug"
          selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
          selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
          shouldUseLaunchSchemeArgsEnv = "YES">
          <MacroExpansion>
            <BuildableReference
                BuildableIdentifier = "primary"
                BlueprintIdentifier = "33CC10EC2044A3C60003C045"
                BuildableName = "${visualNovel.info.id}.app"
                BlueprintName = "Runner"
                ReferencedContainer = "container:Runner.xcodeproj">
            </BuildableReference>
          </MacroExpansion>
          <Testables>
            <TestableReference
                skipped = "NO"
                parallelizable = "YES">
                <BuildableReference
                  BuildableIdentifier = "primary"
                  BlueprintIdentifier = "331C80D4294CF70F00263BE5"
                  BuildableName = "RunnerTests.xctest"
                  BlueprintName = "RunnerTests"
                  ReferencedContainer = "container:Runner.xcodeproj">
                </BuildableReference>
            </TestableReference>
          </Testables>
      </TestAction>
      <LaunchAction
          buildConfiguration = "Debug"
          selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
          selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
          launchStyle = "0"
          useCustomWorkingDirectory = "NO"
          ignoresPersistentStateOnLaunch = "NO"
          debugDocumentVersioning = "YES"
          debugServiceExtension = "internal"
          allowLocationSimulation = "YES">
          <BuildableProductRunnable
            runnableDebuggingMode = "0">
            <BuildableReference
                BuildableIdentifier = "primary"
                BlueprintIdentifier = "33CC10EC2044A3C60003C045"
                BuildableName = "${visualNovel.info.id}.app"
                BlueprintName = "Runner"
                ReferencedContainer = "container:Runner.xcodeproj">
            </BuildableReference>
          </BuildableProductRunnable>
      </LaunchAction>
      <ProfileAction
          buildConfiguration = "Profile"
          shouldUseLaunchSchemeArgsEnv = "YES"
          savedToolIdentifier = ""
          useCustomWorkingDirectory = "NO"
          debugDocumentVersioning = "YES">
          <BuildableProductRunnable
            runnableDebuggingMode = "0">
            <BuildableReference
                BuildableIdentifier = "primary"
                BlueprintIdentifier = "33CC10EC2044A3C60003C045"
                BuildableName = "${visualNovel.info.id}.app"
                BlueprintName = "Runner"
                ReferencedContainer = "container:Runner.xcodeproj">
            </BuildableReference>
          </BuildableProductRunnable>
      </ProfileAction>
      <AnalyzeAction
          buildConfiguration = "Debug">
      </AnalyzeAction>
      <ArchiveAction
          buildConfiguration = "Release"
          revealArchiveInOrganizer = "YES">
      </ArchiveAction>
    </Scheme>`, 4))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/macos/Runner.xcodeproj/project.pbxproj`,
                   fs.readFileSync('platforms/flutter/templates/macos/project.pbxproj').toString().replace(/__PERFORVNM_ID__/g, visualNovel.info.id).replace(/__PERFORVNM_APP_ID__/g, visualNovel.info.applicationId))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/windows/CMakeLists.txt`,
                   fs.readFileSync('platforms/flutter/templates/windows/CMakeLists.txt').toString().replace(/__PERFORVNM_ID__/g, visualNovel.info.id))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/windows/runner/main.cpp`, helper.codePrepare(`
    #include <flutter/dart_project.h>
    #include <flutter/flutter_view_controller.h>
    #include <windows.h>

    #include "flutter_window.h"
    #include "utils.h"

    int APIENTRY wWinMain(_In_ HINSTANCE instance, _In_opt_ HINSTANCE prev,
                          _In_ wchar_t *command_line, _In_ int show_command) {
      // Attach to console when present (e.g., 'flutter run') or create a
      // new console when running with a debugger.
      if (!::AttachConsole(ATTACH_PARENT_PROCESS) && ::IsDebuggerPresent()) {
        CreateAndAttachConsole();
      }

      // Initialize COM, so that it is available for use in the library and/or
      // plugins.
      ::CoInitializeEx(nullptr, COINIT_APARTMENTTHREADED);

      flutter::DartProject project(L"data");

      std::vector<std::string> command_line_arguments =
          GetCommandLineArguments();

      project.set_dart_entrypoint_arguments(std::move(command_line_arguments));

      FlutterWindow window(project);
      Win32Window::Point origin(10, 10);
      Win32Window::Size size(1280, 720);
      if (!window.Create(L"${visualNovel.info.name}", origin, size)) {
        return EXIT_FAILURE;
      }
      window.SetQuitOnClose(true);

      ::MSG msg;
      while (::GetMessage(&msg, nullptr, 0, 0)) {
        ::TranslateMessage(&msg);
        ::DispatchMessage(&msg);
      }

      ::CoUninitialize();
      return EXIT_SUCCESS;
    }`, 4))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/web/manifest.json`, helper.codePrepare(`
    {
      "name": "${visualNovel.info.fullName}",
      "short_name": "${visualNovel.info.name}",
      "start_url": ".",
      "display": "standalone",
      "background_color": "#0175C2",
      "theme_color": "#0175C2",
      "description": "A new Flutter project.",
      "orientation": "portrait-primary",
      "prefer_related_applications": false,
      "icons": [
          {
              "src": "icons/Icon-192.png",
              "sizes": "192x192",
              "type": "image/png"
          },
          {
              "src": "icons/Icon-512.png",
              "sizes": "512x512",
              "type": "image/png"
          },
          {
              "src": "icons/Icon-maskable-192.png",
              "sizes": "192x192",
              "type": "image/png",
              "purpose": "maskable"
          },
          {
              "src": "icons/Icon-maskable-512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "maskable"
          }
      ]
    }`, 4))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/web/index.html`, helper.codePrepare(`
    <!DOCTYPE html>
    <html>
    <head>
      <!--
        If you are serving your web app in a path other than the root, change the
        href value below to reflect the base path you are serving from.

        The path provided below has to start and end with a slash "/" in order for
        it to work correctly.

        For more details:
        * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base

        This is a placeholder for base href that will be replaced by the value of
        the \`--base-href\` argument provided to \`flutter build\`.
      -->
      <base href="$FLUTTER_BASE_HREF">

      <meta charset="UTF-8">
      <meta content="IE=Edge" http-equiv="X-UA-Compatible">
      <meta name="description" content="A new Flutter project.">

      <!-- iOS meta tags & icons -->
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" content="black">
      <meta name="apple-mobile-web-app-title" content="${visualNovel.info.name}">
      <link rel="apple-touch-icon" href="icons/Icon-192.png">

      <!-- Favicon -->
      <link rel="icon" type="image/png" href="favicon.png"/>

      <title>${visualNovel.info.name}</title>
      <link rel="manifest" href="manifest.json">
    </head>
    <body>
      <script src="flutter_bootstrap.js" async></script>
    </body>
    </html>`, 4))

  fs.readdirSync(`${visualNovel.info.paths.flutter}`).forEach((file) => {
    if (!file.endsWith('.iml')) return;
    
    fs.unlinkSync(`${visualNovel.info.paths.flutter}/${file}`)
  })

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/${visualNovel.info.id}.iml`, helper.codePrepare(`
    <?xml version="1.0" encoding="UTF-8"?>
    <module type="JAVA_MODULE" version="4">
      <component name="NewModuleRootManager" inherit-compiler-output="true">
        <exclude-output />
        <content url="file://$MODULE_DIR$">
          <sourceFolder url="file://$MODULE_DIR$/lib" isTestSource="false" />
          <sourceFolder url="file://$MODULE_DIR$/test" isTestSource="true" />
          <excludeFolder url="file://$MODULE_DIR$/.dart_tool" />
          <excludeFolder url="file://$MODULE_DIR$/.idea" />
          <excludeFolder url="file://$MODULE_DIR$/build" />
        </content>
        <orderEntry type="sourceFolder" forTests="false" />
        <orderEntry type="library" name="Dart SDK" level="project" />
        <orderEntry type="library" name="Flutter Plugins" level="project" />
        <orderEntry type="library" name="Dart Packages" level="project" />
      </component>
    </module>`, 4))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/android/app/build.gradle`, helper.codePrepare(`
    plugins {
        id "com.android.application"
        id "kotlin-android"
        // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
        id "dev.flutter.flutter-gradle-plugin"
    }

    android {
        namespace = "${visualNovel.info.applicationId}"
        compileSdk = flutter.compileSdkVersion
        ndkVersion = flutter.ndkVersion

        compileOptions {
            sourceCompatibility = JavaVersion.VERSION_1_8
            targetCompatibility = JavaVersion.VERSION_1_8
        }

        kotlinOptions {
            jvmTarget = JavaVersion.VERSION_1_8
        }

        defaultConfig {
            // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
            applicationId = "${visualNovel.info.applicationId}"
            // You can update the following values to match your application needs.
            // For more information, see: https://flutter.dev/to/review-gradle-config.
            minSdk = flutter.minSdkVersion
            targetSdk = flutter.targetSdkVersion
            versionCode = flutter.versionCode
            versionName = flutter.versionName
        }

        buildTypes {
            release {
                // TODO: Add your own signing config for the release build.
                // Signing with the debug keys for now, so \`flutter run --release\` works.
                signingConfig = signingConfigs.debug
            }
        }
    }

    flutter {
        source = "../.."
    }`, 4))

  fs.rmSync(`${visualNovel.info.paths.flutter}/android/app/src/main/kotlin`, { recursive: true })
  fs.mkdirSync(`${visualNovel.info.paths.flutter}/android/app/src/main/kotlin/${visualNovel.info.applicationId.replace(/\./g, '/')}`, { recursive: true })

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/android/app/src/main/kotlin/${visualNovel.info.applicationId.replace(/\./g, '/')}/MainActivity.kt`, helper.codePrepare(`
    package ${visualNovel.info.applicationId}

    import io.flutter.embedding.android.FlutterActivity

    class MainActivity: FlutterActivity()`, 4))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/android/app/src/main/AndroidManifest.xml`, helper.codePrepare(`
    <manifest xmlns:android="http://schemas.android.com/apk/res/android">
        <application
            android:label="${visualNovel.info.name}"
            android:name="\${applicationName}"
            android:icon="@mipmap/ic_launcher">
            <activity
                android:name=".MainActivity"
                android:exported="true"
                android:launchMode="singleTop"
                android:taskAffinity=""
                android:theme="@style/LaunchTheme"
                android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
                android:hardwareAccelerated="true"
                android:windowSoftInputMode="adjustResize"
                android:screenOrientation="landscape">
                <!-- Specifies an Android theme to apply to this Activity as soon as
                    the Android process has started. This theme is visible to the user
                    while the Flutter UI initializes. After that, this theme continues
                    to determine the Window background behind the Flutter UI. -->
                <meta-data
                  android:name="io.flutter.embedding.android.NormalTheme"
                  android:resource="@style/NormalTheme"
                  />
                <intent-filter>
                    <action android:name="android.intent.action.MAIN"/>
                    <category android:name="android.intent.category.LAUNCHER"/>
                </intent-filter>
            </activity>
            <!-- Don't delete the meta-data below.
                This is used by the Flutter tool to generate GeneratedPluginRegistrant.java -->
            <meta-data
                android:name="flutterEmbedding"
                android:value="2" />
        </application>
        <!-- Required to query activities that can process text, see:
            https://developer.android.com/training/package-visibility and
            https://developer.android.com/reference/android/content/Intent#ACTION_PROCESS_TEXT.

            In particular, this is used by the Flutter engine in io.flutter.plugin.text.ProcessTextPlugin. -->
        <queries>
            <intent>
                <action android:name="android.intent.action.PROCESS_TEXT"/>
                <data android:mimeType="text/plain"/>
            </intent>
        </queries>
    </manifest>`, 4))


  fs.writeFileSync(`${visualNovel.info.paths.flutter}/linux/CMakeLists.txt`,
                   fs.readFileSync('platforms/flutter/templates/linux/CMakeLists.txt').toString().replace(/__PERFORVNM_APP_ID__/g, visualNovel.info.applicationId).replace(/__PERFORVNM_ID__/g, visualNovel.info.id))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/linux/my_application.cc`,
                   fs.readFileSync('platforms/flutter/templates/linux/my_application.cc').toString().replace(/__PERFORVNM_NAME__/g, visualNovel.info.name))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/ios/Runner/Info.plist`, helper.codePrepare(`
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
      <key>CFBundleDevelopmentRegion</key>
      <string>$(DEVELOPMENT_LANGUAGE)</string>
      <key>CFBundleDisplayName</key>
      <string>Perfor Flutter</string>
      <key>CFBundleExecutable</key>
      <string>$(EXECUTABLE_NAME)</string>
      <key>CFBundleIdentifier</key>
      <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
      <key>CFBundleInfoDictionaryVersion</key>
      <string>6.0</string>
      <key>CFBundleName</key>
      <string>${visualNovel.info.id}</string>
      <key>CFBundlePackageType</key>
      <string>APPL</string>
      <key>CFBundleShortVersionString</key>
      <string>$(FLUTTER_BUILD_NAME)</string>
      <key>CFBundleSignature</key>
      <string>????</string>
      <key>CFBundleVersion</key>
      <string>$(FLUTTER_BUILD_NUMBER)</string>
      <key>LSRequiresIPhoneOS</key>
      <true/>
      <key>UILaunchStoryboardName</key>
      <string>LaunchScreen</string>
      <key>UIMainStoryboardFile</key>
      <string>Main</string>
      <key>UISupportedInterfaceOrientations</key>
      <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
      </array>
      <key>UISupportedInterfaceOrientations~ipad</key>
      <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
      </array>
      <key>CADisableMinimumFrameDurationOnPhone</key>
      <true/>
      <key>UIApplicationSupportsIndirectInputEvents</key>
      <true/>
    </dict>
    </plist>`, 4))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/android/app/src/main/res/values/styles.xml`, helper.codePrepare(`
    <?xml version="1.0" encoding="utf-8"?>
    <resources>
        <!-- Theme applied to the Android Window while the process is starting when the OS's Dark Mode setting is off -->
        <style name="LaunchTheme" parent="@android:style/Theme.Light.NoTitleBar">
            <!-- Show a splash screen on the activity. Automatically removed when
                 the Flutter engine draws its first frame -->
            <item name="android:windowBackground">@drawable/launch_background</item>

            <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
            <item name="android:windowNoTitle">true</item>
            <item name="android:windowActionBar">false</item>
            <item name="android:windowFullscreen">true</item>
            <item name="android:windowContentOverlay">@null</item>
        </style>
        <!-- Theme applied to the Android Window as soon as the process has started.
             This theme determines the color of the Android Window while your
             Flutter UI initializes, as well as behind your Flutter UI while its
             running.

             This Theme is only used starting with V2 of Flutter's Android embedding. -->
        <style name="NormalTheme" parent="@android:style/Theme.Light.NoTitleBar">
            <item name="android:windowBackground">?android:colorBackground</item>

            <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
            <item name="android:windowNoTitle">true</item>
            <item name="android:windowActionBar">false</item>
            <item name="android:windowFullscreen">true</item>
            <item name="android:windowContentOverlay">@null</item>
        </style>
    </resources>`, 4))

  fs.writeFileSync(`${visualNovel.info.paths.flutter}/android/app/src/main/res/values-night/styles.xml`, helper.codePrepare(`
    <?xml version="1.0" encoding="utf-8"?>
    <resources>
        <!-- Theme applied to the Android Window while the process is starting when the OS's Dark Mode setting is on -->
        <style name="LaunchTheme" parent="@android:style/Theme.Black.NoTitleBar">
            <!-- Show a splash screen on the activity. Automatically removed when
                 the Flutter engine draws its first frame -->
            <item name="android:windowBackground">@drawable/launch_background</item>

            <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
            <item name="android:windowNoTitle">true</item>
            <item name="android:windowActionBar">false</item>
            <item name="android:windowFullscreen">true</item>
            <item name="android:windowContentOverlay">@null</item>
        </style>
        <!-- Theme applied to the Android Window as soon as the process has started.
             This theme determines the color of the Android Window while your
             Flutter UI initializes, as well as behind your Flutter UI while its
             running.

             This Theme is only used starting with V2 of Flutter's Android embedding. -->
        <style name="NormalTheme" parent="@android:style/Theme.Black.NoTitleBar">
            <item name="android:windowBackground">?android:colorBackground</item>

            <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
            <item name="android:windowNoTitle">true</item>
            <item name="android:windowActionBar">false</item>
            <item name="android:windowFullscreen">true</item>
            <item name="android:windowContentOverlay">@null</item>
        </style>
    </resources>`, 4))
}