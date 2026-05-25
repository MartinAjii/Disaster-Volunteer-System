import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api.dart';

class ReportService {

  static Future<Map<String, dynamic>>
      createReport({

    required int assignmentId,

    required int disasterId,

    required String title,

    required String content,

    File? photo,
  }) async {

    try {

      final prefs =
          await SharedPreferences
              .getInstance();

      final token =
          prefs.getString("token");

      final request =
          http.MultipartRequest(

        "POST",

        Uri.parse(
          "${Api.baseUrl}/reports",
        ),
      );

      request.headers.addAll({

        "Authorization":
            "Bearer $token",
      });

      request.fields[
              "assignment_id"] =
          assignmentId.toString();

      request.fields[
              "disaster_id"] =
          disasterId.toString();

      request.fields["title"] =
          title;

      request.fields["content"] =
          content;

      if (photo != null) {

        final mimeType =
            lookupMimeType(
                  photo.path,
                ) ??
                "image/jpeg";

        final multipartFile =
            await http.MultipartFile
                .fromPath(

          "photo",

          photo.path,

          contentType:
              MediaType.parse(
            mimeType,
          ),
        );

        request.files.add(
          multipartFile,
        );
      }

      final streamedResponse =
          await request.send();

      final response =
          await http.Response
              .fromStream(
        streamedResponse,
      );

      final data =
          jsonDecode(response.body);

      return data;

    } catch (e) {

      return {

        "success": false,

        "message":
            e.toString(),
      };
    }
  }
}