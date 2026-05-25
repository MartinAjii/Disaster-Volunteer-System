import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:image_picker/image_picker.dart';
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

    XFile? photo,
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

        final bytes =
            await photo.readAsBytes();

        final multipartFile =
            http.MultipartFile
                .fromBytes(

          "photo",

          bytes,

          filename:
              photo.name,

          contentType:
              MediaType(
            "image",
            "jpeg",
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

      print(response.body);

      final data =
          jsonDecode(response.body);

      return data;

    } catch (e) {

      print(e);

      return {

        "success": false,

        "message":
            e.toString(),
      };
    }
  }

  static Future<Map<String, dynamic>> updateReport({

    required int reportId,

    required int assignmentId,

    required int disasterId,

    required String title,

    required String content,

    XFile? photo,
  }) async {

    try {

      final prefs =
          await SharedPreferences
              .getInstance();

      final token =
          prefs.getString("token");

      final request =
          http.MultipartRequest(

        "PUT",

        Uri.parse(
          "${Api.baseUrl}/reports/$reportId",
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

        final bytes =
            await photo.readAsBytes();

        final mimeType =
            lookupMimeType(
                  photo.name,
                ) ??
                "image/jpeg";

        final multipartFile =
            http.MultipartFile
                .fromBytes(

          "photo",

          bytes,

          filename:
              photo.name,

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

      print(response.body);

      return jsonDecode(
        response.body,
      );

    } catch (e) {

      print(e);

      return {

        "success": false,

        "message":
            e.toString(),
      };
    }
  }
}