import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/services/report_service.dart';

class ReportFormScreen extends StatefulWidget {

  final dynamic assignment;

  const ReportFormScreen({

    super.key,

    required this.assignment,
  });

  @override
  State<ReportFormScreen> createState() =>
      _ReportFormScreenState();
}

class _ReportFormScreenState
    extends State<ReportFormScreen> {

  final titleController =
      TextEditingController();

  final contentController =
      TextEditingController();

  XFile? selectedImage;

  bool isLoading = false;

  late bool isRevision;

  @override
  void initState() {

    super.initState();

    final reportStatus =
        widget.assignment[
            "report_status"];

    isRevision =
        reportStatus ==
            "rejected";

    if (isRevision) {

      titleController.text =
          widget.assignment[
                  "report_title"] ??
              "";

      contentController.text =
          widget.assignment[
                  "report_content"] ??
              "";
    }
  }

  Future<void> pickImage()
  async {

    final picker =
        ImagePicker();

    final picked =
        await picker.pickImage(

      source:
          ImageSource.gallery,
    );

    if (picked != null) {

      setState(() {

        selectedImage = picked;
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

    final reportId =
        widget.assignment[
            "report_id"];

    Map<String, dynamic>
        result;

    if (reportId != null) {

      result =
          await ReportService
              .updateReport(

        reportId:
            reportId,

        assignmentId:
            widget.assignment["id"],

        disasterId:
            widget.assignment[
                "disaster_id"],

        title:
            titleController.text,

        content:
            contentController.text,

        photo:
            selectedImage,
      );

    } else {

      result =
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

        photo:
            selectedImage,
      );
    }

    setState(() {

      isLoading = false;
    });

    if (result["success"] ==
        true) {

      ScaffoldMessenger.of(
              context)
          .showSnackBar(

        SnackBar(

          content: Text(

            isRevision

                ? "Revisi laporan berhasil dikirim"

                : "Laporan berhasil dikirim",
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

        title: Text(

          isRevision

              ? "Revisi Laporan"

              : "Buat Laporan",
        ),
      ),

      body: SingleChildScrollView(

        padding:
            const EdgeInsets.all(
                20),

        child: Column(

          crossAxisAlignment:
              CrossAxisAlignment
                  .start,

          children: [

            if (isRevision)

              Container(

                width:
                    double.infinity,

                padding:
                    const EdgeInsets
                        .all(12),

                margin:
                    const EdgeInsets
                        .only(
                            bottom:
                                20),

                decoration:
                    BoxDecoration(

                  color: Colors.red
                      .withOpacity(
                          0.1),

                  borderRadius:
                      BorderRadius
                          .circular(
                              12),
                ),

                child: const Text(

                  "Laporan sebelumnya ditolak admin. Silakan revisi laporan lalu kirim kembali.",

                  style: TextStyle(
                    color: Colors.red,
                  ),
                ),
              ),

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

                child: kIsWeb

                    ? Image.network(

                        selectedImage!
                            .path,

                        height: 200,

                        width:
                            double
                                .infinity,

                        fit: BoxFit
                            .cover,
                      )

                    : Image.file(

                        File(
                          selectedImage!
                              .path,
                        ),

                        height: 200,

                        width:
                            double
                                .infinity,

                        fit: BoxFit
                            .cover,
                      ),
              )

            else if (widget.assignment[
                    "photo_url"] !=
                null)

              ClipRRect(

                borderRadius:
                    BorderRadius
                        .circular(12),

                child: Image.network(

                  widget.assignment[
                      "photo_url"],

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

                label: Text(

                  isRevision

                      ? "Ganti Foto"

                      : "Pilih Foto",
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

                    : Text(

                        isRevision

                            ? "Kirim Revisi"

                            : "Kirim Laporan",
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}