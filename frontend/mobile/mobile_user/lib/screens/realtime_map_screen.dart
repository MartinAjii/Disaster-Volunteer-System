import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';

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

  bool isLoading = true;

  @override
  void initState() {

    super.initState();

    initializeLocation();
  }

  Future<void> initializeLocation()
  async {

    await getCurrentLocation();
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

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();

      if (permission == LocationPermission.denied) {
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return;
    }

    Position position = await Geolocator.getCurrentPosition();

    setState(() {

      currentPosition = LatLng(
        position.latitude,
        position.longitude,
      );

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