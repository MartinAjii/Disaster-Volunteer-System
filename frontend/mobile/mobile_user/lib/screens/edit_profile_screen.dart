import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/services/auth_service.dart';

class EditProfileScreen
    extends StatefulWidget {

  const EditProfileScreen({
    super.key,
  });

  @override
  State<EditProfileScreen>
      createState() =>
          _EditProfileScreenState();
}

class _EditProfileScreenState
    extends State<EditProfileScreen> {

  final nameController =
      TextEditingController();

  final phoneController =
      TextEditingController();

  final addressController =
      TextEditingController();

  final skillsController =
      TextEditingController();

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

      final user =
          jsonDecode(userString);

      nameController.text =
          user["name"] ?? "";

      phoneController.text =
          user["phone"] ?? "";

      final volunteer =
          user["volunteer"];

      if (volunteer != null) {

        addressController.text =
            volunteer["address"] ??
                "";

        skillsController.text =
            volunteer["skills"] ??
                "";
      }
    }

    setState(() {
      isLoading = false;
    });
  }

  void updateProfile()
  async {

    final result =
        await AuthService
            .updateProfile(

      name:
          nameController.text,

      phone:
          phoneController.text,

      address:
          addressController.text,

      skills:
          skillsController.text,
    );

    if (result["success"] == true) {

      await AuthService.getProfile();

      ScaffoldMessenger.of(
              context)
          .showSnackBar(

        const SnackBar(

          content: Text(
            "Profile berhasil diupdate",
          ),
        ),
      );

      Navigator.pop(context, true);

    } else {

      ScaffoldMessenger.of(
              context)
          .showSnackBar(

        SnackBar(

          content: Text(

            result["message"] ??
                "Update gagal",
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {

    if (isLoading) {

      return const Scaffold(

        body: Center(
          child:
              CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(

      appBar: AppBar(
        title:
            const Text("Edit Profile"),
      ),

      body: SingleChildScrollView(

        padding:
            const EdgeInsets.all(20),

        child: Column(

          children: [

            TextField(

              controller:
                  nameController,

              decoration:
                  const InputDecoration(
                labelText:
                    "Nama Lengkap",
              ),
            ),

            const SizedBox(height: 20),

            TextField(

              controller:
                  phoneController,

              decoration:
                  const InputDecoration(
                labelText:
                    "Nomor Telepon",
              ),
            ),

            const SizedBox(height: 20),

            TextField(

              controller:
                  addressController,

              maxLines: 2,

              decoration:
                  const InputDecoration(
                labelText:
                    "Alamat",
              ),
            ),

            const SizedBox(height: 20),

            TextField(

              controller:
                  skillsController,

              decoration:
                  const InputDecoration(
                labelText:
                    "Keahlian",
              ),
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

                onPressed:
                    updateProfile,

                child: const Text(

                  "UPDATE PROFILE",

                  style: TextStyle(
                    color:
                        Colors.white,
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