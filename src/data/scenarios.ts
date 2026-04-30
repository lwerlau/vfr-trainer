import type { Scenario } from '../types/scenario'

export const scenarios: Scenario[] = [
  {
    id: 'scud-running-rising-terrain',
    title: 'Scud Running into Rising Terrain',
    aircraft: 'C172',
    departure: {
      icao: 'KAEJ',
      name: 'Central Colorado Regional Airport',
      distance_nm: 0,
      bearing: 0,
      has_ils: false,
      current_metar:
        'METAR KAEJ 281500Z 25010KT 10SM SCT080 BKN110 09/M01 A3002',
    },
    destination: {
      icao: 'KGUC',
      name: 'Gunnison-Crested Butte Regional Airport',
      distance_nm: 47,
      bearing: 238,
      has_ils: true,
      current_metar:
        'METAR KGUC 281500Z 23014KT 8SM BKN060 OVC090 07/02 A2998',
    },
    pilot_experience: 'private_vfr',
    terrain_type: 'mountains',
    lighting: 'day',
    failure_mode:
      'Pilot continues into a box canyon as lowering ceilings force the airplane below surrounding terrain.',
    ntsb_basis:
      'Represents the common VFR-into-IMC accident pattern in mountainous terrain: continued visual flight into lowering cloud bases, reduced maneuvering room, and controlled flight into terrain risk.',
    total_duration_sec: 60,
    states: [
      {
        time_offset_sec: 0,
        position: { lat: 38.814, lon: -106.12 },
        altitude_ft: 9500,
        weather: {
          timestamp: 0,
          ceiling_ft: 10000,
          visibility_sm: 10,
          wind_dir: 250,
          wind_kts: 10,
          precipitation: 'none',
          metar:
            'METAR KAEJ 281500Z 25010KT 10SM SCT080 BKN110 09/M01 A3002',
        },
        nearest_airports: [
          {
            icao: 'KANK',
            name: 'Salida Airport - Harriet Alexander Field',
            distance_nm: 13,
            bearing: 145,
            has_ils: false,
            current_metar:
              'METAR KANK 281500Z 24009KT 10SM SCT075 BKN100 10/00 A3001',
          },
          {
            icao: 'KMTJ',
            name: 'Montrose Regional Airport',
            distance_nm: 78,
            bearing: 262,
            has_ils: true,
            current_metar:
              'METAR KMTJ 281500Z 22012KT 10SM BKN070 11/03 A2997',
          },
        ],
      },
      {
        time_offset_sec: 9,
        position: { lat: 38.754, lon: -106.202 },
        altitude_ft: 9800,
        weather: {
          timestamp: 9,
          ceiling_ft: 6500,
          visibility_sm: 8,
          wind_dir: 240,
          wind_kts: 13,
          precipitation: 'none',
          metar:
            'METAR KANK 281502Z 24013KT 8SM BKN065 OVC090 09/02 A3000',
        },
        nearest_airports: [
          {
            icao: 'KANK',
            name: 'Salida Airport - Harriet Alexander Field',
            distance_nm: 8,
            bearing: 132,
            has_ils: false,
            current_metar:
              'METAR KANK 281502Z 24013KT 8SM BKN065 OVC090 09/02 A3000',
          },
          {
            icao: 'KMTJ',
            name: 'Montrose Regional Airport',
            distance_nm: 72,
            bearing: 265,
            has_ils: true,
            current_metar:
              'METAR KMTJ 281502Z 23012KT 10SM BKN070 10/04 A2997',
          },
        ],
      },
      {
        time_offset_sec: 18,
        position: { lat: 38.676, lon: -106.302 },
        altitude_ft: 9300,
        weather: {
          timestamp: 18,
          ceiling_ft: 4200,
          visibility_sm: 6,
          wind_dir: 240,
          wind_kts: 16,
          precipitation: 'mist',
          metar:
            'METAR KANK 281504Z 24016KT 6SM BR BKN042 OVC060 08/04 A2999',
        },
        nearest_airports: [
          {
            icao: 'KANK',
            name: 'Salida Airport - Harriet Alexander Field',
            distance_nm: 10,
            bearing: 82,
            has_ils: false,
            current_metar:
              'METAR KANK 281504Z 24016KT 6SM BR BKN042 OVC060 08/04 A2999',
          },
          {
            icao: 'KMTJ',
            name: 'Montrose Regional Airport',
            distance_nm: 66,
            bearing: 270,
            has_ils: true,
            current_metar:
              'METAR KMTJ 281504Z 23014KT 8SM BKN055 09/05 A2996',
          },
        ],
      },
      {
        time_offset_sec: 27,
        position: { lat: 38.604, lon: -106.398 },
        altitude_ft: 8900,
        weather: {
          timestamp: 27,
          ceiling_ft: 2800,
          visibility_sm: 5,
          wind_dir: 230,
          wind_kts: 18,
          precipitation: 'rain',
          metar:
            'METAR KANK 281506Z 23018KT 5SM -RA BR BKN028 OVC040 07/05 A2997',
        },
        nearest_airports: [
          {
            icao: 'KANK',
            name: 'Salida Airport - Harriet Alexander Field',
            distance_nm: 15,
            bearing: 70,
            has_ils: false,
            current_metar:
              'METAR KANK 281506Z 23018KT 5SM -RA BR BKN028 OVC040 07/05 A2997',
          },
          {
            icao: 'KMTJ',
            name: 'Montrose Regional Airport',
            distance_nm: 61,
            bearing: 273,
            has_ils: true,
            current_metar:
              'METAR KMTJ 281506Z 23015KT 7SM -RA BKN045 OVC070 09/05 A2995',
          },
        ],
        decision_window: {
          correct_actions: ['turn_180'],
          rationale:
            'The ceiling is still high enough and the valley wide enough for a standard-rate 180 before terrain and cloud bases remove the escape path.',
        },
      },
      {
        time_offset_sec: 36,
        position: { lat: 38.548, lon: -106.502 },
        altitude_ft: 8300,
        weather: {
          timestamp: 36,
          ceiling_ft: 1800,
          visibility_sm: 4,
          wind_dir: 230,
          wind_kts: 20,
          precipitation: 'rain',
          metar:
            'METAR KGUC 281508Z 23020KT 4SM RA BR OVC018 06/05 A2994',
        },
        nearest_airports: [
          {
            icao: 'KANK',
            name: 'Salida Airport - Harriet Alexander Field',
            distance_nm: 21,
            bearing: 73,
            has_ils: false,
            current_metar:
              'METAR KANK 281508Z 23019KT 4SM RA BR OVC020 07/06 A2996',
          },
          {
            icao: 'KMTJ',
            name: 'Montrose Regional Airport',
            distance_nm: 55,
            bearing: 275,
            has_ils: true,
            current_metar:
              'METAR KMTJ 281508Z 23017KT 6SM -RA BKN035 OVC055 08/06 A2994',
          },
        ],
      },
      {
        time_offset_sec: 45,
        position: { lat: 38.5, lon: -106.61 },
        altitude_ft: 7800,
        weather: {
          timestamp: 45,
          ceiling_ft: 450,
          visibility_sm: 1.5,
          wind_dir: 220,
          wind_kts: 22,
          precipitation: 'rain',
          metar:
            'METAR KGUC 281510Z 22022KT 1 1/2SM RA BR OVC004 05/05 A2992',
        },
        nearest_airports: [
          {
            icao: 'KANK',
            name: 'Salida Airport - Harriet Alexander Field',
            distance_nm: 28,
            bearing: 72,
            has_ils: false,
            current_metar:
              'METAR KANK 281510Z 22020KT 1 1/2SM RA BR OVC005 06/05 A2994',
          },
          {
            icao: 'KMTJ',
            name: 'Montrose Regional Airport',
            distance_nm: 49,
            bearing: 278,
            has_ils: true,
            current_metar:
              'METAR KMTJ 281510Z 23018KT 5SM -RA BR BKN028 OVC045 08/06 A2993',
          },
        ],
      },
      {
        time_offset_sec: 60,
        position: { lat: 38.47, lon: -106.79 },
        altitude_ft: 7400,
        weather: {
          timestamp: 60,
          ceiling_ft: 300,
          visibility_sm: 0.75,
          wind_dir: 220,
          wind_kts: 24,
          precipitation: 'rain',
          metar:
            'METAR KGUC 281512Z 22024KT 3/4SM RA BR OVC003 04/04 A2990',
        },
        nearest_airports: [
          {
            icao: 'KGUC',
            name: 'Gunnison-Crested Butte Regional Airport',
            distance_nm: 20,
            bearing: 245,
            has_ils: true,
            current_metar:
              'METAR KGUC 281512Z 22024KT 3/4SM RA BR OVC003 04/04 A2990',
          },
          {
            icao: 'KANK',
            name: 'Salida Airport - Harriet Alexander Field',
            distance_nm: 38,
            bearing: 69,
            has_ils: false,
            current_metar:
              'METAR KANK 281512Z 22022KT 3/4SM RA BR OVC004 05/05 A2992',
          },
        ],
      },
    ],
  },
  {
    id: 'get-there-itis-marginal-vfr',
    title: 'Get-There-itis to Marginal VFR',
    aircraft: 'C172',
    departure: {
      icao: 'KDEC',
      name: 'Decatur Airport',
      distance_nm: 0,
      bearing: 0,
      has_ils: true,
      current_metar:
        'METAR KDEC 281500Z 19008KT 10SM SCT050 17/12 A2995',
    },
    destination: {
      icao: 'KSTL',
      name: 'St. Louis Lambert International Airport',
      distance_nm: 101,
      bearing: 229,
      has_ils: true,
      current_metar:
        'METAR KSTL 281500Z 20010KT 6SM BR BKN030 18/14 A2994',
    },
    pilot_experience: 'private_vfr',
    terrain_type: 'flat',
    lighting: 'day',
    failure_mode:
      'Pilot presses toward the destination as visibility drops below 3 miles instead of diverting to a closer airport still reporting VFR.',
    ntsb_basis:
      'Represents the repeated accident pattern where destination pressure and plan-continuation bias lead VFR pilots deeper into marginal weather despite usable alternates nearby.',
    total_duration_sec: 60,
    states: [
      {
        time_offset_sec: 0,
        position: { lat: 39.834, lon: -88.865 },
        altitude_ft: 3500,
        weather: {
          timestamp: 0,
          ceiling_ft: 5000,
          visibility_sm: 10,
          wind_dir: 190,
          wind_kts: 8,
          precipitation: 'none',
          metar:
            'METAR KDEC 281500Z 19008KT 10SM SCT050 17/12 A2995',
        },
        nearest_airports: [
          {
            icao: 'KSPI',
            name: 'Abraham Lincoln Capital Airport',
            distance_nm: 36,
            bearing: 258,
            has_ils: true,
            current_metar:
              'METAR KSPI 281500Z 20009KT 10SM SCT045 18/12 A2995',
          },
          {
            icao: 'KIJX',
            name: 'Jacksonville Municipal Airport',
            distance_nm: 58,
            bearing: 263,
            has_ils: false,
            current_metar:
              'METAR KIJX 281500Z 20007KT 10SM SCT040 18/12 A2994',
          },
        ],
      },
      {
        time_offset_sec: 10,
        position: { lat: 39.754, lon: -89.13 },
        altitude_ft: 3300,
        weather: {
          timestamp: 10,
          ceiling_ft: 3500,
          visibility_sm: 6,
          wind_dir: 200,
          wind_kts: 9,
          precipitation: 'mist',
          metar:
            'METAR KSPI 281502Z 20009KT 6SM BR BKN035 18/13 A2994',
        },
        nearest_airports: [
          {
            icao: 'KSPI',
            name: 'Abraham Lincoln Capital Airport',
            distance_nm: 18,
            bearing: 265,
            has_ils: true,
            current_metar:
              'METAR KSPI 281502Z 20009KT 6SM BR BKN035 18/13 A2994',
          },
          {
            icao: 'KIJX',
            name: 'Jacksonville Municipal Airport',
            distance_nm: 41,
            bearing: 271,
            has_ils: false,
            current_metar:
              'METAR KIJX 281502Z 21007KT 10SM SCT035 18/12 A2994',
          },
        ],
      },
      {
        time_offset_sec: 20,
        position: { lat: 39.674, lon: -89.418 },
        altitude_ft: 3000,
        weather: {
          timestamp: 20,
          ceiling_ft: 2400,
          visibility_sm: 4.5,
          wind_dir: 200,
          wind_kts: 10,
          precipitation: 'mist',
          metar:
            'METAR KSPI 281504Z 20010KT 4 1/2SM BR BKN024 OVC040 17/14 A2993',
        },
        nearest_airports: [
          {
            icao: 'KSPI',
            name: 'Abraham Lincoln Capital Airport',
            distance_nm: 15,
            bearing: 35,
            has_ils: true,
            current_metar:
              'METAR KSPI 281504Z 20010KT 4 1/2SM BR BKN024 OVC040 17/14 A2993',
          },
          {
            icao: 'KIJX',
            name: 'Jacksonville Municipal Airport',
            distance_nm: 25,
            bearing: 278,
            has_ils: false,
            current_metar:
              'METAR KIJX 281504Z 21007KT 10SM SCT035 BKN050 18/12 A2994',
          },
        ],
      },
      {
        time_offset_sec: 30,
        position: { lat: 39.585, lon: -89.726 },
        altitude_ft: 2700,
        weather: {
          timestamp: 30,
          ceiling_ft: 1600,
          visibility_sm: 3.5,
          wind_dir: 210,
          wind_kts: 11,
          precipitation: 'mist',
          metar:
            'METAR KSPI 281506Z 21011KT 3 1/2SM BR BKN016 OVC028 17/15 A2992',
        },
        nearest_airports: [
          {
            icao: 'KIJX',
            name: 'Jacksonville Municipal Airport',
            distance_nm: 12,
            bearing: 282,
            has_ils: false,
            current_metar:
              'METAR KIJX 281506Z 21007KT 10SM SCT032 BKN050 18/12 A2994',
          },
          {
            icao: 'KSPI',
            name: 'Abraham Lincoln Capital Airport',
            distance_nm: 22,
            bearing: 55,
            has_ils: true,
            current_metar:
              'METAR KSPI 281506Z 21011KT 3 1/2SM BR BKN016 OVC028 17/15 A2992',
          },
        ],
        decision_window: {
          correct_actions: ['divert'],
          rationale:
            'Jacksonville is nearby and still VFR, while the route and destination trend are closing toward low MVFR and IFR.',
        },
      },
      {
        time_offset_sec: 40,
        position: { lat: 39.49, lon: -90.02 },
        altitude_ft: 2300,
        weather: {
          timestamp: 40,
          ceiling_ft: 1600,
          visibility_sm: 2.5,
          wind_dir: 210,
          wind_kts: 12,
          precipitation: 'mist',
          metar:
            'METAR KALN 281508Z 21012KT 2 1/2SM BR OVC016 17/16 A2991',
        },
        nearest_airports: [
          {
            icao: 'KIJX',
            name: 'Jacksonville Municipal Airport',
            distance_nm: 9,
            bearing: 20,
            has_ils: false,
            current_metar:
              'METAR KIJX 281508Z 21008KT 9SM SCT030 BKN045 18/13 A2993',
          },
          {
            icao: 'KALN',
            name: 'St. Louis Regional Airport',
            distance_nm: 39,
            bearing: 229,
            has_ils: true,
            current_metar:
              'METAR KALN 281508Z 21012KT 2 1/2SM BR OVC016 17/16 A2991',
          },
        ],
      },
      {
        time_offset_sec: 50,
        position: { lat: 39.258, lon: -90.19 },
        altitude_ft: 1900,
        weather: {
          timestamp: 50,
          ceiling_ft: 450,
          visibility_sm: 1.5,
          wind_dir: 210,
          wind_kts: 13,
          precipitation: 'mist',
          metar:
            'METAR KALN 281510Z 21013KT 1 1/2SM BR OVC004 17/16 A2990',
        },
        nearest_airports: [
          {
            icao: 'KALN',
            name: 'St. Louis Regional Airport',
            distance_nm: 24,
            bearing: 220,
            has_ils: true,
            current_metar:
              'METAR KALN 281510Z 21013KT 1 1/2SM BR OVC004 17/16 A2990',
          },
          {
            icao: 'KIJX',
            name: 'Jacksonville Municipal Airport',
            distance_nm: 25,
            bearing: 23,
            has_ils: false,
            current_metar:
              'METAR KIJX 281510Z 21008KT 8SM SCT028 BKN045 18/13 A2993',
          },
        ],
      },
      {
        time_offset_sec: 60,
        position: { lat: 38.978, lon: -90.372 },
        altitude_ft: 1600,
        weather: {
          timestamp: 60,
          ceiling_ft: 300,
          visibility_sm: 0.75,
          wind_dir: 220,
          wind_kts: 14,
          precipitation: 'mist',
          metar:
            'METAR KSTL 281512Z 22014KT 3/4SM BR OVC003 17/16 A2989',
        },
        nearest_airports: [
          {
            icao: 'KSTL',
            name: 'St. Louis Lambert International Airport',
            distance_nm: 16,
            bearing: 218,
            has_ils: true,
            current_metar:
              'METAR KSTL 281512Z 22014KT 3/4SM BR OVC003 17/16 A2989',
          },
          {
            icao: 'KIJX',
            name: 'Jacksonville Municipal Airport',
            distance_nm: 42,
            bearing: 32,
            has_ils: false,
            current_metar:
              'METAR KIJX 281512Z 21008KT 7SM SCT025 BKN040 18/14 A2992',
          },
        ],
      },
    ],
  },
  {
    id: 'unforecast-imc-enroute',
    title: 'Unforecast IMC En Route',
    aircraft: 'C172',
    departure: {
      icao: 'KCHO',
      name: 'Charlottesville-Albemarle Airport',
      distance_nm: 0,
      bearing: 0,
      has_ils: true,
      current_metar:
        'METAR KCHO 281500Z 22006KT 10SM FEW060 SCT120 21/10 A3006',
    },
    destination: {
      icao: 'KLNS',
      name: 'Lancaster Airport',
      distance_nm: 164,
      bearing: 39,
      has_ils: true,
      current_metar:
        'METAR KLNS 281500Z 21008KT 8SM BKN045 18/12 A3003',
    },
    pilot_experience: 'private_ifr_current',
    terrain_type: 'rolling_hills',
    lighting: 'day',
    failure_mode:
      'Pilot waits until IMC closes both ahead and behind, leaving no practical VFR alternate as fuel planning becomes a concern.',
    ntsb_basis:
      'Represents accidents and serious incidents where pilots delay asking ATC for help during unforecast weather deterioration until options are limited by IMC and fuel.',
    total_duration_sec: 60,
    states: [
      {
        time_offset_sec: 0,
        position: { lat: 38.139, lon: -78.452 },
        altitude_ft: 5500,
        weather: {
          timestamp: 0,
          ceiling_ft: 9000,
          visibility_sm: 10,
          wind_dir: 220,
          wind_kts: 6,
          precipitation: 'none',
          metar:
            'METAR KCHO 281500Z 22006KT 10SM FEW060 SCT120 21/10 A3006',
        },
        nearest_airports: [
          {
            icao: 'KCHO',
            name: 'Charlottesville-Albemarle Airport',
            distance_nm: 3,
            bearing: 190,
            has_ils: true,
            current_metar:
              'METAR KCHO 281500Z 22006KT 10SM FEW060 SCT120 21/10 A3006',
          },
          {
            icao: 'KOKV',
            name: 'Winchester Regional Airport',
            distance_nm: 66,
            bearing: 11,
            has_ils: false,
            current_metar:
              'METAR KOKV 281500Z 22006KT 10SM SCT060 BKN100 20/11 A3005',
          },
        ],
      },
      {
        time_offset_sec: 9,
        position: { lat: 38.428, lon: -78.253 },
        altitude_ft: 5500,
        weather: {
          timestamp: 9,
          ceiling_ft: 6500,
          visibility_sm: 10,
          wind_dir: 220,
          wind_kts: 8,
          precipitation: 'none',
          metar:
            'METAR KCHO 281502Z 22008KT 10SM SCT045 BKN065 20/11 A3005',
        },
        nearest_airports: [
          {
            icao: 'KCHO',
            name: 'Charlottesville-Albemarle Airport',
            distance_nm: 23,
            bearing: 207,
            has_ils: true,
            current_metar:
              'METAR KCHO 281502Z 22008KT 10SM SCT045 BKN065 20/11 A3005',
          },
          {
            icao: 'KOKV',
            name: 'Winchester Regional Airport',
            distance_nm: 45,
            bearing: 18,
            has_ils: false,
            current_metar:
              'METAR KOKV 281502Z 22007KT 9SM BKN055 19/12 A3004',
          },
        ],
      },
      {
        time_offset_sec: 17,
        position: { lat: 38.71, lon: -78.04 },
        altitude_ft: 5300,
        weather: {
          timestamp: 17,
          ceiling_ft: 4000,
          visibility_sm: 7,
          wind_dir: 220,
          wind_kts: 10,
          precipitation: 'mist',
          metar:
            'METAR KOKV 281504Z 22010KT 7SM BR BKN040 OVC060 18/13 A3003',
        },
        nearest_airports: [
          {
            icao: 'KOKV',
            name: 'Winchester Regional Airport',
            distance_nm: 27,
            bearing: 25,
            has_ils: false,
            current_metar:
              'METAR KOKV 281504Z 22010KT 7SM BR BKN040 OVC060 18/13 A3003',
          },
          {
            icao: 'KMRB',
            name: 'Eastern West Virginia Regional Airport',
            distance_nm: 49,
            bearing: 13,
            has_ils: true,
            current_metar:
              'METAR KMRB 281504Z 23009KT 6SM BR BKN035 OVC055 17/13 A3002',
          },
        ],
      },
      {
        time_offset_sec: 25,
        position: { lat: 38.986, lon: -77.828 },
        altitude_ft: 5000,
        weather: {
          timestamp: 25,
          ceiling_ft: 2500,
          visibility_sm: 5,
          wind_dir: 230,
          wind_kts: 11,
          precipitation: 'rain',
          metar:
            'METAR KOKV 281506Z 23011KT 5SM -RA BR BKN025 OVC040 17/14 A3001',
        },
        nearest_airports: [
          {
            icao: 'KOKV',
            name: 'Winchester Regional Airport',
            distance_nm: 13,
            bearing: 346,
            has_ils: false,
            current_metar:
              'METAR KOKV 281506Z 23011KT 5SM -RA BR BKN025 OVC040 17/14 A3001',
          },
          {
            icao: 'KMRB',
            name: 'Eastern West Virginia Regional Airport',
            distance_nm: 31,
            bearing: 12,
            has_ils: true,
            current_metar:
              'METAR KMRB 281506Z 23010KT 4SM -RA BR OVC018 16/14 A3000',
          },
          {
            icao: 'KFDK',
            name: 'Frederick Municipal Airport',
            distance_nm: 42,
            bearing: 31,
            has_ils: true,
            current_metar:
              'METAR KFDK 281506Z 23010KT 4SM -RA BR BKN020 OVC035 17/14 A3000',
          },
        ],
        decision_window: {
          correct_actions: ['request_popup_ifr'],
          rationale:
            'The pilot is still in VMC, is IFR-current, and nearby alternates are trending MVFR/IFR, so an early pop-up IFR request preserves ATC support and routing options.',
        },
      },
      {
        time_offset_sec: 33,
        position: { lat: 39.264, lon: -77.62 },
        altitude_ft: 4700,
        weather: {
          timestamp: 33,
          ceiling_ft: 1600,
          visibility_sm: 4,
          wind_dir: 230,
          wind_kts: 12,
          precipitation: 'rain',
          metar:
            'METAR KMRB 281508Z 23012KT 4SM -RA BR OVC016 16/15 A2999',
        },
        nearest_airports: [
          {
            icao: 'KMRB',
            name: 'Eastern West Virginia Regional Airport',
            distance_nm: 18,
            bearing: 330,
            has_ils: true,
            current_metar:
              'METAR KMRB 281508Z 23012KT 4SM -RA BR OVC016 16/15 A2999',
          },
          {
            icao: 'KOKV',
            name: 'Winchester Regional Airport',
            distance_nm: 27,
            bearing: 235,
            has_ils: false,
            current_metar:
              'METAR KOKV 281508Z 23011KT 3SM -RA BR OVC014 16/15 A3000',
          },
        ],
      },
      {
        time_offset_sec: 42,
        position: { lat: 39.498, lon: -77.396 },
        altitude_ft: 4300,
        weather: {
          timestamp: 42,
          ceiling_ft: 1600,
          visibility_sm: 2.5,
          wind_dir: 240,
          wind_kts: 12,
          precipitation: 'rain',
          metar:
            'METAR KFDK 281510Z 24012KT 2 1/2SM -RA BR OVC016 16/15 A2998',
        },
        nearest_airports: [
          {
            icao: 'KFDK',
            name: 'Frederick Municipal Airport',
            distance_nm: 12,
            bearing: 87,
            has_ils: true,
            current_metar:
              'METAR KFDK 281510Z 24012KT 2 1/2SM -RA BR OVC016 16/15 A2998',
          },
          {
            icao: 'KOKV',
            name: 'Winchester Regional Airport',
            distance_nm: 42,
            bearing: 222,
            has_ils: false,
            current_metar:
              'METAR KOKV 281510Z 24011KT 2SM -RA BR OVC015 16/15 A2999',
          },
        ],
      },
      {
        time_offset_sec: 52,
        position: { lat: 39.716, lon: -77.15 },
        altitude_ft: 3900,
        weather: {
          timestamp: 52,
          ceiling_ft: 450,
          visibility_sm: 0.75,
          wind_dir: 240,
          wind_kts: 14,
          precipitation: 'rain',
          metar:
            'METAR KHGR 281512Z 24014KT 3/4SM -RA BR OVC004 15/15 A2997',
        },
        nearest_airports: [
          {
            icao: 'KHGR',
            name: 'Hagerstown Regional Airport',
            distance_nm: 16,
            bearing: 322,
            has_ils: true,
            current_metar:
              'METAR KHGR 281512Z 24014KT 3/4SM -RA BR OVC004 15/15 A2997',
          },
          {
            icao: 'KOKV',
            name: 'Winchester Regional Airport',
            distance_nm: 58,
            bearing: 224,
            has_ils: false,
            current_metar:
              'METAR KOKV 281512Z 24012KT 3/4SM -RA BR OVC004 15/15 A2998',
          },
        ],
      },
      {
        time_offset_sec: 60,
        position: { lat: 39.936, lon: -76.858 },
        altitude_ft: 3500,
        weather: {
          timestamp: 60,
          ceiling_ft: 300,
          visibility_sm: 0.5,
          wind_dir: 250,
          wind_kts: 15,
          precipitation: 'rain',
          metar:
            'METAR KLNS 281514Z 25015KT 1/2SM -RA BR OVC003 15/15 A2996',
        },
        nearest_airports: [
          {
            icao: 'KLNS',
            name: 'Lancaster Airport',
            distance_nm: 18,
            bearing: 48,
            has_ils: true,
            current_metar:
              'METAR KLNS 281514Z 25015KT 1/2SM -RA BR OVC003 15/15 A2996',
          },
          {
            icao: 'KOKV',
            name: 'Winchester Regional Airport',
            distance_nm: 72,
            bearing: 228,
            has_ils: false,
            current_metar:
              'METAR KOKV 281514Z 25012KT 1/2SM -RA BR OVC003 15/15 A2997',
          },
        ],
      },
    ],
  },
  {
    id: 'marginal-night-vfr',
    title: 'Marginal Night VFR',
    aircraft: 'C172',
    departure: {
      icao: 'KOLM',
      name: 'Olympia Regional Airport',
      distance_nm: 0,
      bearing: 0,
      has_ils: true,
      current_metar:
        'METAR KOLM 282030Z 21008KT 8SM SCT040 BKN060 11/08 A2994',
    },
    destination: {
      icao: 'KBLI',
      name: 'Bellingham International Airport',
      distance_nm: 99,
      bearing: 9,
      has_ils: true,
      current_metar:
        'METAR KBLI 282030Z 22010KT 7SM BKN035 OVC050 10/08 A2993',
    },
    pilot_experience: 'student',
    terrain_type: 'coastal',
    lighting: 'night',
    failure_mode:
      'Pilot continues after sunset as ceilings lower, losing visual references and unable to see terrain or weather features in fading light.',
    ntsb_basis:
      'Common accident pattern where VFR student or low-time pilots continue into deteriorating night conditions. Loss of horizon and visual cues at night with low ceilings is a frequent precursor to spatial disorientation and CFIT.',
    total_duration_sec: 60,
    states: [
      {
        time_offset_sec: 0,
        position: { lat: 46.969, lon: -122.903 },
        altitude_ft: 3500,
        weather: {
          timestamp: 0,
          ceiling_ft: 6000,
          visibility_sm: 8,
          wind_dir: 210,
          wind_kts: 8,
          precipitation: 'none',
          metar:
            'METAR KOLM 282030Z 21008KT 8SM SCT040 BKN060 11/08 A2994',
        },
        nearest_airports: [
          {
            icao: 'KOLM',
            name: 'Olympia Regional Airport',
            distance_nm: 3,
            bearing: 190,
            has_ils: true,
            current_metar:
              'METAR KOLM 282030Z 21008KT 8SM SCT040 BKN060 11/08 A2994',
          },
          {
            icao: 'KTIW',
            name: 'Tacoma Narrows Airport',
            distance_nm: 23,
            bearing: 33,
            has_ils: false,
            current_metar:
              'METAR KTIW 282030Z 21007KT 8SM SCT035 BKN055 11/08 A2994',
          },
        ],
      },
      {
        time_offset_sec: 10,
        position: { lat: 47.25, lon: -122.82 },
        altitude_ft: 3400,
        weather: {
          timestamp: 10,
          ceiling_ft: 4200,
          visibility_sm: 6,
          wind_dir: 210,
          wind_kts: 10,
          precipitation: 'mist',
          metar:
            'METAR KTIW 282031Z 21010KT 6SM BR BKN035 OVC050 10/08 A2993',
        },
        nearest_airports: [
          {
            icao: 'KTIW',
            name: 'Tacoma Narrows Airport',
            distance_nm: 13,
            bearing: 78,
            has_ils: false,
            current_metar:
              'METAR KTIW 282031Z 21010KT 6SM BR BKN035 OVC050 10/08 A2993',
          },
          {
            icao: 'KPAE',
            name: 'Seattle Paine Field International Airport',
            distance_nm: 49,
            bearing: 7,
            has_ils: true,
            current_metar:
              'METAR KPAE 282031Z 21009KT 7SM BKN040 OVC060 10/08 A2992',
          },
        ],
      },
      {
        time_offset_sec: 20,
        position: { lat: 47.55, lon: -122.7 },
        altitude_ft: 3100,
        weather: {
          timestamp: 20,
          ceiling_ft: 2800,
          visibility_sm: 5,
          wind_dir: 220,
          wind_kts: 11,
          precipitation: 'rain',
          metar:
            'METAR KPAE 282032Z 22011KT 5SM -RA BR BKN028 OVC040 10/09 A2991',
        },
        nearest_airports: [
          {
            icao: 'KPAE',
            name: 'Seattle Paine Field International Airport',
            distance_nm: 22,
            bearing: 26,
            has_ils: true,
            current_metar:
              'METAR KPAE 282032Z 22011KT 5SM -RA BR BKN028 OVC040 10/09 A2991',
          },
          {
            icao: 'KTIW',
            name: 'Tacoma Narrows Airport',
            distance_nm: 31,
            bearing: 187,
            has_ils: false,
            current_metar:
              'METAR KTIW 282032Z 22010KT 6SM -RA BR BKN030 OVC045 10/09 A2992',
          },
        ],
      },
      {
        time_offset_sec: 30,
        position: { lat: 47.82, lon: -122.62 },
        altitude_ft: 2600,
        weather: {
          timestamp: 30,
          ceiling_ft: 1800,
          visibility_sm: 3.5,
          wind_dir: 220,
          wind_kts: 13,
          precipitation: 'rain',
          metar:
            'METAR KPAE 282033Z 22013KT 3 1/2SM -RA BR BKN018 OVC030 09/09 A2990',
        },
        nearest_airports: [
          {
            icao: 'KPAE',
            name: 'Seattle Paine Field International Airport',
            distance_nm: 20,
            bearing: 182,
            has_ils: true,
            current_metar:
              'METAR KPAE 282033Z 22013KT 3 1/2SM -RA BR BKN018 OVC030 09/09 A2990',
          },
          {
            icao: 'KBVS',
            name: 'Skagit Regional Airport',
            distance_nm: 28,
            bearing: 12,
            has_ils: false,
            current_metar:
              'METAR KBVS 282033Z 22010KT 5SM -RA BR BKN026 OVC040 09/08 A2991',
          },
        ],
        decision_window: {
          correct_actions: ['turn_180', 'divert'],
          rationale:
            'At night, lowering ceilings and rain remove the visual horizon quickly; a student pilot should turn back or divert while airports remain reachable in VFR or marginal VFR.',
        },
      },
      {
        time_offset_sec: 40,
        position: { lat: 48.1, lon: -122.56 },
        altitude_ft: 2200,
        weather: {
          timestamp: 40,
          ceiling_ft: 1100,
          visibility_sm: 2,
          wind_dir: 230,
          wind_kts: 14,
          precipitation: 'rain',
          metar:
            'METAR KBVS 282034Z 23014KT 2SM RA BR OVC011 08/08 A2989',
        },
        nearest_airports: [
          {
            icao: 'KBVS',
            name: 'Skagit Regional Airport',
            distance_nm: 16,
            bearing: 18,
            has_ils: false,
            current_metar:
              'METAR KBVS 282034Z 23014KT 2SM RA BR OVC011 08/08 A2989',
          },
          {
            icao: 'KPAE',
            name: 'Seattle Paine Field International Airport',
            distance_nm: 42,
            bearing: 178,
            has_ils: true,
            current_metar:
              'METAR KPAE 282034Z 23013KT 2 1/2SM RA BR OVC014 08/08 A2989',
          },
        ],
      },
      {
        time_offset_sec: 50,
        position: { lat: 48.45, lon: -122.52 },
        altitude_ft: 1800,
        weather: {
          timestamp: 50,
          ceiling_ft: 450,
          visibility_sm: 1.25,
          wind_dir: 230,
          wind_kts: 16,
          precipitation: 'rain',
          metar:
            'METAR KBLI 282035Z 23016KT 1 1/4SM RA BR OVC004 08/08 A2988',
        },
        nearest_airports: [
          {
            icao: 'KBVS',
            name: 'Skagit Regional Airport',
            distance_nm: 12,
            bearing: 170,
            has_ils: false,
            current_metar:
              'METAR KBVS 282035Z 23015KT 1 1/2SM RA BR OVC005 08/08 A2988',
          },
          {
            icao: 'KBLI',
            name: 'Bellingham International Airport',
            distance_nm: 25,
            bearing: 11,
            has_ils: true,
            current_metar:
              'METAR KBLI 282035Z 23016KT 1 1/4SM RA BR OVC004 08/08 A2988',
          },
        ],
      },
      {
        time_offset_sec: 60,
        position: { lat: 48.793, lon: -122.538 },
        altitude_ft: 1500,
        weather: {
          timestamp: 60,
          ceiling_ft: 300,
          visibility_sm: 0.75,
          wind_dir: 240,
          wind_kts: 18,
          precipitation: 'rain',
          metar:
            'METAR KBLI 282036Z 24018KT 3/4SM RA BR OVC003 08/08 A2987',
        },
        nearest_airports: [
          {
            icao: 'KBLI',
            name: 'Bellingham International Airport',
            distance_nm: 4,
            bearing: 6,
            has_ils: true,
            current_metar:
              'METAR KBLI 282036Z 24018KT 3/4SM RA BR OVC003 08/08 A2987',
          },
          {
            icao: 'KBVS',
            name: 'Skagit Regional Airport',
            distance_nm: 18,
            bearing: 182,
            has_ils: false,
            current_metar:
              'METAR KBVS 282036Z 24016KT 3/4SM RA BR OVC003 08/08 A2988',
          },
        ],
      },
    ],
  },
  {
    id: 'low-fuel-lowering-ceilings',
    title: 'Low Fuel + Lowering Ceilings',
    aircraft: 'C172',
    departure: {
      icao: 'KFLG',
      name: 'Flagstaff Pulliam Airport',
      distance_nm: 0,
      bearing: 0,
      has_ils: true,
      current_metar:
        'METAR KFLG 281800Z 22010KT 10SM SCT070 BKN100 12/M02 A3012',
    },
    destination: {
      icao: 'KPRC',
      name: 'Prescott Regional Airport',
      distance_nm: 49,
      bearing: 232,
      has_ils: true,
      current_metar:
        'METAR KPRC 281800Z 22012KT 8SM BKN060 OVC090 14/02 A3008',
    },
    pilot_experience: 'private_vfr',
    terrain_type: 'mountains',
    lighting: 'day',
    failure_mode:
      'Pilot presses toward destination with limited fuel reserves as ceilings drop, refusing to divert to a closer field because of the fuel waste, until both fuel and weather options close simultaneously.',
    ntsb_basis:
      "Combined fuel + weather pressure scenario where pilot's diminishing fuel state removes the option to wait or hold, while simultaneously deteriorating weather closes off the planned destination. Common in get-home pressure incidents.",
    total_duration_sec: 60,
    states: [
      {
        time_offset_sec: 0,
        position: { lat: 35.14, lon: -111.67 },
        altitude_ft: 7500,
        weather: {
          timestamp: 0,
          ceiling_ft: 8000,
          visibility_sm: 10,
          wind_dir: 220,
          wind_kts: 10,
          precipitation: 'none',
          metar:
            'METAR KFLG 281800Z 22010KT 10SM SCT070 BKN100 12/M02 A3012',
        },
        nearest_airports: [
          {
            icao: 'KFLG',
            name: 'Flagstaff Pulliam Airport',
            distance_nm: 4,
            bearing: 15,
            has_ils: true,
            current_metar:
              'METAR KFLG 281800Z 22010KT 10SM SCT070 BKN100 12/M02 A3012',
          },
          {
            icao: 'KSEZ',
            name: 'Sedona Airport',
            distance_nm: 22,
            bearing: 205,
            has_ils: false,
            current_metar:
              'METAR KSEZ 281800Z 21008KT 10SM SCT060 BKN090 15/00 A3010',
          },
        ],
      },
      {
        time_offset_sec: 10,
        position: { lat: 35.03, lon: -111.82 },
        altitude_ft: 7300,
        weather: {
          timestamp: 10,
          ceiling_ft: 6000,
          visibility_sm: 8,
          wind_dir: 220,
          wind_kts: 12,
          precipitation: 'none',
          metar:
            'METAR KFLG 281801Z 22012KT 8SM SCT050 BKN070 12/00 A3011',
        },
        nearest_airports: [
          {
            icao: 'KSEZ',
            name: 'Sedona Airport',
            distance_nm: 17,
            bearing: 204,
            has_ils: false,
            current_metar:
              'METAR KSEZ 281801Z 21008KT 10SM SCT055 BKN080 15/01 A3010',
          },
          {
            icao: 'KFLG',
            name: 'Flagstaff Pulliam Airport',
            distance_nm: 13,
            bearing: 31,
            has_ils: true,
            current_metar:
              'METAR KFLG 281801Z 22012KT 8SM SCT050 BKN070 12/00 A3011',
          },
        ],
      },
      {
        time_offset_sec: 20,
        position: { lat: 34.92, lon: -111.99 },
        altitude_ft: 7000,
        weather: {
          timestamp: 20,
          ceiling_ft: 4500,
          visibility_sm: 6,
          wind_dir: 230,
          wind_kts: 13,
          precipitation: 'mist',
          metar:
            'METAR KSEZ 281802Z 23013KT 6SM BR BKN045 OVC065 14/04 A3009',
        },
        nearest_airports: [
          {
            icao: 'KSEZ',
            name: 'Sedona Airport',
            distance_nm: 11,
            bearing: 180,
            has_ils: false,
            current_metar:
              'METAR KSEZ 281802Z 23009KT 9SM SCT050 BKN070 15/03 A3009',
          },
          {
            icao: 'KPAN',
            name: 'Payson Airport',
            distance_nm: 43,
            bearing: 139,
            has_ils: false,
            current_metar:
              'METAR KPAN 281802Z 22008KT 10SM SCT060 BKN085 14/01 A3011',
          },
        ],
      },
      {
        time_offset_sec: 30,
        position: { lat: 34.82, lon: -112.14 },
        altitude_ft: 6700,
        weather: {
          timestamp: 30,
          ceiling_ft: 2800,
          visibility_sm: 5,
          wind_dir: 230,
          wind_kts: 15,
          precipitation: 'mist',
          metar:
            'METAR KSEZ 281803Z 23015KT 5SM BR BKN028 OVC045 13/06 A3008',
        },
        nearest_airports: [
          {
            icao: 'KSEZ',
            name: 'Sedona Airport',
            distance_nm: 16,
            bearing: 58,
            has_ils: false,
            current_metar:
              'METAR KSEZ 281803Z 22009KT 8SM SCT045 BKN065 15/04 A3009',
          },
          {
            icao: 'KPRC',
            name: 'Prescott Regional Airport',
            distance_nm: 27,
            bearing: 235,
            has_ils: true,
            current_metar:
              'METAR KPRC 281803Z 23015KT 5SM BR BKN028 OVC045 13/06 A3008',
          },
        ],
        decision_window: {
          correct_actions: ['divert'],
          rationale:
            'Sedona is still VFR and close enough to preserve fuel reserves; pressing on trades the last good alternate for a destination that is trending down.',
        },
      },
      {
        time_offset_sec: 40,
        position: { lat: 34.74, lon: -112.26 },
        altitude_ft: 6400,
        weather: {
          timestamp: 40,
          ceiling_ft: 1800,
          visibility_sm: 3,
          wind_dir: 240,
          wind_kts: 16,
          precipitation: 'mist',
          metar:
            'METAR KPRC 281804Z 24016KT 3SM BR BKN018 OVC032 12/08 A3007',
        },
        nearest_airports: [
          {
            icao: 'KPRC',
            name: 'Prescott Regional Airport',
            distance_nm: 18,
            bearing: 240,
            has_ils: true,
            current_metar:
              'METAR KPRC 281804Z 24016KT 3SM BR BKN018 OVC032 12/08 A3007',
          },
          {
            icao: 'KSEZ',
            name: 'Sedona Airport',
            distance_nm: 28,
            bearing: 54,
            has_ils: false,
            current_metar:
              'METAR KSEZ 281804Z 22008KT 7SM SCT040 BKN060 14/05 A3008',
          },
        ],
      },
      {
        time_offset_sec: 50,
        position: { lat: 34.69, lon: -112.35 },
        altitude_ft: 6200,
        weather: {
          timestamp: 50,
          ceiling_ft: 700,
          visibility_sm: 1.5,
          wind_dir: 250,
          wind_kts: 17,
          precipitation: 'mist',
          metar:
            'METAR KPRC 281805Z 25017KT 1 1/2SM BR OVC007 11/09 A3006',
        },
        nearest_airports: [
          {
            icao: 'KPRC',
            name: 'Prescott Regional Airport',
            distance_nm: 9,
            bearing: 248,
            has_ils: true,
            current_metar:
              'METAR KPRC 281805Z 25017KT 1 1/2SM BR OVC007 11/09 A3006',
          },
          {
            icao: 'KSEZ',
            name: 'Sedona Airport',
            distance_nm: 36,
            bearing: 57,
            has_ils: false,
            current_metar:
              'METAR KSEZ 281805Z 23009KT 6SM SCT035 BKN055 14/06 A3007',
          },
        ],
      },
      {
        time_offset_sec: 60,
        position: { lat: 34.654, lon: -112.419 },
        altitude_ft: 6000,
        weather: {
          timestamp: 60,
          ceiling_ft: 400,
          visibility_sm: 0.75,
          wind_dir: 250,
          wind_kts: 18,
          precipitation: 'mist',
          metar:
            'METAR KPRC 281806Z 25018KT 3/4SM BR OVC004 11/10 A3005',
        },
        nearest_airports: [
          {
            icao: 'KPRC',
            name: 'Prescott Regional Airport',
            distance_nm: 3,
            bearing: 260,
            has_ils: true,
            current_metar:
              'METAR KPRC 281806Z 25018KT 3/4SM BR OVC004 11/10 A3005',
          },
          {
            icao: 'KSEZ',
            name: 'Sedona Airport',
            distance_nm: 42,
            bearing: 58,
            has_ils: false,
            current_metar:
              'METAR KSEZ 281806Z 24010KT 5SM BR SCT030 BKN050 13/07 A3006',
          },
        ],
      },
    ],
  },
]
