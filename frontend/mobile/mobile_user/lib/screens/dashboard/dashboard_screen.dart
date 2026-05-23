import 'package:flutter/material.dart';
import '../assignment/assignment_screen.dart';
import '../disaster/disaster_screen.dart';
import '../profile/profile_screen.dart';

class DashboardScreen extends StatefulWidget {

  const DashboardScreen({super.key});

  @override
  State<DashboardScreen>
      createState() =>
          _DashboardScreenState();
}

class _DashboardScreenState
    extends State<DashboardScreen> {

  int currentIndex = 0;

  final pages = [

    const DisasterScreen(),

    const AssignmentScreen(),

    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {

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