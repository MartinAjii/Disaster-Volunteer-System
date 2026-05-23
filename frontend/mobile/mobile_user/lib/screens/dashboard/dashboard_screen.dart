import 'package:flutter/material.dart';
import '../../core/services/auth_service.dart';
import '../../core/services/disaster_service.dart';
import '../auth/login_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen>
      createState() =>
          _DashboardScreenState();
}

class _DashboardScreenState
    extends State<DashboardScreen> {

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

  int currentIndex = 0;

  List<dynamic> disasters = [];

  bool isLoading = true;

  Widget buildHome() {

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

  Widget buildAssignment() {

    return const Center(
      child: Text(
        "Belum ada penugasan",
      ),
    );
  }

  Widget buildProfile() {

    return Padding(

      padding:
          const EdgeInsets.all(20),

      child: Column(

        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [

          const SizedBox(height: 20),

          const Center(

            child: CircleAvatar(
              radius: 50,

              backgroundColor:
                  Color(0xFFE63946),

              child: Icon(
                Icons.person,
                size: 50,
                color: Colors.white,
              ),
            ),
          ),

          const SizedBox(height: 20),

          const Center(
            child: Text(
              "Relawan",

              style: TextStyle(
                fontSize: 22,
                fontWeight:
                    FontWeight.bold,
              ),
            ),
          ),

          const SizedBox(height: 40),

          Card(

            color: Colors.white10,

            shape:
                RoundedRectangleBorder(
              borderRadius:
                  BorderRadius.circular(
                      16),
            ),

            child: ListTile(

              leading: const Icon(
                Icons.logout,
                color: Colors.red,
              ),

              title: const Text(
                "Logout",
              ),

              onTap: () async {

                await AuthService.logout();

                Navigator.pushReplacement(
                  context,

                  MaterialPageRoute(
                    builder: (_) =>
                        const LoginScreen(),
                  ),
                );
              },
            ),
          ),
        ],
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