import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/services/realtime_service.dart';

class MapScreen extends StatefulWidget {

  const MapScreen({super.key});

  @override
  State<MapScreen> createState() =>
      _MapScreenState();
}

class _MapScreenState
    extends State<MapScreen> {

  LatLng currentPosition =
      const LatLng(
        -7.7956,
        110.3695,
      );

  StreamSubscription<Position>?
      positionStream;

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

    if (userString == null) return;

    final user =
        jsonDecode(userString);

    final volunteerId =
        user["id"];

    positionStream =
        Geolocator
            .getPositionStream(

      locationSettings:
          const LocationSettings(

        accuracy:
            LocationAccuracy.high,

        distanceFilter: 10,
      ),
    ).listen(

      (Position position)
      async {

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
      },
    );
  }

  @override
  void dispose() {

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
              'com.example.app',
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