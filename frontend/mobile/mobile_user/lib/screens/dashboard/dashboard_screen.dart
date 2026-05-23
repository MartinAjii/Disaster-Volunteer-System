import 'package:flutter/material.dart';

class DashboardScreen
    extends StatefulWidget {

  const DashboardScreen({super.key});

  @override
  State<DashboardScreen>
      createState() =>
          _DashboardScreenState();
}

class _DashboardScreenState
    extends State<DashboardScreen> {

  int currentIndex = 0;

  final List<Map<String, dynamic>>
      disasters = [
    {
      "title": "Banjir Bandang",
      "location": "Yogyakarta",
      "severity": "High",
    },
    {
      "title": "Gempa Bumi",
      "location": "Bandung",
      "severity": "Critical",
    },
  ];

  Widget buildHome() {

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
                  CrossAxisAlignment.start,

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

                    Text(
                      disaster["location"],
                    ),
                  ],
                ),

                const SizedBox(height: 12),

                Container(

                  padding:
                      const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),

                  decoration:
                      BoxDecoration(
                    color: Colors.red,
                    borderRadius:
                        BorderRadius.circular(
                            20),
                  ),

                  child: Text(
                    disaster["severity"],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget buildAssignment() {

    return const Center(
      child: Text(
        "Belum ada penugasan",
      ),
    );
  }

  Widget buildProfile() {

    return const Center(
      child: Text(
        "Profil Relawan",
      ),
    );
  }

  @override
  Widget build(BuildContext context) {

    final pages = [
      buildHome(),
      buildAssignment(),
      buildProfile(),
    ];

    return Scaffold(

      appBar: AppBar(
        title: const Text(
          "Relawan Dashboard",
        ),

        backgroundColor:
            const Color(0xFF1D3557),
      ),

      body: pages[currentIndex],

      bottomNavigationBar:
          BottomNavigationBar(

        currentIndex: currentIndex,

        backgroundColor:
            const Color(0xFF1D3557),

        selectedItemColor:
            const Color(0xFFE63946),

        unselectedItemColor:
            Colors.grey,

        onTap: (index) {
          setState(() {
            currentIndex = index;
          });
        },

        items: const [

          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "Home",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.assignment),
            label: "Tugas",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: "Profil",
          ),
        ],
      ),
    );
  }
}