import 'package:flutter/material.dart';
import '../../core/services/auth_service.dart';

class RegisterScreen
    extends StatefulWidget {

  const RegisterScreen({super.key});

  @override
  State<RegisterScreen>
      createState() =>
          _RegisterScreenState();
}

class _RegisterScreenState
    extends State<RegisterScreen> {

  final TextEditingController
      nameController =
      TextEditingController();

  final TextEditingController
      emailController =
      TextEditingController();

  final TextEditingController
      passwordController =
      TextEditingController();

  bool isLoading = false;

  void register() async {

    setState(() {
      isLoading = true;
    });

    final result =
        await AuthService.register(
      name: nameController.text,
      email: emailController.text,
      password:
          passwordController.text,
    );

    setState(() {
      isLoading = false;
    });

    if (result["success"] == true) {

      ScaffoldMessenger.of(context)
          .showSnackBar(

        const SnackBar(
          content: Text(
            "Register berhasil",
          ),
        ),
      );

      Navigator.pop(context);

    } else {

      ScaffoldMessenger.of(context)
          .showSnackBar(

        SnackBar(
          content: Text(
            result["message"] ??
                "Register gagal",
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(
        title:
            const Text("Register"),
      ),

      body: SingleChildScrollView(

        padding:
            const EdgeInsets.all(24),

        child: Column(

          children: [

            const SizedBox(height: 40),

            const Icon(
              Icons.person_add,
              size: 80,
              color: Color(0xFFE63946),
            ),

            const SizedBox(height: 20),

            TextField(
              controller:
                  nameController,

              decoration:
                  InputDecoration(
                labelText:
                    "Nama Lengkap",

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
                  emailController,

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
                labelText:
                    "Password",

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
                        : register,

                child:
                    isLoading
                        ? const CircularProgressIndicator(
                            color:
                                Colors.white,
                          )
                        : const Text(
                            "REGISTER",

                            style: TextStyle(
                              color:
                                  Colors.white,
                              fontWeight:
                                  FontWeight
                                      .bold,
                            ),
                          ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}