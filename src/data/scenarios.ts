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
    failure_mode:
      'Pilot continues into a box canyon as lowering ceilings force the airplane below surrounding terrain.',
    ntsb_basis:
      'Represents the common VFR-into-IMC accident pattern in mountainous terrain: continued visual flight into lowering cloud bases, reduced maneuvering room, and controlled flight into terrain risk.',
    total_duration_sec: 90,
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
        time_offset_sec: 14,
        position: { lat: 38.754, lon: -106.202 },
        altitude_ft: 9800,
        weather: {
          timestamp: 90,
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
        time_offset_sec: 27,
        position: { lat: 38.676, lon: -106.302 },
        altitude_ft: 9300,
        weather: {
          timestamp: 180,
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
        time_offset_sec: 41,
        position: { lat: 38.604, lon: -106.398 },
        altitude_ft: 8900,
        weather: {
          timestamp: 270,
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
        time_offset_sec: 54,
        position: { lat: 38.548, lon: -106.502 },
        altitude_ft: 8300,
        weather: {
          timestamp: 360,
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
        time_offset_sec: 68,
        position: { lat: 38.5, lon: -106.61 },
        altitude_ft: 7800,
        weather: {
          timestamp: 450,
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
        time_offset_sec: 90,
        position: { lat: 38.47, lon: -106.79 },
        altitude_ft: 7400,
        weather: {
          timestamp: 600,
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
    failure_mode:
      'Pilot presses toward the destination as visibility drops below 3 miles instead of diverting to a closer airport still reporting VFR.',
    ntsb_basis:
      'Represents the repeated accident pattern where destination pressure and plan-continuation bias lead VFR pilots deeper into marginal weather despite usable alternates nearby.',
    total_duration_sec: 90,
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
        time_offset_sec: 15,
        position: { lat: 39.754, lon: -89.13 },
        altitude_ft: 3300,
        weather: {
          timestamp: 90,
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
        time_offset_sec: 30,
        position: { lat: 39.674, lon: -89.418 },
        altitude_ft: 3000,
        weather: {
          timestamp: 180,
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
        time_offset_sec: 45,
        position: { lat: 39.585, lon: -89.726 },
        altitude_ft: 2700,
        weather: {
          timestamp: 270,
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
        time_offset_sec: 60,
        position: { lat: 39.49, lon: -90.02 },
        altitude_ft: 2300,
        weather: {
          timestamp: 360,
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
        time_offset_sec: 75,
        position: { lat: 39.258, lon: -90.19 },
        altitude_ft: 1900,
        weather: {
          timestamp: 450,
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
        time_offset_sec: 90,
        position: { lat: 38.978, lon: -90.372 },
        altitude_ft: 1600,
        weather: {
          timestamp: 540,
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
    failure_mode:
      'Pilot waits until IMC closes both ahead and behind, leaving no practical VFR alternate as fuel planning becomes a concern.',
    ntsb_basis:
      'Represents accidents and serious incidents where pilots delay asking ATC for help during unforecast weather deterioration until options are limited by IMC and fuel.',
    total_duration_sec: 90,
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
        time_offset_sec: 13,
        position: { lat: 38.428, lon: -78.253 },
        altitude_ft: 5500,
        weather: {
          timestamp: 100,
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
        time_offset_sec: 25,
        position: { lat: 38.71, lon: -78.04 },
        altitude_ft: 5300,
        weather: {
          timestamp: 200,
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
        time_offset_sec: 38,
        position: { lat: 38.986, lon: -77.828 },
        altitude_ft: 5000,
        weather: {
          timestamp: 300,
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
        time_offset_sec: 50,
        position: { lat: 39.264, lon: -77.62 },
        altitude_ft: 4700,
        weather: {
          timestamp: 400,
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
        time_offset_sec: 63,
        position: { lat: 39.498, lon: -77.396 },
        altitude_ft: 4300,
        weather: {
          timestamp: 500,
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
        time_offset_sec: 78,
        position: { lat: 39.716, lon: -77.15 },
        altitude_ft: 3900,
        weather: {
          timestamp: 620,
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
        time_offset_sec: 90,
        position: { lat: 39.936, lon: -76.858 },
        altitude_ft: 3500,
        weather: {
          timestamp: 720,
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
]
