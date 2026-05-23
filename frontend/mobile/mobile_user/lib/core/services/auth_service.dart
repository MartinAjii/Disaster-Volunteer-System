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
          "${Api.baseUrl}/auth/login",
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
  }) async {

    try {

      final response = await http.post(
        Uri.parse(
          "${Api.baseUrl}/auth/register",
        ),

        headers: {
          "Content-Type":
              "application/json",
        },

        body: jsonEncode({
          "name": name,
          "email": email,
          "password": password,
        }),
      );

      return jsonDecode(response.body);

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

    await prefs.clear();
  }
}
