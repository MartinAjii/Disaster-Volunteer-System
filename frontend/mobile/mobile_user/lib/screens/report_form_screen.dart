import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/services/report_service.dart';

class ReportFormScreen
    extends StatefulWidget {

  final dynamic assignment;

  const ReportFormScreen({
    super.key,
    required this.assignment,
  });

  @override
  State<ReportFormScreen>
      createState() =>
          _ReportFormScreenState();
}

class _ReportFormScreenState
    extends State<ReportFormScreen> {

  final titleController =
      TextEditingController();

  final contentController =
      TextEditingController();

  File? selectedImage;

  bool isLoading = false;

  Future<void> pickImage()
  async {

    final picker =
        ImagePicker();

    final picked =
        await picker.pickImage(
      source: ImageSource.gallery,
    );

    if (picked != null) {

      setState(() {

        selectedImage =
            File(picked.path);
      });
    }
  }

  Future<void> submitReport()
  async {

    if (titleController.text
            .trim()
            .isEmpty ||
        contentController.text
            .trim()
            .isEmpty) {

      ScaffoldMessenger.of(
              context)
          .showSnackBar(

        const SnackBar(

          content: Text(
            "Judul dan isi laporan wajib diisi",
          ),
        ),
      );

      return;
    }

    setState(() {
      isLoading = true;
    });

    final result =
        await ReportService
            .createReport(

      assignmentId:
          widget.assignment["id"],

      disasterId:
          widget.assignment[
              "disaster_id"],

      title:
          titleController.text,

      content:
          contentController.text,

      photo: selectedImage,
    );

    setState(() {
      isLoading = false;
    });

    if (result["success"] ==
        true) {

      ScaffoldMessenger.of(
              context)
          .showSnackBar(

        const SnackBar(

          content: Text(
            "Laporan berhasil dikirim",
          ),
        ),
      );

      Navigator.pop(context);

    } else {

      ScaffoldMessenger.of(
              context)
          .showSnackBar(

        SnackBar(

          content: Text(

            result["message"] ??
                "Gagal mengirim laporan",
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(
        title: const Text(
          "Buat Laporan",
        ),
      ),

      body: SingleChildScrollView(

        padding:
            const EdgeInsets.all(
                20),

        child: Column(

          children: [

            TextField(

              controller:
                  titleController,

              decoration:
                  const InputDecoration(

                labelText:
                    "Judul Laporan",
              ),
            ),

            const SizedBox(
                height: 20),

            TextField(

              controller:
                  contentController,

              maxLines: 6,

              decoration:
                  const InputDecoration(

                labelText:
                    "Isi Laporan",
              ),
            ),

            const SizedBox(
                height: 20),

            if (selectedImage != null)

              ClipRRect(

                borderRadius:
                    BorderRadius
                        .circular(12),

                child: Image.file(
                  selectedImage!,
                  height: 200,
                  width:
                      double.infinity,
                  fit: BoxFit.cover,
                ),
              ),

            const SizedBox(
                height: 20),

            SizedBox(

              width:
                  double.infinity,

              child:
                  OutlinedButton.icon(

                onPressed:
                    pickImage,

                icon: const Icon(
                  Icons.image,
                ),

                label: const Text(
                  "Pilih Foto",
                ),
              ),
            ),

            const SizedBox(
                height: 30),

            SizedBox(

              width:
                  double.infinity,

              child:
                  ElevatedButton(

                onPressed:
                    isLoading
                        ? null
                        : submitReport,

                child: isLoading

                    ? const SizedBox(

                        height: 20,
                        width: 20,

                        child:
                            CircularProgressIndicator(
                          strokeWidth:
                              2,
                        ),
                      )

                    : const Text(
                        "Kirim Laporan",
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}