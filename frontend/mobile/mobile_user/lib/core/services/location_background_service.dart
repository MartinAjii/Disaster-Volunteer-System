import 'dart:async';
import 'dart:convert';
import 'package:flutter_background_service/flutter_background_service.dart';
import 'package:flutter_background_service_android/flutter_background_service_android.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'realtime_service.dart';

Future<void> initializeBackgroundService() async {

  final service = FlutterBackgroundService();

  await service.configure(

    androidConfiguration:
        AndroidConfiguration(

      onStart: onStart,

      autoStart: false,

      isForegroundMode: true,

      foregroundServiceNotificationId: 1,

      initialNotificationTitle:
          'Disaster Volunteer',

      initialNotificationContent:
          'Lokasi sedang dibagikan',
    ),

    iosConfiguration:
      IosConfiguration(
        onForeground: onStart,
        onBackground: (_) async => true,
      ),
  );
}

Future<void> startLocationService() async {

  final service =
      FlutterBackgroundService();

  await service.startService();
}

Future<void> stopLocationService() async {

  final service =
      FlutterBackgroundService();

  service.invoke("stop");
}

@pragma('vm:entry-point')
void onStart(
  ServiceInstance service,
) {

  if (service
      is AndroidServiceInstance) {

    service.on("stop").listen(
      (event) {

        service.stopSelf();
      },
    );
  }

  Timer.periodic(

    const Duration(
      seconds: 10,
    ),

    (_) async {

      try {

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
          return;
        }

        if (permission ==
            LocationPermission.deniedForever) {
          return;
        }

        final position =
            await Geolocator
                .getCurrentPosition(
          desiredAccuracy:
              LocationAccuracy.high,
        );

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
          "Background location updated",
        );

      } catch (e) {

        print(
          "Background location error: $e",
        );
      }
    },
  );
}