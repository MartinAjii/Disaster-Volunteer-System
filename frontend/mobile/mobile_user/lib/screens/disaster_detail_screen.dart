import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:url_launcher/url_launcher.dart';

class DisasterDetailScreen
    extends StatelessWidget {

  final dynamic disaster;

  const DisasterDetailScreen({
    super.key,
    required this.disaster,
  });

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

    return Scaffold(

      backgroundColor:
          const Color(
              0xFF0B0712),

      appBar: AppBar(

        backgroundColor:
            const Color(
                0xFF1E3A5F),

        title: const Text(
          "Detail Bencana",
        ),
      ),

      body: SingleChildScrollView(

        padding:
            const EdgeInsets.all(
                18),

        child: Column(

          crossAxisAlignment:
              CrossAxisAlignment
                  .start,

          children: [

            if (latitude != null &&
                longitude != null)

              ClipRRect(

                borderRadius:
                    BorderRadius
                        .circular(18),

                child: SizedBox(

                  height: 250,

                  child: FlutterMap(

                    options:
                        MapOptions(

                      initialCenter:
                          LatLng(
                        latitude,
                        longitude,
                      ),

                      initialZoom:
                          14,
                    ),

                    children: [

                      TileLayer(

                        urlTemplate:
                            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',

                        userAgentPackageName:
                            'com.example.app',
                      ),

                      MarkerLayer(

                        markers: [

                          Marker(

                            point:
                                LatLng(
                              latitude,
                              longitude,
                            ),

                            width: 80,
                            height: 80,

                            child:
                                const Icon(

                              Icons
                                  .location_pin,

                              size: 50,

                              color:
                                  Colors.red,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

            const SizedBox(
                height: 20),

            Text(

              disaster["title"] ??
                  "-",

              style:
                  const TextStyle(

                fontSize: 28,

                fontWeight:
                    FontWeight.bold,
              ),
            ),

            const SizedBox(
                height: 12),

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
                  ),
                ),

                const SizedBox(
                    width: 10),

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
                        Colors.blueGrey,

                    borderRadius:
                        BorderRadius
                            .circular(
                                20),
                  ),

                  child: Text(
                    disaster["status"] ??
                        "-",
                  ),
                ),
              ],
            ),

            const SizedBox(
                height: 20),

            infoTile(
              Icons.warning,
              "Jenis Bencana",
              disaster["type"] ??
                  "-",
            ),

            infoTile(
              Icons.calendar_month,
              "Tanggal Kejadian",
              disaster["disaster_date"]
                      ?.toString() ??
                  "-",
            ),

            infoTile(
              Icons.location_on,
              "Lokasi",
              disaster["location"] ??
                  "-",
            ),

            const SizedBox(
                height: 24),

            const Text(

              "Deskripsi",

              style: TextStyle(

                fontSize: 20,

                fontWeight:
                    FontWeight.bold,
              ),
            ),

            const SizedBox(
                height: 10),

            Text(
              disaster["description"] ??
                  "-",
            ),

            const SizedBox(
                height: 30),

            SizedBox(

              width: double.infinity,

              child: ElevatedButton
                  .icon(

                style:
                    ElevatedButton
                        .styleFrom(

                  backgroundColor:
                      Colors.blue,

                  padding:
                      const EdgeInsets
                          .symmetric(
                    vertical: 16,
                  ),

                  shape:
                      RoundedRectangleBorder(

                    borderRadius:
                        BorderRadius
                            .circular(
                                16),
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
                  color: Colors.white,
                ),

                label:
                    const Text(

                  "Buka Route",

                  style:
                      TextStyle(
                    color:
                        Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget infoTile(
    IconData icon,
    String title,
    String value,
  ) {

    return Padding(

      padding:
          const EdgeInsets.only(
              bottom: 16),

      child: Row(

        crossAxisAlignment:
            CrossAxisAlignment
                .start,

        children: [

          Icon(
            icon,
            color: Colors.grey,
          ),

          const SizedBox(
              width: 10),

          Expanded(

            child: Column(

              crossAxisAlignment:
                  CrossAxisAlignment
                      .start,

              children: [

                Text(

                  title,

                  style:
                      const TextStyle(
                    color:
                        Colors.grey,
                  ),
                ),

                const SizedBox(
                    height: 4),

                Text(
                  value,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}