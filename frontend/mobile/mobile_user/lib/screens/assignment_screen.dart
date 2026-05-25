import 'package:flutter/material.dart';
import '../../core/services/assignment_service.dart';
import 'report_form_screen.dart';

class AssignmentScreen extends StatefulWidget {

  const AssignmentScreen({
    super.key,
  });

  @override
  State<AssignmentScreen>
      createState() =>
          _AssignmentScreenState();
}

class _AssignmentScreenState
    extends State<AssignmentScreen> {

  List<dynamic> assignments = [];

  bool isLoading = true;

  @override
  void initState() {
    super.initState();

    loadAssignments();
  }

  void loadAssignments() async {

    final result =
        await AssignmentService
            .getAssignments();

    setState(() {

      assignments = result;

      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {

    if (isLoading) {

      return const Center(
        child:
            CircularProgressIndicator(),
      );
    }

    if (assignments.isEmpty) {

      return const Center(
        child: Text(
          "Belum ada tugas",
        ),
      );
    }

    return ListView.builder(

      itemCount: assignments.length,

      itemBuilder: (context, index) {

        final assignment =
            assignments[index];

        return Card(

          color: Colors.white10,

          margin:
              const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 8,
          ),

          shape:
              RoundedRectangleBorder(
            borderRadius:
                BorderRadius.circular(
                    16),
          ),

          child: Padding(

            padding:
                const EdgeInsets.all(16),

            child: Column(

              crossAxisAlignment:
                  CrossAxisAlignment
                      .start,

              children: [

                Text(
                  assignment[
                          "disaster_title"] ??
                      "Tugas Relawan",

                  style:
                      const TextStyle(
                    fontSize: 18,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 10),

                Text(
                  assignment["notes"] ??
                      "-",
                ),

                const SizedBox(height: 12),

                Row(

                  mainAxisAlignment:
                      MainAxisAlignment
                          .spaceBetween,

                  children: [

                    Container(

                      padding:
                          const EdgeInsets
                              .symmetric(

                        horizontal: 12,
                        vertical: 6,
                      ),

                      decoration:
                          BoxDecoration(

                        color: Colors.orange,

                        borderRadius:
                            BorderRadius
                                .circular(
                                    20),
                      ),

                      child: Text(

                        assignment[
                                "assignment_status"] ??
                            "-",
                      ),
                    ),

                    ElevatedButton.icon(

                      onPressed: () {

                        Navigator.push(

                          context,

                          MaterialPageRoute(

                            builder: (_) =>
                                ReportFormScreen(
                              assignment:
                                  assignment,
                            ),
                          ),
                        );
                      },

                      icon: const Icon(
                        Icons.description,
                        size: 18,
                      ),

                      label: const Text(
                        "Laporan",
                      ),
                    ),
                  ],
                )
              ],
            ),
          ),
        );
      },
    );
  }
}