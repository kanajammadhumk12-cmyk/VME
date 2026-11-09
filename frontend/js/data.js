/**
 * VME - Vehicle Mechanic Electrician
 * Comprehensive Master Dataset
 */

const VME_DATA = {
  // Vehicle Types
  vehicleTypes: [
    { id: 'bikes', name: 'Bikes (ICE — Petrol/Diesel)', icon: '🏍️', desc: 'Petrol and diesel motorcycles' },
    { id: 'scooters', name: 'Scooters (ICE — Petrol)', icon: '🛵', desc: 'Petrol scooters' },
    { id: 'cars', name: 'Cars (Hatchback/Sedan)', icon: '🚗', desc: 'Hatchbacks and sedans' },
    { id: 'suvs_mpvs', name: 'SUVs & MPVs', icon: '🚙', desc: 'SUVs and MPVs' },
    { id: 'ev_bikes', name: 'EV Bikes (Electric)', icon: '⚡🏍️', desc: 'Electric motorcycles' },
    { id: 'ev_scooters', name: 'EV Scooters (Electric)', icon: '⚡🛵', desc: 'Electric scooters' },
    { id: 'ev_cars', name: 'EV Cars (Electric)', icon: '⚡🚙', desc: 'Electric cars and SUVs' },
    { id: 'commercial', name: 'Commercial Vehicles (LCV/HCV/Multi-Utility)', icon: '🚛', desc: 'LCV, HCV and multi-utility vehicles' }
  ],

  // Brands and their Models mapped by Vehicle Type
  // Structure: typeId -> brandName -> Array of Models
  catalog: {
    bikes: {
      TVS: ['Apache', 'Raider', 'Ronin', 'Radeon', 'Sport'],
      Hero: ['Splendor Plus', 'HF Deluxe', 'Glamour', 'Xtreme', 'Karizma'],
      Honda: ['Shine', 'SP 125', 'Unicorn', 'Hornet', 'CB200X'],
      Yamaha: ['R15', 'MT-15', 'FZ', 'R3', 'XSR'],
      Bajaj: ['Pulsar', 'Platina', 'CT', 'Dominar', 'Avenger'],
      'Royal Enfield': ['Classic 350', 'Bullet 350', 'Hunter 350', 'Meteor 350', 'Himalayan'],
      Suzuki: ['Gixxer', 'Gixxer SF', 'V-Strom'],
      KTM: ['Duke', 'RC', 'Adventure'],
      Jawa: ['42', 'Classic', 'Perak'],
      Yezdi: ['Roadster', 'Scrambler', 'Adventure']
    },
    scooters: {
      TVS: ['Jupiter', 'NTORQ', 'Zest', 'Scooty Pep+'],
      Hero: ['Pleasure+', 'Destini', 'Xoom'],
      Honda: ['Activa', 'Dio', 'Activa 125'],
      Suzuki: ['Access', 'Burgman Street', 'Avenis'],
      Yamaha: ['Fascino', 'RayZR', 'Aerox']
    },
    cars: {
      'Maruti Suzuki': ['Alto K10', 'S-Presso', 'Celerio', 'WagonR', 'Swift', 'Dzire', 'Baleno', 'Fronx'],
      Hyundai: ['Grand i10 Nios', 'i20', 'Aura', 'Exter'],
      'Tata Motors': ['Tiago', 'Tigor', 'Altroz'],
      Honda: ['Amaze', 'City'],
      Toyota: ['Glanza'],
      Renault: ['Kwid'],
      Nissan: ['Magnite'],
      Volkswagen: ['Virtus'],
      Skoda: ['Slavia'],
      Citroën: ['C3']
    },
    suvs_mpvs: {
      'Maruti Suzuki': ['Brezza', 'Fronx', 'Grand Vitara', 'Jimny', 'Ertiga', 'XL6', 'Invicto'],
      Hyundai: ['Venue', 'Creta', 'Alcazar', 'Tucson'],
      'Tata Motors': ['Punch', 'Nexon', 'Harrier', 'Safari', 'Curvv'],
      Mahindra: ['XUV 3XO', 'Bolero', 'Bolero Neo', 'Thar', 'Thar Roxx', 'Scorpio Classic', 'Scorpio-N', 'XUV700'],
      Toyota: ['Urban Cruiser Taisor', 'Urban Cruiser Hyryder', 'Rumion', 'Innova Crysta', 'Innova Hycross', 'Fortuner', 'Hilux'],
      Kia: ['Sonet', 'Seltos', 'Carens', 'Carnival'],
      Honda: ['Elevate'],
      Renault: ['Triber', 'Kiger'],
      Nissan: ['Magnite', 'X-Trail'],
      'MG Motor': ['Astor', 'Hector', 'Hector Plus', 'Gloster', 'Windsor EV', 'ZS EV'],
      Citroën: ['C3 Aircross', 'Basalt'],
      Jeep: ['Compass', 'Meridian']
    },
    ev_bikes: {
      'Revolt Motors': ['RV1', 'RV1+', 'RV400'],
      'Oben Electric': ['Rorr', 'Rorr EZ'],
      'Tork Motors': ['Kratos R'],
      Ultraviolette: ['F77', 'F77 Mach 2', 'F77 SuperStreet'],
      Matter: ['AERA'],
      'Kabira Mobility': ['KM3000', 'KM4000'],
      'Hop Electric': ['OXO'],
      Komaki: ['Ranger', 'MX3'],
      'PURE EV': ['eTryst X', 'EcoDryft'],
      'Odysse Electric': ['EVOQIS']
    },
    ev_scooters: {
      TVS: ['iQube', 'iQube S', 'iQube ST'],
      Bajaj: ['Chetak', 'Chetak Premium', 'Chetak Urbane'],
      'Ola Electric': ['S1 X', 'S1 X+', 'S1 Air', 'S1 Pro', 'S1 Pro+'],
      Ather: ['Rizta', '450S', '450X', '450 Apex'],
      'Hero Vida': ['V1', 'V2', 'VX2'],
      Ampere: ['Magnus', 'Nexus', 'Primus'],
      River: ['Indie'],
      'Simple Energy': ['One', 'OneS'],
      'Kinetic Green': ['E-Luna', 'Zing', 'Flex'],
      'Okaya EV': ['Faast', 'ClassIQ', 'Motofaast'],
      Okinawa: ['PraisePro', 'Ridge+', 'iPraise+'],
      BGauss: ['RUV 350', 'C12i', 'A2']
    },
    ev_cars: {
      'Tata Motors': ['Tiago EV', 'Tigor EV', 'Punch EV', 'Nexon EV', 'Curvv EV', 'Harrier EV'],
      Mahindra: ['XUV400 EV', 'BE 6', 'XEV 9e'],
      'MG Motor': ['Comet EV', 'Windsor EV', 'ZS EV'],
      Citroën: ['ë-C3'],
      Hyundai: ['Creta Electric', 'Ioniq 5'],
      Kia: ['EV6', 'EV9', 'Carens Clavis EV'],
      'Maruti Suzuki': ['e Vitara'],
      BYD: ['Atto 3', 'eMAX 7', 'Seal', 'Sealion 7'],
      VinFast: ['VF 6', 'VF 7']
    },
    commercial: {
      'Tata Motors': ['Ace', 'Intra', 'Yodha', 'Winger', 'Magic', '407', '709', '1109', '1512', '1612', '2518', 'Signa', 'Prima', 'Starbus', 'Ultra'],
      'Ashok Leyland': ['DOST', 'BADA DOST', 'Partner', 'BOSS', 'Ecomet', 'AVTR', 'U-Truck', 'MiTR', 'Oyster'],
      Mahindra: ['Jeeto', 'Supro', 'Bolero Pik-Up', 'Veero', 'Furio', 'Blazo X', 'Loadking'],
      Eicher: ['Pro 2049', 'Pro 2059', 'Pro 2095', 'Pro 3015', 'Pro 6028', 'Pro 8035', 'Skyline Pro'],
      'Force Motors': ['Traveller', 'Trax Cruiser', 'Urbania', 'Citiline'],
      'SML Isuzu': ['S7', 'S9', 'Prestige', 'Samrat', 'Executive LX'],
      BharatBenz: ['914R', '1017R', '1217C', '1617R', '1923C', '2823C', '3528C', '5032T'],
      'VE Commercial Vehicles': ['Volvo FM', 'Volvo FH', 'Eicher Pro series'],
      'Maruti Suzuki': ['Super Carry', 'Eeco Cargo'],
      Piaggio: ['Ape Xtra', 'Ape City', 'Porter 700'],
      'Mahindra Last Mile Mobility': ['Treo', 'Treo Zor', 'Zor Grand', 'e-Alfa'],
      'Tata Motors Electric Mobility': ['Ace EV', 'Starbus EV']
    }
  },

  // The 5 Service Categories
  categories: [
    {
      id: 'emergency',
      name: 'Emergency Service',
      badge: 'Roadside Assistance',
      icon: '🚨',
      desc: 'Breakdowns, roadside assistance, towing, and vehicle recovery'
    },
    {
      id: 'basic',
      name: 'Basic Services',
      badge: 'Routine Maintenance',
      icon: '🛢️',
      desc: 'Routine maintenance for ICE and electric vehicles'
    },
    {
      id: 'repair',
      name: 'Repair',
      badge: 'Mechanical, Electrical & Diagnostic',
      icon: '🔧',
      desc: 'Mechanical, electrical, and vehicle diagnostic work'
    },
    {
      id: 'replace',
      name: 'Replace',
      badge: 'Parts quoted separately',
      icon: '⚙️',
      desc: 'Replacement parts are quoted separately for customer approval'
    },
    {
      id: 'safety_comfort',
      name: 'Safety & Comfort',
      badge: 'Safety & Comfort',
      icon: '❄️',
      desc: 'Driving safety, comfort, cabin, and bodywork services'
    }
  ],

  serviceTasks: {
    emergency: [
      { id: 'em_start', name: "Vehicle won't start", types: ['all'] },
      { id: 'em_battery', name: 'Dead battery / jump-start', types: ['all'] },
      { id: 'em_tyre', name: 'Flat tyre / puncture', types: ['all'] },
      { id: 'em_fuel', name: 'Fuel shortage (for non-EV vehicles)', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'em_ev_charge', name: 'EV out of charge (roadside charging)', types: ['ev_bikes', 'ev_scooters', 'ev_cars'] },
      { id: 'em_overheat', name: 'Engine overheating', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'em_brakes', name: 'Brake failure', types: ['all'] },
      { id: 'em_clutch', name: 'Clutch failure', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'em_wiring', name: 'Electrical wiring failure', types: ['all'] },
      { id: 'em_starter', name: 'Starter motor failure', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'em_alternator', name: 'Alternator / dynamo failure', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'em_recovery', name: 'Accident / vehicle recovery', types: ['all'] },
      { id: 'em_lock', name: 'Vehicle locked / key problem', types: ['all'] },
      { id: 'em_towing', name: 'Towing service', types: ['all'] }
    ],
    basic: [
      { id: 'bs_general', name: 'General vehicle servicing', types: ['all'] },
      { id: 'bs_oil_filter', name: 'Engine oil and filter change (ICE vehicles)', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'bs_air_filter', name: 'Air filter cleaning / replacement', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'bs_brakes', name: 'Brake inspection and adjustment', types: ['all'] },
      { id: 'bs_tyres', name: 'Tyre pressure and wheel alignment', types: ['all'] },
      { id: 'bs_wheel_balance', name: 'Wheel balancing', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'bs_chain', name: 'Chain cleaning and lubrication (bikes)', types: ['bikes', 'ev_bikes'] },
      { id: 'bs_coolant', name: 'Coolant inspection and refill', types: ['cars', 'suvs_mpvs', 'commercial', 'ev_cars'] },
      { id: 'bs_12v', name: 'Battery health check (12V)', types: ['all'] },
      { id: 'bs_spark', name: 'Spark plug inspection (ICE)', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'bs_ac', name: 'AC inspection and cleaning', types: ['cars', 'suvs_mpvs', 'commercial', 'ev_cars'] },
      { id: 'bs_electrical', name: 'General electrical inspection', types: ['all'] },
      { id: 'bs_ev_system', name: 'EV battery and charging system check', types: ['ev_bikes', 'ev_scooters', 'ev_cars'] },
      { id: 'bs_wash', name: 'Vehicle washing and polishing', types: ['all'] }
    ],
    repair: [
      { id: 'rp_engine', name: 'Engine noise / low performance', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rp_gears', name: 'Gear shifting problem', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rp_clutch', name: 'Clutch slipping', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rp_brake_noise', name: 'Brake noise or vibration', types: ['all'] },
      { id: 'rp_suspension', name: 'Suspension noise', types: ['all'] },
      { id: 'rp_steering', name: 'Steering problem', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rp_coolant', name: 'Radiator / coolant leakage', types: ['cars', 'suvs_mpvs', 'commercial', 'ev_cars'] },
      { id: 'rp_fuel_ev_power', name: 'Fuel injection / EV power delivery issue', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial', 'ev_bikes', 'ev_scooters', 'ev_cars'] },
      { id: 'rp_sensor', name: 'Sensor fault / warning light', types: ['all'] },
      { id: 'rp_wiring', name: 'Wiring short circuit', types: ['all'] },
      { id: 'rp_starter', name: 'Starter motor repair', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rp_alternator', name: 'Alternator / dynamo repair', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rp_ecu', name: 'ECU / control module diagnosis', types: ['all'] },
      { id: 'rp_ac', name: 'AC cooling problem', types: ['cars', 'suvs_mpvs', 'commercial', 'ev_cars'] },
      { id: 'rp_windows', name: 'Power window / central locking problem', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rp_ev_charger', name: 'EV charging port / onboard charger diagnosis', types: ['ev_bikes', 'ev_scooters', 'ev_cars'] },
      { id: 'rp_ev_motor', name: 'EV motor / controller diagnosis', types: ['ev_bikes', 'ev_scooters', 'ev_cars'] }
    ],
    replace: [
      { id: 'rc_oil_filter', name: 'Engine oil / filters (ICE vehicles)', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rc_battery', name: 'Battery (12V or EV battery components)', types: ['all'] },
      { id: 'rc_tyres', name: 'Tyres / tubes', types: ['all'] },
      { id: 'rc_brakes', name: 'Brake pads / brake shoes', types: ['all'] },
      { id: 'rc_clutch', name: 'Clutch plates', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rc_chain', name: 'Chain and sprocket (bikes)', types: ['bikes', 'ev_bikes'] },
      { id: 'rc_spark', name: 'Spark plugs (ICE)', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rc_coolant', name: 'Coolant', types: ['cars', 'suvs_mpvs', 'commercial', 'ev_cars'] },
      { id: 'rc_belts', name: 'Belts / hoses', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rc_suspension', name: 'Suspension components', types: ['all'] },
      { id: 'rc_starter', name: 'Starter motor', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rc_alternator', name: 'Alternator / dynamo', types: ['bikes', 'scooters', 'cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rc_wiring', name: 'Damaged wiring / fuses', types: ['all'] },
      { id: 'rc_sensors', name: 'Sensors', types: ['all'] },
      { id: 'rc_lights', name: 'Headlights / tail lights', types: ['all'] },
      { id: 'rc_wipers', name: 'Wiper blades', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rc_radiator', name: 'Radiator', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'rc_ac', name: 'AC compressor', types: ['cars', 'suvs_mpvs', 'commercial', 'ev_cars'] },
      { id: 'rc_ev_battery', name: 'EV battery components (as per OEM)', types: ['ev_bikes', 'ev_scooters', 'ev_cars'] }
    ],
    safety_comfort: [
      { id: 'sc_airbag', name: 'Airbag warning diagnosis', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'sc_seatbelt', name: 'Seat belt inspection / replacement', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'sc_abs', name: 'ABS / EBD warning diagnosis', types: ['all'] },
      { id: 'sc_safety', name: 'Tyre and brake safety inspection', types: ['all'] },
      { id: 'sc_parking', name: 'Parking sensor / reverse camera', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'sc_tpms', name: 'TPMS (tyre pressure sensors)', types: ['all'] },
      { id: 'sc_lights', name: 'Headlight alignment and lighting upgrades', types: ['all'] },
      { id: 'sc_seats', name: 'Seat covers and seat replacement', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'sc_upholstery', name: 'Seat upholstery / leather finishing', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'sc_trim', name: 'Dashboard and interior trim repairs', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'sc_cabin', name: 'Cabin air filter / AC service', types: ['cars', 'suvs_mpvs', 'commercial', 'ev_cars'] },
      { id: 'sc_windows', name: 'Power window and door locks', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'sc_infotainment', name: 'Infotainment / speakers', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'sc_mats', name: 'Car mats and floor protection', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'sc_dent_paint', name: 'Denting and painting', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'sc_glass', name: 'Windshield / glass replacement', types: ['cars', 'suvs_mpvs', 'commercial'] },
      { id: 'sc_bike_comfort', name: 'Bike seat comfort and handlebar adjustments', types: ['bikes', 'ev_bikes'] },
      { id: 'sc_ev_connector', name: 'EV charging cable and connector safety check', types: ['ev_bikes', 'ev_scooters', 'ev_cars'] }
    ]
  },

  // Technicians (Mechanics & Electricians) with live coordinates for real-time in-app simulation
  technicians: [
    {
      id: 'TECH-101',
      name: 'Rajesh Sharma',
      role: 'mechanic',
      rating: 4.9,
      reviewsCount: 312,
      experience: '9 Years',
      workshop: 'Sharma Auto & Multi-Brand Garage',
      phone: '+91 98452 11029',
      avatar: '👨‍🔧',
      specializations: ['Bikes', 'Cars', 'Commercial Vehicles', 'Engine & Clutch Specialist'],
      distanceKm: 1.8,
      etaMins: 7,
      lat: 12.9716,
      lng: 77.5946,
      status: 'Available',
      serviceLimit: '15 km radius'
    },
    {
      id: 'TECH-102',
      name: 'Vikas Sundaram',
      role: 'electrician',
      rating: 4.95,
      reviewsCount: 268,
      experience: '7 Years',
      workshop: 'Vikas Volt EV & Auto Electricals',
      phone: '+91 97410 44821',
      avatar: '⚡👨‍💻',
      specializations: ['EV Cars & SUVs', 'EV Scooters', 'Battery Pack BMS', 'Wiring & ECU Diagnostics'],
      distanceKm: 2.3,
      etaMins: 9,
      lat: 12.9782,
      lng: 77.6021,
      status: 'Available',
      serviceLimit: '20 km radius'
    },
    {
      id: 'TECH-103',
      name: 'Imran Khan',
      role: 'mechanic',
      rating: 4.8,
      reviewsCount: 194,
      experience: '12 Years',
      workshop: 'Apex Motor Works',
      phone: '+91 99001 88342',
      avatar: '🔧👨‍🔧',
      specializations: ['Cars', 'SUVs', 'Brake Systems', 'Suspension Overhaul'],
      distanceKm: 3.1,
      etaMins: 12,
      lat: 12.9654,
      lng: 77.5891,
      status: 'On Call',
      serviceLimit: '12 km radius'
    },
    {
      id: 'TECH-104',
      name: 'Pooja Patil',
      role: 'electrician',
      rating: 4.92,
      reviewsCount: 215,
      experience: '6 Years',
      workshop: 'ElectroDrive Green Mobility Lab',
      phone: '+91 98865 32910',
      avatar: '⚡👩‍🔧',
      specializations: ['EV Bikes', 'EV Scooters', 'High-Voltage Inverters', 'Sensors & CAN-Bus'],
      distanceKm: 2.9,
      etaMins: 11,
      lat: 12.9825,
      lng: 77.5843,
      status: 'Available',
      serviceLimit: '18 km radius'
    }
  ],

  offers: [],

  // Real Customer Reviews
  reviews: [
    {
      id: 'REV-1',
      author: 'Arjun Nambiar',
      vehicle: 'Royal Enfield Classic 350',
      techName: 'Rajesh Sharma (Mechanic)',
      rating: 5,
      date: '2 days ago',
      comment: 'My clutch cable snapped right in the middle of evening traffic on Outer Ring Road. Booked Rajesh through VME app, he reached within 12 minutes, carried the exact cable, and had me back on the road in 15 mins! The in-app call and live map location tracking were super precise.',
      verified: true
    },
    {
      id: 'REV-2',
      author: 'Sneha Deshmukh',
      vehicle: 'Tata Motors Nexon EV',
      techName: 'Vikas Sundaram (Electrician)',
      rating: 5,
      date: '1 week ago',
      comment: 'The charging gun got mechanically jammed in the CCS2 port and wouldn\'t release. Vikas arrived with specialized diagnostic tools, safely cleared the actuator lock without voiding my warranty, and gave great battery maintenance tips. Fantastic electrician support!',
      verified: true
    },
    {
      id: 'REV-3',
      author: 'Karthik Subramanian',
      vehicle: 'Hyundai Creta 1.5 Diesel',
      techName: 'Imran Khan (Mechanic)',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Scheduled a front brake pad change and synthetic oil service at my home doorstep. Clean, professional work, showed me the old parts before replacement, and cost was 40% cheaper than authorized showroom quotation.',
      verified: true
    },
    {
      id: 'REV-4',
      author: 'Gurpreet Singh',
      vehicle: 'Tata 407 Gold Commercial Truck',
      techName: 'Rajesh Sharma (Mechanic)',
      rating: 5,
      date: '1 month ago',
      comment: 'Our delivery truck had an air brake valve failure near the toll plaza. VME emergency response saved our delivery schedule. Mechanic knew commercial truck systems inside out.',
      verified: true
    }
  ],

  // FAQs
  faqs: [
    {
      q: 'How does VME guarantee verified mechanics and electricians?',
      a: 'All technicians on VME undergo rigorous government ID verification, workshop/garage physical checks, trade certificates validation, and police background clearance before onboarding.'
    },
    {
      q: 'Can I call and chat with the mechanic directly inside this app?',
      a: 'Yes! VME features native built-in VoIP calling and real-time chat with live location sharing. You do not need to switch to any external phone dialer or third-party messaging apps.'
    },
    {
      q: 'How does the mechanic find my exact breakdown location?',
      a: 'When you grant in-app location permission, your exact GPS coordinates and landmark are displayed on the mechanic\'s live radar map directly within the app, showing real-time ETA and route guidance.'
    },
    {
      q: 'What payment modes are accepted on VME?',
      a: 'You can pay using UPI (Google Pay, PhonePe, Paytm, BHIM), Debit Cards, Credit Cards, Net Banking, or Cash on Request (pay directly after the service is completed to your satisfaction).'
    },
    {
      q: 'Are parts replaced covered under warranty?',
      a: 'Yes, all batteries, brake components, spark plugs, filters, and spare parts supplied via VME carry manufacturer warranties ranging from 6 months to 36 months with digital invoices.'
    }
  ]
};
