import 'dart:convert';

import 'package:http/http.dart'
    as http;

import 'package:shared_preferences/shared_preferences.dart';

import '../constants/api.dart';

class RealtimeService {

  static Future<void>
      updateLocation({

    required int volunteerId,

    required double latitude,

    required double longitude,

  }) async {

    try {

      final prefs =
          await SharedPreferences
              .getInstance();

      final token =
          prefs.getString("token");

      await http.post(

        Uri.parse(
          "${Api.baseUrl}/realtime/locations/$volunteerId",
        ),

        headers: {

          "Content-Type":
              "application/json",

          "Authorization":
              "Bearer $token",
        },

        body: jsonEncode({

          "latitude": latitude,

          "longitude": longitude,

          "status": "available",
        }),
      );

    } catch (e) {

      print(e);
    }
  }
}