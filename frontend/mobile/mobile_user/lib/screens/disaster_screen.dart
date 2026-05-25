import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/services/disaster_service.dart';

class DisasterScreen
    extends StatefulWidget {

  const DisasterScreen({
    super.key,
  });

  @override
  State<DisasterScreen>
      createState() =>
          _DisasterScreenState();
}

class _DisasterScreenState
    extends State<DisasterScreen> {

  List<dynamic> disasters = [];

  bool isLoading = true;

  @override
  void initState() {
    super.initState();

    loadDisasters();
  }

  void loadDisasters() async {

    final result =
        await DisasterService
            .getDisasters();

    setState(() {

      disasters = result;

      isLoading = false;
    });
  }

  Future<void> openRoute(
    double latitude,
    double longitude,
  ) async {

    final url =
        "https://www.google.com/maps/dir/?api=1&destination=$latitude,$longitude";

    final uri =
        Uri.parse(url);

    if (await canLaunchUrl(uri)) {

      await launchUrl(

        uri,

        mode:
            LaunchMode.externalApplication,
      );
    }
  }

  Color getSeverityColor(
    String severity,
  ) {

    switch (severity) {

      case "low":
        return Colors.green;

      case "medium":
        return Colors.orange;

      case "high":
        return Colors.red;

      case "critical":
        return Colors.purple;

      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {

    if (isLoading) {

      return const Center(
        child:
            CircularProgressIndicator(),
      );
    }

    if (disasters.isEmpty) {

      return const Center(
        child: Text(
          "Belum ada data bencana",
        ),
      );
    }

    return RefreshIndicator(

      onRefresh: () async {
        loadDisasters();
      },

      child: ListView.builder(

        itemCount:
            disasters.length,

        itemBuilder:
            (context, index) {

          final disaster =
              disasters[index];

          final severity =
              disaster["severity"] ??
                  "medium";

          final latitude =
              double.tryParse(

            disaster["latitude"]
                    ?.toString() ??
                "",
          );

          final longitude =
              double.tryParse(

            disaster["longitude"]
                    ?.toString() ??
                "",
          );

          return Card(

            color: Colors.white10,

            margin:
                const EdgeInsets
                    .symmetric(

              horizontal: 16,
              vertical: 8,
            ),

            shape:
                RoundedRectangleBorder(

              borderRadius:
                  BorderRadius
                      .circular(
                          16),
            ),

            child: Padding(

              padding:
                  const EdgeInsets
                      .all(16),

              child: Column(

                crossAxisAlignment:
                    CrossAxisAlignment
                        .start,

                children: [

                  Text(

                    disaster["title"] ??
                        "-",

                    style:
                        const TextStyle(

                      fontSize: 20,

                      fontWeight:
                          FontWeight
                              .bold,
                    ),
                  ),

                  const SizedBox(
                      height: 12),

                  Row(

                    crossAxisAlignment:
                        CrossAxisAlignment
                            .start,

                    children: [

                      const Icon(

                        Icons
                            .location_on,

                        color:
                            Colors.grey,

                        size: 18,
                      ),

                      const SizedBox(
                          width: 6),

                      Expanded(

                        child: Text(

                          disaster["location"] ??
                              "-",

                          style:
                              const TextStyle(
                            fontSize: 15,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(
                      height: 14),

                  Text(

                    disaster["description"] ??
                        "-",

                    style:
                        const TextStyle(

                      color:
                          Colors.grey,

                      fontSize: 14,
                    ),
                  ),

                  const SizedBox(
                      height: 18),

                  Row(

                    children: [

                      Container(

                        padding:
                            const EdgeInsets
                                .symmetric(

                          horizontal: 14,
                          vertical: 8,
                        ),

                        decoration:
                            BoxDecoration(

                          color:
                              getSeverityColor(
                            severity,
                          ),

                          borderRadius:
                              BorderRadius
                                  .circular(
                                      20),
                        ),

                        child: Text(

                          severity,

                          style:
                              const TextStyle(

                            color:
                                Colors
                                    .white,

                            fontWeight:
                                FontWeight
                                    .bold,
                          ),
                        ),
                      ),

                      const SizedBox(
                          width: 12),

                      ElevatedButton
                          .icon(

                        style:
                            ElevatedButton
                                .styleFrom(

                          backgroundColor:
                              Colors
                                  .blue,

                          shape:
                              RoundedRectangleBorder(

                            borderRadius:
                                BorderRadius
                                    .circular(
                                        20),
                          ),
                        ),

                        onPressed:

                            latitude != null &&
                                    longitude !=
                                        null

                                ? () {

                                    openRoute(
                                      latitude,
                                      longitude,
                                    );
                                  }

                                : null,

                        icon:
                            const Icon(

                          Icons.route,

                          color:
                              Colors.white,

                          size: 18,
                        ),

                        label:
                            const Text(

                          "Route",

                          style:
                              TextStyle(
                            color:
                                Colors
                                    .white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}