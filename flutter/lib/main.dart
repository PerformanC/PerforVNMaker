import 'dart:ui';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher_string.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({ super.key });

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'APP_NAME',
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({ super.key });

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class MyAboutPage extends StatefulWidget {
  const MyAboutPage({ super.key });

  @override
  State<MyAboutPage> createState() => _MyAboutPageState();
}

class MySettingsPage extends StatefulWidget {
  const MySettingsPage({ super.key });

  @override
  State<MySettingsPage> createState() => _MySettingsPageState();
}

class MySavesPage extends StatefulWidget {
  const MySavesPage({ super.key });

  @override
  State<MySavesPage> createState() => _MySavesPageState();
}

class MyAchievementsPage extends StatefulWidget {
  const MyAchievementsPage({ super.key });

  @override
  State<MyAchievementsPage> createState() => _MyAchievementsPageState();
}
class _RectSliderThumbShape extends SliderComponentShape {
  const _RectSliderThumbShape();

  @override
  Size getPreferredSize(bool isEnabled, bool isDiscrete) {
    return Size(8.4, 15.6);
  }

  @override
  void paint(
    PaintingContext context,
    Offset center, {
    required Animation<double> activationAnimation,
    required Animation<double> enableAnimation,
    required bool isDiscrete,
    required TextPainter labelPainter,
    required RenderBox parentBox,
    required SliderThemeData sliderTheme,
    required TextDirection textDirection,
    required double value,
    required double textScaleFactor,
    required Size sizeWithOverflow,
  }) {
    final Paint paint = Paint()
      ..color = sliderTheme.thumbColor ?? Color(0xFF22FF00);

    context.canvas.drawRect(
      Rect.fromCenter(
        center: center,
        width: 8.4,
        height: 15.6,
      ),
      paint,
    );
  }
}

Widget _buildSettingsSlider(double value, ValueChanged<double> onChanged) {
  return SliderTheme(
    data: SliderThemeData(
      trackHeight: 15.6,
      trackShape: RectangularSliderTrackShape(),
      thumbShape: _RectSliderThumbShape(),
      overlayShape: SliderComponentShape.noOverlay,
      activeTrackColor: Colors.white,
      inactiveTrackColor: Color(0xFFF00000),
      thumbColor: Color(0xFF22FF00),
    ),
    child: Slider(
      value: value,
      min: 0,
      max: 100,
      onChanged: onChanged,
    ),
  );
}

Widget _buildMenuPage(BuildContext context, String disableButton, List<Widget> children) {
  return Scaffold(
    backgroundColor: Colors.black,
    body: Stack(
      children: [
        Center(
          child: Image.asset(
            'assets/menu.png',
            fit: BoxFit.contain,
          ),
        ),
        Container(
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 0.8),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return ClipRect(
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10 * value, sigmaY: 10 * value),
                  child: Container(
                    color: Colors.black.withOpacity(value),
                  ),
                ),
              );
            },
          ),
        ),
        ...children,
        Positioned(
          left: 87.6,
          top: 0,
          child: TextButton(
            onPressed: () {
              Navigator.pushReplacement(
                context,
                PageRouteBuilder(
                  pageBuilder: (context, animation1, animation2) => MyHomePage(),
                  transitionDuration: Duration.zero,
                  reverseTransitionDuration: Duration.zero,
                ),
              );
            },
            style: TextButton.styleFrom(
              padding: EdgeInsets.zero,
              minimumSize: Size(0, 0),
            ),
            child: Text(
              'Back',
              style: TextStyle(
                color: Colors.white,
                fontSize: 15
              ),
            ),
          ),
        ),
        ..._buildFooterButtons(context, disableButton)
      ],
    ),
  );
}

