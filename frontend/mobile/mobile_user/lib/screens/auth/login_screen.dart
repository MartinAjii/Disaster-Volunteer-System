import 'package:flutter/material.dart';

import '../dashboard/dashboard_screen.dart';

class LoginScreen extends StatefulWidget {

  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() =>
      _LoginScreenState();
}

class _LoginScreenState
    extends State<LoginScreen> {

  final TextEditingController
      emailController =
      TextEditingController();

  final TextEditingController
      passwordController =
      TextEditingController();

  bool isLoading = false;

  void login() async {

    setState(() {
      isLoading = true;
    });

    await Future.delayed(
      const Duration(seconds: 1),
    );

    setState(() {
      isLoading = false;
    });

    Navigator.pushReplacement(
      context,

      MaterialPageRoute(
        builder: (_) =>
            const DashboardScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      body: Center(

        child: SingleChildScrollView(

          padding:
              const EdgeInsets.all(24),

          child: Column(

            children: [

              const Icon(
                Icons.volunteer_activism,
                size: 90,
                color: Color(0xFFE63946),
              ),

              const SizedBox(height: 20),

              const Text(
                "Disaster Volunteer",

                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 8),

              const Text(
                "Sistem Relawan Bencana",

                style: TextStyle(
                  color: Colors.grey,
                ),
              ),

              const SizedBox(height: 40),

              TextField(
                controller: emailController,

                decoration:
                    InputDecoration(
                  labelText: "Email",

                  filled: true,

                  fillColor:
                      Colors.white10,

                  border:
                      OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(
                            12),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              TextField(
                controller:
                    passwordController,

                obscureText: true,

                decoration:
                    InputDecoration(
                  labelText: "Password",

                  filled: true,

                  fillColor:
                      Colors.white10,

                  border:
                      OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(
                            12),
                  ),
                ),
              ),

              const SizedBox(height: 30),

              SizedBox(
                width: double.infinity,
                height: 55,

                child: ElevatedButton(

                  style:
                      ElevatedButton.styleFrom(
                    backgroundColor:
                        const Color(
                            0xFFE63946),

                    shape:
                        RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(
                              12),
                    ),
                  ),

                  onPressed:
                      isLoading
                          ? null
                          : login,

                  child:
                      isLoading
                          ? const CircularProgressIndicator(
                              color:
                                  Colors.white,
                            )
                          : const Text(
                              "LOGIN",

                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}