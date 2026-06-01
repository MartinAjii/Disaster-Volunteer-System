import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {

  static Future<Map<String, dynamic>>
      login({
    required String email,
    required String password,
  }) async {

    try {

      final response = await http.post(
        Uri.parse(
          "${Api.cloudUrl}/auth/login",
        ),

        headers: {
          "Content-Type":
              "application/json",
        },

        body: jsonEncode({
          "email": email,
          "password": password,
        }),
      );

      print(response.statusCode);
      print(response.body);

      return jsonDecode(response.body);

    } catch (e) {

      return {
        "success": false,
        "message": e.toString(),
      };
    }
  }

  static Future<Map<String, dynamic>>
      register({

    required String name,

    required String email,

    required String password,

    required String phone,

    required String address,

    required String skills,
  }) async {

    try {

      final response = await http.post(

        Uri.parse(
          "${Api.cloudUrl}/auth/register",
        ),

        headers: {
          "Content-Type":
              "application/json",
        },

        body: jsonEncode({

          "name": name,

          "email": email,

          "password": password,

          "phone": phone,

          "address": address,

          "skills": skills,
        }),
      );

      return jsonDecode(
        response.body,
      );

    } catch (e) {

      return {
        "success": false,
        "message": e.toString(),
      };
    }
  }

  static Future<void> saveAuthData(
    String token,
    Map<String, dynamic> user,
  ) async {

    final prefs =
        await SharedPreferences.getInstance();

    print("TOKEN DISIMPAN:");
    print(token);

    await prefs.setString(
      "token",
      token,
    );

    await prefs.setString(
      "user",
      jsonEncode(user),
    );
  }

  static Future<String?> getToken()
  async {

    final prefs =
        await SharedPreferences.getInstance();

    return prefs.getString("token");
  }

  static Future<void> logout()
  async {

    final prefs =
        await SharedPreferences.getInstance();

    print("TOKEN DIAMBIL:");
    print(prefs.getString("token"));

    await prefs.clear();
  }

  static Future<Map<String, dynamic>>
      updateProfile({

    required String name,

    required String phone,

    required String address,

    required String skills,
  }) async {

    try {

      final prefs =
          await SharedPreferences
              .getInstance();

      final token =
          prefs.getString("token");

      final response =
          await http.put(

        Uri.parse(
          "${Api.cloudUrl}/auth/profile",
        ),

        headers: {

          "Content-Type":
              "application/json",

          "Authorization":
              "Bearer $token",
        },

        body: jsonEncode({

          "name": name,

          "phone": phone,

          "address": address,

          "skills": skills,
        }),
      );

      return jsonDecode(
        response.body,
      );

    } catch (e) {

      return {
        "success": false,
        "message": e.toString(),
      };
    }
  }

  static Future<Map<String, dynamic>>
      getProfile()
  async {

    try {

      final prefs =
          await SharedPreferences
              .getInstance();

      final token =
          prefs.getString("token");

      final response =
          await http.get(

        Uri.parse(
          "${Api.cloudUrl}/auth/profile",
        ),

        headers: {

          "Authorization":
              "Bearer $token",
        },
      );

      final data =
          jsonDecode(response.body);

      if (data["success"] == true) {

        await prefs.setString(

          "user",

          jsonEncode(
            data["data"],
          ),
        );
      }

      return data;

    } catch (e) {

      return {
        "success": false,
        "message": e.toString(),
      };
    }
  }
}
