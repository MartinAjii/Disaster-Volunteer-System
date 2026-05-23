import 'package:flutter/material.dart';
import '../../core/services/disaster_service.dart';

class DisasterScreen extends StatefulWidget {

  const DisasterScreen({super.key});

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

    return ListView.builder(

      itemCount: disasters.length,

      itemBuilder: (context, index) {

        final disaster =
            disasters[index];

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
                  disaster["title"],

                  style:
                      const TextStyle(
                    fontSize: 18,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 8),

                Row(
                  children: [

                    const Icon(
                      Icons.location_on,
                      color: Colors.grey,
                      size: 18,
                    ),

                    const SizedBox(width: 5),

                    Expanded(
                      child: Text(
                        disaster[
                            "location"],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 10),

                Text(
                  disaster["description"] ??
                      "-",

                  style:
                      const TextStyle(
                    color: Colors.grey,
                  ),
                ),

                const SizedBox(height: 12),

                Container(

                  padding:
                      const EdgeInsets
                          .symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),

                  decoration:
                      BoxDecoration(
                    color: Colors.red,

                    borderRadius:
                        BorderRadius
                            .circular(
                                20),
                  ),

                  child: Text(
                    disaster[
                        "severity"],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}