List<Widget> _buildFooterButtons(BuildContext context, String disableButton) {
  return [
    Align(
      alignment: Alignment.bottomCenter,
      child: Container(
        height: 36,
        color: Colors.black.withOpacity(0.8),
      ),
    ),
    Positioned(
      left: 105.6,
      bottom: -6,
      child: TextButton(
        onPressed: () {},
        style: TextButton.styleFrom(
          padding: EdgeInsets.zero,
          minimumSize: Size(0, 0),
        ),
        child: Text(
          'START',
          style: TextStyle(
            color: Colors.white,
            fontSize: 14
          ),
        ),
      ),
    ),
    Positioned(
      left: 193.2,
      bottom: -6,
      child: TextButton(
        onPressed: () {
          if (disableButton == 'ABOUT') return;

          Navigator.pushReplacement(
            context,
            PageRouteBuilder(
              pageBuilder: (context, animation1, animation2) => MyAboutPage(),
              transitionDuration: Duration.zero,
              reverseTransitionDuration: Duration.zero,
            ),
          );
        },
        style: TextButton.styleFrom(
          padding: EdgeInsets.zero,
          minimumSize: Size(0, 0)
        ),
        child: Text(
          'ABOUT',
          style: TextStyle(
            color: Colors.white,
            fontSize: 14
          ),
        ),
      ),
    ),
    Positioned(
      left: 279.6,
      bottom: -6,
      child: TextButton(
        onPressed: () {
          if (disableButton == 'SETTINGS') return;

          Navigator.pushReplacement(
            context,
            PageRouteBuilder(
              pageBuilder: (context, animation1, animation2) => MySettingsPage(),
              transitionDuration: Duration.zero,
              reverseTransitionDuration: Duration.zero,
            ),
          );
        },
        style: TextButton.styleFrom(
          padding: EdgeInsets.zero,
          minimumSize: Size(0, 0),
        ),
        child: Text(
          'SETTINGS',
          style: TextStyle(
            color: Colors.white,
            fontSize: 14
          ),
        ),
      ),
    ),
    Positioned(
      left: 384.0,
      bottom: -6,
      child: TextButton(
        onPressed: () {
          if (disableButton == 'SAVES') return;

          Navigator.pushReplacement(
            context,
            PageRouteBuilder(
              pageBuilder: (context, animation1, animation2) => MySavesPage(),
              transitionDuration: Duration.zero,
              reverseTransitionDuration: Duration.zero,
            ),
          );
        },
        style: TextButton.styleFrom(
          padding: EdgeInsets.zero,
          minimumSize: Size(0, 0),
        ),
        child: Text(
          'SAVES',
          style: TextStyle(
            color: Colors.white,
            fontSize: 14
          ),
        ),
      ),
    ),
    Positioned(
      left: 468.0,
      bottom: -6,
      child: TextButton(
        onPressed: () {
          if (disableButton == 'ACHIEVEMENTS') return;

          Navigator.pushReplacement(
            context,
            PageRouteBuilder(
              pageBuilder: (context, animation1, animation2) => MyAchievementsPage(),
              transitionDuration: Duration.zero,
              reverseTransitionDuration: Duration.zero,
            ),
          );
        },
        style: TextButton.styleFrom(
          padding: EdgeInsets.zero,
          minimumSize: Size(0, 0),
        ),
        child: Text(
          'ACHIEVEMENTS',
          style: TextStyle(
            color: Colors.white,
            fontSize: 14
          ),
        ),
      ),
    )
  ];
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          Center(
            child: Image.asset(
              'assets/menu.png',
              fit: BoxFit.contain,
            ),
          ),
          ..._buildFooterButtons(context, '')
        ],
      ),
    );
  }
}
class _MyAboutPageState extends State<MyAboutPage> {
  @override
  Widget build(BuildContext context) {
    return _buildMenuPage(
      context,
      'ABOUT',
      [
        Positioned(
          top: 150,
          left: 100,
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 1),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return Container(
                child: Opacity(
                  opacity: value,
                  child: RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: 'The PerforVNM 1.0.0\n\nMade with ',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                          ),
                        ),
                        TextSpan(
                          text: 'PerforVNM',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11
                          ),
                          recognizer: TapGestureRecognizer()..onTap = () {
                            launchUrlString('https://github.com/PerformanC/PerforVNMaker');
                          },
                        ),
                        TextSpan(
                          text: ' 2.0.0 (code generator), 1.0.0 (non-native generated code).\n\nThis is our example visual novel, made by @ThePedroo',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _MySettingsPageState extends State<MySettingsPage> {
  double textSpeed = 50;
  double menuMusicVolume = 100;
  double sEffectVolume = 100;
  double sceneMusicVolume = 100;

  @override
  Widget build(BuildContext context) {
    return _buildMenuPage(
      context,
      'SETTINGS',
      [
        Positioned(
          left: 178.8,
          top: 63.6,
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 1),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: Text(
                  'Text speed: ${textSpeed.toInt()}ms',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),
              );
            },
          ),
        ),
        Positioned(
          left: 162.0,
          top: 92.4,
          width: 180,
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 1),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: _buildSettingsSlider(
                  textSpeed,
                  (value) {
                    setState(() {
                      textSpeed = value;
                    });
                  },
                ),
              );
            },
          ),
        ),
        Positioned(
          left: 531.6,
          top: 63.6,
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 1),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: Text(
                  'Menu music: ${menuMusicVolume.toInt()}%',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),
              );
            },
          ),
        ),
        Positioned(
          left: 518.4,
          top: 92.4,
          width: 180,
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 1),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: _buildSettingsSlider(
                  menuMusicVolume,
                  (value) {
                    setState(() {
                      menuMusicVolume = value;
                    });
                  },
                ),
              );
            },
          ),
        ),
        Positioned(
          left: 531.6,
          top: 133.2,
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 1),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: Text(
                  'Sound effects: ${sEffectVolume.toInt()}%',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),
              );
            },
          ),
        ),
        Positioned(
          left: 518.4,
          top: 162.0,
          width: 180,
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 1),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: _buildSettingsSlider(
                  sEffectVolume,
                  (value) {
                    setState(() {
                      sEffectVolume = value;
                    });
                  },
                ),
              );
            },
          ),
        ),
        Positioned(
          left: 531.6,
          top: 199.2,
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 1),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: Text(
                  'Scene music: ${sceneMusicVolume.toInt()}%',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),
              );
            },
          ),
        ),
        Positioned(
          left: 518.4,
          top: 228.0,
          width: 180,
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 1),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: _buildSettingsSlider(
                  sceneMusicVolume,
                  (value) {
                    setState(() {
                      sceneMusicVolume = value;
                    });
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _MySavesPageState extends State<MySavesPage> {
  @override
  Widget build(BuildContext context) {
    return _buildMenuPage(
      context,
      'SAVES',
      [
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 1),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: SingleChildScrollView(
                  child: SizedBox(
                    width: MediaQuery.of(context).size.width,
                    height: 264,
                    child: Stack(
                      children: [
                        Positioned(
                          left: 120,
                          top: 60,
                          child: SizedBox(
                            width: 120,
                            height: 84,
                            child: Stack(
                              children: [
                                Positioned.fill(
                                  child: Image.asset(
                                    'assets/background_thanking.png',
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                Positioned(
                                  left: 6,
                                  top: 0,
                                  child: SizedBox(
                                    width: 120,
                                    height: 84,
                                    child: Image.asset(
                                      'assets/pedro_staring.png',
                                      fit: BoxFit.contain,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        Positioned(
                          left: 279.6,
                          top: 60,
                          child: SizedBox(
                            width: 120,
                            height: 84,
                            child: Stack(
                              children: [
                                Positioned.fill(
                                  child: Image.asset(
                                    'assets/background_thanking.png',
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                Positioned(
                                  left: 6,
                                  top: 0,
                                  child: SizedBox(
                                    width: 120,
                                    height: 84,
                                    child: Image.asset(
                                      'assets/pedro_staring.png',
                                      fit: BoxFit.contain,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        Positioned(
                          left: 439.2,
                          top: 60,
                          child: SizedBox(
                            width: 120,
                            height: 84,
                            child: Stack(
                              children: [
                                Positioned.fill(
                                  child: Image.asset(
                                    'assets/background_thanking.png',
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                Positioned(
                                  left: 6,
                                  top: 0,
                                  child: SizedBox(
                                    width: 120,
                                    height: 84,
                                    child: Image.asset(
                                      'assets/pedro_staring.png',
                                      fit: BoxFit.contain,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        Positioned(
                          left: 598.8,
                          top: 60,
                          child: SizedBox(
                            width: 120,
                            height: 84,
                            child: Stack(
                              children: [
                                Positioned.fill(
                                  child: Image.asset(
                                    'assets/background_thanking.png',
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                Positioned(
                                  left: 6,
                                  top: 0,
                                  child: SizedBox(
                                    width: 120,
                                    height: 84,
                                    child: Image.asset(
                                      'assets/pedro_staring.png',
                                      fit: BoxFit.contain,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        Positioned(
                          left: 120,
                          top: 180,
                          child: SizedBox(
                            width: 120,
                            height: 84,
                            child: Stack(
                              children: [
                                Positioned.fill(
                                  child: Image.asset(
                                    'assets/background_thanking.png',
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                Positioned(
                                  left: 6,
                                  top: 0,
                                  child: SizedBox(
                                    width: 120,
                                    height: 84,
                                    child: Image.asset(
                                      'assets/pedro_staring.png',
                                      fit: BoxFit.contain,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _MyAchievementsPageState extends State<MyAchievementsPage> {
  @override
  Widget build(BuildContext context) {
    return _buildMenuPage(
      context,
      'ACHIEVEMENTS',
      [
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: TweenAnimationBuilder(
            tween: Tween<double>(begin: 0, end: 1),
            duration: Duration(milliseconds: 500),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: SingleChildScrollView(
                  child: SizedBox(
                    width: MediaQuery.of(context).size.width,
                    height: 204,
                    child: Stack(
                      children: [
                        Positioned(
                          left: 120,
                          top: 60,
                          child: Column(
                            children: [
                              SizedBox(
                                width: 84,
                                height: 84,
                                child: Image.asset(
                                  'assets/achievement.png',
                                  fit: BoxFit.cover,
                                ),
                              ),
                              SizedBox(height: 6),
                              Text(
                                'FIRST WORDS',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Positioned(
                          left: 279.6,
                          top: 60,
                          child: Column(
                            children: [
                              SizedBox(
                                width: 84,
                                height: 84,
                                child: Image.asset(
                                  'assets/achievement.png',
                                  fit: BoxFit.cover,
                                ),
                              ),
                              SizedBox(height: 6),
                              Text(
                                'COFFEE BREAK',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Positioned(
                          left: 439.2,
                          top: 60,
                          child: Column(
                            children: [
                              SizedBox(
                                width: 84,
                                height: 84,
                                child: Image.asset(
                                  'assets/achievement.png',
                                  fit: BoxFit.cover,
                                ),
                              ),
                              SizedBox(height: 6),
                              Text(
                                'TRUE ROUTE',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}