import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/services/auth_service.dart';
import './login_screen.dart';
import 'edit_profile_screen.dart';

class ProfileScreen
    extends StatefulWidget {

  const ProfileScreen({
    super.key,
  });

  @override
  State<ProfileScreen>
      createState() =>
          _ProfileScreenState();
}

class _ProfileScreenState
    extends State<ProfileScreen> {

  Map<String, dynamic>? user;

  bool isLoading = true;

  @override
  void initState() {
    super.initState();

    loadUser();
  }

  void loadUser() async {

    final prefs =
        await SharedPreferences
            .getInstance();

    final userString =
        prefs.getString("user");

    if (userString != null) {

      setState(() {

        user =
            jsonDecode(userString);

        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {

    if (isLoading) {

      return const Center(
        child:
            CircularProgressIndicator(),
      );
    }

    final volunteer =
        user?["volunteer"];

    return SingleChildScrollView(

      padding:
          const EdgeInsets.all(20),

      child: Column(

        children: [

          const SizedBox(height: 20),

          const CircleAvatar(

            radius: 50,

            backgroundColor:
                Color(0xFFE63946),

            child: Icon(
              Icons.person,
              size: 50,
              color: Colors.white,
            ),
          ),

          const SizedBox(height: 30),

          profileItem(
            "Nama Lengkap",
            user?["name"] ?? "-",
          ),

          profileItem(
            "Nomor Telepon",
            user?["phone"] ?? "-",
          ),

          profileItem(
            "Alamat",
            volunteer?["address"] ??
                "-",
          ),

          profileItem(
            "Keahlian",
            volunteer?["skills"] ??
                "-",
          ),

          const SizedBox(height: 30),

          SizedBox(

            width:
                double.infinity,

            height: 55,

            child: ElevatedButton(

              style:
                  ElevatedButton
                      .styleFrom(

                backgroundColor:
                    const Color(
                        0xFFE63946),
              ),

              onPressed: () async {

                final updated =
                    await Navigator.push(

                  context,

                  MaterialPageRoute(
                    builder: (_) =>
                        const EditProfileScreen(),
                  ),
                );

                if (updated == true) {
                  loadUser();
                }
              },

              child: const Text(

                "EDIT PROFILE",

                style: TextStyle(
                  color:
                      Colors.white,
                ),
              ),
            ),
          ),

          const SizedBox(height: 30),

          Card(

            color: Colors.white10,

            child: ListTile(

              leading: const Icon(
                Icons.logout,
                color: Colors.red,
              ),

              title: const Text(
                "Logout",
              ),

              onTap: () async {

                await AuthService.logout();

                Navigator.pushReplacement(

                  context,

                  MaterialPageRoute(
                    builder: (_) =>
                        const LoginScreen(),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget profileItem(
    String title,
    String value,
  ) {

    return Container(

      width: double.infinity,

      margin:
          const EdgeInsets.only(
              bottom: 20),

      padding:
          const EdgeInsets.all(16),

      decoration: BoxDecoration(

        color: Colors.white10,

        borderRadius:
            BorderRadius.circular(
                16),
      ),

      child: Column(

        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [

          Text(

            title,

            style: const TextStyle(

              color: Colors.white70,

              fontSize: 14,
            ),
          ),

          const SizedBox(height: 8),

          Text(

            value,

            style: const TextStyle(

              fontSize: 18,

              fontWeight:
                  FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}