import 'package:flutter/material.dart';

import '../../core/services/auth_service.dart';

import '../auth/login_screen.dart';

class ProfileScreen
    extends StatelessWidget {

  const ProfileScreen({
    super.key,
  });

  @override
  Widget build(BuildContext context) {

    return Padding(

      padding:
          const EdgeInsets.all(20),

      child: Column(

        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [

          const SizedBox(height: 20),

          const Center(

            child: CircleAvatar(
              radius: 50,

              backgroundColor:
                  Color(0xFFE63946),

              child: Icon(
                Icons.person,
                size: 50,
                color: Colors.white,
              ),
            ),
          ),

          const SizedBox(height: 20),

          const Center(
            child: Text(
              "Relawan",

              style: TextStyle(
                fontSize: 22,
                fontWeight:
                    FontWeight.bold,
              ),
            ),
          ),

          const SizedBox(height: 40),

          Card(

            color: Colors.white10,

            shape:
                RoundedRectangleBorder(
              borderRadius:
                  BorderRadius.circular(
                      16),
            ),

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
}