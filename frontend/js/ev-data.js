const VME_EV_DATA = {
  issueTypes: [
    { id: 'mechanical', name: 'Mechanical Issues' },
    { id: 'electrical', name: 'Electrical Issues' }
  ],
  vehicleIssues: {
    ev_bikes: {
      mechanical: [
        ['Brake pad wear', 'Brakes are weak or making noise'],
        ['Brake failure', 'Vehicle does not stop properly'],
        ['Tyre puncture', 'Tyre loses air'],
        ['Tyre damage', 'Tyre is cut, cracked or worn'],
        ['Loose chain', 'Chain is loose or noisy'],
        ['Belt drive problem', 'Belt is worn, damaged or slipping'],
        ['Wheel bearing damage', 'Grinding noise or wheel play'],
        ['Front fork problem', 'Front suspension is stiff or leaking'],
        ['Rear suspension problem', 'Rear shock absorber is weak or damaged'],
        ['Steering problem', 'Steering is stiff or unstable'],
        ['Handlebar problem', 'Handlebar is loose or misaligned'],
        ['Loose nuts and bolts', 'Parts vibrate or rattle'],
        ['Body panel damage', 'Panels are broken or loose'],
        ['Wheel alignment problem', 'Vehicle pulls to one side'],
        ['Brake disc damage', 'Disc is warped, scored or noisy'],
        ['Stand mechanism problem', 'Side stand or centre stand does not work properly'],
        ['Seat mechanism damage', 'Seat latch or hinge is faulty']
      ],
      electrical: [
        ['Battery not charging', 'Battery does not charge'],
        ['Battery drains quickly', 'Riding range is reduced'],
        ['Battery overheating', 'Battery becomes unusually hot'],
        ['Battery swelling or damage', 'Battery appears swollen or damaged'],
        ['Electric motor failure', 'Motor does not run'],
        ['Motor controller failure', 'Motor response is irregular or absent'],
        ['Throttle failure', 'Throttle does not respond correctly'],
        ['Wiring damage', 'Exposed, damaged or broken wires'],
        ['Loose electrical connections', 'Intermittent power or electrical faults'],
        ['Dashboard/display failure', 'Display is blank or inaccurate'],
        ['Headlight failure', 'Headlight does not work'],
        ['Indicator failure', 'Turn indicators do not work'],
        ['Horn failure', 'Horn does not sound'],
        ['DC-DC converter fault', 'Low-voltage electrical systems lose power'],
        ['Charging port damage', 'Charger connector does not fit or connect'],
        ['Battery Management System (BMS) fault', 'Battery warning or protection error'],
        ['Sensor faults', 'Speed, temperature or other sensor readings are incorrect'],
        ['Keyless start/ignition failure', 'Vehicle does not unlock or start'],
        ['Battery connector fault', 'Battery power connection is intermittent'],
        ['Fuse or relay fault', 'Electrical circuits stop working'],
        ['Brake sensor fault', 'Brake signal or motor cut-off malfunctions'],
        ['Side-stand sensor fault', 'Vehicle incorrectly detects the stand position']
      ]
    },
    ev_scooters: {
      mechanical: [
        ['Brake pad wear', 'Brakes are weak or noisy'],
        ['Brake failure', 'Scooter does not stop properly'],
        ['Tyre puncture', 'Tyre loses air'],
        ['Tyre damage', 'Tyre is cracked, cut or worn'],
        ['Wheel bearing damage', 'Grinding noise or wheel play'],
        ['Front suspension problem', 'Front suspension is stiff or damaged'],
        ['Rear suspension problem', 'Rear shock absorber is damaged'],
        ['Steering problem', 'Steering is stiff or unstable'],
        ['Wheel alignment problem', 'Scooter pulls to one side'],
        ['Brake disc damage', 'Disc is warped or noisy'],
        ['Loose body panels', 'Body panels vibrate or rattle'],
        ['Stand mechanism problem', 'Side stand does not operate properly'],
        ['Seat latch problem', 'Seat does not open or lock correctly'],
        ['Wheel or hub damage', 'Wheel or motor hub is damaged']
      ],
      electrical: [
        ['Battery not charging', 'Scooter battery does not charge'],
        ['Battery drains quickly', 'Scooter range is reduced'],
        ['Battery overheating', 'Battery becomes unusually hot'],
        ['Battery swelling or damage', 'Battery appears swollen or damaged'],
        ['Hub motor failure', 'Motor does not drive the wheel'],
        ['Motor controller failure', 'Motor response is irregular'],
        ['Throttle failure', 'Throttle does not respond'],
        ['Wiring damage', 'Electrical wires are damaged'],
        ['Dashboard failure', 'Display does not work'],
        ['Charging port fault', 'Charger cannot connect'],
        ['BMS fault', 'Battery management warning appears'],
        ['DC-DC converter fault', 'Low-voltage systems lose power'],
        ['Headlight or indicator failure', 'Lights or indicators do not work'],
        ['Horn failure', 'Horn does not work'],
        ['Brake sensor fault', 'Brake signal is incorrect'],
        ['Side-stand sensor fault', 'Scooter incorrectly detects stand position'],
        ['Fuse or relay fault', 'Electrical circuit is not working'],
        ['Keyless entry fault', 'Scooter does not unlock or start'],
        ['Temperature sensor fault', 'Incorrect temperature reading']
      ]
    },
    ev_cars: {
      mechanical: [
        ['Brake pad wear', 'Brakes make noise or braking performance decreases'],
        ['Brake disc wear or damage', 'Vibration, scoring or unusual braking noise'],
        ['Tyre puncture', 'Tyre loses air'],
        ['Tyre damage', 'Cuts, cracks, bulges or excessive wear'],
        ['Uneven tyre wear', 'Tyres wear unevenly'],
        ['Suspension failure', 'Bumpy or uncomfortable ride'],
        ['Shock absorber damage', 'Excessive bouncing or fluid leakage'],
        ['Steering system problem', 'Steering feels stiff or unstable'],
        ['Wheel bearing failure', 'Grinding noise or wheel looseness'],
        ['Wheel alignment problem', 'Vehicle pulls to one side'],
        ['CV joint damage', 'Clicking noise while turning'],
        ['Drive axle damage', 'Vibration or loss of drive'],
        ['Reduction gearbox fault', 'Unusual noise from the drive unit'],
        ['Differential problem', 'Noise or vibration where a differential is fitted'],
        ['Coolant leakage', 'Coolant level drops or leakage is visible'],
        ['Cooling pump mechanical fault', 'Battery or motor cooling performance decreases'],
        ['Air-conditioning compressor mechanical fault', 'Poor cooling or abnormal noise'],
        ['Door lock mechanism failure', 'Door does not lock or unlock mechanically'],
        ['Power-window mechanism failure', 'Window becomes stuck or moves incorrectly'],
        ['Wiper mechanism failure', 'Wipers move slowly or stop'],
        ['Door hinge damage', 'Door is difficult to open or close'],
        ['Seat adjustment mechanism failure', 'Seat cannot be adjusted properly'],
        ['Suspension bush damage', 'Knocking noises over bumps'],
        ['Brake caliper problem', 'Brake drag or uneven braking'],
        ['Parking brake mechanism fault', 'Parking brake does not hold properly']
      ],
      electrical: [
        ['High-voltage battery fault', 'Battery warning or reduced vehicle performance'],
        ['Battery not charging', 'Vehicle does not accept a charge'],
        ['On-board charger failure', 'AC charging does not work'],
        ['Charging port or connector fault', 'Charging connector or port does not work'],
        ['Charging communication fault', 'Vehicle and charger fail to communicate'],
        ['Battery Management System (BMS) fault', 'Battery error or protection warning'],
        ['Traction motor failure', 'Vehicle loses drive or motor performance'],
        ['Inverter fault', 'Motor power conversion error'],
        ['Motor controller fault', 'Drive system fails or operates irregularly'],
        ['12V auxiliary battery failure', 'Vehicle electronics or startup functions fail'],
        ['DC-DC converter failure', '12V battery does not charge correctly'],
        ['Wiring harness damage', 'Electrical faults or intermittent operation'],
        ['Loose or corroded connectors', 'Intermittent electrical connections'],
        ['ABS fault', 'Anti-lock braking warning'],
        ['Electronic stability-control fault', 'Stability-control warning or malfunction'],
        ['Dashboard failure', 'Display is blank or warning messages are missing'],
        ['ECU fault', 'Electronic control system reports errors'],
        ['Communication network fault', 'Control modules fail to communicate'],
        ['Parking sensor failure', 'Parking sensors do not detect obstacles correctly'],
        ['Camera failure', 'Rear-view or surround-view camera does not work'],
        ['Air-conditioning electrical fault', 'AC controls or electrical components fail'],
        ['Temperature sensor fault', 'Incorrect battery, motor or coolant temperature readings'],
        ['Fuse or relay failure', 'One or more electrical systems stop working'],
        ['Lighting system failure', 'Headlights, brake lights or indicators fail'],
        ['Electric power steering fault', 'Steering assistance is reduced or unavailable'],
        ['Electric brake or brake-control fault', 'Brake-system warning or electronic braking malfunction'],
        ['Electric water pump fault', 'Electrically powered cooling pump stops working'],
        ['Charging cable or connector fault', 'Charging is interrupted or cannot start'],
        ['Software or firmware fault', 'System errors or unexpected electronic behaviour'],
        ['Keyless entry or immobilizer fault', 'Vehicle fails to unlock or authorize starting'],
        ['Power-window electrical fault', 'Window switches or motors do not work'],
        ['Central locking electrical fault', 'Doors do not lock or unlock electronically'],
        ['Infotainment system fault', 'Touchscreen, audio or connectivity fails'],
        ['Instrument cluster communication fault', 'Vehicle information is missing or incorrect'],
        ['Electric seat or mirror adjustment fault', 'Seat or mirror controls fail'],
        ['Wiper motor electrical fault', 'Wipers stop or operate intermittently'],
        ['Horn circuit fault', 'Horn does not work'],
        ['Thermal management control fault', 'Battery or motor temperature regulation is abnormal']
      ]
    }
  },
  serviceCategories: [
    { name: 'Emergency Service', examples: 'Vehicle breakdown; brake failure; tyre puncture; vehicle power loss; charging failure; motor failure', purpose: 'Roadside or urgent assistance' },
    { name: 'Basic Services', examples: 'Brake inspection; tyre inspection; suspension inspection; wiring inspection; battery diagnostics; sensor checks', purpose: 'Routine inspection and maintenance' },
    { name: 'Repair', examples: 'Brake, steering, suspension, bearing, gearbox, controller, charger, wiring, sensor or lighting repair', purpose: 'Diagnose and repair a confirmed fault' },
    { name: 'Replace', examples: 'Brake pads; tyres; bearings; shock absorbers; approved battery components; fuses; sensors; connectors', purpose: 'Replace worn or faulty components' },
    { name: 'Safety & Comfort', examples: 'Steering; suspension; brakes; door mechanisms; ABS; warning lights; cameras; sensors; air conditioning', purpose: 'Safety systems and comfort features' }
  ],
  reportFields: [
    ['Registration number', 'Enter the vehicle registration'],
    ['Problem description', 'Customer describes the fault'],
    ['Photo or video', 'Optional upload'],
    ['Vehicle location', 'Location permission or manually entered address'],
    ['Service request', 'Emergency Service, Basic Services, Repair or Replace'],
    ['Assigned professional', 'Suitable mechanic or EV electrician'],
    ['Request status', 'Pending, Accepted, In Progress, Completed or Cancelled']
  ],
  safetyGuidance: [
    { match: /battery.*(smok|swell|hot|overheat)|overheat.*battery/i, action: 'Stop using and charging the vehicle, keep away, and contact emergency services if there is smoke or fire.' },
    { match: /high-voltage battery|inverter/i, action: 'Assign a qualified high-voltage EV technician.' },
    { match: /charging port|charging cable|connector|wiring damage|wiring harness/i, action: 'Do not charge until inspected by a qualified technician.' },
    { match: /brake failure|electric brake/i, action: 'Do not ride or drive; arrange safe recovery.' },
    { match: /tyre damage|tyre puncture|steering/i, action: 'Stop in a safe location and arrange assistance.' },
    { match: /sensor|dashboard|warning|ECU/i, action: 'Record diagnostic codes and inspect before clearing the warning.' },
    { match: /body panel|seat|door|hinge/i, action: 'Assign an appropriately qualified mechanical technician.' }
  ],
  implementationNotes: [
    'Use consistent issue names as stable database values; display customer complaint text separately.',
    'Filter issues by vehicle type first, then Mechanical or Electrical.',
    'Map each complaint to one or more service categories and an appropriate professional specialization.',
    'Components such as chains, belts, differentials and specific sensors depend on the vehicle model.',
    'Battery, charging, motor and control-system faults may require electrical diagnostics even when described as mechanical.',
    'High-voltage systems must only be inspected or repaired by suitably trained professionals.'
  ]
};

if (typeof window !== 'undefined') {
  window.VME_EV_DATA = VME_EV_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VME_EV_DATA;
}

