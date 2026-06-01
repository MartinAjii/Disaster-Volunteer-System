import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api.dart';

class AssignmentService {

  static Future<List<dynamic>>
      getAssignments() async {

    try {

      final prefs =
          await SharedPreferences
              .getInstance();

      final token =
          prefs.getString("token");

      final response = await http.get(

        Uri.parse(
          "${Api.cloudUrl}/assignments",
        ),

        headers: {
          "Authorization":
              "Bearer $token",
        },
      );

      final data =
          jsonDecode(response.body);

      if (data["success"] == true) {

        return data["data"];
      }

      return [];

    } catch (e) {

      print(e);

      return [];
    }
  }
}