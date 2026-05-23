import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api.dart';

class DisasterService {

  static Future<List<dynamic>>
      getDisasters() async {

    try {

      final response = await http.get(
        Uri.parse(
          "${Api.baseUrl}/disasters",
        ),
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