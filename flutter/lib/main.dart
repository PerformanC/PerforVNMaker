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
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              height: 30,
              color: Colors.black.withOpacity(0.8),
              child: Row(
                children: [
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 50),
                  ),
                  TextButton(
                    onPressed: () {},
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size(0, 0),
                    ),
                    child: Text(
                      'Start',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 5),
                  ),
                  TextButton(
                    onPressed: () {
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
                      'About',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 5),
                  ),
                  TextButton(
                    onPressed: () {},
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size(0, 0),
                    ),
                    child: Text(
                      'Saves',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 7),
                  ),
                  TextButton(
                    onPressed: () {},
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size(0, 0),
                    ),
                    child: Text(
                      'Achievements',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                  ),
                  TextButton(
                    onPressed: () {},
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size(0, 0),
                    ),
                    child: Text(
                      'Settings',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MyAboutPageState extends State<MyAboutPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          Stack(
            alignment: Alignment.center,
            children: [
              Image.asset(
                'assets/menu.png',
                fit: BoxFit.contain,
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
              Positioned(
                left: 90,
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
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              height: 30,
              color: Colors.black.withOpacity(0.8),
              child: Row(
                children: [
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 50),
                  ),
                  TextButton(
                    onPressed: () {},
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size(0, 0),
                    ),
                    child: Text(
                      'Start',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 5),
                  ),
                  TextButton(
                    onPressed: () { /* INFO: noop */ },
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size(0, 0),
                    ),
                    child: Text(
                      'About',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 5),
                  ),
                  TextButton(
                    onPressed: () {},
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size(0, 0),
                    ),
                    child: Text(
                      'Saves',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 7),
                  ),
                  TextButton(
                    onPressed: () {},
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size(0, 0),
                    ),
                    child: Text(
                      'Achievements',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                  ),
                  TextButton(
                    onPressed: () {},
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size(0, 0),
                    ),
                    child: Text(
                      'Settings',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
