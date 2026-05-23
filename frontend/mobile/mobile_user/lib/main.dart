import 'package:flutter/material.dart';
import 'screens/auth/login_screen.dart';
import 'core/services/auth_service.dart';
import 'screens/dashboard/dashboard_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {

  const MyApp({super.key});

  @override
  State<MyApp> createState() =>
      _MyAppState();
}

class _MyAppState
    extends State<MyApp> {

  Widget screen =
      const LoginScreen();

  @override
  void initState() {
    super.initState();

    checkLogin();
  }

  void checkLogin() async {

    final token =
        await AuthService.getToken();

    if (token != null) {

      setState(() {

        screen =
            const DashboardScreen();
      });
    }
  }

  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      debugShowCheckedModeBanner:
          false,

      title: 'Disaster Volunteer',

      theme: ThemeData.dark(),

      home: screen,
    );
  }
}