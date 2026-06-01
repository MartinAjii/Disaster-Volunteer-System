import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/services/realtime_service.dart';

class RealtimeMapScreen extends StatefulWidget {

  const RealtimeMapScreen({
    super.key,
  });

  @override
  State<RealtimeMapScreen> createState() =>
      _MapScreenState();
}

class _MapScreenState
    extends State<RealtimeMapScreen> {

  LatLng currentPosition =
      const LatLng(
        -7.7956,
        110.3695,
      );

  StreamSubscription<Position>?
      positionStream;

  Timer? locationTimer;

  bool isLoading = true;

  @override
  void initState() {

    super.initState();

    initializeLocation();
  }

  Future<void> initializeLocation()
  async {

    await getCurrentLocation();

    startRealtimeTracking();
  }

  Future<void> getCurrentLocation()
  async {

    bool serviceEnabled =
        await Geolocator
            .isLocationServiceEnabled();

    if (!serviceEnabled) {
      return;
    }

    LocationPermission permission =
        await Geolocator
            .checkPermission();

    if (permission ==
        LocationPermission.denied) {

      permission =
          await Geolocator
              .requestPermission();
    }

    if (permission ==
        LocationPermission.deniedForever) {

      return;
    }

    Position position =
        await Geolocator
            .getCurrentPosition();

    setState(() {

      currentPosition = LatLng(
        position.latitude,
        position.longitude,
      );

      isLoading = false;
    });
  }

  void startRealtimeTracking()
  async {

    final prefs =
        await SharedPreferences
            .getInstance();

    final userString =
        prefs.getString("user");

    if (userString == null) {
      return;
    }

    final user =
        jsonDecode(userString);

    final volunteerId =
        user["id"];

    // update posisi realtime tiap 5 detik
    locationTimer =
        Timer.periodic(

      const Duration(seconds: 3),

      (_) async {

        try {

          Position position =
              await Geolocator
                  .getCurrentPosition(

            desiredAccuracy:
                LocationAccuracy.high,
          );

          if (!mounted) return;

          setState(() {

            currentPosition = LatLng(
              position.latitude,
              position.longitude,
            );
          });

          await RealtimeService
              .updateLocation(

            volunteerId:
                volunteerId,

            latitude:
                position.latitude,

            longitude:
                position.longitude,
          );

          print(
            "Realtime location updated",
          );

        } catch (e) {

          print(
            "Location update error: $e",
          );
        }
      },
    );
  }

  @override
  void dispose() {

    locationTimer?.cancel();

    positionStream?.cancel();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    if (isLoading) {

      return const Center(

        child:
            CircularProgressIndicator(),
      );
    }

    return FlutterMap(

      options: MapOptions(

        initialCenter:
            currentPosition,

        initialZoom: 15,
      ),

      children: [

        TileLayer(

          urlTemplate:
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',

          userAgentPackageName:
              'com.disaster.volunteer.app',
        ),

        MarkerLayer(

          markers: [

            Marker(

              point:
                  currentPosition,

              width: 80,
              height: 80,

              child: const Icon(

                Icons.location_pin,

                size: 50,

                color: Colors.red,
              ),
            ),
          ],
        ),
      ],
    );
  }
}