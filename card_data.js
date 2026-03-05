// Auto-generated card data — 972 cards from TM source
// Generated: 2026-03-05T20:21:03.642Z
const CARD_DATA = {
  "Bioengineering Enclosure": {
    "name": "Bioengineering Enclosure",
    "type": "active",
    "cost": 7,
    "tags": [
      "animal"
    ],
    "requirements": {
      "tag": "science"
    },
    "behavior": {
      "addResources": 2
    },
    "resourceType": "Animal",
    "cardNumber": "A01",
    "description": "Requires 1 science tag to play. Add 2 animals to this card. OTHERS MAY NOT REMOVE ANIMALS FROM THIS CARD.",
    "expansion": "ares"
  },
  "Bio-Fertilizer Facility": {
    "name": "Bio-Fertilizer Facility",
    "type": "automated",
    "cost": 12,
    "tags": [
      "microbe",
      "building"
    ],
    "requirements": {
      "tag": "science"
    },
    "behavior": {
      "production": {
        "plants": 1
      },
      "city": true
    },
    "cardNumber": "A02",
    "description": "Requires 1 science tag. Increase your plant production 1 step. ",
    "expansion": "ares"
  },
  "Butterfly Effect": {
    "name": "Butterfly Effect",
    "type": "event",
    "cost": 8,
    "behavior": {
      "tr": 1
    },
    "cardNumber": "A03",
    "description": "Gain 1 TR. Move each hazard marker up to 1 step up or down along its terraforming track.",
    "expansion": "ares"
  },
  "Desperate Measures": {
    "name": "Desperate Measures",
    "type": "event",
    "cost": 1,
    "vp": {
      "type": "static",
      "vp": -2
    },
    "cardNumber": "A04",
    "description": "Place a bronze cube on a dust storm tile and raise oxygen 1 step, or place a bronze cube on an erosion tile and raise the temperature 1 step. The hazard tile with the bronze cube cannot be removed.",
    "expansion": "ares"
  },
  "Ecological Survey": {
    "name": "Ecological Survey",
    "type": "active",
    "cost": 9,
    "tags": [
      "science"
    ],
    "requirements": {
      "greeneries": 3
    },
    "cardNumber": "A07",
    "description": "Requires 3 greeneries on Mars.",
    "expansion": "ares"
  },
  "Geological Survey": {
    "name": "Geological Survey",
    "type": "active",
    "cost": 8,
    "tags": [
      "science"
    ],
    "requirements": {
      "greeneries": 5
    },
    "cardNumber": "A09",
    "description": "Requires 5 or fewer greeneries on Mars.",
    "expansion": "ares"
  },
  "Marketing Experts": {
    "name": "Marketing Experts",
    "type": "active",
    "cost": 5,
    "tags": [
      "earth"
    ],
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "A12",
    "description": "Increase your M€ production 1 step.",
    "expansion": "ares"
  },
  "Metallic Asteroid": {
    "name": "Metallic Asteroid",
    "type": "event",
    "cost": 13,
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "titanium": 1
      },
      "global": {
        "temperature": 1
      },
      "city": true,
      "removeAnyPlants": 4
    },
    "cardNumber": "A13",
    "description": "Raise temperature 1 step and gain 1 titanium. Remove up to 4 plants from any player. Place this tile which grants an ADJACENCY BONUS of 1 titanium.",
    "expansion": "ares"
  },
  "Ocean City": {
    "name": "Ocean City",
    "type": "automated",
    "cost": 18,
    "tags": [
      "city",
      "building"
    ],
    "requirements": {
      "oceans": 6
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 3
      },
      "city": true,
      "ocean": true
    },
    "cardNumber": "A20",
    "description": "Requires 6 ocean tiles. Decrease your energy production 1 step and increase your M€ production 3 steps. Place this tile on top of an existing ocean tile, IGNORING NORMAL PLACEMENT RESTRICTIONS FOR CITIES. The tile counts as a city as well as an ocean.",
    "expansion": "ares"
  },
  "Ocean Farm": {
    "name": "Ocean Farm",
    "type": "automated",
    "cost": 15,
    "tags": [
      "plant",
      "building"
    ],
    "requirements": {
      "oceans": 4
    },
    "behavior": {
      "production": {
        "plants": 1,
        "heat": 1
      },
      "city": true,
      "ocean": true
    },
    "cardNumber": "A21",
    "description": "Requires 4 ocean tiles. Increase your heat production 1 step and increase your plant production 1 step. Place this tile on top of an existing ocean tile. The tile grants an ADJACENCY BONUS of 1 plant.",
    "expansion": "ares"
  },
  "Ocean Sanctuary": {
    "name": "Ocean Sanctuary",
    "type": "active",
    "cost": 9,
    "tags": [
      "animal"
    ],
    "requirements": {
      "oceans": 5
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "behavior": {
      "city": true,
      "ocean": true,
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "A22",
    "description": "Requires 5 ocean tiles. Place this tile on top of an existing ocean tile. The tile grants an ADJACENCY BONUS of 1 animal. Add 1 animal to this card.",
    "expansion": "ares"
  },
  "Solar Farm": {
    "name": "Solar Farm",
    "type": "automated",
    "cost": 12,
    "tags": [
      "power",
      "building"
    ],
    "cardNumber": "A17",
    "description": "Place this tile which grants an ADJACENCY BONUS of 2 energy. Increase your energy production 1 step for each plant resource on the area where you place the tile.",
    "expansion": "ares"
  },
  "Acquired Company": {
    "name": "Acquired Company",
    "type": "automated",
    "cost": 10,
    "tags": [
      "earth"
    ],
    "behavior": {
      "production": {
        "megacredits": 3
      }
    },
    "cardNumber": "106",
    "description": "Increase your M€ production 3 steps.",
    "expansion": "base"
  },
  "Adaptation Technology": {
    "name": "Adaptation Technology",
    "type": "active",
    "cost": 12,
    "tags": [
      "science"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "153",
    "expansion": "base"
  },
  "Adapted Lichen": {
    "name": "Adapted Lichen",
    "type": "automated",
    "cost": 9,
    "tags": [
      "plant"
    ],
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "048",
    "description": "Increase your plant production 1 step.",
    "expansion": "base"
  },
  "Advanced Alloys": {
    "name": "Advanced Alloys",
    "type": "active",
    "cost": 9,
    "tags": [
      "science"
    ],
    "cardNumber": "071",
    "expansion": "base"
  },
  "Advanced Ecosystems": {
    "name": "Advanced Ecosystems",
    "type": "automated",
    "cost": 11,
    "tags": [
      "plant",
      "microbe",
      "animal"
    ],
    "requirements": {
      "tag": "microbe"
    },
    "vp": {
      "type": "static",
      "vp": 3
    },
    "cardNumber": "135",
    "description": "Requires a plant tag, a microbe tag, and an animal tag.",
    "expansion": "base"
  },
  "Aerobraked Ammonia Asteroid": {
    "name": "Aerobraked Ammonia Asteroid",
    "type": "event",
    "cost": 26,
    "tags": [
      "space"
    ],
    "behavior": {
      "production": {
        "heat": 3,
        "plants": 1
      }
    },
    "cardNumber": "170",
    "description": "Increase your heat production 3 steps and your plant production 1 step. Add 2 microbes to ANOTHER card.",
    "expansion": "base"
  },
  "AI Central": {
    "name": "AI Central",
    "type": "active",
    "cost": 21,
    "tags": [
      "science",
      "building"
    ],
    "requirements": {
      "count": 3,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": -1
      }
    },
    "cardNumber": "208",
    "description": "Requires 3 science tags to play. Decrease your energy production 1 step.",
    "expansion": "base"
  },
  "Algae": {
    "name": "Algae",
    "type": "automated",
    "cost": 10,
    "tags": [
      "plant"
    ],
    "requirements": {
      "oceans": 5
    },
    "behavior": {
      "production": {
        "plants": 2
      },
      "stock": {
        "plants": 1
      }
    },
    "cardNumber": "047",
    "description": "Requires 5 ocean tiles. Gain 1 plant and increase your plant production 2 steps.",
    "expansion": "base"
  },
  "Anti-Gravity Technology": {
    "name": "Anti-Gravity Technology",
    "type": "active",
    "cost": 14,
    "tags": [
      "science"
    ],
    "requirements": {
      "count": 7,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 3
    },
    "cardDiscount": {
      "amount": 2
    },
    "cardNumber": "150",
    "description": "Requires 7 science tags.",
    "expansion": "base"
  },
  "Ants": {
    "name": "Ants",
    "type": "active",
    "cost": 9,
    "tags": [
      "microbe"
    ],
    "requirements": {
      "oxygen": 4
    },
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "resourceType": "Microbe",
    "cardNumber": "035",
    "description": "Requires 4% oxygen.",
    "expansion": "base"
  },
  "Aquifer Pumping": {
    "name": "Aquifer Pumping",
    "type": "active",
    "cost": 18,
    "tags": [
      "building"
    ],
    "cardNumber": "187",
    "expansion": "base"
  },
  "ArchaeBacteria": {
    "name": "ArchaeBacteria",
    "type": "automated",
    "cost": 6,
    "tags": [
      "microbe"
    ],
    "requirements": {
      "temperature": -18
    },
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "042",
    "description": "It must be -18 C or colder. Increase your plant production 1 step.",
    "expansion": "base"
  },
  "Arctic Algae": {
    "name": "Arctic Algae",
    "type": "active",
    "cost": 12,
    "tags": [
      "plant"
    ],
    "requirements": {
      "temperature": -12
    },
    "behavior": {
      "stock": {
        "plants": 1
      }
    },
    "cardNumber": "023",
    "description": "It must be -12 C or colder to play. Gain 1 plant.",
    "expansion": "base"
  },
  "Artificial Lake": {
    "name": "Artificial Lake",
    "type": "automated",
    "cost": 15,
    "tags": [
      "building"
    ],
    "requirements": {
      "temperature": -6
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "ocean": true
    },
    "cardNumber": "116",
    "description": "Requires -6 C or warmer. Place 1 ocean tile ON AN AREA NOT RESERVED FOR OCEAN.",
    "expansion": "base"
  },
  "Artificial Photosynthesis": {
    "name": "Artificial Photosynthesis",
    "type": "automated",
    "cost": 12,
    "tags": [
      "science"
    ],
    "behavior": {
      "production": {
        "energy": 2
      }
    },
    "cardNumber": "115",
    "description": "Increase your plant production 1 step or your energy production 2 steps.",
    "expansion": "base"
  },
  "Asteroid": {
    "name": "Asteroid",
    "type": "event",
    "cost": 14,
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "titanium": 2
      },
      "global": {
        "temperature": 1
      },
      "removeAnyPlants": 3
    },
    "cardNumber": "009",
    "description": "Raise temperature 1 step and gain 2 titanium. Remove up to 3 plants from any player.",
    "expansion": "base"
  },
  "Asteroid Mining": {
    "name": "Asteroid Mining",
    "type": "automated",
    "cost": 30,
    "tags": [
      "jovian",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "titanium": 2
      }
    },
    "cardNumber": "040",
    "description": "Increase your titanium production 2 steps.",
    "expansion": "base"
  },
  "Asteroid Mining Consortium": {
    "name": "Asteroid Mining Consortium",
    "type": "automated",
    "cost": 13,
    "tags": [
      "jovian"
    ],
    "requirements": {
      "count": 1
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "002",
    "description": "Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step.",
    "expansion": "base"
  },
  "Beam From A Thorium Asteroid": {
    "name": "Beam From A Thorium Asteroid",
    "type": "automated",
    "cost": 32,
    "tags": [
      "jovian",
      "space",
      "power"
    ],
    "requirements": {
      "tag": "jovian"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "heat": 3,
        "energy": 3
      }
    },
    "cardNumber": "058",
    "description": "Requires a Jovian tag. Increase your heat production and energy production 3 steps each.",
    "expansion": "base"
  },
  "Big Asteroid": {
    "name": "Big Asteroid",
    "type": "event",
    "cost": 27,
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "titanium": 4
      },
      "global": {
        "temperature": 2
      },
      "removeAnyPlants": 4
    },
    "cardNumber": "011",
    "description": "Raise temperature 2 steps and gain 4 titanium. Remove up to 4 plants from any player.",
    "expansion": "base"
  },
  "Biomass Combustors": {
    "name": "Biomass Combustors",
    "type": "automated",
    "cost": 4,
    "tags": [
      "power",
      "building"
    ],
    "requirements": {
      "oxygen": 6
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "behavior": {
      "production": {
        "energy": 2
      },
      "decreaseAnyProduction": {
        "type": "plants",
        "count": 1
      }
    },
    "cardNumber": "183",
    "description": "Requires 6% oxygen. Decrease any plant production 1 step and increase your energy production 2 steps.",
    "expansion": "base"
  },
  "Birds": {
    "name": "Birds",
    "type": "active",
    "cost": 10,
    "tags": [
      "animal"
    ],
    "requirements": {
      "oxygen": 13
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "behavior": {
      "decreaseAnyProduction": {
        "type": "plants",
        "count": 2
      }
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "072",
    "description": "Requires 13% oxygen. Decrease any plant production 2 steps. 1 VP per animal on this card.",
    "expansion": "base"
  },
  "Black Polar Dust": {
    "name": "Black Polar Dust",
    "type": "automated",
    "cost": 15,
    "behavior": {
      "production": {
        "megacredits": -2,
        "heat": 3
      },
      "ocean": true
    },
    "cardNumber": "022",
    "description": "Place an ocean tile. Decrease your M€ production 2 steps and increase your heat production 3 steps.",
    "expansion": "base"
  },
  "Breathing Filters": {
    "name": "Breathing Filters",
    "type": "automated",
    "cost": 11,
    "tags": [
      "science"
    ],
    "requirements": {
      "oxygen": 7
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "114",
    "description": "Requires 7% oxygen.",
    "expansion": "base"
  },
  "Bribed Committee": {
    "name": "Bribed Committee",
    "type": "event",
    "cost": 7,
    "tags": [
      "earth"
    ],
    "vp": {
      "type": "static",
      "vp": -2
    },
    "behavior": {
      "tr": 2
    },
    "cardNumber": "112",
    "description": "Raise your TR 2 steps.",
    "expansion": "base"
  },
  "Building Industries": {
    "name": "Building Industries",
    "type": "automated",
    "cost": 6,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "steel": 2
      }
    },
    "cardNumber": "065",
    "description": "Decrease your energy production 1 step and increase your steel production 2 steps.",
    "expansion": "base"
  },
  "Bushes": {
    "name": "Bushes",
    "type": "automated",
    "cost": 10,
    "tags": [
      "plant"
    ],
    "requirements": {
      "temperature": -10
    },
    "behavior": {
      "production": {
        "plants": 2
      },
      "stock": {
        "plants": 2
      }
    },
    "cardNumber": "093",
    "description": "Requires -10 C or warmer. Increase your plant production 2 steps. Gain 2 plants.",
    "expansion": "base"
  },
  "Business Contacts": {
    "name": "Business Contacts",
    "type": "event",
    "cost": 7,
    "tags": [
      "earth"
    ],
    "cardNumber": "111",
    "expansion": "base"
  },
  "Business Network": {
    "name": "Business Network",
    "type": "active",
    "cost": 4,
    "tags": [
      "earth"
    ],
    "behavior": {
      "production": {
        "megacredits": -1
      }
    },
    "cardNumber": "110",
    "description": "Decrease your M€ production 1 step.",
    "expansion": "base"
  },
  "Callisto Penal Mines": {
    "name": "Callisto Penal Mines",
    "type": "automated",
    "cost": 24,
    "tags": [
      "jovian",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "megacredits": 3
      }
    },
    "cardNumber": "082",
    "description": "Increase your M€ production 3 steps.",
    "expansion": "base"
  },
  "Carbonate Processing": {
    "name": "Carbonate Processing",
    "type": "automated",
    "cost": 6,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "heat": 3
      }
    },
    "cardNumber": "043",
    "description": "Decrease your energy production 1 step and increase your heat production 3 steps.",
    "expansion": "base"
  },
  "Caretaker Contract": {
    "name": "Caretaker Contract",
    "type": "active",
    "cost": 3,
    "requirements": {
      "temperature": 0
    },
    "action": {
      "tr": 1
    },
    "cardNumber": "154",
    "description": "Requires 0° C or warmer.",
    "expansion": "base"
  },
  "Cartel": {
    "name": "Cartel",
    "type": "automated",
    "cost": 8,
    "tags": [
      "earth"
    ],
    "cardNumber": "137",
    "description": "Increase your M€ production 1 step for each Earth tag you have, including this.",
    "expansion": "base"
  },
  "CEO\\": {
    "name": "CEO\\",
    "type": "event",
    "cost": 1,
    "cardNumber": "149",
    "expansion": "base"
  },
  "Cloud Seeding": {
    "name": "Cloud Seeding",
    "type": "automated",
    "cost": 11,
    "requirements": {
      "oceans": 3
    },
    "behavior": {
      "production": {
        "megacredits": -1,
        "plants": 2
      },
      "decreaseAnyProduction": {
        "type": "heat",
        "count": 1
      }
    },
    "cardNumber": "004",
    "description": "Requires 3 ocean tiles. Decrease your M€ production 1 step and any heat production 1 step. Increase your plant production 2 steps.",
    "expansion": "base"
  },
  "Colonizer Training Camp": {
    "name": "Colonizer Training Camp",
    "type": "automated",
    "cost": 8,
    "tags": [
      "jovian",
      "building"
    ],
    "requirements": {
      "oxygen": 5
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "001",
    "description": "Oxygen must be 5% or less.",
    "expansion": "base"
  },
  "Comet": {
    "name": "Comet",
    "type": "event",
    "cost": 21,
    "tags": [
      "space"
    ],
    "behavior": {
      "global": {
        "temperature": 1
      },
      "ocean": true,
      "removeAnyPlants": 3
    },
    "cardNumber": "010",
    "description": "Raise temperature 1 step and place an ocean tile. Remove up to 3 plants from any player.",
    "expansion": "base"
  },
  "Convoy From Europa": {
    "name": "Convoy From Europa",
    "type": "event",
    "cost": 15,
    "tags": [
      "space"
    ],
    "behavior": {
      "ocean": true,
      "drawCard": 1
    },
    "cardNumber": "161",
    "description": "Place 1 ocean tile and draw 1 card.",
    "expansion": "base"
  },
  "Corporate Stronghold": {
    "name": "Corporate Stronghold",
    "type": "automated",
    "cost": 11,
    "tags": [
      "city",
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": -2
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 3
      },
      "city": true
    },
    "cardNumber": "182",
    "description": "Decrease your energy production 1 step and increase your M€ production 3 steps. Place a city tile.",
    "expansion": "base"
  },
  "Cupola City": {
    "name": "Cupola City",
    "type": "automated",
    "cost": 16,
    "tags": [
      "city",
      "building"
    ],
    "requirements": {
      "oxygen": 9
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 3
      },
      "city": true
    },
    "cardNumber": "029",
    "description": "Oxygen must be 9% or less. Place a city tile. Decrease your energy production 1 step and increase your M€ production 3 steps.",
    "expansion": "base"
  },
  "Decomposers": {
    "name": "Decomposers",
    "type": "active",
    "cost": 5,
    "tags": [
      "microbe"
    ],
    "requirements": {
      "oxygen": 3
    },
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "resourceType": "Microbe",
    "cardNumber": "131",
    "description": "Requires 3% oxygen.",
    "expansion": "base"
  },
  "Deep Well Heating": {
    "name": "Deep Well Heating",
    "type": "automated",
    "cost": 13,
    "tags": [
      "power",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": 1
      },
      "global": {
        "temperature": 1
      }
    },
    "cardNumber": "003",
    "description": "Increase your energy production 1 step. Increase temperature 1 step.",
    "expansion": "base"
  },
  "Deimos Down": {
    "name": "Deimos Down",
    "type": "event",
    "cost": 31,
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "steel": 4
      },
      "global": {
        "temperature": 3
      },
      "removeAnyPlants": 8
    },
    "cardNumber": "039",
    "description": "Raise temperature 3 steps and gain 4 steel. Remove up to 8 plants from any player.",
    "expansion": "base"
  },
  "Designed Microorganisms": {
    "name": "Designed Microorganisms",
    "type": "automated",
    "cost": 16,
    "tags": [
      "science",
      "microbe"
    ],
    "requirements": {
      "temperature": -14
    },
    "behavior": {
      "production": {
        "plants": 2
      }
    },
    "cardNumber": "155",
    "description": "It must be -14 C or colder. Increase your plant production 2 steps.",
    "expansion": "base"
  },
  "Development Center": {
    "name": "Development Center",
    "type": "active",
    "cost": 11,
    "tags": [
      "science",
      "building"
    ],
    "action": {
      "drawCard": 1
    },
    "cardNumber": "014",
    "expansion": "base"
  },
  "Domed Crater": {
    "name": "Domed Crater",
    "type": "automated",
    "cost": 24,
    "tags": [
      "city",
      "building"
    ],
    "requirements": {
      "oxygen": 7
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 3
      },
      "stock": {
        "plants": 3
      },
      "city": true
    },
    "cardNumber": "016",
    "description": "Oxygen must be 7% or less. Gain 3 plants. Place a city tile. Decrease your energy production 1 step and increase your M€ production 3 steps.",
    "expansion": "base"
  },
  "Dust Seals": {
    "name": "Dust Seals",
    "type": "automated",
    "cost": 2,
    "requirements": {
      "oceans": 3
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "119",
    "description": "Requires 3 or less ocean tiles.",
    "expansion": "base"
  },
  "Earth Catapult": {
    "name": "Earth Catapult",
    "type": "active",
    "cost": 23,
    "tags": [
      "earth"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardDiscount": {
      "amount": 2
    },
    "cardNumber": "070",
    "expansion": "base"
  },
  "Earth Office": {
    "name": "Earth Office",
    "type": "active",
    "cost": 1,
    "tags": [
      "earth"
    ],
    "cardDiscount": {
      "amount": 3,
      "tag": "earth"
    },
    "cardNumber": "105",
    "expansion": "base"
  },
  "Electro Catapult": {
    "name": "Electro Catapult",
    "type": "active",
    "cost": 17,
    "tags": [
      "building"
    ],
    "requirements": {
      "oxygen": 8
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": -1
      }
    },
    "action": {
      "stock": {
        "megacredits": 7
      }
    },
    "cardNumber": "069",
    "description": "Oxygen must be 8% or less. Decrease your energy production 1 step.",
    "expansion": "base"
  },
  "Energy Saving": {
    "name": "Energy Saving",
    "type": "automated",
    "cost": 15,
    "tags": [
      "power"
    ],
    "cardNumber": "189",
    "description": "Increase your energy production 1 step for each city tile in play.",
    "expansion": "base"
  },
  "Energy Tapping": {
    "name": "Energy Tapping",
    "type": "automated",
    "cost": 3,
    "tags": [
      "power"
    ],
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "201",
    "description": "Decrease any energy production 1 step and increase your own 1 step.",
    "expansion": "base"
  },
  "Eos Chasma National Park": {
    "name": "Eos Chasma National Park",
    "type": "automated",
    "cost": 16,
    "tags": [
      "plant",
      "building"
    ],
    "requirements": {
      "temperature": -12
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "megacredits": 2
      },
      "stock": {
        "plants": 3
      }
    },
    "cardNumber": "026",
    "description": "Requires -12 C or warmer. Add 1 animal TO ANY ANIMAL CARD. Gain 3 plants. Increase your M€ production 2 steps.",
    "expansion": "base"
  },
  "Equatorial Magnetizer": {
    "name": "Equatorial Magnetizer",
    "type": "active",
    "cost": 11,
    "tags": [
      "building"
    ],
    "action": {
      "production": {
        "energy": -1
      },
      "tr": 1
    },
    "cardNumber": "015",
    "expansion": "base"
  },
  "Extreme-Cold Fungus": {
    "name": "Extreme-Cold Fungus",
    "type": "active",
    "cost": 13,
    "tags": [
      "microbe"
    ],
    "requirements": {
      "temperature": -10
    },
    "cardNumber": "134",
    "description": "It must be -10 C or colder.",
    "expansion": "base"
  },
  "Farming": {
    "name": "Farming",
    "type": "automated",
    "cost": 16,
    "tags": [
      "plant"
    ],
    "requirements": {
      "temperature": 4
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "megacredits": 2,
        "plants": 2
      },
      "stock": {
        "plants": 2
      }
    },
    "cardNumber": "118",
    "description": "Requires +4° C or warmer. Increase your M€ production 2 steps and your plant production 2 steps. Gain 2 plants.",
    "expansion": "base"
  },
  "Fish": {
    "name": "Fish",
    "type": "active",
    "cost": 9,
    "tags": [
      "animal"
    ],
    "requirements": {
      "temperature": 2
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "behavior": {
      "decreaseAnyProduction": {
        "type": "plants",
        "count": 1
      }
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "052",
    "description": "Requires +2 C° or warmer. Decrease any plant production 1 step.",
    "expansion": "base"
  },
  "Flooding": {
    "name": "Flooding",
    "type": "event",
    "cost": 7,
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "188",
    "description": "Place an ocean tile. IF THERE ARE TILES ADJACENT TO THIS OCEAN TILE, YOU MAY REMOVE 4 M€ FROM THE OWNER OF ONE OF THOSE TILES.",
    "expansion": "base"
  },
  "Food Factory": {
    "name": "Food Factory",
    "type": "automated",
    "cost": 12,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "megacredits": 4,
        "plants": -1
      }
    },
    "cardNumber": "041",
    "description": "Decrease your plant production 1 step and increase your M€ production 4 steps.",
    "expansion": "base"
  },
  "Fueled Generators": {
    "name": "Fueled Generators",
    "type": "automated",
    "cost": 1,
    "tags": [
      "power",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": 1,
        "megacredits": -1
      }
    },
    "cardNumber": "100",
    "description": "Decrease your M€ production 1 step and increase your energy production 1 steps.",
    "expansion": "base"
  },
  "Fuel Factory": {
    "name": "Fuel Factory",
    "type": "automated",
    "cost": 6,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 1,
        "titanium": 1
      }
    },
    "cardNumber": "180",
    "description": "Decrease your energy production 1 step and increase your titanium and your M€ production 1 step each.",
    "expansion": "base"
  },
  "Fusion Power": {
    "name": "Fusion Power",
    "type": "automated",
    "cost": 14,
    "tags": [
      "science",
      "power",
      "building"
    ],
    "requirements": {
      "count": 2,
      "tag": "power"
    },
    "behavior": {
      "production": {
        "energy": 3
      }
    },
    "cardNumber": "132",
    "description": "Requires 2 power tags. Increase your energy production 3 steps.",
    "expansion": "base"
  },
  "Ganymede Colony": {
    "name": "Ganymede Colony",
    "type": "automated",
    "cost": 20,
    "tags": [
      "jovian",
      "space",
      "city"
    ],
    "vp": {
      "type": "per_tag",
      "tag": "jovian",
      "per": 1
    },
    "behavior": {
      "city": true
    },
    "cardNumber": "081",
    "description": "Place a city tile ON THE RESERVED AREA.",
    "expansion": "base"
  },
  "Gene Repair": {
    "name": "Gene Repair",
    "type": "automated",
    "cost": 12,
    "tags": [
      "science"
    ],
    "requirements": {
      "count": 3,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "091",
    "description": "Requires 3 science tags. Increase your M€ production 2 steps.",
    "expansion": "base"
  },
  "Geothermal Power": {
    "name": "Geothermal Power",
    "type": "automated",
    "cost": 11,
    "tags": [
      "power",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": 2
      }
    },
    "cardNumber": "117",
    "description": "Increase your energy production 2 steps.",
    "expansion": "base"
  },
  "GHG Factories": {
    "name": "GHG Factories",
    "type": "automated",
    "cost": 11,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "heat": 4
      }
    },
    "cardNumber": "126",
    "description": "Decrease your energy production 1 step and increase your heat production 4 steps.",
    "expansion": "base"
  },
  "GHG Producing Bacteria": {
    "name": "GHG Producing Bacteria",
    "type": "active",
    "cost": 8,
    "tags": [
      "science",
      "microbe"
    ],
    "requirements": {
      "oxygen": 4
    },
    "action": {
      "addResources": 1,
      "global": {
        "temperature": 1
      },
      "temperature": true
    },
    "resourceType": "Microbe",
    "cardNumber": "034",
    "description": "Requires 4% oxygen.",
    "expansion": "base"
  },
  "Giant Ice Asteroid": {
    "name": "Giant Ice Asteroid",
    "type": "event",
    "cost": 36,
    "tags": [
      "space"
    ],
    "behavior": {
      "global": {
        "temperature": 2
      },
      "ocean": true,
      "removeAnyPlants": 6
    },
    "cardNumber": "080",
    "description": "Raise temperature 2 steps and place 2 ocean tiles. Remove up to 6 plants from any player.",
    "expansion": "base"
  },
  "Giant Space Mirror": {
    "name": "Giant Space Mirror",
    "type": "automated",
    "cost": 17,
    "tags": [
      "power",
      "space"
    ],
    "behavior": {
      "production": {
        "energy": 3
      }
    },
    "cardNumber": "083",
    "description": "Increase your energy production 3 steps.",
    "expansion": "base"
  },
  "Grass": {
    "name": "Grass",
    "type": "automated",
    "cost": 11,
    "tags": [
      "plant"
    ],
    "requirements": {
      "temperature": -16
    },
    "behavior": {
      "production": {
        "plants": 1
      },
      "stock": {
        "plants": 3
      }
    },
    "cardNumber": "087",
    "description": "Requires -16° C or warmer. Increase your plant production 1 step. Gain 3 plants.",
    "expansion": "base"
  },
  "Great Dam": {
    "name": "Great Dam",
    "type": "automated",
    "cost": 12,
    "tags": [
      "power",
      "building"
    ],
    "requirements": {
      "oceans": 4
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": 2
      }
    },
    "cardNumber": "136",
    "description": "Requires 4 ocean tiles. Increase your energy production 2 steps.",
    "expansion": "base"
  },
  "Great Escarpment Consortium": {
    "name": "Great Escarpment Consortium",
    "type": "automated",
    "cost": 6,
    "requirements": {
      "count": 1
    },
    "cardNumber": "061",
    "description": "Requires that you have steel production. Decrease any steel production 1 step and increase your own 1 step.",
    "expansion": "base"
  },
  "Greenhouses": {
    "name": "Greenhouses",
    "type": "automated",
    "cost": 6,
    "tags": [
      "plant",
      "building"
    ],
    "cardNumber": "096",
    "description": "Gain 1 plant for each city tile in play.",
    "expansion": "base"
  },
  "Hackers": {
    "name": "Hackers",
    "type": "automated",
    "cost": 3,
    "vp": {
      "type": "static",
      "vp": -1
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 2
      }
    },
    "cardNumber": "125",
    "description": "Decrease your energy production 1 step and any M€ production 2 steps. Increase your M€ production 2 steps.",
    "expansion": "base"
  },
  "Heather": {
    "name": "Heather",
    "type": "automated",
    "cost": 6,
    "tags": [
      "plant"
    ],
    "requirements": {
      "temperature": -14
    },
    "behavior": {
      "production": {
        "plants": 1
      },
      "stock": {
        "plants": 1
      }
    },
    "cardNumber": "88",
    "description": "Requires -14 C° or warmer. Increase your plant production 1 step. Gain 1 plant.",
    "expansion": "base"
  },
  "Heat Trappers": {
    "name": "Heat Trappers",
    "type": "automated",
    "cost": 6,
    "tags": [
      "power",
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": -1
    },
    "behavior": {
      "production": {
        "energy": 1
      },
      "decreaseAnyProduction": {
        "type": "heat",
        "count": 2
      }
    },
    "cardNumber": "178",
    "description": "Decrease any heat production 2 steps and increase your energy production 1 step.",
    "expansion": "base"
  },
  "Herbivores": {
    "name": "Herbivores",
    "type": "active",
    "cost": 12,
    "tags": [
      "animal"
    ],
    "requirements": {
      "oxygen": 8
    },
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "behavior": {
      "decreaseAnyProduction": {
        "type": "plants",
        "count": 1
      },
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "147",
    "description": "Requires 8% oxygen. +1 animal to this card. -1 any plant production",
    "expansion": "base"
  },
  "Hired Raiders": {
    "name": "Hired Raiders",
    "type": "event",
    "cost": 1,
    "cardNumber": "124",
    "description": "Steal up to 2 steel, or 3 M€ from any player.",
    "expansion": "base"
  },
  "Ice Asteroid": {
    "name": "Ice Asteroid",
    "type": "event",
    "cost": 23,
    "tags": [
      "space"
    ],
    "behavior": {
      "ocean": true
    },
    "cardNumber": "078",
    "description": "Place 2 ocean tiles.",
    "expansion": "base"
  },
  "Ice Cap Melting": {
    "name": "Ice Cap Melting",
    "type": "event",
    "cost": 5,
    "requirements": {
      "temperature": 2
    },
    "behavior": {
      "ocean": true
    },
    "cardNumber": "181",
    "description": "Requires +2 C or warmer. Place 1 ocean tile.",
    "expansion": "base"
  },
  "Immigrant City": {
    "name": "Immigrant City",
    "type": "active",
    "cost": 13,
    "tags": [
      "city",
      "building"
    ],
    "cardNumber": "200",
    "description": "Decrease your energy production 1 step and decrease your M€ production 2 steps. Place a city tile.",
    "expansion": "base"
  },
  "Immigration Shuttles": {
    "name": "Immigration Shuttles",
    "type": "automated",
    "cost": 31,
    "tags": [
      "earth",
      "space"
    ],
    "vp": {
      "type": "per_city",
      "per": 3
    },
    "behavior": {
      "production": {
        "megacredits": 5
      }
    },
    "cardNumber": "198",
    "description": "Increase your M€ production 5 steps.",
    "expansion": "base"
  },
  "Imported GHG": {
    "name": "Imported GHG",
    "type": "event",
    "cost": 7,
    "tags": [
      "earth",
      "space"
    ],
    "behavior": {
      "production": {
        "heat": 1
      },
      "stock": {
        "heat": 3
      }
    },
    "cardNumber": "162",
    "description": "Increase your heat production 1 step and gain 3 heat.",
    "expansion": "base"
  },
  "Imported Hydrogen": {
    "name": "Imported Hydrogen",
    "type": "event",
    "cost": 16,
    "tags": [
      "earth",
      "space"
    ],
    "behavior": {
      "ocean": true
    },
    "cardNumber": "019",
    "description": "Gain 3 plants, or add 3 microbes or 2 animals to ANOTHER card. Place an ocean tile.",
    "expansion": "base"
  },
  "Imported Nitrogen": {
    "name": "Imported Nitrogen",
    "type": "event",
    "cost": 23,
    "tags": [
      "earth",
      "space"
    ],
    "behavior": {
      "stock": {
        "plants": 4
      },
      "tr": 1
    },
    "cardNumber": "163",
    "description": "Raise your TR 1 step and gain 4 plants. Add 3 microbes to ANOTHER card and 2 animals to ANOTHER card.",
    "expansion": "base"
  },
  "Import of Advanced GHG": {
    "name": "Import of Advanced GHG",
    "type": "event",
    "cost": 9,
    "tags": [
      "earth",
      "space"
    ],
    "behavior": {
      "production": {
        "heat": 2
      }
    },
    "cardNumber": "167",
    "description": "Increase your heat production 2 steps.",
    "expansion": "base"
  },
  "Indentured Workers": {
    "name": "Indentured Workers",
    "type": "event",
    "cost": 0,
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "195",
    "description": "The next card you play this generation costs 8 M€ less.",
    "expansion": "base"
  },
  "Industrial Microbes": {
    "name": "Industrial Microbes",
    "type": "automated",
    "cost": 12,
    "tags": [
      "microbe",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": 1,
        "steel": 1
      }
    },
    "cardNumber": "158",
    "description": "Increase your energy production and your steel production 1 step each.",
    "expansion": "base"
  },
  "Insects": {
    "name": "Insects",
    "type": "automated",
    "cost": 9,
    "tags": [
      "microbe"
    ],
    "requirements": {
      "oxygen": 6
    },
    "cardNumber": "148",
    "description": "Requires 6% oxygen. Increase your plant production 1 step for each plant tag you have.",
    "expansion": "base"
  },
  "Insulation": {
    "name": "Insulation",
    "type": "automated",
    "cost": 2,
    "cardNumber": "152",
    "description": "Decrease your heat production any number of steps and increase your M€ production the same number of steps.",
    "expansion": "base"
  },
  "Interstellar Colony Ship": {
    "name": "Interstellar Colony Ship",
    "type": "event",
    "cost": 24,
    "tags": [
      "earth",
      "space"
    ],
    "requirements": {
      "count": 5,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 4
    },
    "cardNumber": "027",
    "description": "Requires that you have 5 science tags.",
    "expansion": "base"
  },
  "Invention Contest": {
    "name": "Invention Contest",
    "type": "event",
    "cost": 2,
    "tags": [
      "science"
    ],
    "cardNumber": "192",
    "expansion": "base"
  },
  "Inventors\\": {
    "name": "Inventors\\",
    "type": "active",
    "cost": 9,
    "tags": [
      "science"
    ],
    "cardNumber": "006",
    "expansion": "base"
  },
  "Investment Loan": {
    "name": "Investment Loan",
    "type": "event",
    "cost": 3,
    "tags": [
      "earth"
    ],
    "behavior": {
      "production": {
        "megacredits": -1
      },
      "stock": {
        "megacredits": 10
      }
    },
    "cardNumber": "151",
    "description": "Decrease your M€ production 1 step. Gain 10 M€.",
    "expansion": "base"
  },
  "Io Mining Industries": {
    "name": "Io Mining Industries",
    "type": "automated",
    "cost": 41,
    "tags": [
      "jovian",
      "space"
    ],
    "vp": {
      "type": "per_tag",
      "tag": "jovian",
      "per": 1
    },
    "behavior": {
      "production": {
        "titanium": 2,
        "megacredits": 2
      }
    },
    "cardNumber": "092",
    "description": "Increase your titanium production 2 steps and your M€ production 2 steps.",
    "expansion": "base"
  },
  "Ironworks": {
    "name": "Ironworks",
    "type": "active",
    "cost": 11,
    "tags": [
      "building"
    ],
    "action": {
      "stock": {
        "steel": 1
      },
      "global": {
        "oxygen": 1
      }
    },
    "cardNumber": "101",
    "expansion": "base"
  },
  "Kelp Farming": {
    "name": "Kelp Farming",
    "type": "automated",
    "cost": 17,
    "tags": [
      "plant"
    ],
    "requirements": {
      "oceans": 6
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "megacredits": 2,
        "plants": 3
      },
      "stock": {
        "plants": 2
      }
    },
    "cardNumber": "055",
    "description": "Requires 6 ocean tiles. Increase your M€ production 2 steps and your plant production 3 steps. Gain 2 plants.",
    "expansion": "base"
  },
  "Lagrange Observatory": {
    "name": "Lagrange Observatory",
    "type": "automated",
    "cost": 9,
    "tags": [
      "science",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "drawCard": 1
    },
    "cardNumber": "196",
    "description": "Draw 1 card.",
    "expansion": "base"
  },
  "Lake Marineris": {
    "name": "Lake Marineris",
    "type": "automated",
    "cost": 18,
    "requirements": {
      "temperature": 0
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "ocean": true
    },
    "cardNumber": "053",
    "description": "Requires 0° C or warmer. Place 2 ocean tiles.",
    "expansion": "base"
  },
  "Land Claim": {
    "name": "Land Claim",
    "type": "event",
    "cost": 1,
    "cardNumber": "066",
    "expansion": "base"
  },
  "Large Convoy": {
    "name": "Large Convoy",
    "type": "event",
    "cost": 36,
    "tags": [
      "earth",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "ocean": true,
      "drawCard": 2
    },
    "cardNumber": "143",
    "description": "Place an ocean tile and draw 2 cards. Gain 5 plants or add 4 animals to ANOTHER card.",
    "expansion": "base"
  },
  "Lichen": {
    "name": "Lichen",
    "type": "automated",
    "cost": 7,
    "tags": [
      "plant"
    ],
    "requirements": {
      "temperature": -24
    },
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "159",
    "description": "Requires -24 C or warmer. Increase your plant production 1 step.",
    "expansion": "base"
  },
  "Lightning Harvest": {
    "name": "Lightning Harvest",
    "type": "automated",
    "cost": 8,
    "tags": [
      "power"
    ],
    "requirements": {
      "count": 3,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": 1,
        "megacredits": 1
      }
    },
    "cardNumber": "046",
    "description": "Requires 3 science tags. Increase your energy production and your M€ production one step each.",
    "expansion": "base"
  },
  "Livestock": {
    "name": "Livestock",
    "type": "active",
    "cost": 13,
    "tags": [
      "animal"
    ],
    "requirements": {
      "oxygen": 9
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "behavior": {
      "production": {
        "plants": -1,
        "megacredits": 2
      }
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "184",
    "description": "Requires 9% oxygen. Decrease your plant production 1 step and increase your M€ production 2 steps",
    "expansion": "base"
  },
  "Local Heat Trapping": {
    "name": "Local Heat Trapping",
    "type": "event",
    "cost": 1,
    "cardNumber": "190",
    "description": "Spend 5 heat to gain either 4 plants, or to add 2 animals to ANOTHER card.",
    "expansion": "base"
  },
  "Lunar Beam": {
    "name": "Lunar Beam",
    "type": "automated",
    "cost": 13,
    "tags": [
      "earth",
      "power"
    ],
    "behavior": {
      "production": {
        "megacredits": -2,
        "heat": 2,
        "energy": 2
      }
    },
    "cardNumber": "030",
    "description": "Decrease your M€ production 2 steps and increase your heat production and energy production 2 steps each.",
    "expansion": "base"
  },
  "Magnetic Field Dome": {
    "name": "Magnetic Field Dome",
    "type": "automated",
    "cost": 5,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -2,
        "plants": 1
      },
      "tr": 1
    },
    "cardNumber": "171",
    "description": "Decrease your energy production 2 steps and increase your plant production 1 step. Raise your TR 1 step.",
    "expansion": "base"
  },
  "Magnetic Field Generators": {
    "name": "Magnetic Field Generators",
    "type": "automated",
    "cost": 20,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -4,
        "plants": 2
      },
      "tr": 3
    },
    "cardNumber": "165",
    "description": "Decrease your energy production 4 steps and increase your plant production 2 steps. Raise your TR 3 steps.",
    "expansion": "base"
  },
  "Mangrove": {
    "name": "Mangrove",
    "type": "automated",
    "cost": 12,
    "tags": [
      "plant"
    ],
    "requirements": {
      "temperature": 4
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "greenery": true,
      "ocean": true
    },
    "cardNumber": "059",
    "description": "Requires +4 C or warmer. Place a greenery tile ON AN AREA RESERVED FOR OCEAN and raise oxygen 1 step. Disregard normal placement restrictions for this.",
    "expansion": "base"
  },
  "Mars University": {
    "name": "Mars University",
    "type": "active",
    "cost": 8,
    "tags": [
      "science",
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "073",
    "expansion": "base"
  },
  "Martian Rails": {
    "name": "Martian Rails",
    "type": "active",
    "cost": 13,
    "tags": [
      "building"
    ],
    "cardNumber": "007",
    "expansion": "base"
  },
  "Mass Converter": {
    "name": "Mass Converter",
    "type": "active",
    "cost": 8,
    "tags": [
      "science",
      "power"
    ],
    "requirements": {
      "count": 5,
      "tag": "science"
    },
    "behavior": {
      "production": {
        "energy": 6
      }
    },
    "cardDiscount": {
      "amount": 2,
      "tag": "space",
      "per": "card"
    },
    "cardNumber": "094",
    "description": "Requires 5 science tags. Increase your energy production 6 steps.",
    "expansion": "base"
  },
  "Media Archives": {
    "name": "Media Archives",
    "type": "automated",
    "cost": 8,
    "tags": [
      "earth"
    ],
    "cardNumber": "107",
    "description": "Gain 1 M€ for each event EVER PLAYED by all players.",
    "expansion": "base"
  },
  "Media Group": {
    "name": "Media Group",
    "type": "active",
    "cost": 6,
    "tags": [
      "earth"
    ],
    "cardNumber": "109",
    "expansion": "base"
  },
  "Medical Lab": {
    "name": "Medical Lab",
    "type": "automated",
    "cost": 13,
    "tags": [
      "science",
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "per": 2
      }
    },
    "cardNumber": "207",
    "description": "Increase your M€ production 1 step for every 2 building tags you have, including this.",
    "expansion": "base"
  },
  "Methane From Titan": {
    "name": "Methane From Titan",
    "type": "automated",
    "cost": 28,
    "tags": [
      "jovian",
      "space"
    ],
    "requirements": {
      "oxygen": 2
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "heat": 2,
        "plants": 2
      }
    },
    "cardNumber": "018",
    "description": "Requires 2% oxygen. Increase your heat production 2 steps and your plant production 2 steps.",
    "expansion": "base"
  },
  "Micro-Mills": {
    "name": "Micro-Mills",
    "type": "automated",
    "cost": 3,
    "behavior": {
      "production": {
        "heat": 1
      }
    },
    "cardNumber": "164",
    "description": "Increase your heat production 1 step.",
    "expansion": "base"
  },
  "Mine": {
    "name": "Mine",
    "type": "automated",
    "cost": 4,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 1
      }
    },
    "cardNumber": "056",
    "description": "Increase your steel production 1 step.",
    "expansion": "base"
  },
  "Mineral Deposit": {
    "name": "Mineral Deposit",
    "type": "event",
    "cost": 5,
    "behavior": {
      "stock": {
        "steel": 5
      }
    },
    "cardNumber": "062",
    "description": "Gain 5 steel.",
    "expansion": "base"
  },
  "Mining Expedition": {
    "name": "Mining Expedition",
    "type": "event",
    "cost": 12,
    "behavior": {
      "stock": {
        "steel": 2
      },
      "global": {
        "oxygen": 1
      },
      "removeAnyPlants": 2
    },
    "cardNumber": "063",
    "description": "Raise oxygen 1 step. Remove 2 plants from any player. Gain 2 steel.",
    "expansion": "base"
  },
  "Miranda Resort": {
    "name": "Miranda Resort",
    "type": "automated",
    "cost": 12,
    "tags": [
      "jovian",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "051",
    "description": "Increase your M€ production 1 step for each Earth tag you have.",
    "expansion": "base"
  },
  "Moss": {
    "name": "Moss",
    "type": "automated",
    "cost": 4,
    "tags": [
      "plant"
    ],
    "requirements": {
      "oceans": 3
    },
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "122",
    "description": "Requires 3 ocean tiles and that you lose 1 plant. Increase your plant production 1 step.",
    "expansion": "base"
  },
  "Nitrite Reducing Bacteria": {
    "name": "Nitrite Reducing Bacteria",
    "type": "active",
    "cost": 11,
    "tags": [
      "microbe"
    ],
    "behavior": {
      "addResources": 3
    },
    "action": {
      "addResources": 1,
      "tr": 1
    },
    "resourceType": "Microbe",
    "cardNumber": "157",
    "description": "Add 3 microbes to this card.",
    "expansion": "base"
  },
  "Nitrogen-Rich Asteroid": {
    "name": "Nitrogen-Rich Asteroid",
    "type": "event",
    "cost": 31,
    "tags": [
      "space"
    ],
    "behavior": {
      "global": {
        "temperature": 1
      },
      "tr": 2
    },
    "cardNumber": "037",
    "description": "Raise your terraforming rating 2 steps and temperature 1 step. Increase your plant production 1 step, or 4 steps if you have 3 plant tags.",
    "expansion": "base"
  },
  "Nitrophilic Moss": {
    "name": "Nitrophilic Moss",
    "type": "automated",
    "cost": 8,
    "tags": [
      "plant"
    ],
    "requirements": {
      "oceans": 3
    },
    "behavior": {
      "production": {
        "plants": 2
      }
    },
    "cardNumber": "146",
    "description": "Requires 3 ocean tiles and that you lose 2 plants. Increase your plant production 2 steps.",
    "expansion": "base"
  },
  "Noctis City": {
    "name": "Noctis City",
    "type": "automated",
    "cost": 18,
    "tags": [
      "city",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 3
      }
    },
    "cardNumber": "017",
    "description": "Decrease your energy production 1 step and increase your M€ production 3 steps. Place a city tile ON THE RESERVED AREA, disregarding normal placement restrictions.",
    "expansion": "base"
  },
  "Noctis Farming": {
    "name": "Noctis Farming",
    "type": "automated",
    "cost": 10,
    "tags": [
      "plant",
      "building"
    ],
    "requirements": {
      "temperature": -20
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "megacredits": 1
      },
      "stock": {
        "plants": 2
      }
    },
    "cardNumber": "176",
    "description": "Requires -20 C or warmer. Increase your M€ production 1 step and gain 2 plants.",
    "expansion": "base"
  },
  "Nuclear Power": {
    "name": "Nuclear Power",
    "type": "automated",
    "cost": 10,
    "tags": [
      "power",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": 3,
        "megacredits": -2
      }
    },
    "cardNumber": "045",
    "description": "Decrease your M€ production 2 steps and increase your energy production 3 steps.",
    "expansion": "base"
  },
  "Olympus Conference": {
    "name": "Olympus Conference",
    "type": "active",
    "cost": 10,
    "tags": [
      "science",
      "earth",
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "resourceType": "Science",
    "cardNumber": "185",
    "description": "When you play a science tag, including this, either add a science resource to this card, or remove a science resource from this card to draw a card.",
    "expansion": "base"
  },
  "Open City": {
    "name": "Open City",
    "type": "automated",
    "cost": 23,
    "tags": [
      "city",
      "building"
    ],
    "requirements": {
      "oxygen": 12
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 4
      },
      "stock": {
        "plants": 2
      },
      "city": true
    },
    "cardNumber": "108",
    "description": "Requires 12% oxygen. Gain 2 plants. Place a city tile. Decrease your energy production 1 step and increase your M€ production 4 steps.",
    "expansion": "base"
  },
  "Optimal Aerobraking": {
    "name": "Optimal Aerobraking",
    "type": "active",
    "cost": 7,
    "tags": [
      "space"
    ],
    "cardNumber": "031",
    "expansion": "base"
  },
  "Ore Processor": {
    "name": "Ore Processor",
    "type": "active",
    "cost": 13,
    "tags": [
      "building"
    ],
    "action": {
      "stock": {
        "titanium": 1
      },
      "global": {
        "oxygen": 1
      }
    },
    "cardNumber": "104",
    "expansion": "base"
  },
  "Permafrost Extraction": {
    "name": "Permafrost Extraction",
    "type": "event",
    "cost": 8,
    "requirements": {
      "temperature": -8
    },
    "behavior": {
      "ocean": true
    },
    "cardNumber": "191",
    "description": "Requires -8 C or warmer. Place 1 ocean tile.",
    "expansion": "base"
  },
  "Peroxide Power": {
    "name": "Peroxide Power",
    "type": "automated",
    "cost": 7,
    "tags": [
      "power",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": 2,
        "megacredits": -1
      }
    },
    "cardNumber": "089",
    "description": "Decrease your M€ production 1 step and increase your energy production 2 steps.",
    "expansion": "base"
  },
  "Pets": {
    "name": "Pets",
    "type": "active",
    "cost": 10,
    "tags": [
      "earth",
      "animal"
    ],
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "behavior": {
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "172",
    "description": "Add 1 animal to this card.",
    "expansion": "base"
  },
  "Phobos Space Haven": {
    "name": "Phobos Space Haven",
    "type": "automated",
    "cost": 25,
    "tags": [
      "space",
      "city"
    ],
    "vp": {
      "type": "static",
      "vp": 3
    },
    "behavior": {
      "production": {
        "titanium": 1
      },
      "city": true
    },
    "cardNumber": "021",
    "description": "Increase your titanium production 1 step and place a city tile ON THE RESERVED AREA.",
    "expansion": "base"
  },
  "Physics Complex": {
    "name": "Physics Complex",
    "type": "active",
    "cost": 12,
    "tags": [
      "science",
      "building"
    ],
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Science",
    "cardNumber": "095",
    "expansion": "base"
  },
  "Plantation": {
    "name": "Plantation",
    "type": "automated",
    "cost": 15,
    "tags": [
      "plant"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "behavior": {
      "greenery": true
    },
    "cardNumber": "193",
    "description": "Requires 2 science tags. Place a greenery tile and raise oxygen 1 step.",
    "expansion": "base"
  },
  "Power Grid": {
    "name": "Power Grid",
    "type": "automated",
    "cost": 18,
    "tags": [
      "power"
    ],
    "cardNumber": "102",
    "description": "Increase your energy production step for each power tag you have, including this.",
    "expansion": "base"
  },
  "Power Infrastructure": {
    "name": "Power Infrastructure",
    "type": "active",
    "cost": 4,
    "tags": [
      "power",
      "building"
    ],
    "cardNumber": "194",
    "expansion": "base"
  },
  "Power Plant": {
    "name": "Power Plant",
    "type": "automated",
    "cost": 4,
    "tags": [
      "power",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": 1
      }
    },
    "cardNumber": "141",
    "description": "Increase your energy production 1 step.",
    "expansion": "base"
  },
  "Power Supply Consortium": {
    "name": "Power Supply Consortium",
    "type": "automated",
    "cost": 5,
    "tags": [
      "power"
    ],
    "requirements": {
      "count": 2,
      "tag": "power"
    },
    "cardNumber": "160",
    "description": "Requires 2 power tags. Decrease any energy production 1 step and increase your own 1 step.",
    "expansion": "base"
  },
  "Predators": {
    "name": "Predators",
    "type": "active",
    "cost": 14,
    "tags": [
      "animal"
    ],
    "requirements": {
      "oxygen": 11
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "resourceType": "Animal",
    "cardNumber": "024",
    "description": "Requires 11% oxygen.",
    "expansion": "base"
  },
  "Protected Habitats": {
    "name": "Protected Habitats",
    "type": "active",
    "cost": 5,
    "cardNumber": "173",
    "expansion": "base"
  },
  "Protected Valley": {
    "name": "Protected Valley",
    "type": "automated",
    "cost": 23,
    "tags": [
      "plant",
      "building"
    ],
    "behavior": {
      "production": {
        "megacredits": 2
      },
      "greenery": true,
      "ocean": true
    },
    "cardNumber": "174",
    "description": "Increase your M€ production 2 steps. Place a greenery tile ON AN AREA RESERVED FOR OCEAN, disregarding normal placement restrictions, and increase oxygen 1 step.",
    "expansion": "base"
  },
  "Quantum Extractor": {
    "name": "Quantum Extractor",
    "type": "active",
    "cost": 13,
    "tags": [
      "science",
      "power"
    ],
    "requirements": {
      "count": 4,
      "tag": "science"
    },
    "behavior": {
      "production": {
        "energy": 4
      }
    },
    "cardDiscount": {
      "amount": 2,
      "tag": "space"
    },
    "cardNumber": "079",
    "description": "Requires 4 science tags. Increase your energy production 4 steps.",
    "expansion": "base"
  },
  "Rad-Chem Factory": {
    "name": "Rad-Chem Factory",
    "type": "automated",
    "cost": 8,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1
      },
      "tr": 2
    },
    "cardNumber": "205",
    "description": "Decrease your energy production 1 step. Raise your TR 2 steps.",
    "expansion": "base"
  },
  "Rad-Suits": {
    "name": "Rad-Suits",
    "type": "automated",
    "cost": 6,
    "requirements": {
      "cities": 2
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "186",
    "description": "Requires two cities in play. Increase your M€ production 1 step.",
    "expansion": "base"
  },
  "Regolith Eaters": {
    "name": "Regolith Eaters",
    "type": "active",
    "cost": 13,
    "tags": [
      "science",
      "microbe"
    ],
    "action": {
      "addResources": 1,
      "global": {
        "oxygen": 1
      }
    },
    "resourceType": "Microbe",
    "cardNumber": "033",
    "expansion": "base"
  },
  "Release of Inert Gases": {
    "name": "Release of Inert Gases",
    "type": "event",
    "cost": 14,
    "behavior": {
      "tr": 2
    },
    "cardNumber": "036",
    "description": "Raise your terraforming rating 2 steps.",
    "expansion": "base"
  },
  "Research": {
    "name": "Research",
    "type": "automated",
    "cost": 11,
    "tags": [
      "science",
      "science"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "drawCard": 2
    },
    "cardNumber": "090",
    "description": "Counts as playing 2 science cards. Draw 2 cards.",
    "expansion": "base"
  },
  "Research Outpost": {
    "name": "Research Outpost",
    "type": "active",
    "cost": 18,
    "tags": [
      "science",
      "city",
      "building"
    ],
    "behavior": {
      "city": true
    },
    "cardDiscount": {
      "amount": 1
    },
    "cardNumber": "020",
    "description": "Place a city tile NEXT TO NO OTHER TILE.",
    "expansion": "base"
  },
  "Robotic Workforce": {
    "name": "Robotic Workforce",
    "type": "automated",
    "cost": 9,
    "tags": [
      "science"
    ],
    "cardNumber": "086",
    "description": "Duplicate only the production box of one of your building cards.",
    "expansion": "base"
  },
  "Rover Construction": {
    "name": "Rover Construction",
    "type": "active",
    "cost": 8,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "038",
    "expansion": "base"
  },
  "Sabotage": {
    "name": "Sabotage",
    "type": "event",
    "cost": 1,
    "cardNumber": "121",
    "description": "Remove up to 3 titanium from any player, or 4 steel, or 7 M€.",
    "expansion": "base"
  },
  "Satellites": {
    "name": "Satellites",
    "type": "automated",
    "cost": 10,
    "tags": [
      "space"
    ],
    "cardNumber": "175",
    "description": "Increase your M€ production 1 step for each space tag you have, including this one.",
    "expansion": "base"
  },
  "Search For Life": {
    "name": "Search For Life",
    "type": "active",
    "cost": 3,
    "tags": [
      "science"
    ],
    "requirements": {
      "oxygen": 6
    },
    "vp": {
      "type": "special"
    },
    "resourceType": "Science",
    "cardNumber": "005",
    "description": "Oxygen must be 6% or less.",
    "expansion": "base"
  },
  "Security Fleet": {
    "name": "Security Fleet",
    "type": "active",
    "cost": 12,
    "tags": [
      "space"
    ],
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Fighter",
    "cardNumber": "028",
    "expansion": "base"
  },
  "Shuttles": {
    "name": "Shuttles",
    "type": "active",
    "cost": 10,
    "tags": [
      "space"
    ],
    "requirements": {
      "oxygen": 5
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 2
      }
    },
    "cardDiscount": {
      "amount": 2,
      "tag": "space"
    },
    "cardNumber": "166",
    "description": "Requires 5% oxygen. Decrease your energy production 1 step and increase your M€ production 2 steps.",
    "expansion": "base"
  },
  "Small Animals": {
    "name": "Small Animals",
    "type": "active",
    "cost": 6,
    "tags": [
      "animal"
    ],
    "requirements": {
      "oxygen": 6
    },
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "behavior": {
      "decreaseAnyProduction": {
        "type": "plants",
        "count": 1
      }
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "054",
    "description": "Requires 6% oxygen. Decrease any plant production 1 step.",
    "expansion": "base"
  },
  "Soil Factory": {
    "name": "Soil Factory",
    "type": "automated",
    "cost": 9,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": -1,
        "plants": 1
      }
    },
    "cardNumber": "179",
    "description": "Decrease your energy production 1 step and increase your plant production 1 step.",
    "expansion": "base"
  },
  "Solar Power": {
    "name": "Solar Power",
    "type": "automated",
    "cost": 11,
    "tags": [
      "power",
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": 1
      }
    },
    "cardNumber": "113",
    "description": "Increase your energy production 1 step.",
    "expansion": "base"
  },
  "Solar Wind Power": {
    "name": "Solar Wind Power",
    "type": "automated",
    "cost": 11,
    "tags": [
      "science",
      "space",
      "power"
    ],
    "behavior": {
      "production": {
        "energy": 1
      },
      "stock": {
        "titanium": 2
      }
    },
    "cardNumber": "077",
    "description": "Increase your energy production 1 step and gain 2 titanium.",
    "expansion": "base"
  },
  "Soletta": {
    "name": "Soletta",
    "type": "automated",
    "cost": 35,
    "tags": [
      "space"
    ],
    "behavior": {
      "production": {
        "heat": 7
      }
    },
    "cardNumber": "203",
    "description": "Increase your heat production 7 steps.",
    "expansion": "base"
  },
  "Space Elevator": {
    "name": "Space Elevator",
    "type": "active",
    "cost": 27,
    "tags": [
      "space",
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "titanium": 1
      }
    },
    "action": {
      "stock": {
        "megacredits": 5
      }
    },
    "cardNumber": "013",
    "description": "Increase your titanium production 1 step.",
    "expansion": "base"
  },
  "Space Mirrors": {
    "name": "Space Mirrors",
    "type": "active",
    "cost": 3,
    "tags": [
      "power",
      "space"
    ],
    "action": {
      "production": {
        "energy": 1
      }
    },
    "cardNumber": "076",
    "expansion": "base"
  },
  "Space Station": {
    "name": "Space Station",
    "type": "active",
    "cost": 10,
    "tags": [
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardDiscount": {
      "amount": 2,
      "tag": "space"
    },
    "cardNumber": "025",
    "expansion": "base"
  },
  "Special Design": {
    "name": "Special Design",
    "type": "event",
    "cost": 4,
    "tags": [
      "science"
    ],
    "cardNumber": "206",
    "description": "The next card you play this generation is +2 or -2 steps in global requirements, your choice.",
    "expansion": "base"
  },
  "Sponsors": {
    "name": "Sponsors",
    "type": "automated",
    "cost": 6,
    "tags": [
      "earth"
    ],
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "068",
    "description": "Increase your M€ production 2 steps.",
    "expansion": "base"
  },
  "Aquifer": {
    "name": "Aquifer",
    "cost": 18,
    "cardNumber": "SP2",
    "expansion": "base"
  },
  "City": {
    "name": "City",
    "cost": 25,
    "cardNumber": "SP4",
    "expansion": "base"
  },
  "Greenery": {
    "name": "Greenery",
    "cost": 23,
    "cardNumber": "SP6",
    "expansion": "base"
  },
  "Sell Patents": {
    "name": "Sell Patents",
    "cost": 0,
    "cardNumber": "SP8",
    "expansion": "base"
  },
  "Standard Technology": {
    "name": "Standard Technology",
    "type": "active",
    "cost": 6,
    "tags": [
      "science"
    ],
    "cardNumber": "156",
    "expansion": "base"
  },
  "Steelworks": {
    "name": "Steelworks",
    "type": "active",
    "cost": 15,
    "tags": [
      "building"
    ],
    "action": {
      "stock": {
        "steel": 2
      },
      "global": {
        "oxygen": 1
      }
    },
    "cardNumber": "103",
    "expansion": "base"
  },
  "Strip Mine": {
    "name": "Strip Mine",
    "type": "automated",
    "cost": 25,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -2,
        "steel": 2,
        "titanium": 1
      },
      "global": {
        "oxygen": 2
      }
    },
    "cardNumber": "138",
    "description": "Decrease your energy production 2 steps. Increase your steel production 2 steps and your titanium production 1 step. Raise oxygen 2 steps.",
    "expansion": "base"
  },
  "Subterranean Reservoir": {
    "name": "Subterranean Reservoir",
    "type": "event",
    "cost": 11,
    "behavior": {
      "ocean": true
    },
    "cardNumber": "127",
    "description": "Place 1 ocean tile.",
    "expansion": "base"
  },
  "Symbiotic Fungus": {
    "name": "Symbiotic Fungus",
    "type": "active",
    "cost": 4,
    "tags": [
      "microbe"
    ],
    "requirements": {
      "temperature": -14
    },
    "action": {
      "temperature": true
    },
    "cardNumber": "133",
    "description": "Requires -14 C° or warmer.",
    "expansion": "base"
  },
  "Tardigrades": {
    "name": "Tardigrades",
    "type": "active",
    "cost": 4,
    "tags": [
      "microbe"
    ],
    "vp": {
      "type": "per_resource",
      "per": 4
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Microbe",
    "cardNumber": "049",
    "expansion": "base"
  },
  "Technology Demonstration": {
    "name": "Technology Demonstration",
    "type": "event",
    "cost": 5,
    "tags": [
      "science",
      "space"
    ],
    "behavior": {
      "drawCard": 2
    },
    "cardNumber": "204",
    "description": "Draw two cards.",
    "expansion": "base"
  },
  "Tectonic Stress Power": {
    "name": "Tectonic Stress Power",
    "type": "automated",
    "cost": 18,
    "tags": [
      "power",
      "building"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": 3
      }
    },
    "cardNumber": "145",
    "description": "Requires 2 science tags. Increase your energy production 3 steps.",
    "expansion": "base"
  },
  "Terraforming Ganymede": {
    "name": "Terraforming Ganymede",
    "type": "automated",
    "cost": 33,
    "tags": [
      "jovian",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "197",
    "description": "Raise your TR 1 step for each Jovian tag you have, including this.",
    "expansion": "base"
  },
  "Titanium Mine": {
    "name": "Titanium Mine",
    "type": "automated",
    "cost": 7,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      }
    },
    "cardNumber": "144",
    "description": "Increase your titanium production 1 step.",
    "expansion": "base"
  },
  "Toll Station": {
    "name": "Toll Station",
    "type": "automated",
    "cost": 12,
    "tags": [
      "space"
    ],
    "cardNumber": "099",
    "description": "Increase your M€ production 1 step for each space tag your OPPONENTS have.",
    "expansion": "base"
  },
  "Towing A Comet": {
    "name": "Towing A Comet",
    "type": "event",
    "cost": 23,
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "plants": 2
      },
      "global": {
        "oxygen": 1
      },
      "ocean": true
    },
    "cardNumber": "075",
    "description": "Gain 2 plants. Raise oxygen level 1 step and place an ocean tile.",
    "expansion": "base"
  },
  "Trans-Neptune Probe": {
    "name": "Trans-Neptune Probe",
    "type": "automated",
    "cost": 6,
    "tags": [
      "science",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "084",
    "expansion": "base"
  },
  "Trees": {
    "name": "Trees",
    "type": "automated",
    "cost": 13,
    "tags": [
      "plant"
    ],
    "requirements": {
      "temperature": -4
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "plants": 3
      },
      "stock": {
        "plants": 1
      }
    },
    "cardNumber": "060",
    "description": "Requires -4 C or warmer. Increase your plant production 3 steps. Gain 1 plant.",
    "expansion": "base"
  },
  "Tropical Resort": {
    "name": "Tropical Resort",
    "type": "automated",
    "cost": 13,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "megacredits": 3,
        "heat": -2
      }
    },
    "cardNumber": "098",
    "description": "Reduce your heat production 2 steps and increase your M€ production 3 steps.",
    "expansion": "base"
  },
  "Tundra Farming": {
    "name": "Tundra Farming",
    "type": "automated",
    "cost": 16,
    "tags": [
      "plant"
    ],
    "requirements": {
      "temperature": -6
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "plants": 1,
        "megacredits": 2
      },
      "stock": {
        "plants": 1
      }
    },
    "cardNumber": "169",
    "description": "Requires -6° C or warmer. Increase your plant production 1 step and your M€ production 2 steps. Gain 1 plant.",
    "expansion": "base"
  },
  "Underground City": {
    "name": "Underground City",
    "type": "automated",
    "cost": 18,
    "tags": [
      "city",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -2,
        "steel": 2
      },
      "city": true
    },
    "cardNumber": "032",
    "description": "Place a city tile. Decrease your energy production 2 steps and increase your steel production 2 steps.",
    "expansion": "base"
  },
  "Underground Detonations": {
    "name": "Underground Detonations",
    "type": "active",
    "cost": 6,
    "tags": [
      "building"
    ],
    "action": {
      "production": {
        "heat": 2
      }
    },
    "cardNumber": "202",
    "expansion": "base"
  },
  "Urbanized Area": {
    "name": "Urbanized Area",
    "type": "automated",
    "cost": 10,
    "tags": [
      "city",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 2
      }
    },
    "cardNumber": "120",
    "description": "Decrease your energy production 1 step and increase your M€ production 2 steps. Place a city tile ADJACENT TO AT LEAST 2 OTHER CITY TILES.",
    "expansion": "base"
  },
  "Vesta Shipyard": {
    "name": "Vesta Shipyard",
    "type": "automated",
    "cost": 15,
    "tags": [
      "jovian",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "titanium": 1
      }
    },
    "cardNumber": "057",
    "description": "Increase your titanium production 1 step.",
    "expansion": "base"
  },
  "Viral Enhancers": {
    "name": "Viral Enhancers",
    "type": "active",
    "cost": 9,
    "tags": [
      "science",
      "microbe"
    ],
    "cardNumber": "074",
    "expansion": "base"
  },
  "Virus": {
    "name": "Virus",
    "type": "event",
    "cost": 1,
    "tags": [
      "microbe"
    ],
    "cardNumber": "050",
    "description": "Remove up to 2 animals or 5 plants from any player.",
    "expansion": "base"
  },
  "Water Import From Europa": {
    "name": "Water Import From Europa",
    "type": "active",
    "cost": 25,
    "tags": [
      "jovian",
      "space"
    ],
    "vp": {
      "type": "per_tag",
      "tag": "jovian",
      "per": 1
    },
    "cardNumber": "012",
    "expansion": "base"
  },
  "Water Splitting Plant": {
    "name": "Water Splitting Plant",
    "type": "active",
    "cost": 12,
    "tags": [
      "building"
    ],
    "requirements": {
      "oceans": 2
    },
    "action": {
      "global": {
        "oxygen": 1
      }
    },
    "cardNumber": "177",
    "description": "Requires 2 ocean tiles.",
    "expansion": "base"
  },
  "Wave Power": {
    "name": "Wave Power",
    "type": "automated",
    "cost": 8,
    "tags": [
      "power"
    ],
    "requirements": {
      "oceans": 3
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": 1
      }
    },
    "cardNumber": "139",
    "description": "Requires 3 ocean tiles. Increase your energy production 1 step.",
    "expansion": "base"
  },
  "Windmills": {
    "name": "Windmills",
    "type": "automated",
    "cost": 6,
    "tags": [
      "power",
      "building"
    ],
    "requirements": {
      "oxygen": 7
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": 1
      }
    },
    "cardNumber": "168",
    "description": "Requires 7% oxygen. Increase your energy production 1 step.",
    "expansion": "base"
  },
  "Worms": {
    "name": "Worms",
    "type": "automated",
    "cost": 8,
    "tags": [
      "microbe"
    ],
    "requirements": {
      "oxygen": 4
    },
    "behavior": {
      "production": {
        "per": 2
      }
    },
    "cardNumber": "130",
    "description": "Requires 4% oxygen. Increase your plant production 1 step for every 2 microbe tags you have, including this.",
    "expansion": "base"
  },
  "Zeppelins": {
    "name": "Zeppelins",
    "type": "automated",
    "cost": 13,
    "requirements": {
      "oxygen": 5
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "129",
    "description": "Requires 5% oxygen. Increase your M€ production 1 step for each city tile ON MARS.",
    "expansion": "base"
  },
  "Apollo": {
    "name": "Apollo",
    "cardNumber": "L35",
    "description": "Once per game, gain 3 M€ for each tile on The Moon.",
    "expansion": "ceos"
  },
  "Asimov": {
    "name": "Asimov",
    "cardNumber": "L01",
    "description": "Once per game, draw 10-X awards (min. 1), where X is the current generation number. You may put one into the game and fund it for free.",
    "expansion": "ceos"
  },
  "Bjorn": {
    "name": "Bjorn",
    "cardNumber": "L02",
    "description": "Once per game, steal X+2 M€ from each player that has more M€ than you, where X is the current generation number.",
    "expansion": "ceos"
  },
  "Caesar": {
    "name": "Caesar",
    "cardNumber": "L33",
    "description": "Once per game, place X hazard tiles where X is the current generation number. Each opponent loses 1 unit of production of their choice, or 2 units if there are 6 or more hazard tiles.",
    "expansion": "ceos"
  },
  "Clarke": {
    "name": "Clarke",
    "cardNumber": "L03",
    "description": "Once per game, increase your plant and heat production 1 step each. Gain plants and heat equal to your production +4.",
    "expansion": "ceos"
  },
  "Co-leadership": {
    "name": "Co-leadership",
    "cardNumber": "xxx",
    "expansion": "ceos"
  },
  "Duncan": {
    "name": "Duncan",
    "vp": {
      "type": "special"
    },
    "cardNumber": "L04",
    "description": "Once per game, gain 7-X VP and 4X M€, where X is the current generation number.",
    "expansion": "ceos"
  },
  "Ender": {
    "name": "Ender",
    "cardNumber": "L05",
    "description": "Once per game, discard any number of cards up to twice the current generation number to draw that many cards.",
    "expansion": "ceos"
  },
  "Faraday": {
    "name": "Faraday",
    "cardNumber": "L27",
    "description": "When you gain a multiple of 5 for any tag type IN PLAY, you may pay 3 M€ to draw a card with that tag. Wild tags do not count for this effect.",
    "expansion": "ceos"
  },
  "Floyd": {
    "name": "Floyd",
    "cardNumber": "L06",
    "description": "Once per game, play a card from hand for 13 + 2X M€ less, where X is the current generation number.",
    "expansion": "ceos"
  },
  "Gaia": {
    "name": "Gaia",
    "cardNumber": "L32",
    "description": "Once per game, gain the Ares adjacency bonuses of all player-owned tiles on Mars.",
    "expansion": "ceos"
  },
  "Gordon": {
    "name": "Gordon",
    "cardNumber": "L07",
    "expansion": "ceos"
  },
  "Greta": {
    "name": "Greta",
    "cardNumber": "L31",
    "description": "When you take an action or play a card that increases your TR THIS GENERATION (max 10 times), gain 4 M€.",
    "expansion": "ceos"
  },
  "HAL 9000": {
    "name": "HAL 9000",
    "cardNumber": "L08",
    "description": "Once per game, decrease each of your productions 1 step to gain 4 of that resource.",
    "expansion": "ceos"
  },
  "Huan": {
    "name": "Huan",
    "cardNumber": "L29",
    "description": "ALL OPPONENTS CANNOT TRADE NEXT GENERATION. Gain 1 Trade Fleet.",
    "expansion": "ceos"
  },
  "Ingrid": {
    "name": "Ingrid",
    "cardNumber": "L09",
    "description": "When you take an action that places a tile on Mars THIS GENERATION, draw a card.",
    "expansion": "ceos"
  },
  "Jansson": {
    "name": "Jansson",
    "cardNumber": "L10",
    "description": "Once per game, gain all placement bonuses under your tiles on Mars.",
    "expansion": "ceos"
  },
  "Karen": {
    "name": "Karen",
    "cardNumber": "L11",
    "description": "Once per game, draw Prelude cards equal to the current generation number and choose one to play, and discard the rest.",
    "expansion": "ceos"
  },
  "Lowell": {
    "name": "Lowell",
    "tags": [
      "wild"
    ],
    "cardNumber": "L12",
    "description": "Once per game, pay 8 M€ to draw 3 CEO cards and choose one to play. Discard this card.",
    "expansion": "ceos"
  },
  "Maria": {
    "name": "Maria",
    "cardNumber": "L13",
    "description": "Once per game, draw colony tiles equal to the current generation number. Put one into play and build a colony on it for free if possible.",
    "expansion": "ceos"
  },
  "Musk": {
    "name": "Musk",
    "cardNumber": "L28",
    "description": "Once per game, discard any number of Earth cards to draw that many space cards, and gain that many units of titanium, plus 6.",
    "expansion": "ceos"
  },
  "Naomi": {
    "name": "Naomi",
    "cardNumber": "L14",
    "description": "Once per game, move each colony tile track marker to its highest or lowest value.",
    "expansion": "ceos"
  },
  "Neil": {
    "name": "Neil",
    "cardNumber": "L34",
    "description": "Once per game, increase your M€ production by the value of the LOWEST Moon rate.",
    "expansion": "ceos"
  },
  "Oscar": {
    "name": "Oscar",
    "cardNumber": "L15",
    "description": "Once per game, replace the Chairman with one of your delegates.",
    "expansion": "ceos"
  },
  "Petra": {
    "name": "Petra",
    "cardNumber": "L16",
    "description": "Once per game, replace all Neutral delegates with your delegates. Gain 3 M€ for each delegate replaced this way. Place 3 Neutral delegates.",
    "expansion": "ceos"
  },
  "Quill": {
    "name": "Quill",
    "cardNumber": "L17",
    "description": "Once per game, add 2 floaters to each of your cards that collect floaters, then add 2 floaters to ANY card. Gain 1 M€ for every 2 floaters added this way.",
    "expansion": "ceos"
  },
  "Rogers": {
    "name": "Rogers",
    "cardNumber": "L18",
    "description": "Ignore global requirements for your Venus cards THIS GENERATION. When you play a Venus tag THIS GENERATION, you pay 3 M€ less for it.",
    "expansion": "ceos"
  },
  "Ryu": {
    "name": "Ryu",
    "cardNumber": "L30",
    "description": "Once per game, swap up to X+2 units of production between two resources, where X is the current generation number.",
    "expansion": "ceos"
  },
  "Shara": {
    "name": "Shara",
    "cardNumber": "LXXX",
    "description": "Once per game, choose a planet tag. This card counts as having immediately played 2 of that tag. Then gain M€ equal to that tags planety influence track minus the current generation.",
    "expansion": "ceos"
  },
  "Stefan": {
    "name": "Stefan",
    "cardNumber": "L19",
    "description": "Once per game, sell any number of cards from your hand for 3 M€ each.",
    "expansion": "ceos"
  },
  "Tate": {
    "name": "Tate",
    "cardNumber": "L20",
    "description": "Once per game, name a tag. Reveal cards from the deck until you find 5 cards with that tag. BUY up to 2 cards and discard the rest.",
    "expansion": "ceos"
  },
  "Ulrich": {
    "name": "Ulrich",
    "cardNumber": "L21",
    "description": "Once per game, gain 4 M€ for each ocean placed. If all oceans are aleady placed, gain only 15 M€.",
    "expansion": "ceos"
  },
  "Van Allen": {
    "name": "Van Allen",
    "cardNumber": "L22",
    "expansion": "ceos"
  },
  "Will": {
    "name": "Will",
    "cardNumber": "L23",
    "description": "Once per game, add the following resources to your cards: 2 animals, 2 microbes, 2 floaters, 2 wild.",
    "expansion": "ceos"
  },
  "Xavier": {
    "name": "Xavier",
    "cardNumber": "L24",
    "expansion": "ceos"
  },
  "Xu": {
    "name": "Xu",
    "tags": [
      "venus"
    ],
    "cardNumber": "L37",
    "description": "Once per game, gain 2 M€ for each Venus tag in play. Gain an additional 8 M€ if you have the most Venus tags in play.",
    "expansion": "ceos"
  },
  "Yvonne": {
    "name": "Yvonne",
    "cardNumber": "L25",
    "description": "Once per game, gain all your colony bonuses twice.",
    "expansion": "ceos"
  },
  "Zan": {
    "name": "Zan",
    "cardNumber": "L26",
    "description": "Once per game, place all of your available delegates in Reds. Gain 1 M€ for each delegate placed this way.",
    "expansion": "ceos"
  },
  "Airliners": {
    "name": "Airliners",
    "type": "automated",
    "cost": 11,
    "requirements": {
      "floaters": 3
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "C01",
    "description": "Requires that you have 3 floaters. Increase your M€ production 2 steps. Add 2 floaters to ANY card.",
    "expansion": "colonies"
  },
  "Air Raid": {
    "name": "Air Raid",
    "type": "event",
    "cost": 0,
    "cardNumber": "C02",
    "description": "Requires that you lose 1 floater. Steal 5 M€ from any player.",
    "expansion": "colonies"
  },
  "Aridor": {
    "name": "Aridor",
    "cardNumber": "R20",
    "description": "You start with 40 M€. As your first action, put an additional Colony Tile of your choice into play",
    "expansion": "colonies"
  },
  "Arklight": {
    "name": "Arklight",
    "tags": [
      "animal"
    ],
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "resourceType": "Animal",
    "cardNumber": "R04",
    "description": "You start with 45 M€. Increase your M€ production 2 steps. 1 VP per 2 animals on this card.",
    "expansion": "colonies"
  },
  "Atmo Collectors": {
    "name": "Atmo Collectors",
    "type": "active",
    "cost": 15,
    "action": {
      "addResources": 1,
      "stock": {
        "titanium": 2
      }
    },
    "resourceType": "Floater",
    "cardNumber": "C03",
    "description": "Add 2 floaters to ANY card.",
    "expansion": "colonies"
  },
  "Colony": {
    "name": "Colony",
    "cost": 17,
    "cardNumber": "SP5",
    "expansion": "colonies"
  },
  "Community Services": {
    "name": "Community Services",
    "type": "automated",
    "cost": 13,
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "C04",
    "description": "Increase your M€ production 1 step per CARD WITH NO TAGS, including this.",
    "expansion": "colonies"
  },
  "Conscription": {
    "name": "Conscription",
    "type": "event",
    "cost": 5,
    "tags": [
      "earth"
    ],
    "requirements": {
      "count": 2,
      "tag": "earth"
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "C05",
    "description": "Requires 2 Earth tags. The next card you play this generation costs 16 M€ less.",
    "expansion": "colonies"
  },
  "Corona Extractor": {
    "name": "Corona Extractor",
    "type": "automated",
    "cost": 10,
    "tags": [
      "space",
      "power"
    ],
    "requirements": {
      "count": 4,
      "tag": "science"
    },
    "behavior": {
      "production": {
        "energy": 4
      }
    },
    "cardNumber": "C06",
    "description": "Requires 4 science tags. Increase your energy production 4 steps.",
    "expansion": "colonies"
  },
  "Cryo-Sleep": {
    "name": "Cryo-Sleep",
    "type": "active",
    "cost": 10,
    "tags": [
      "science"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "C07",
    "expansion": "colonies"
  },
  "Earth Elevator": {
    "name": "Earth Elevator",
    "type": "automated",
    "cost": 43,
    "tags": [
      "space",
      "earth"
    ],
    "vp": {
      "type": "static",
      "vp": 4
    },
    "behavior": {
      "production": {
        "titanium": 3
      }
    },
    "cardNumber": "C08",
    "description": "Increase your titanium production 3 steps.",
    "expansion": "colonies"
  },
  "Ecology Research": {
    "name": "Ecology Research",
    "type": "automated",
    "cost": 21,
    "tags": [
      "science",
      "plant",
      "animal",
      "microbe"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "C09",
    "description": "Increase your plant production 1 step for each colony you own. Add 1 animal to ANOTHER card and 2 microbes to ANOTHER card.",
    "expansion": "colonies"
  },
  "Floater Leasing": {
    "name": "Floater Leasing",
    "type": "automated",
    "cost": 3,
    "behavior": {
      "production": {
        "per": 3
      }
    },
    "cardNumber": "C10",
    "description": "Increase your M€ production 1 step PER 3 floaters you have.",
    "expansion": "colonies"
  },
  "Floater Prototypes": {
    "name": "Floater Prototypes",
    "type": "event",
    "cost": 2,
    "tags": [
      "science"
    ],
    "cardNumber": "C11",
    "description": "Add two floaters to ANOTHER card.",
    "expansion": "colonies"
  },
  "Floater Technology": {
    "name": "Floater Technology",
    "type": "active",
    "cost": 7,
    "tags": [
      "science"
    ],
    "cardNumber": "C12",
    "expansion": "colonies"
  },
  "Galilean Waystation": {
    "name": "Galilean Waystation",
    "type": "automated",
    "cost": 15,
    "tags": [
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "C13",
    "description": "Increase your M€ production 1 step for every Jovian tag in play.",
    "expansion": "colonies"
  },
  "Heavy Taxation": {
    "name": "Heavy Taxation",
    "type": "automated",
    "cost": 3,
    "tags": [
      "earth"
    ],
    "requirements": {
      "count": 2,
      "tag": "earth"
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "behavior": {
      "production": {
        "megacredits": 2
      },
      "stock": {
        "megacredits": 4
      }
    },
    "cardNumber": "C14",
    "description": "Requires 2 Earth tags. Increase your M€ production 2 steps, and gain 4 M€.",
    "expansion": "colonies"
  },
  "Ice Moon Colony": {
    "name": "Ice Moon Colony",
    "type": "automated",
    "cost": 23,
    "tags": [
      "space"
    ],
    "behavior": {
      "ocean": true,
      "colony": true
    },
    "cardNumber": "C15",
    "description": "Place 1 colony and 1 ocean tile.",
    "expansion": "colonies"
  },
  "Impactor Swarm": {
    "name": "Impactor Swarm",
    "type": "event",
    "cost": 11,
    "tags": [
      "space"
    ],
    "requirements": {
      "count": 2,
      "tag": "jovian"
    },
    "behavior": {
      "stock": {
        "heat": 12
      },
      "removeAnyPlants": 2
    },
    "cardNumber": "C16",
    "description": "Requires 2 Jovian tags. Gain 12 heat. Remove up to 2 plants from any player.",
    "expansion": "colonies"
  },
  "Interplanetary Colony Ship": {
    "name": "Interplanetary Colony Ship",
    "type": "event",
    "cost": 12,
    "tags": [
      "space",
      "earth"
    ],
    "behavior": {
      "colony": true
    },
    "cardNumber": "C17",
    "description": "Place a colony.",
    "expansion": "colonies"
  },
  "Jovian Lanterns": {
    "name": "Jovian Lanterns",
    "type": "active",
    "cost": 20,
    "tags": [
      "jovian"
    ],
    "requirements": {
      "tag": "jovian"
    },
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "behavior": {
      "tr": 1
    },
    "resourceType": "Floater",
    "cardNumber": "C18",
    "description": "Requires 1 Jovian tag. Increase your TR 1 step. Add 2 floaters to ANY card.",
    "expansion": "colonies"
  },
  "Jupiter Floating Station": {
    "name": "Jupiter Floating Station",
    "type": "active",
    "cost": 9,
    "tags": [
      "jovian"
    ],
    "requirements": {
      "count": 3,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "resourceType": "Floater",
    "cardNumber": "C19",
    "description": "Requires 3 science tags.",
    "expansion": "colonies"
  },
  "Luna Governor": {
    "name": "Luna Governor",
    "type": "automated",
    "cost": 4,
    "tags": [
      "earth",
      "earth"
    ],
    "requirements": {
      "count": 3,
      "tag": "earth"
    },
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "C20",
    "description": "Requires 3 Earth tags. Increase your M€ production 2 steps.",
    "expansion": "colonies"
  },
  "Lunar Exports": {
    "name": "Lunar Exports",
    "type": "automated",
    "cost": 19,
    "tags": [
      "earth",
      "space"
    ],
    "behavior": {
      "production": {
        "megacredits": 5
      }
    },
    "cardNumber": "C21",
    "description": "Increase your plant production 2 steps, or your M€ production 5 steps.",
    "expansion": "colonies"
  },
  "Lunar Mining": {
    "name": "Lunar Mining",
    "type": "automated",
    "cost": 11,
    "tags": [
      "earth"
    ],
    "behavior": {
      "production": {
        "per": 2
      }
    },
    "cardNumber": "C22",
    "description": "Increase your titanium production 1 step for every 2 Earth tags you have in play, including this.",
    "expansion": "colonies"
  },
  "Market Manipulation": {
    "name": "Market Manipulation",
    "type": "event",
    "cost": 1,
    "tags": [
      "earth"
    ],
    "cardNumber": "C23",
    "expansion": "colonies"
  },
  "Martian Zoo": {
    "name": "Martian Zoo",
    "type": "active",
    "cost": 12,
    "tags": [
      "animal",
      "building"
    ],
    "requirements": {
      "cities": 2
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "resourceType": "Animal",
    "cardNumber": "C24",
    "description": "Requires 2 city tiles in play.",
    "expansion": "colonies"
  },
  "Mining Colony": {
    "name": "Mining Colony",
    "type": "automated",
    "cost": 20,
    "tags": [
      "space"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      },
      "colony": true
    },
    "cardNumber": "C25",
    "description": "Increase your titanium production 1 step. Place a colony.",
    "expansion": "colonies"
  },
  "Minority Refuge": {
    "name": "Minority Refuge",
    "type": "automated",
    "cost": 5,
    "tags": [
      "space"
    ],
    "cardNumber": "C26",
    "description": "Decrease your M€ production 2 steps. Place a colony.",
    "expansion": "colonies"
  },
  "Molecular Printing": {
    "name": "Molecular Printing",
    "type": "automated",
    "cost": 11,
    "tags": [
      "science"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "C27",
    "description": "Gain 1 M€ for each city tile in play. Gain 1 M€ for each colony in play.",
    "expansion": "colonies"
  },
  "Nitrogen from Titan": {
    "name": "Nitrogen from Titan",
    "type": "automated",
    "cost": 25,
    "tags": [
      "jovian",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "tr": 2
    },
    "cardNumber": "C28",
    "description": "Raise your TR 2 steps. Add 2 floaters to a JOVIAN CARD.",
    "expansion": "colonies"
  },
  "Pioneer Settlement": {
    "name": "Pioneer Settlement",
    "type": "automated",
    "cost": 13,
    "tags": [
      "space"
    ],
    "requirements": {
      "colonies": 1
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "C29",
    "description": "Requires that you have no more than 1 colony. Decrease your M€ production 2 steps. Place a colony.",
    "expansion": "colonies"
  },
  "Polyphemos": {
    "name": "Polyphemos",
    "behavior": {
      "production": {
        "megacredits": 5
      },
      "stock": {
        "titanium": 5
      }
    },
    "cardNumber": "R11",
    "description": "You start with 50 M€. Increase your M€ production 5 steps. Gain 5 titanium.",
    "expansion": "colonies"
  },
  "Poseidon": {
    "name": "Poseidon",
    "cardNumber": "R02",
    "description": "You start with 45 M€. As your first action, place a colony.",
    "expansion": "colonies"
  },
  "Productive Outpost": {
    "name": "Productive Outpost",
    "type": "automated",
    "cost": 0,
    "cardNumber": "C30",
    "expansion": "colonies"
  },
  "Quantum Communications": {
    "name": "Quantum Communications",
    "type": "automated",
    "cost": 8,
    "requirements": {
      "count": 4,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "C31",
    "description": "Requires 4 science tags. Increase your M€ production 1 step for each colony in play.",
    "expansion": "colonies"
  },
  "Red Spot Observatory": {
    "name": "Red Spot Observatory",
    "type": "active",
    "cost": 17,
    "tags": [
      "jovian",
      "science"
    ],
    "requirements": {
      "count": 3,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "drawCard": 2
    },
    "resourceType": "Floater",
    "cardNumber": "C32",
    "description": "Requires 3 science tags. Draw 2 cards.",
    "expansion": "colonies"
  },
  "Refugee Camps": {
    "name": "Refugee Camps",
    "type": "active",
    "cost": 10,
    "tags": [
      "earth"
    ],
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "action": {
      "addResources": 1,
      "production": {
        "megacredits": -1
      }
    },
    "resourceType": "Camp",
    "cardNumber": "C33",
    "expansion": "colonies"
  },
  "Research Colony": {
    "name": "Research Colony",
    "type": "automated",
    "cost": 20,
    "tags": [
      "space",
      "science"
    ],
    "behavior": {
      "colony": true,
      "drawCard": 2
    },
    "cardNumber": "C34",
    "description": "Place a colony. MAY BE PLACED WHERE YOU ALREADY HAVE A COLONY. Draw 2 cards.",
    "expansion": "colonies"
  },
  "Rim Freighters": {
    "name": "Rim Freighters",
    "type": "active",
    "cost": 4,
    "tags": [
      "space"
    ],
    "cardNumber": "C35",
    "expansion": "colonies"
  },
  "Sky Docks": {
    "name": "Sky Docks",
    "type": "active",
    "cost": 18,
    "tags": [
      "space",
      "earth"
    ],
    "requirements": {
      "count": 2,
      "tag": "earth"
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "tradeFleet": true
    },
    "cardDiscount": {
      "amount": 1
    },
    "cardNumber": "C36",
    "description": "Requires 2 Earth tags. Gain 1 Trade Fleet.",
    "expansion": "colonies"
  },
  "Solar Probe": {
    "name": "Solar Probe",
    "type": "event",
    "cost": 9,
    "tags": [
      "space",
      "science"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "C37",
    "description": "Draw 1 card for every 3 science tags you have, including this.",
    "expansion": "colonies"
  },
  "Solar Reflectors": {
    "name": "Solar Reflectors",
    "type": "automated",
    "cost": 23,
    "tags": [
      "space"
    ],
    "behavior": {
      "production": {
        "heat": 5
      }
    },
    "cardNumber": "C38",
    "description": "Increase your heat production 5 steps.",
    "expansion": "colonies"
  },
  "Space Port": {
    "name": "Space Port",
    "type": "automated",
    "cost": 22,
    "tags": [
      "city",
      "building"
    ],
    "requirements": {
      "colonies": 1
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 4
      },
      "city": true,
      "tradeFleet": true
    },
    "cardNumber": "C39",
    "description": "Requires 1 colony. Decrease your energy production 1 step and increase your M€ production 4 steps. Place a city tile. Gain 1 Trade Fleet.",
    "expansion": "colonies"
  },
  "Space Port Colony": {
    "name": "Space Port Colony",
    "type": "automated",
    "cost": 27,
    "tags": [
      "space"
    ],
    "requirements": {
      "colonies": 1
    },
    "vp": {
      "type": "per_colony",
      "per": 2
    },
    "behavior": {
      "colony": true,
      "tradeFleet": true
    },
    "cardNumber": "C40",
    "description": "Requires a colony. Place a colony. MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY. Gain 1 Trade Fleet.",
    "expansion": "colonies"
  },
  "Spin-off Department": {
    "name": "Spin-off Department",
    "type": "active",
    "cost": 10,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "C41",
    "description": "Increase your M€ production 2 steps.",
    "expansion": "colonies"
  },
  "Stormcraft Incorporated": {
    "name": "Stormcraft Incorporated",
    "type": "cardresource.floater",
    "tags": [
      "jovian"
    ],
    "resourceType": "Floater",
    "cardNumber": "R29",
    "description": "You start with 48 M€.",
    "expansion": "colonies"
  },
  "Sub-zero Salt Fish": {
    "name": "Sub-zero Salt Fish",
    "type": "active",
    "cost": 5,
    "tags": [
      "animal"
    ],
    "requirements": {
      "temperature": -6
    },
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "behavior": {
      "decreaseAnyProduction": {
        "type": "plants",
        "count": 1
      }
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "C42",
    "description": "Requires -6 C. Decrease any plant production 1 step.",
    "expansion": "colonies"
  },
  "Titan Air-scrapping": {
    "name": "Titan Air-scrapping",
    "type": "active",
    "cost": 21,
    "tags": [
      "jovian"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "resourceType": "Floater",
    "cardNumber": "C43",
    "expansion": "colonies"
  },
  "Titan Floating Launch-pad": {
    "name": "Titan Floating Launch-pad",
    "type": "active",
    "cost": 18,
    "tags": [
      "jovian"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "resourceType": "Floater",
    "cardNumber": "C44",
    "description": "Add two floaters to ANY JOVIAN CARD.",
    "expansion": "colonies"
  },
  "Titan Shuttles": {
    "name": "Titan Shuttles",
    "type": "active",
    "cost": 23,
    "tags": [
      "jovian",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "resourceType": "Floater",
    "cardNumber": "C45",
    "expansion": "colonies"
  },
  "Trade Envoys": {
    "name": "Trade Envoys",
    "type": "active",
    "cost": 6,
    "cardNumber": "C46",
    "expansion": "colonies"
  },
  "Trading Colony": {
    "name": "Trading Colony",
    "type": "active",
    "cost": 18,
    "tags": [
      "space"
    ],
    "behavior": {
      "colony": true
    },
    "cardNumber": "C47",
    "description": "Place a colony.",
    "expansion": "colonies"
  },
  "Urban Decomposers": {
    "name": "Urban Decomposers",
    "type": "automated",
    "cost": 6,
    "tags": [
      "microbe"
    ],
    "requirements": {
      "colonies": 1,
      "cities": 1
    },
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "C48",
    "description": "Requires that you have 1 city tile and 1 colony in play. Increase your plant production 1 step, and add 2 microbes to ANOTHER card.",
    "expansion": "colonies"
  },
  "Warp Drive": {
    "name": "Warp Drive",
    "type": "active",
    "cost": 14,
    "tags": [
      "science"
    ],
    "requirements": {
      "count": 5,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardDiscount": {
      "amount": 4,
      "tag": "space"
    },
    "cardNumber": "C49",
    "description": "Requires 5 science tags.",
    "expansion": "colonies"
  },
  "Aerospace Mission": {
    "name": "Aerospace Mission",
    "tags": [
      "space"
    ],
    "cardNumber": "Y01",
    "description": "Place 2 colonies. Pay 14 M€.",
    "expansion": "community"
  },
  "Agricola Inc": {
    "name": "Agricola Inc",
    "tags": [
      "plant"
    ],
    "vp": {
      "type": "special"
    },
    "behavior": {
      "production": {
        "megacredits": 1,
        "plants": 1,
        "heat": 1
      }
    },
    "cardNumber": "R36",
    "description": "You start with 1 plant production, 1 M€ production, 1 heat production and 40 M€.",
    "expansion": "community"
  },
  "Athena": {
    "name": "Athena",
    "tags": [
      "earth"
    ],
    "cardNumber": "R52",
    "description": "You start with 62 M€. As your first action, place 2 hazard tiles adjacent to no other tiles.",
    "expansion": "community"
  },
  "By-Election": {
    "name": "By-Election",
    "tags": [
      "wild"
    ],
    "cardNumber": "Y02",
    "description": "Set the ruling party to one of your choice. Gain 1 influence.",
    "expansion": "community"
  },
  "Curiosity II": {
    "name": "Curiosity II",
    "tags": [
      "science",
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 2
      }
    },
    "cardNumber": "Y07",
    "description": "You start with 40 M€ and 2 steel production.",
    "expansion": "community"
  },
  "Eris": {
    "name": "Eris",
    "tags": [
      "building"
    ],
    "cardNumber": "R47",
    "description": "You start with 46 M€. As your first action, draw an Ares card.",
    "expansion": "community"
  },
  "Executive Order": {
    "name": "Executive Order",
    "cardNumber": "Y31",
    "description": "Draw 4 global events. Play 1 as the CURRENT GLOBAL EVENT and discard the rest. Place 2 delegates in any party. Gain 10 M€.",
    "expansion": "community"
  },
  "ColonyName.HYGIEA": {
    "name": "ColonyName.HYGIEA",
    "type": "colonybenefit.opponent_discard",
    "description": "Choose opponent to discard 1 card",
    "expansion": "community"
  },
  "ColonyName.IAPETUS": {
    "name": "ColonyName.IAPETUS",
    "type": "colonybenefit.gain_tr",
    "description": "Pay 1 M€ less for cards this generation",
    "expansion": "community"
  },
  "Incite": {
    "name": "Incite",
    "tags": [
      "science"
    ],
    "cardNumber": "R37",
    "description": "You start with 32 M€. As your first action, place two delegates in one party.",
    "expansion": "community"
  },
  "Junk Ventures": {
    "name": "Junk Ventures",
    "cardNumber": "R49",
    "description": "You start with 43 M€. As your first action, discard the top 3 cards of the deck.",
    "expansion": "community"
  },
  "GlobalEventName.LEADERSHIP_SUMMIT": {
    "name": "GlobalEventName.LEADERSHIP_SUMMIT",
    "description": "Draw 1 card for each party leader (max 5) and influence.",
    "expansion": "community"
  },
  "ColonyName.LEAVITT": {
    "name": "ColonyName.LEAVITT",
    "type": "colonybenefit.gain_science_tag",
    "description": "Gain 1 science tag",
    "expansion": "community"
  },
  "ColonyName.MERCURY": {
    "name": "ColonyName.MERCURY",
    "type": "colonybenefit.copy_trade",
    "description": "Gain the trade bonus of any colony tile. (This does not move the markers.)",
    "expansion": "community"
  },
  "Midas": {
    "name": "Midas",
    "cardNumber": "R41",
    "description": "You start with 120 M€. Lower your TR 7 steps.",
    "expansion": "community"
  },
  "ColonyName.PALLAS": {
    "name": "ColonyName.PALLAS",
    "type": "colonybenefit.gain_influence",
    "description": "Gain +1 influence",
    "expansion": "community"
  },
  "Playwrights": {
    "name": "Playwrights",
    "tags": [
      "power"
    ],
    "behavior": {
      "production": {
        "energy": 1
      }
    },
    "cardNumber": "R40",
    "description": "You start with 38 M€ and 1 energy production.",
    "expansion": "community"
  },
  "Political Uprising": {
    "name": "Political Uprising",
    "cardNumber": "Y03",
    "description": "Place 4 delegates in any parties. Draw a Turmoil card.",
    "expansion": "community"
  },
  "Project Workshop": {
    "name": "Project Workshop",
    "type": "active",
    "tags": [
      "earth"
    ],
    "behavior": {
      "stock": {
        "steel": 1,
        "titanium": 1
      }
    },
    "cardNumber": "R45",
    "description": "You start with 39 M€, 1 steel and 1 titanium. As your first action, draw a blue card.",
    "expansion": "community"
  },
  "Research Grant": {
    "name": "Research Grant",
    "tags": [
      "science",
      "science"
    ],
    "behavior": {
      "stock": {
        "megacredits": 8
      }
    },
    "cardNumber": "Y04",
    "description": "Gain 8 M€.",
    "expansion": "community"
  },
  "ColonyName.TITANIA": {
    "name": "ColonyName.TITANIA",
    "type": "colonybenefit.gain_vp",
    "description": "Gain 5, 3, or 2 VP",
    "expansion": "community"
  },
  "Trade Advance": {
    "name": "Trade Advance",
    "tags": [
      "earth"
    ],
    "cardNumber": "Y05",
    "description": "Gain 2 M€ [SOLO: Gain 10 M€]. Immediately trade with all active colonies. You may increase the Colony Tile track 1 step before each of these trades.",
    "expansion": "community"
  },
  "United Nations Mission One": {
    "name": "United Nations Mission One",
    "tags": [
      "earth"
    ],
    "cardNumber": "R50",
    "description": "You start with 39 M€. Increase your TR 1 step.",
    "expansion": "community"
  },
  "Valuable Gases": {
    "name": "Valuable Gases",
    "tags": [
      "jovian",
      "venus"
    ],
    "behavior": {
      "stock": {
        "megacredits": 6
      }
    },
    "cardNumber": "Y06",
    "description": "Gain 6 M€. Play a Venus card from your hand and add 4 floaters to it.",
    "expansion": "community"
  },
  "ColonyName.VENUS": {
    "name": "ColonyName.VENUS",
    "type": "colonybenefit.increase_venus_scale",
    "description": "Increase Venus 1 step",
    "expansion": "community"
  },
  "Beginner Corporation": {
    "name": "Beginner Corporation",
    "behavior": {
      "drawCard": 10
    },
    "cardNumber": "R00",
    "description": "You start with 42 M€. Instead of choosing from 10 cards during setup, you get 10 cards for free.",
    "expansion": "corporation"
  },
  "CrediCor": {
    "name": "CrediCor",
    "cardNumber": "R08",
    "description": "You start with 57 M€.",
    "expansion": "corporation"
  },
  "EcoLine": {
    "name": "EcoLine",
    "tags": [
      "plant"
    ],
    "behavior": {
      "production": {
        "plants": 2
      },
      "stock": {
        "plants": 3
      }
    },
    "cardNumber": "R17",
    "description": "You start with 2 plant production, 3 plants, and 36 M€.",
    "expansion": "corporation"
  },
  "Helion": {
    "name": "Helion",
    "tags": [
      "space"
    ],
    "behavior": {
      "production": {
        "heat": 3
      }
    },
    "cardNumber": "R18",
    "description": "You start with 3 heat production and 42 M€.",
    "expansion": "corporation"
  },
  "Interplanetary Cinematics": {
    "name": "Interplanetary Cinematics",
    "tags": [
      "building"
    ],
    "behavior": {
      "stock": {
        "steel": 20
      }
    },
    "cardNumber": "R19",
    "description": "You start with 20 steel and 30 M€.",
    "expansion": "corporation"
  },
  "Inventrix": {
    "name": "Inventrix",
    "tags": [
      "science"
    ],
    "cardNumber": "R43",
    "description": "As your first action in the game, draw 3 cards. Start with 45 M€.",
    "expansion": "corporation"
  },
  "Mining Guild": {
    "name": "Mining Guild",
    "tags": [
      "building",
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 1
      },
      "stock": {
        "steel": 5
      }
    },
    "cardNumber": "R24",
    "description": "You start with 30 M€, 5 steel and 1 steel production.",
    "expansion": "corporation"
  },
  "PhoboLog": {
    "name": "PhoboLog",
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "titanium": 10
      }
    },
    "cardNumber": "R09",
    "description": "You start with 10 titanium and 23 M€.",
    "expansion": "corporation"
  },
  "Saturn Systems": {
    "name": "Saturn Systems",
    "tags": [
      "jovian"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      }
    },
    "cardNumber": "R03",
    "description": "You start with 1 titanium production and 42 M€.",
    "expansion": "corporation"
  },
  "Teractor": {
    "name": "Teractor",
    "tags": [
      "earth"
    ],
    "cardDiscount": {
      "amount": 3,
      "tag": "earth"
    },
    "cardNumber": "R30",
    "description": "You start with 60 M€.",
    "expansion": "corporation"
  },
  "Tharsis Republic": {
    "name": "Tharsis Republic",
    "tags": [
      "building"
    ],
    "cardNumber": "R31",
    "description": "You start with 40 M€. As your first action in the game, place a city tile.",
    "expansion": "corporation"
  },
  "Thorgate": {
    "name": "Thorgate",
    "tags": [
      "power"
    ],
    "behavior": {
      "production": {
        "energy": 1
      }
    },
    "cardDiscount": {
      "amount": 3,
      "tag": "power"
    },
    "cardNumber": "R13",
    "description": "You start with 1 energy production and 48 M€.",
    "expansion": "corporation"
  },
  "United Nations Mars Initiative": {
    "name": "United Nations Mars Initiative",
    "tags": [
      "earth"
    ],
    "cardNumber": "R32",
    "description": "You start with 40 M€.",
    "expansion": "corporation"
  },
  "AI Controlled Mine Network": {
    "name": "AI Controlled Mine Network",
    "type": "automated",
    "cost": 6,
    "tags": [
      "science"
    ],
    "requirements": {
      "logisticRate": 2
    },
    "cardNumber": "M32",
    "description": "Requires the logistic rate to be 2 or higher. Raise the logistic rate 1 step",
    "expansion": "moon"
  },
  "Algae Bioreactors": {
    "name": "Algae Bioreactors",
    "type": "automated",
    "cost": 9,
    "tags": [
      "plant"
    ],
    "behavior": {
      "production": {
        "plants": -1
      },
      "global": {
        "oxygen": 1
      }
    },
    "cardNumber": "M47",
    "description": "Decrease your plant production 1 step. Raise the habitat rate 1 step and oxygen 1%.",
    "expansion": "moon"
  },
  "Ancient Shipyards": {
    "name": "Ancient Shipyards",
    "type": "active",
    "cost": 6,
    "tags": [
      "moon",
      "space"
    ],
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "resourceType": "Resource cube",
    "cardNumber": "M19",
    "description": "Spend 3 titanium. -1 VP for every resource here.",
    "expansion": "moon"
  },
  "An Offer You Can\\": {
    "name": "An Offer You Can\\",
    "type": "event",
    "cost": 5,
    "cardNumber": "M62",
    "description": "Exchange a NON-NEUTRAL opponent delegate with one of your own from the reserve. This exchange may not change the party leader. You may then move your delegate to another party.",
    "expansion": "moon"
  },
  "Archimedes Hydroponics Station": {
    "name": "Archimedes Hydroponics Station",
    "type": "automated",
    "cost": 12,
    "tags": [
      "plant"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": -1,
        "plants": 2
      }
    },
    "cardNumber": "M27",
    "description": "Decrease your energy production 1 step and your M€ production 1 step. Increase your plant production 2 steps.",
    "expansion": "moon"
  },
  "Aristarchus Road Network": {
    "name": "Aristarchus Road Network",
    "type": "automated",
    "cost": 15,
    "tags": [
      "moon"
    ],
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "M10",
    "description": "Spend 2 steel. Increase your M€ production 2 steps. ",
    "expansion": "moon"
  },
  "Basic Infrastructure": {
    "name": "Basic Infrastructure",
    "tags": [
      "moon"
    ],
    "behavior": {
      "tradeFleet": true
    },
    "cardNumber": "MP3",
    "description": "Place a road tile on The Moon and raise the Logistics Rate 1 step. Gain 1 trade fleet.",
    "expansion": "moon"
  },
  "Colonist Shuttles": {
    "name": "Colonist Shuttles",
    "type": "automated",
    "cost": 12,
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "each": 2
      }
    },
    "cardNumber": "M16",
    "description": "Spend 1 titanium. Raise the habitat rate 1 step. Gain 2M€ for each habitat tile on The Moon.",
    "expansion": "moon"
  },
  "Copernicus Solar Arrays": {
    "name": "Copernicus Solar Arrays",
    "type": "automated",
    "cost": 8,
    "tags": [
      "power",
      "space"
    ],
    "behavior": {
      "production": {
        "energy": 1
      },
      "stock": {
        "heat": 2
      }
    },
    "cardNumber": "M44",
    "description": "Spend 1 titanium. Gain 2 heat. Incease your energy production 1 step.",
    "expansion": "moon"
  },
  "Copernicus Tower": {
    "name": "Copernicus Tower",
    "type": "active",
    "cost": 36,
    "tags": [
      "science",
      "moon"
    ],
    "requirements": {
      "count": 2
    },
    "vp": {
      "type": "per_tag",
      "tag": "moon",
      "per": 1
    },
    "action": {
      "addResources": 1,
      "tr": 1
    },
    "resourceType": "Science",
    "cardNumber": "M72",
    "expansion": "moon"
  },
  "Core Mine": {
    "name": "Core Mine",
    "tags": [
      "moon"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      }
    },
    "cardNumber": "MP2",
    "description": "Place a mine tile on The Moon and raise the mining rate 1 step. Increase your titanium production 1 step.",
    "expansion": "moon"
  },
  "Cosmic Radiation": {
    "name": "Cosmic Radiation",
    "type": "event",
    "cost": 3,
    "tags": [
      "moon"
    ],
    "requirements": {
      "miningRate": 4
    },
    "cardNumber": "M52",
    "description": "Requires 4 mining rate. All players pay 4M€ for each mining tile they own.",
    "expansion": "moon"
  },
  "Crescent Research Association": {
    "name": "Crescent Research Association",
    "tags": [
      "science",
      "moon"
    ],
    "vp": {
      "type": "per_tag",
      "tag": "moon",
      "per": 3
    },
    "cardNumber": "MC5",
    "description": "You start with 50 M€. 1 VP for every 3 Moon tags you have.",
    "expansion": "moon"
  },
  "Darkside Incubation Plant": {
    "name": "Darkside Incubation Plant",
    "type": "active",
    "cost": 11,
    "tags": [
      "microbe",
      "moon"
    ],
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "resourceType": "Microbe",
    "cardNumber": "M45",
    "description": "Spend 1 titanium. 1 VP for every 2 microbes here.",
    "expansion": "moon"
  },
  "Darkside Meteor Bombardment": {
    "name": "Darkside Meteor Bombardment",
    "type": "event",
    "cost": 20,
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "steel": 2,
        "titanium": 2
      }
    },
    "cardNumber": "M33",
    "description": "Gain 2 steel and 2 titanium. Raise the mining rate 2 steps.",
    "expansion": "moon"
  },
  "Darkside Mining Syndicate": {
    "name": "Darkside Mining Syndicate",
    "type": "automated",
    "cost": 18,
    "tags": [
      "moon",
      "space"
    ],
    "cardNumber": "M66",
    "description": "Increase your titanium production 2 steps, or ",
    "expansion": "moon"
  },
  "Darkside Observatory": {
    "name": "Darkside Observatory",
    "type": "active",
    "cost": 12,
    "tags": [
      "science"
    ],
    "cardNumber": "M75",
    "expansion": "moon"
  },
  "Darkside Smugglers\\": {
    "name": "Darkside Smugglers\\",
    "type": "active",
    "cost": 17,
    "tags": [
      "space"
    ],
    "cardNumber": "M80",
    "description": "Raise the logistics rate 1 step.",
    "expansion": "moon"
  },
  "Deep Lunar Mining": {
    "name": "Deep Lunar Mining",
    "type": "automated",
    "cost": 18,
    "tags": [
      "moon"
    ],
    "behavior": {
      "production": {
        "titanium": 2
      }
    },
    "cardNumber": "M18",
    "description": "Spend 1 titanium. Increase your titanium production 2 steps. Raise the mining rate 1 step.",
    "expansion": "moon"
  },
  "Earth Embassy": {
    "name": "Earth Embassy",
    "type": "active",
    "cost": 16,
    "tags": [
      "moon",
      "earth"
    ],
    "cardNumber": "M77",
    "expansion": "moon"
  },
  "First Lunar Settlement": {
    "name": "First Lunar Settlement",
    "tags": [
      "city",
      "moon"
    ],
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "MP1",
    "description": "Place a habitat tile on The Moon and raise the habitat rate 1 step. Increase your M€ production 1 step.",
    "expansion": "moon"
  },
  "Geodesic Tents": {
    "name": "Geodesic Tents",
    "type": "automated",
    "cost": 13,
    "tags": [
      "plant",
      "city",
      "moon"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "plants": 1
      }
    },
    "cardNumber": "M06",
    "description": "Decrease your energy production 1 step and increase your plant production 1 step. ",
    "expansion": "moon"
  },
  "Grand Luna Academy": {
    "name": "Grand Luna Academy",
    "type": "automated",
    "cost": 13,
    "tags": [
      "moon"
    ],
    "cardNumber": "M83",
    "description": "Draw 1 card per 2 Moon tags you have, including this.",
    "expansion": "moon"
  },
  "Habitat 14": {
    "name": "Habitat 14",
    "type": "automated",
    "cost": 5,
    "tags": [
      "city",
      "moon"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": -1
      }
    },
    "cardNumber": "M05",
    "description": "Decrease your energy production 1 step and your M€ production 1 step. Spend 1 titanium. Place a habitat tile on The Moon and raise the habitat rate 1 step.",
    "expansion": "moon"
  },
  "HE3 Fusion Plant": {
    "name": "HE3 Fusion Plant",
    "type": "automated",
    "cost": 12,
    "tags": [
      "power",
      "power",
      "moon"
    ],
    "requirements": {
      "miningRate": 2
    },
    "cardNumber": "M48",
    "description": "Requires the mining rate of 2 or higher. ",
    "expansion": "moon"
  },
  "HE3 Lobbyists": {
    "name": "HE3 Lobbyists",
    "type": "automated",
    "cost": 7,
    "tags": [
      "moon"
    ],
    "cardNumber": "M50",
    "description": "Increase your M€ production 1 step for each Moon tag you have (including this).",
    "expansion": "moon"
  },
  "HE3 Production Quotas": {
    "name": "HE3 Production Quotas",
    "type": "event",
    "cost": 10,
    "tags": [
      "moon"
    ],
    "requirements": {
      "miningTiles": 1
    },
    "cardNumber": "M57",
    "description": "Requires that Kelvinists are ruling or that you have 2 delegates there, and 1 mine tile on The Moon. ",
    "expansion": "moon"
  },
  "HE3 Refinery": {
    "name": "HE3 Refinery",
    "type": "active",
    "cost": 8,
    "tags": [
      "moon"
    ],
    "cardNumber": "M49",
    "expansion": "moon"
  },
  "Heavy Duty Rovers": {
    "name": "Heavy Duty Rovers",
    "type": "automated",
    "cost": 12,
    "cardNumber": "M39",
    "description": "Gain 4 M€ for each mining tile adjacent to a road tile. Raise the logistic rate 1 step.",
    "expansion": "moon"
  },
  "Heliostat Mirror Array": {
    "name": "Heliostat Mirror Array",
    "type": "automated",
    "cost": 10,
    "tags": [
      "power"
    ],
    "behavior": {
      "production": {
        "energy": 2
      },
      "stock": {
        "heat": 1
      }
    },
    "cardNumber": "M41",
    "description": "Spend 1 titanium. Gain 1 heat. Increase your energy production 2 steps.",
    "expansion": "moon"
  },
  "Hostile Takeover": {
    "name": "Hostile Takeover",
    "type": "event",
    "cost": 26,
    "tags": [
      "city",
      "moon"
    ],
    "requirements": {
      "habitatRate": 2,
      "miningRate": 4
    },
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "M64",
    "description": "Requires a habitat rate of 2 or higher, and a mining rate of 4 or higher. ",
    "expansion": "moon"
  },
  "Hypersensitive Silicon Chip Factory": {
    "name": "Hypersensitive Silicon Chip Factory",
    "type": "automated",
    "cost": 11,
    "tags": [
      "building"
    ],
    "requirements": {
      "miningTiles": 2
    },
    "behavior": {
      "production": {
        "megacredits": 4
      }
    },
    "cardNumber": "M43",
    "description": "Requires 2 mining tiles on The Moon. Spend 2 titanium. Increase your M€ production 4 steps.",
    "expansion": "moon"
  },
  "Improved Moon Concrete": {
    "name": "Improved Moon Concrete",
    "type": "active",
    "cost": 12,
    "tags": [
      "moon"
    ],
    "cardNumber": "M37",
    "description": "Spend 2 steel. Raise the mining rate 1 step.",
    "expansion": "moon"
  },
  "Intragen Sanctuary Headquarters": {
    "name": "Intragen Sanctuary Headquarters",
    "tags": [
      "animal",
      "moon"
    ],
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "resourceType": "Animal",
    "cardNumber": "MC8",
    "description": "You start with 38 M€. ",
    "expansion": "moon"
  },
  "Iron Extraction Center": {
    "name": "Iron Extraction Center",
    "type": "automated",
    "cost": 10,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "per": 2
      }
    },
    "cardNumber": "M25",
    "description": "Spend 1 titanium. Increase your steel production 1 step for every 2 raised steps of mining rate.",
    "expansion": "moon"
  },
  "L.T.F. Headquarters": {
    "name": "L.T.F. Headquarters",
    "type": "automated",
    "cost": 31,
    "tags": [
      "space"
    ],
    "behavior": {
      "colony": true,
      "tradeFleet": true
    },
    "cardNumber": "M79",
    "description": "Raise the habitat rate 1 step. Place a colony. Gain 1 Trade Fleet.",
    "expansion": "moon"
  },
  "L.T.F. Privileges": {
    "name": "L.T.F. Privileges",
    "type": "active",
    "cost": 21,
    "tags": [
      "moon"
    ],
    "cardNumber": "M82",
    "expansion": "moon"
  },
  "Luna Archives": {
    "name": "Luna Archives",
    "type": "active",
    "cost": 13,
    "tags": [
      "science",
      "moon"
    ],
    "resourceType": "Science",
    "cardNumber": "M69",
    "expansion": "moon"
  },
  "Luna Conference": {
    "name": "Luna Conference",
    "type": "event",
    "cost": 5,
    "tags": [
      "science",
      "moon"
    ],
    "behavior": {
      "stock": {
        "each": 2
      }
    },
    "cardNumber": "M58",
    "description": "Requires that Scientists are ruling or that you have 2 delegates there. ",
    "expansion": "moon"
  },
  "Luna Ecumenopolis": {
    "name": "Luna Ecumenopolis",
    "type": "automated",
    "cost": 35,
    "tags": [
      "city",
      "city",
      "moon"
    ],
    "cardNumber": "M84",
    "description": "Spend 2 titanium. ",
    "expansion": "moon"
  },
  "Luna First Incorporated": {
    "name": "Luna First Incorporated",
    "tags": [
      "moon"
    ],
    "behavior": {
      "stock": {
        "steel": 1,
        "titanium": 1
      }
    },
    "cardNumber": "MC6",
    "description": "You start with 40 M€, 2 steel, and 2 titanium.",
    "expansion": "moon"
  },
  "Luna Hyperloop Corporation": {
    "name": "Luna Hyperloop Corporation",
    "tags": [
      "moon",
      "building"
    ],
    "vp": {
      "type": "special"
    },
    "behavior": {
      "stock": {
        "steel": 4
      }
    },
    "cardNumber": "MC4",
    "description": "You start with 38 M€ and 4 steel.",
    "expansion": "moon"
  },
  "Luna Mining Hub": {
    "name": "Luna Mining Hub",
    "type": "automated",
    "cost": 23,
    "tags": [
      "building"
    ],
    "requirements": {
      "miningRate": 5
    },
    "vp": {
      "type": "special"
    },
    "behavior": {
      "production": {
        "steel": 1,
        "titanium": 1
      },
      "city": true
    },
    "cardNumber": "M14",
    "description": "2 VP PER MINING TILE ADJACENT TO THIS TILE.",
    "expansion": "moon"
  },
  "Luna Political Institute": {
    "name": "Luna Political Institute",
    "type": "active",
    "cost": 6,
    "tags": [
      "moon",
      "earth"
    ],
    "requirements": {
      "count": 2,
      "tag": "moon"
    },
    "cardNumber": "M71",
    "description": "Requires that you have 2 Moon tags.",
    "expansion": "moon"
  },
  "Luna Project Office": {
    "name": "Luna Project Office",
    "type": "automated",
    "cost": 4,
    "tags": [
      "science"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "cardNumber": "M20",
    "description": "Requires 2 science tags.",
    "expansion": "moon"
  },
  "Lunar Dust Processing Plant": {
    "name": "Lunar Dust Processing Plant",
    "type": "active",
    "cost": 6,
    "tags": [
      "building"
    ],
    "cardNumber": "M17",
    "description": "Spend 1 titanium. Raise the logistic rate 1 step.",
    "expansion": "moon"
  },
  "Luna Resort": {
    "name": "Luna Resort",
    "type": "automated",
    "cost": 11,
    "tags": [
      "moon"
    ],
    "requirements": {
      "habitatTiles": 2
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 3
      }
    },
    "cardNumber": "M21",
    "description": "Requires 2 habitats on The Moon. Spend 2 titanium. Decrease your energy production 1 step and increase your M€ production 3 steps. Raise the habitat rate 1 step.",
    "expansion": "moon"
  },
  "Lunar Industry Complex": {
    "name": "Lunar Industry Complex",
    "type": "automated",
    "cost": 28,
    "tags": [
      "power",
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 1,
        "titanium": 1,
        "energy": 2,
        "heat": 1
      }
    },
    "cardNumber": "M74",
    "description": "Spend 2 titanium. Place a mine tile on The Moon and raise the mining rate 1 step. ",
    "expansion": "moon"
  },
  "Lunar Mine Urbanization": {
    "name": "Lunar Mine Urbanization",
    "type": "event",
    "cost": 8,
    "tags": [
      "moon",
      "building"
    ],
    "requirements": {
      "miningTiles": 1
    },
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "M55",
    "description": "Requires you have 1 mine tile. Increase your M€ production 1 step. Raise the habitat rate 1 step. ",
    "expansion": "moon"
  },
  "Lunar Observation Post": {
    "name": "Lunar Observation Post",
    "type": "active",
    "cost": 7,
    "tags": [
      "science",
      "science"
    ],
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "resourceType": "Data",
    "cardNumber": "M22",
    "description": "Spend 1 titanium. 1 VP for every 3 data resources here.",
    "expansion": "moon"
  },
  "Lunar Planning Office": {
    "name": "Lunar Planning Office",
    "tags": [
      "moon",
      "building"
    ],
    "behavior": {
      "stock": {
        "steel": 6
      }
    },
    "cardNumber": "MP4",
    "description": "Draw 2 cards with a Moon tag. Gain 6 steel.",
    "expansion": "moon"
  },
  "Lunar Security Stations": {
    "name": "Lunar Security Stations",
    "type": "active",
    "cost": 9,
    "tags": [
      "moon"
    ],
    "requirements": {
      "roadTiles": 3
    },
    "cardNumber": "M42",
    "description": "Requires 3 road tiles on The Moon. Raise the logistic rate 1 step.",
    "expansion": "moon"
  },
  "Lunar Steel": {
    "name": "Lunar Steel",
    "type": "active",
    "cost": 5,
    "tags": [
      "moon"
    ],
    "cardNumber": "M87",
    "expansion": "moon"
  },
  "Lunar Trade Fleet": {
    "name": "Lunar Trade Fleet",
    "type": "automated",
    "cost": 8,
    "tags": [
      "moon",
      "space"
    ],
    "requirements": {
      "count": 2
    },
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "M35",
    "description": "Requires that you have 2 titanium production. ",
    "expansion": "moon"
  },
  "Luna Senate": {
    "name": "Luna Senate",
    "type": "automated",
    "cost": 32,
    "tags": [
      "moon",
      "moon"
    ],
    "requirements": {
      "count": 3,
      "tag": "moon"
    },
    "vp": {
      "type": "per_tag",
      "tag": "moon",
      "per": 1
    },
    "cardNumber": "M70",
    "description": "Requires that you have 3 Moon tags. Increase your M€ production 1 step per Moon tag in the game (including these.)",
    "expansion": "moon"
  },
  "Luna Staging Station": {
    "name": "Luna Staging Station",
    "type": "automated",
    "cost": 12,
    "tags": [
      "moon",
      "building"
    ],
    "requirements": {
      "logisticRate": 2
    },
    "cardNumber": "M30",
    "description": "Requires the logistic rate to be 2 or higher. Spend 1 titanium. Raise the logistic rate 2 steps.",
    "expansion": "moon"
  },
  "Luna Trade Federation": {
    "name": "Luna Trade Federation",
    "tags": [
      "moon",
      "space"
    ],
    "behavior": {
      "stock": {
        "titanium": 10
      }
    },
    "cardNumber": "MC9",
    "description": "You start with 15 M€ and 10 titanium. As your first action, place a mine tile on The Moon and raise the mining rate 1 step.",
    "expansion": "moon"
  },
  "Luna Trade Station": {
    "name": "Luna Trade Station",
    "type": "active",
    "cost": 10,
    "tags": [
      "moon",
      "moon",
      "space"
    ],
    "behavior": {
      "city": true
    },
    "action": {
      "stock": {
        "each": 2
      }
    },
    "cardNumber": "M13",
    "description": "Spend 2 titanium. Place this tile ON THE RESERVED AREA.",
    "expansion": "moon"
  },
  "Luna Train Station": {
    "name": "Luna Train Station",
    "type": "automated",
    "cost": 24,
    "tags": [
      "building"
    ],
    "requirements": {
      "logisticRate": 5
    },
    "vp": {
      "type": "special"
    },
    "behavior": {
      "production": {
        "megacredits": 4
      },
      "city": true
    },
    "cardNumber": "M15",
    "description": "Requires a logistic rate of 5 or higher. Spend 2 steel. ",
    "expansion": "moon"
  },
  "Mare Imbrium Mine": {
    "name": "Mare Imbrium Mine",
    "type": "automated",
    "cost": 19,
    "tags": [
      "moon",
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 1,
        "titanium": 1
      }
    },
    "cardNumber": "M03",
    "description": "Spend 1 titanium. Increase your steel production 1 step and your titanium production 1 step. Place a mine ON THE RESERVED AREA and raise the mining rate 1 step.",
    "expansion": "moon"
  },
  "Mare Nectaris Mine": {
    "name": "Mare Nectaris Mine",
    "type": "automated",
    "cost": 14,
    "tags": [
      "moon",
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 1
      }
    },
    "cardNumber": "M01",
    "description": "Spend 1 titanium. Increase your steel production 1 step. Place a mine ON THE RESERVED AREA and raise the mining rate 1 step.",
    "expansion": "moon"
  },
  "Mare Nubium Mine": {
    "name": "Mare Nubium Mine",
    "type": "automated",
    "cost": 17,
    "tags": [
      "moon",
      "building"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      }
    },
    "cardNumber": "M02",
    "description": "Spend 1 titanium. Increase your titanium production 1 step. Place a mine ON THE RESERVED AREA and raise the mining rate 1 step.",
    "expansion": "moon"
  },
  "Mare Serenitatis Mine": {
    "name": "Mare Serenitatis Mine",
    "type": "automated",
    "cost": 21,
    "tags": [
      "moon",
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 1,
        "titanium": 1
      }
    },
    "cardNumber": "M04",
    "description": "Spend 2 titanium and 1 steel. Increase your steel and titanium production 1 step. ",
    "expansion": "moon"
  },
  "Martian Embassy": {
    "name": "Martian Embassy",
    "type": "automated",
    "cost": 11,
    "tags": [
      "moon",
      "mars"
    ],
    "cardNumber": "M76",
    "description": "Raise the Mars Planetary Track 1 step for every 3 Moon tags you have, including this.",
    "expansion": "moon"
  },
  "Microsingularity Plant": {
    "name": "Microsingularity Plant",
    "type": "automated",
    "cost": 10,
    "tags": [
      "power"
    ],
    "requirements": {
      "habitatTiles": 2
    },
    "behavior": {
      "production": {
        "energy": 2
      }
    },
    "cardNumber": "M40",
    "description": "Requires 2 habitats on The Moon. Increase your energy production 2 steps.",
    "expansion": "moon"
  },
  "Mining Complex": {
    "name": "Mining Complex",
    "tags": [
      "moon"
    ],
    "cardNumber": "MP5",
    "description": "Place a mine tile on The Moon and raise the mining rate 1 step. ",
    "expansion": "moon"
  },
  "Mining Robots Manuf. Center": {
    "name": "Mining Robots Manuf. Center",
    "type": "automated",
    "cost": 12,
    "tags": [
      "science",
      "building"
    ],
    "cardNumber": "M23",
    "description": "Spend 1 titanium. Raise the mining rate 2 steps.",
    "expansion": "moon"
  },
  "Momentum Virium Habitat": {
    "name": "Momentum Virium Habitat",
    "type": "automated",
    "cost": 23,
    "tags": [
      "city",
      "space"
    ],
    "behavior": {
      "production": {
        "heat": 2,
        "megacredits": 3
      }
    },
    "cardNumber": "M12",
    "description": "Spend 1 titanium. Increase your heat production 2 steps and your M€ production 3 steps. ",
    "expansion": "moon"
  },
  "Mooncrate Block Factory": {
    "name": "Mooncrate Block Factory",
    "type": "active",
    "cost": 8,
    "tags": [
      "building"
    ],
    "requirements": {
      "miningTiles": 1
    },
    "cardNumber": "M38",
    "description": "Requires 1 mine on The Moon.",
    "expansion": "moon"
  },
  "Mooncrate Convoys To Mars": {
    "name": "Mooncrate Convoys To Mars",
    "type": "event",
    "cost": 13,
    "cardNumber": "M60",
    "description": "Requires that Mars First are ruling or that you have 2 delegates there. ",
    "expansion": "moon"
  },
  "Lunar Habitat (var. 1)": {
    "name": "Lunar Habitat (var. 1)",
    "cost": 23,
    "expansion": "moon"
  },
  "Lunar Habitat (var. 2)": {
    "name": "Lunar Habitat (var. 2)",
    "cost": 26,
    "expansion": "moon"
  },
  "Moon Tether": {
    "name": "Moon Tether",
    "type": "active",
    "cost": 18,
    "tags": [
      "moon",
      "space"
    ],
    "requirements": {
      "count": 6,
      "tag": "space"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardDiscount": {
      "amount": 2
    },
    "cardNumber": "M90",
    "description": "Requires 6 space tags.",
    "expansion": "moon"
  },
  "Nanotech Industries": {
    "name": "Nanotech Industries",
    "tags": [
      "science",
      "moon"
    ],
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "resourceType": "Science",
    "cardNumber": "MC1",
    "description": "You start with 42 M€. As your first action, draw 3 cards. Take 2 of them into hand, and discard the rest. ",
    "expansion": "moon"
  },
  "New Colony Planning Initiatives": {
    "name": "New Colony Planning Initiatives",
    "type": "automated",
    "cost": 6,
    "tags": [
      "moon"
    ],
    "requirements": {
      "habitatRate": 2
    },
    "cardNumber": "M31",
    "description": "Requires the habitat rate to be 2 or higher. Raise the habitat rate 1 step.",
    "expansion": "moon"
  },
  "Off-World City Living": {
    "name": "Off-World City Living",
    "type": "automated",
    "cost": 35,
    "tags": [
      "city",
      "space"
    ],
    "vp": {
      "type": "per_city",
      "per": 3
    },
    "cardNumber": "M53",
    "description": "Increase your M€ production 1 step per city tile NOT ON MARS. Increase habitat rate 1 step.",
    "expansion": "moon"
  },
  "Orbital Power Grid": {
    "name": "Orbital Power Grid",
    "type": "automated",
    "cost": 19,
    "tags": [
      "power",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "M85",
    "description": "Increase your energy production 1 step per city tile NOT ON MARS.",
    "expansion": "moon"
  },
  "Preliminary Darkside": {
    "name": "Preliminary Darkside",
    "type": "event",
    "cost": 13,
    "tags": [
      "moon"
    ],
    "cardNumber": "M63",
    "description": "Gain 3 titanium or 4 steel. Raise the mining rate 1 step.",
    "expansion": "moon"
  },
  "Pride of the Earth Arkship": {
    "name": "Pride of the Earth Arkship",
    "type": "active",
    "cost": 22,
    "tags": [
      "science",
      "science",
      "space"
    ],
    "requirements": {
      "count": 2,
      "tag": "space"
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "resourceType": "Science",
    "cardNumber": "M24",
    "description": "Requires 1 science and 2 space tags. Spend 2 titanium. 1 VP per science resource here.",
    "expansion": "moon"
  },
  "Processor Factory": {
    "name": "Processor Factory",
    "type": "active",
    "cost": 8,
    "tags": [
      "moon",
      "building"
    ],
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "resourceType": "Data",
    "cardNumber": "M86",
    "expansion": "moon"
  },
  "Revolting Colonists": {
    "name": "Revolting Colonists",
    "type": "event",
    "cost": 3,
    "tags": [
      "moon"
    ],
    "requirements": {
      "habitatRate": 4
    },
    "cardNumber": "M51",
    "description": "Requires 4 habitat rate. All players pay 3M€ for each habitat tile they own.",
    "expansion": "moon"
  },
  "Road Piracy": {
    "name": "Road Piracy",
    "type": "event",
    "cost": 10,
    "tags": [
      "moon"
    ],
    "requirements": {
      "logisticRate": 3
    },
    "cardNumber": "M54",
    "description": "Requires 3 logistic rate. ",
    "expansion": "moon"
  },
  "Rover Drivers Union": {
    "name": "Rover Drivers Union",
    "type": "automated",
    "cost": 16,
    "tags": [
      "moon"
    ],
    "requirements": {
      "logisticRate": 2
    },
    "cardNumber": "M78",
    "description": "Requires 2 logistic rate. Raise the logistic rate 1 step. Increase your M€ production 1 step per logistic rate.",
    "expansion": "moon"
  },
  "Rust Eating Bacteria": {
    "name": "Rust Eating Bacteria",
    "type": "active",
    "cost": 7,
    "tags": [
      "microbe"
    ],
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "action": {
      "addResources": 2
    },
    "resourceType": "Microbe",
    "cardNumber": "M88",
    "expansion": "moon"
  },
  "Sinus Irdium Road Network": {
    "name": "Sinus Irdium Road Network",
    "type": "automated",
    "cost": 15,
    "tags": [
      "moon"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 3
      }
    },
    "cardNumber": "M11",
    "description": "Decrease your energy production 1 step and increase your M€ production 3 steps. ",
    "expansion": "moon"
  },
  "Small Duty Rovers": {
    "name": "Small Duty Rovers",
    "type": "automated",
    "cost": 9,
    "tags": [
      "moon",
      "space"
    ],
    "cardNumber": "M73",
    "description": "Spend 1 titanium. Raise the logistic rate 1 step. Gain 1 M€ per habitat tile, mine tile and road tile on The Moon.",
    "expansion": "moon"
  },
  "Solar Panel Foundry": {
    "name": "Solar Panel Foundry",
    "type": "active",
    "cost": 11,
    "tags": [
      "power",
      "moon",
      "building"
    ],
    "action": {
      "production": {
        "energy": 1
      }
    },
    "cardNumber": "M89",
    "expansion": "moon"
  },
  "Sphere Habitats": {
    "name": "Sphere Habitats",
    "type": "automated",
    "cost": 14,
    "tags": [
      "city",
      "moon"
    ],
    "cardNumber": "M07",
    "description": "Spend 1 titanium. Place a habitat tile on The Moon and raise the habitat rate 1 step.",
    "expansion": "moon"
  },
  "Staging Station \"Behemoth\"": {
    "name": "Staging Station \"Behemoth\"",
    "type": "automated",
    "cost": 24,
    "tags": [
      "space"
    ],
    "behavior": {
      "tradeFleet": true
    },
    "cardNumber": "M68",
    "description": "Gain 2 Trade Fleets. Raise the logistic rate 1 step.",
    "expansion": "moon"
  },
  "Subterranean Habitats": {
    "name": "Subterranean Habitats",
    "type": "active",
    "cost": 12,
    "tags": [
      "moon"
    ],
    "cardNumber": "M36",
    "description": "Spend 2 steel. Raise the habitat rate 1 step.",
    "expansion": "moon"
  },
  "Syndicate Pirate Raids": {
    "name": "Syndicate Pirate Raids",
    "type": "event",
    "cost": 8,
    "tags": [
      "space"
    ],
    "cardNumber": "M65",
    "description": "ALL OPPONENTS CANNOT RETRIEVE THEIR TRADE FLEETS THIS GENERATION",
    "expansion": "moon"
  },
  "Tempest Consultancy": {
    "name": "Tempest Consultancy",
    "tags": [
      "moon"
    ],
    "cardNumber": "MC2",
    "description": "You start with 37 M€. As your first action, place 2 delegates in one party.",
    "expansion": "moon"
  },
  "The Archaic Foundation Institute": {
    "name": "The Archaic Foundation Institute",
    "tags": [
      "moon",
      "moon"
    ],
    "resourceType": "Resource cube",
    "cardNumber": "MC10",
    "description": "You start with 55 M€.",
    "expansion": "moon"
  },
  "The Darkside of The Moon Syndicate": {
    "name": "The Darkside of The Moon Syndicate",
    "tags": [
      "moon"
    ],
    "behavior": {
      "addResources": 2
    },
    "resourceType": "Syndicate Fleet",
    "cardNumber": "MC3",
    "expansion": "moon"
  },
  "The Grand Luna Capital Group": {
    "name": "The Grand Luna Capital Group",
    "tags": [
      "city",
      "moon"
    ],
    "vp": {
      "type": "special"
    },
    "behavior": {
      "stock": {
        "titanium": 1
      }
    },
    "cardNumber": "MC7",
    "description": "You start with 32 M€ and 1 titanium. As your first action, place a habitat tile on The Moon and raise the habitat rate 1 step.",
    "expansion": "moon"
  },
  "The Womb": {
    "name": "The Womb",
    "type": "automated",
    "cost": 16,
    "tags": [
      "city",
      "moon"
    ],
    "behavior": {
      "production": {
        "energy": -2,
        "megacredits": 4
      }
    },
    "cardNumber": "M08",
    "description": "Decrease your energy production 2 steps and increase your M€ production 4 steps. ",
    "expansion": "moon"
  },
  "Thorium Rush": {
    "name": "Thorium Rush",
    "type": "event",
    "cost": 39,
    "tags": [
      "moon",
      "building"
    ],
    "cardNumber": "M56",
    "description": "Place 1 habitat tile, 1 mining tile and 1 road tile on The Moon. ",
    "expansion": "moon"
  },
  "Titanium Extraction Center": {
    "name": "Titanium Extraction Center",
    "type": "automated",
    "cost": 14,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "per": 2
      }
    },
    "cardNumber": "M26",
    "description": "Spend 2 titanium. Increase your titanium production 1 step for every 2 raised steps of mining rate.",
    "expansion": "moon"
  },
  "Tycho Road Network": {
    "name": "Tycho Road Network",
    "type": "automated",
    "cost": 15,
    "tags": [
      "moon"
    ],
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "M09",
    "description": "Spend 1 steel. Increase your M€ production 1 step. ",
    "expansion": "moon"
  },
  "Underground Detonators": {
    "name": "Underground Detonators",
    "type": "event",
    "cost": 9,
    "behavior": {
      "stock": {
        "steel": 1,
        "titanium": 1
      }
    },
    "cardNumber": "M34",
    "description": "Gain 1 steel and 1 titanium. Raise the mining rate 1 step.",
    "expansion": "moon"
  },
  "Undermoon Drug Lords Network": {
    "name": "Undermoon Drug Lords Network",
    "type": "automated",
    "cost": 2,
    "tags": [
      "moon"
    ],
    "vp": {
      "type": "static",
      "vp": -1
    },
    "behavior": {
      "production": {
        "per": 2
      }
    },
    "cardNumber": "M81",
    "description": "Increase your M€ production 1 step per 2 steps of habitat rate.",
    "expansion": "moon"
  },
  "Water Treatment Complex": {
    "name": "Water Treatment Complex",
    "type": "automated",
    "cost": 12,
    "tags": [
      "moon"
    ],
    "requirements": {
      "habitatTiles": 1
    },
    "cardNumber": "M46",
    "description": "Requires 1 habitat tile on The Moon. Spend 1 titanium. Raise the habitat rate 2 steps.",
    "expansion": "moon"
  },
  "We Grow As One": {
    "name": "We Grow As One",
    "type": "event",
    "cost": 8,
    "tags": [
      "space"
    ],
    "cardNumber": "M59",
    "description": "Requires that Unity are ruling or that you have 2 delegates there. ",
    "expansion": "moon"
  },
  "Adhai High Orbit Constructions": {
    "name": "Adhai High Orbit Constructions",
    "tags": [
      "space"
    ],
    "resourceType": "Orbital",
    "cardNumber": "PfC23",
    "description": "You start with 43 M€.",
    "expansion": "pathfinders"
  },
  "Advanced Power Grid": {
    "name": "Advanced Power Grid",
    "type": "automated",
    "cost": 18,
    "tags": [
      "power",
      "building",
      "mars"
    ],
    "behavior": {
      "production": {
        "energy": 2
      }
    },
    "cardNumber": "Pf56",
    "description": "Increase your energy production 2 steps. Increase your M€ production 1 step per power tag you have, including this.",
    "expansion": "pathfinders"
  },
  "Agro-Drones": {
    "name": "Agro-Drones",
    "type": "active",
    "cost": 14,
    "tags": [
      "plant",
      "mars"
    ],
    "requirements": {
      "temperature": -18
    },
    "cardNumber": "Pf04",
    "description": "Requires -18° C or warmer.",
    "expansion": "pathfinders"
  },
  "Ambient": {
    "name": "Ambient",
    "tags": [
      "venus"
    ],
    "cardNumber": "PfC3",
    "description": "You start with 38 M€. As your first action, raise the Venus scale 2 steps.",
    "expansion": "pathfinders"
  },
  "Anthozoa": {
    "name": "Anthozoa",
    "type": "active",
    "cost": 9,
    "tags": [
      "plant",
      "animal",
      "mars"
    ],
    "requirements": {
      "oceans": 3
    },
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "resourceType": "Animal",
    "cardNumber": "Pf55",
    "description": "Requires 3 oceans on Mars. 1 VP per 2 animals on this card.",
    "expansion": "pathfinders"
  },
  "Asteroid Resources": {
    "name": "Asteroid Resources",
    "type": "automated",
    "cost": 17,
    "tags": [
      "jovian",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "steel": 1,
        "titanium": 1
      },
      "stock": {
        "steel": 2,
        "titanium": 1
      },
      "ocean": true
    },
    "cardNumber": "Pf40",
    "description": "Spend 3 energy. Either increase your steel and titanium production one step, OR ",
    "expansion": "pathfinders"
  },
  "Aurorai": {
    "name": "Aurorai",
    "tags": [
      "mars"
    ],
    "behavior": {
      "addResources": 2
    },
    "resourceType": "Data",
    "cardNumber": "PfC15",
    "description": "You start with 33 M€. and 2 data on this card",
    "expansion": "pathfinders"
  },
  "GlobalEventName.BALANCED_DEVELOPMENT": {
    "name": "GlobalEventName.BALANCED_DEVELOPMENT",
    "description": "Gain 2M€ for each Mars tag you have (max 5) and influence.",
    "expansion": "pathfinders"
  },
  "Bio-Sol": {
    "name": "Bio-Sol",
    "type": "cardresource.microbe",
    "tags": [
      "microbe"
    ],
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "resourceType": "Microbe",
    "cardNumber": "PfC14",
    "description": "You start with 42 M€. As your first action, draw 2 cards with a microbe tag.",
    "expansion": "pathfinders"
  },
  "Botanical Experience": {
    "name": "Botanical Experience",
    "type": "active",
    "cost": 14,
    "tags": [
      "plant",
      "mars",
      "science"
    ],
    "requirements": {
      "greeneries": 1
    },
    "resourceType": "Data",
    "cardNumber": "Pf50",
    "description": "Requires one greenery tile on Mars.",
    "expansion": "pathfinders"
  },
  "Breeding Farms": {
    "name": "Breeding Farms",
    "type": "active",
    "cost": 16,
    "tags": [
      "science",
      "animal",
      "building"
    ],
    "requirements": {
      "tag": "animal"
    },
    "behavior": {
      "global": {
        "temperature": 1
      }
    },
    "cardNumber": "Pf01",
    "description": "Requires 1 science tag and 1 animal tag. Raise the temperature 1 step.",
    "expansion": "pathfinders"
  },
  "Cassini Station": {
    "name": "Cassini Station",
    "type": "automated",
    "cost": 23,
    "tags": [
      "power",
      "science",
      "space"
    ],
    "cardNumber": "Pf62",
    "description": "Increase your energy production 1 step for every colony in play. ",
    "expansion": "pathfinders"
  },
  "Ceres Spaceport": {
    "name": "Ceres Spaceport",
    "type": "automated",
    "cost": 36,
    "tags": [
      "jovian",
      "jovian",
      "city",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "megacredits": 2,
        "per": 2
      },
      "city": true,
      "ocean": true,
      "drawCard": 1
    },
    "cardNumber": "Pf14",
    "description": "Increase your M€ production 2 steps, and titanium production 1 step for every 2 Jovian tags (including these.) ",
    "expansion": "pathfinders"
  },
  "Charity Donation": {
    "name": "Charity Donation",
    "type": "event",
    "cost": 7,
    "tags": [
      "mars"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "Pf58",
    "expansion": "pathfinders"
  },
  "Chimera": {
    "name": "Chimera",
    "tags": [
      "wild",
      "wild"
    ],
    "behavior": {
      "stock": {
        "steel": 1,
        "titanium": 1
      }
    },
    "cardNumber": "PfC5",
    "description": "You start with 36 M€, 1 steel, and 1 titanium.",
    "expansion": "pathfinders"
  },
  "CO² Reducers": {
    "name": "CO² Reducers",
    "tags": [
      "microbe",
      "venus"
    ],
    "behavior": {
      "production": {
        "megacredits": 3
      }
    },
    "cardNumber": "PfP03",
    "description": "Increase your M€ production 3 steps. Draw 2 cards with a microbe tag.",
    "expansion": "pathfinders"
  },
  "Collegium Copernicus": {
    "name": "Collegium Copernicus",
    "tags": [
      "science",
      "earth"
    ],
    "resourceType": "Data",
    "cardNumber": "PfC16",
    "description": "You start with 33 M€. As your first action, draw 2 cards with a science tag.",
    "expansion": "pathfinders"
  },
  "GlobalEventName.COMMUNICATION_BOOM": {
    "name": "GlobalEventName.COMMUNICATION_BOOM",
    "description": "Pay 10M€. Add 2 data to EVERY data card. Add 1 data to any data card for each influence you have.",
    "expansion": "pathfinders"
  },
  "Communication Center": {
    "name": "Communication Center",
    "type": "active",
    "cost": 8,
    "tags": [
      "science",
      "mars",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1
      },
      "addResources": 2
    },
    "resourceType": "Data",
    "cardNumber": "Pf28",
    "description": "Decrease your energy production 1 step. Place 2 data on this card.",
    "expansion": "pathfinders"
  },
  "GlobalEventName.CONSTANT_STRUGGLE": {
    "name": "GlobalEventName.CONSTANT_STRUGGLE",
    "description": "Pay 10M€, reduced by 1M€ per influence. Raise every planetary track 2 steps. Nobody gains the \"rising player\" bonus.",
    "expansion": "pathfinders"
  },
  "Controlled Bloom": {
    "name": "Controlled Bloom",
    "type": "event",
    "cost": 13,
    "tags": [
      "microbe",
      "plant"
    ],
    "requirements": {
      "oceans": 3
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "stock": {
        "plants": 3
      }
    },
    "cardNumber": "PFTmp",
    "description": "Requires 3 oceans. Add 3 microbes to ANY card. Gain 3 plants.",
    "expansion": "pathfinders"
  },
  "Coordinated Raid": {
    "name": "Coordinated Raid",
    "type": "event",
    "cost": 5,
    "requirements": {
      "colonies": 1
    },
    "cardNumber": "Pf64",
    "description": "Requires at least 1 colony in play. Send one of your unused Trade Fleets to ANY colony tile (can be a tile already used this generation.) ",
    "expansion": "pathfinders"
  },
  "Crashlanding": {
    "name": "Crashlanding",
    "type": "event",
    "cost": 20,
    "cardNumber": "Pf48",
    "expansion": "pathfinders"
  },
  "Crew Training": {
    "name": "Crew Training",
    "behavior": {
      "tr": 2
    },
    "cardNumber": "PfP06",
    "description": "Choose a planet tag. This card counts as having 2 of that tag. ",
    "expansion": "pathfinders"
  },
  "Cryptocurrency": {
    "name": "Cryptocurrency",
    "type": "active",
    "cost": 6,
    "tags": [
      "power"
    ],
    "resourceType": "Data",
    "cardNumber": "Pf51",
    "expansion": "pathfinders"
  },
  "Cultivation of Venus": {
    "name": "Cultivation of Venus",
    "type": "active",
    "cost": 18,
    "tags": [
      "plant",
      "venus"
    ],
    "vp": {
      "type": "per_tag",
      "tag": "venus",
      "per": 2
    },
    "action": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "Pf45",
    "description": "1 VP for every 2 Venus tags you own.",
    "expansion": "pathfinders"
  },
  "Cyanobacteria": {
    "name": "Cyanobacteria",
    "type": "automated",
    "cost": 12,
    "tags": [
      "microbe",
      "mars"
    ],
    "behavior": {
      "global": {
        "oxygen": 1
      }
    },
    "cardNumber": "Pf27",
    "description": "Raise the oxygen level 1%. For every ocean tile, add a microbe to ANY card.",
    "expansion": "pathfinders"
  },
  "Data Leak": {
    "name": "Data Leak",
    "type": "event",
    "cost": 5,
    "cardNumber": "Pf30",
    "description": "Add 5 data to ANY card.",
    "expansion": "pathfinders"
  },
  "Declaration of Independence": {
    "name": "Declaration of Independence",
    "type": "event",
    "cost": 20,
    "tags": [
      "mars"
    ],
    "requirements": {
      "count": 6,
      "tag": "mars"
    },
    "vp": {
      "type": "static",
      "vp": 4
    },
    "cardNumber": "Pf34",
    "description": "Requires that you have at least 6 Mars tags in play. Place 2 delegates in any party.",
    "expansion": "pathfinders"
  },
  "Deep Space Operations": {
    "name": "Deep Space Operations",
    "type": "event",
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "titanium": 4
      }
    },
    "cardNumber": "PfP12",
    "description": "Gain 4 titanium. Draw 2 event cards with a space tag.",
    "expansion": "pathfinders"
  },
  "Design Company": {
    "name": "Design Company",
    "tags": [
      "mars"
    ],
    "behavior": {
      "production": {
        "steel": 1
      }
    },
    "cardNumber": "PfP08",
    "description": "Increase your steel production 1 step. Draw 3 cards with a building tag.",
    "expansion": "pathfinders"
  },
  "Designed Organisms": {
    "name": "Designed Organisms",
    "type": "automated",
    "cost": 13,
    "tags": [
      "science",
      "plant",
      "mars"
    ],
    "requirements": {
      "count": 5,
      "tag": "science"
    },
    "behavior": {
      "production": {
        "plants": 2
      },
      "stock": {
        "plants": 3
      }
    },
    "cardNumber": "Pf23",
    "description": "Requires 5 science tags. Increase your plant production 2 steps. Gain 3 plants. ",
    "expansion": "pathfinders"
  },
  "Dust Storm": {
    "name": "Dust Storm",
    "type": "event",
    "cost": 17,
    "tags": [
      "mars"
    ],
    "behavior": {
      "global": {
        "temperature": 2
      }
    },
    "cardNumber": "Pf08",
    "description": "Every player loses all energy. Raise the temperature 2 steps.",
    "expansion": "pathfinders"
  },
  "Dyson Screens": {
    "name": "Dyson Screens",
    "type": "active",
    "cost": 28,
    "tags": [
      "science",
      "venus",
      "power",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": 2,
        "heat": 2
      },
      "global": {
        "temperature": 1
      },
      "city": true,
      "drawCard": 1
    },
    "action": {
      "production": {
        "energy": 1,
        "heat": 1
      }
    },
    "cardNumber": "Pf15",
    "description": "Raise the temperature 1 step. Draw a card. Place a city tile ON THE RESERVED AREA. Raise your energy and heat production 2 steps.",
    "expansion": "pathfinders"
  },
  "Early Expedition": {
    "name": "Early Expedition",
    "type": "automated",
    "cost": 15,
    "tags": [
      "science",
      "space",
      "city"
    ],
    "requirements": {
      "temperature": -18
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 3
      },
      "city": true
    },
    "cardNumber": "Pf18",
    "description": "Temperature must be -18 C or lower. Decrease your energy production 1 step and ",
    "expansion": "pathfinders"
  },
  "Economic Espionage": {
    "name": "Economic Espionage",
    "type": "active",
    "cost": 8,
    "tags": [
      "earth"
    ],
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "resourceType": "Data",
    "cardNumber": "Pf38",
    "expansion": "pathfinders"
  },
  "Economic Help": {
    "name": "Economic Help",
    "type": "event",
    "cost": 9,
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "Pf42",
    "description": "Raise the lowest non-completed planetary influence track 3 steps. When tied, raise all lowest tracks 2 steps. ",
    "expansion": "pathfinders"
  },
  "Expedition to the Surface - Venus": {
    "name": "Expedition to the Surface - Venus",
    "type": "event",
    "cost": 16,
    "tags": [
      "venus"
    ],
    "behavior": {
      "global": {
        "venus": 1
      },
      "drawCard": 2
    },
    "cardNumber": "Pf46",
    "description": "Draw 2 cards. Raise Venus 1 step. Gain 1M€ for each of your Venus tags, including this.",
    "expansion": "pathfinders"
  },
  "Experienced Martians": {
    "name": "Experienced Martians",
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "PfP13",
    "description": "Place 1 delegate in any party. Draw 2 cards with a Mars tag. Increase your M€ production 2 steps.",
    "expansion": "pathfinders"
  },
  "Flat Mars Theory": {
    "name": "Flat Mars Theory",
    "type": "automated",
    "cost": 8,
    "tags": [
      "earth"
    ],
    "requirements": {
      "count": 1,
      "tag": "science"
    },
    "cardNumber": "Pf39",
    "description": "Requires maximum 1 science tag. Increase your M€ production 1 step for every generation played so far.",
    "expansion": "pathfinders"
  },
  "Floater-Urbanism": {
    "name": "Floater-Urbanism",
    "type": "active",
    "cost": 7,
    "tags": [
      "venus"
    ],
    "requirements": {
      "count": 4,
      "tag": "venus"
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "resourceType": "Venusian Habitat",
    "cardNumber": "Pf59",
    "description": "Requires 4 Venus tags.",
    "expansion": "pathfinders"
  },
  "Gagarin Mobile Base": {
    "name": "Gagarin Mobile Base",
    "tags": [
      "science"
    ],
    "cardNumber": "PfC19",
    "description": "You start with 42 M€. As your first action, put Gagarin Mobile Base on ANY area on Mars. Collect the bonus.",
    "expansion": "pathfinders"
  },
  "Geological Expedition": {
    "name": "Geological Expedition",
    "type": "active",
    "cost": 18,
    "tags": [
      "mars",
      "science"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "Pf17",
    "expansion": "pathfinders"
  },
  "Habitat Marte": {
    "name": "Habitat Marte",
    "tags": [
      "mars"
    ],
    "cardNumber": "PfC22",
    "description": "You start with 40 M€.",
    "expansion": "pathfinders"
  },
  "High Temp. Superconductors": {
    "name": "High Temp. Superconductors",
    "type": "active",
    "cost": 10,
    "tags": [
      "power",
      "science"
    ],
    "behavior": {
      "production": {
        "energy": 2
      }
    },
    "cardDiscount": {
      "amount": 3,
      "tag": "power"
    },
    "cardNumber": "PfTMP",
    "description": "Requires Kelvinists are ruling or you have 2 delegates there. Increase your energy production 2 steps.",
    "expansion": "pathfinders"
  },
  "Huygens Observatory": {
    "name": "Huygens Observatory",
    "type": "automated",
    "cost": 27,
    "tags": [
      "science",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "tr": 1
    },
    "cardNumber": "Pf61",
    "description": "Place a colony. MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY. ",
    "expansion": "pathfinders"
  },
  "Hydrogen Bombardment": {
    "name": "Hydrogen Bombardment",
    "tags": [
      "space",
      "venus"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      },
      "stock": {
        "megacredits": 6
      },
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "PfP04",
    "description": "Increase the Venus scale 1 step. Increase your titanium production 1 step. Gain 6 M€.",
    "expansion": "pathfinders"
  },
  "Hydrogen Processing Plant": {
    "name": "Hydrogen Processing Plant",
    "type": "automated",
    "cost": 9,
    "tags": [
      "building",
      "power"
    ],
    "requirements": {
      "oxygen": 3
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "behavior": {
      "production": {
        "per": 2
      },
      "global": {
        "oxygen": -1
      }
    },
    "cardNumber": "Pf19",
    "description": "Oxygen level must be 3% or higher. Decrease oxygen level 1% ",
    "expansion": "pathfinders"
  },
  "ColonyName.IAPETUS_II": {
    "name": "ColonyName.IAPETUS_II",
    "type": "colonybenefit.add_resources_to_card",
    "description": "Add 3 data to ANY card",
    "expansion": "pathfinders"
  },
  "Interplanetary Transport": {
    "name": "Interplanetary Transport",
    "type": "automated",
    "cost": 15,
    "tags": [
      "earth",
      "jovian",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "Pf43",
    "description": "Increase your M€ production 1 step for every offworld city tile.",
    "expansion": "pathfinders"
  },
  "Kickstarter": {
    "name": "Kickstarter",
    "type": "automated",
    "cost": 12,
    "cardNumber": "Pf41",
    "description": "Choose a planet tag. This card counts as having 1 of that tag. Raise the corresponding planetary track 3 steps in total.",
    "expansion": "pathfinders"
  },
  "Last Resort Ingenuity": {
    "name": "Last Resort Ingenuity",
    "type": "event",
    "cost": 4,
    "cardNumber": "Pf47",
    "expansion": "pathfinders"
  },
  "ColonyName.LEAVITT_II": {
    "name": "ColonyName.LEAVITT_II",
    "type": "colonybenefit.gain_science_tags_and_clone_tag",
    "description": "Gain 2 science tags and 1 clone tag",
    "expansion": "pathfinders"
  },
  "Lobby Halls": {
    "name": "Lobby Halls",
    "type": "automated",
    "cost": 11,
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "PfT1",
    "description": "Increase your M€ production 2 steps. Place 1 delegate in any party.",
    "expansion": "pathfinders"
  },
  "Lunar Embassy": {
    "name": "Lunar Embassy",
    "type": "automated",
    "cost": 28,
    "tags": [
      "earth",
      "mars",
      "city",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "megacredits": 3,
        "per": 2
      },
      "city": true,
      "drawCard": 1
    },
    "cardNumber": "Pf16",
    "description": "Increase your M€ production 3 steps, and plant production 1 step for every 2 Earth tags (including this.) ",
    "expansion": "pathfinders"
  },
  "Luxury Estate": {
    "name": "Luxury Estate",
    "type": "automated",
    "cost": 12,
    "tags": [
      "earth",
      "mars",
      "building"
    ],
    "requirements": {
      "oxygen": 7
    },
    "cardNumber": "Pf21",
    "description": "Oxygen must be 7% or greater. Gain 1 titanium for each city tile and greenery tile you own.",
    "expansion": "pathfinders"
  },
  "GlobalEventName.MAGNETIC_FIELD_STIMULATION_DELAYS": {
    "name": "GlobalEventName.MAGNETIC_FIELD_STIMULATION_DELAYS",
    "description": "Lower the temperature and oxygen 2 steps each. (-4C, -2% O2)",
    "expansion": "pathfinders"
  },
  "Mars Direct": {
    "name": "Mars Direct",
    "tags": [
      "mars"
    ],
    "cardNumber": "PFC11",
    "description": "You start with 52 M€.",
    "expansion": "pathfinders"
  },
  "Mars Frontier Alliance": {
    "name": "Mars Frontier Alliance",
    "tags": [],
    "cardNumber": "PfC20",
    "description": "You start with 40 M€. When you reveal this card, select any remaining political program tile (you may use its effect as a passive effect of your corporation or as ruling party this generation).",
    "expansion": "pathfinders"
  },
  "Mars Maths": {
    "name": "Mars Maths",
    "tags": [
      "science"
    ],
    "cardNumber": "PfC10",
    "description": "You start with 40 M€. As your first action, draw 2 cards",
    "expansion": "pathfinders"
  },
  "Martian Culture": {
    "name": "Martian Culture",
    "type": "active",
    "cost": 11,
    "tags": [
      "mars",
      "mars"
    ],
    "requirements": {
      "count": 2,
      "tag": "mars"
    },
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "resourceType": "Data",
    "cardNumber": "Pf35",
    "description": "Requires ANY 2 Mars tags in play.  1 VP for every 2 data here.",
    "expansion": "pathfinders"
  },
  "Martian Dust Processing Plant": {
    "name": "Martian Dust Processing Plant",
    "type": "automated",
    "cost": 15,
    "tags": [
      "mars",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "steel": 2
      },
      "tr": 1
    },
    "cardNumber": "Pf44",
    "description": "Decrease your energy production 1 step, and raise your steel production 2 steps. Gain 1 TR.",
    "expansion": "pathfinders"
  },
  "Martian Insurance Group": {
    "name": "Martian Insurance Group",
    "tags": [
      "mars"
    ],
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "PfC12",
    "description": "You start with 42 M€ and 1 M€ production.",
    "expansion": "pathfinders"
  },
  "Martian Monuments": {
    "name": "Martian Monuments",
    "type": "automated",
    "cost": 10,
    "tags": [
      "mars",
      "building"
    ],
    "requirements": {
      "cities": 1
    },
    "cardNumber": "Pf09",
    "description": "Requires that you own a city ON MARS. Raise your M€ production 1 step for every Mars tag you own (including this.)",
    "expansion": "pathfinders"
  },
  "Martian Nature Wonders": {
    "name": "Martian Nature Wonders",
    "type": "automated",
    "cost": 13,
    "tags": [
      "mars"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "Pf10",
    "description": "Place a neutral player cube on a non-reserved space. No tile can be placed on that space this game. ",
    "expansion": "pathfinders"
  },
  "Martian Repository": {
    "name": "Martian Repository",
    "type": "active",
    "cost": 12,
    "tags": [
      "mars",
      "mars",
      "building"
    ],
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "behavior": {
      "production": {
        "energy": -1
      }
    },
    "resourceType": "Data",
    "cardNumber": "Pf29",
    "description": "Decrease your energy production 1 step. 1 VP for every 3 data here.",
    "expansion": "pathfinders"
  },
  "Microbiology Patents": {
    "name": "Microbiology Patents",
    "type": "active",
    "cost": 6,
    "tags": [
      "mars",
      "microbe"
    ],
    "cardNumber": "Pf63",
    "expansion": "pathfinders"
  },
  "Mind Set Mars": {
    "name": "Mind Set Mars",
    "behavior": {
      "addResources": 1
    },
    "resourceType": "Agenda",
    "cardNumber": "PfC21",
    "description": "You start with 44 M€ and 1 agenda resource to this card.",
    "expansion": "pathfinders"
  },
  "Museum of Early Colonisation": {
    "name": "Museum of Early Colonisation",
    "type": "automated",
    "cost": 20,
    "tags": [
      "building",
      "mars"
    ],
    "requirements": {
      "oceans": 1,
      "cities": 1,
      "greeneries": 1
    },
    "behavior": {
      "production": {
        "energy": -1,
        "steel": 1,
        "titanium": 1,
        "plants": 1
      },
      "tr": 1
    },
    "cardNumber": "Pf11",
    "description": "Requires 1 ocean, 1 city and one greenery on Mars. ",
    "expansion": "pathfinders"
  },
  "New Venice": {
    "name": "New Venice",
    "type": "automated",
    "cost": 21,
    "tags": [
      "mars",
      "power",
      "building",
      "city"
    ],
    "requirements": {
      "oceans": 3
    },
    "behavior": {
      "production": {
        "energy": 1,
        "megacredits": 2
      },
      "city": true,
      "ocean": true
    },
    "cardNumber": "Pf3",
    "description": "Requires 3 ocean tiles. Lose 2 plants. Increase your energy production 1 step and your M€ production 2 steps. ",
    "expansion": "pathfinders"
  },
  "Nobel Labs": {
    "name": "Nobel Labs",
    "type": "active",
    "cost": 8,
    "tags": [
      "science"
    ],
    "requirements": {
      "count": 4,
      "tag": "science"
    },
    "cardNumber": "Pf60",
    "description": "Requires 4 science tags.",
    "expansion": "pathfinders"
  },
  "Odyssey": {
    "name": "Odyssey",
    "cardNumber": "PfC18",
    "description": "You start with 33 M€.",
    "expansion": "pathfinders"
  },
  "Orbital Laboratories": {
    "name": "Orbital Laboratories",
    "type": "automated",
    "cost": 18,
    "tags": [
      "science",
      "plant",
      "space"
    ],
    "behavior": {
      "production": {
        "plants": 2
      },
      "stock": {
        "plants": 1
      }
    },
    "cardNumber": "Pf07",
    "description": "Increase your plant production 2 steps. Gain 1 plant.",
    "expansion": "pathfinders"
  },
  "Oumuamua Type Object Survey": {
    "name": "Oumuamua Type Object Survey",
    "type": "automated",
    "cost": 20,
    "tags": [
      "space",
      "science"
    ],
    "requirements": {
      "tag": "science"
    },
    "cardNumber": "Pf53",
    "description": "Requires 1 space tag and 1 science tag. Add 2 data to ANY card.",
    "expansion": "pathfinders"
  },
  "Ozone Generators": {
    "name": "Ozone Generators",
    "type": "active",
    "cost": 14,
    "tags": [
      "mars",
      "space"
    ],
    "requirements": {
      "oxygen": 6
    },
    "action": {
      "tr": 1
    },
    "cardNumber": "Pf36",
    "description": "Requires 6% Oxygen.",
    "expansion": "pathfinders"
  },
  "Personal Agenda": {
    "name": "Personal Agenda",
    "behavior": {
      "production": {
        "megacredits": 3
      }
    },
    "cardNumber": "PfP10",
    "description": "Increase your M€ production 3 steps. Draw 3 event cards that do not have a space tag.",
    "expansion": "pathfinders"
  },
  "Polaris": {
    "name": "Polaris",
    "tags": [
      "space"
    ],
    "cardNumber": "PfC1",
    "description": "You start with 32 M€. As your first action, place an ocean tile.",
    "expansion": "pathfinders"
  },
  "Pollinators": {
    "name": "Pollinators",
    "type": "active",
    "cost": 19,
    "tags": [
      "plant",
      "animal"
    ],
    "requirements": {
      "count": 3,
      "tag": "plant"
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "behavior": {
      "production": {
        "plants": 1,
        "megacredits": 2
      }
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "PfT9",
    "description": "Requires 3 plant tags. Raise your plant production 1 step and your M€ production 2 steps.",
    "expansion": "pathfinders"
  },
  "Power Plant:Pathfinders": {
    "name": "Power Plant:Pathfinders",
    "type": "automated",
    "cost": 13,
    "tags": [
      "mars",
      "power",
      "building"
    ],
    "behavior": {
      "production": {
        "heat": 2,
        "energy": 1
      }
    },
    "cardNumber": "Pf20",
    "description": "Increase your heat production 2 steps and your energy production 1 step.",
    "expansion": "pathfinders"
  },
  "Prefabrication of Human Habitats": {
    "name": "Prefabrication of Human Habitats",
    "type": "active",
    "cost": 8,
    "tags": [
      "building",
      "city"
    ],
    "requirements": {
      "count": 1
    },
    "cardDiscount": {
      "amount": 2,
      "tag": "city"
    },
    "cardNumber": "Pf02",
    "description": "Requires that you have steel production.",
    "expansion": "pathfinders"
  },
  "Private Security": {
    "name": "Private Security",
    "type": "active",
    "cost": 8,
    "tags": [
      "earth"
    ],
    "cardNumber": "Pf25",
    "expansion": "pathfinders"
  },
  "Public Sponsored Grant": {
    "name": "Public Sponsored Grant",
    "type": "event",
    "cost": 6,
    "cardNumber": "PfTVD",
    "description": "Requires Scientists are ruling or that you have 2 delegates there. All players lose 2M€. Choose a tag (NOT CITY, ? OR PLANETARY TRACK) and draw 2 cards with that tag.",
    "expansion": "pathfinders"
  },
  "Rare-Earth Elements": {
    "name": "Rare-Earth Elements",
    "type": "automated",
    "cost": 5,
    "tags": [
      "earth",
      "mars"
    ],
    "cardNumber": "Pf06",
    "description": "Increase your M€ production by 1 for every special tile you own on Mars.",
    "expansion": "pathfinders"
  },
  "Red City": {
    "name": "Red City",
    "type": "automated",
    "cost": 21,
    "tags": [
      "city",
      "building"
    ],
    "vp": {
      "type": "special"
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 2
      }
    },
    "cardNumber": "PFT2",
    "description": "Requires that Reds are ruling or that you have 2 delegates there. ",
    "expansion": "pathfinders"
  },
  "Research Grant:Pathfinders": {
    "name": "Research Grant:Pathfinders",
    "tags": [
      "science",
      "science"
    ],
    "behavior": {
      "production": {
        "energy": 1
      },
      "stock": {
        "megacredits": 14
      }
    },
    "cardNumber": "PfP05",
    "description": "Increase your energy production 1 step. Gain 14 M€.",
    "expansion": "pathfinders"
  },
  "Return to Abandoned Technology": {
    "name": "Return to Abandoned Technology",
    "type": "event",
    "cost": 4,
    "tags": [
      "mars"
    ],
    "cardNumber": "Pf22",
    "expansion": "pathfinders"
  },
  "Rich Deposits": {
    "name": "Rich Deposits",
    "type": "automated",
    "cost": 12,
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "behavior": {
      "production": {
        "steel": 3
      }
    },
    "cardNumber": "Pf52",
    "description": "Requires 2 science tags. Increase your steel production 3 steps.",
    "expansion": "pathfinders"
  },
  "Ringcom": {
    "name": "Ringcom",
    "tags": [
      "jovian"
    ],
    "behavior": {
      "production": {
        "megacredits": 3
      }
    },
    "cardNumber": "PfC4",
    "description": "You start with 39 M€. and 3 M€ production. As your first action, draw 2 cards with a Jovian tag.",
    "expansion": "pathfinders"
  },
  "Robin Haulings": {
    "name": "Robin Haulings",
    "tags": [
      "mars",
      "venus"
    ],
    "resourceType": "Floater",
    "cardNumber": "PfC17",
    "description": "You start with 39 M€.",
    "expansion": "pathfinders"
  },
  "Secret Labs": {
    "name": "Secret Labs",
    "type": "automated",
    "cost": 21,
    "tags": [
      "jovian",
      "building",
      "space"
    ],
    "requirements": {
      "tag": "jovian"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "Pf26",
    "description": "Requires 1 science tag and 1 Jovian tag. ",
    "expansion": "pathfinders"
  },
  "Small Comet": {
    "name": "Small Comet",
    "type": "event",
    "cost": 32,
    "tags": [
      "mars",
      "space"
    ],
    "behavior": {
      "stock": {
        "titanium": 1
      },
      "global": {
        "temperature": 1,
        "oxygen": 1
      },
      "ocean": true
    },
    "cardNumber": "Pf37",
    "description": "Every player loses 2 plants. Raise the temperature 1 step. Raise the oxygen 1 step. ",
    "expansion": "pathfinders"
  },
  "Small Open Pit Mine": {
    "name": "Small Open Pit Mine",
    "type": "automated",
    "cost": 10,
    "tags": [
      "building"
    ],
    "cardNumber": "Pf31",
    "description": "Increase your steel production 2 steps OR increase your titanium production 1 step.",
    "expansion": "pathfinders"
  },
  "Social Events": {
    "name": "Social Events",
    "type": "event",
    "cost": 18,
    "tags": [
      "earth",
      "mars"
    ],
    "cardNumber": "PfT10",
    "description": "Gain 1 TR for every 2 Mars tags you have (including this one.)",
    "expansion": "pathfinders"
  },
  "Soil Detoxification": {
    "name": "Soil Detoxification",
    "type": "active",
    "cost": 10,
    "tags": [
      "plant",
      "science"
    ],
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "PfTmp",
    "description": "Requires that Greens are ruling or you have 2 delegates there. Increase your plant production 1 step",
    "expansion": "pathfinders"
  },
  "Solarpedia": {
    "name": "Solarpedia",
    "type": "active",
    "cost": 12,
    "tags": [
      "space"
    ],
    "requirements": {
      "tag": "jovian"
    },
    "vp": {
      "type": "per_resource",
      "per": 6
    },
    "resourceType": "Data",
    "cardNumber": "Pf54",
    "description": "Requires 1 Venus, Earth, Mars, and Jovian Tag. Add 2 data to ANY card. 1 VP for every 6 data resources here.",
    "expansion": "pathfinders"
  },
  "Solar Storm": {
    "name": "Solar Storm",
    "type": "event",
    "cost": 12,
    "tags": [
      "space"
    ],
    "behavior": {
      "production": {
        "heat": 1
      },
      "global": {
        "temperature": 1
      }
    },
    "cardNumber": "Pf32",
    "description": "Every player loses 2 plants. Remove up to 3 data from any player. ",
    "expansion": "pathfinders"
  },
  "SolBank": {
    "name": "SolBank",
    "resourceType": "Data",
    "cardNumber": "PfC13",
    "description": "You start with 40 M€",
    "expansion": "pathfinders"
  },
  "Soylent Seedling Systems": {
    "name": "Soylent Seedling Systems",
    "tags": [
      "science",
      "plant"
    ],
    "behavior": {
      "addResources": 2
    },
    "resourceType": "Seed",
    "cardNumber": "PfC8",
    "description": "You start with 38M€ and 2 seeds on this card.",
    "expansion": "pathfinders"
  },
  "Space Debris Cleaning Operation": {
    "name": "Space Debris Cleaning Operation",
    "type": "event",
    "cost": 7,
    "tags": [
      "mars",
      "space"
    ],
    "requirements": {
      "count": 4,
      "tag": "space"
    },
    "behavior": {
      "stock": {
        "titanium": 3
      },
      "drawCard": 1
    },
    "cardNumber": "Pf24",
    "description": "Requires any 4 space tags in play. Gain 3 titanium. ",
    "expansion": "pathfinders"
  },
  "GlobalEventName.SPACE_RACE_TO_MARS": {
    "name": "GlobalEventName.SPACE_RACE_TO_MARS",
    "description": "Increase your M€ production 1 step for every special tile you own (max 5.) Gain 1 energy for every influence you have",
    "expansion": "pathfinders"
  },
  "Space Relay": {
    "name": "Space Relay",
    "type": "active",
    "cost": 13,
    "tags": [
      "space",
      "jovian"
    ],
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "Pf33",
    "description": "Increase your M€ production 1 step.",
    "expansion": "pathfinders"
  },
  "Specialized Settlement": {
    "name": "Specialized Settlement",
    "type": "automated",
    "cost": 20,
    "tags": [
      "city",
      "building",
      "mars"
    ],
    "cardNumber": "PF57",
    "description": "Decrease your energy production 1 step and increase your M€ production 3 steps. ",
    "expansion": "pathfinders"
  },
  "Steelaris": {
    "name": "Steelaris",
    "tags": [
      "building",
      "city"
    ],
    "cardNumber": "PfC9",
    "description": "You start with 42 M€.",
    "expansion": "pathfinders"
  },
  "Survey Mission": {
    "name": "Survey Mission",
    "tags": [
      "mars"
    ],
    "behavior": {
      "stock": {
        "steel": 5
      }
    },
    "cardNumber": "PfP07",
    "description": "Gain 5 steel. Land-claim three non-reserved spaces in a triangle shape. Gain all placement bonuses. ",
    "expansion": "pathfinders"
  },
  "Terraforming Control Station": {
    "name": "Terraforming Control Station",
    "type": "active",
    "cost": 18,
    "tags": [
      "venus",
      "mars",
      "space"
    ],
    "behavior": {
      "tr": 2
    },
    "cardDiscount": {
      "amount": 2,
      "tag": "venus"
    },
    "cardNumber": "Pf12",
    "description": "Raise your TR 2 steps.",
    "expansion": "pathfinders"
  },
  "Terraforming Robots": {
    "name": "Terraforming Robots",
    "type": "active",
    "cost": 10,
    "tags": [
      "science"
    ],
    "requirements": {
      "count": 4,
      "tag": "science"
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "resourceType": "Specialized Robot",
    "cardNumber": "PfT12",
    "description": "Requires 4 science tags.",
    "expansion": "pathfinders"
  },
  "The New Space Race": {
    "name": "The New Space Race",
    "tags": [
      "science",
      "earth"
    ],
    "behavior": {
      "stock": {
        "megacredits": 12
      }
    },
    "cardNumber": "PfP14",
    "description": "REVEALED BEFORE ANY OTHER PRELUDE. You become starting player for the game. Choose and set a ruling policy for the first generation. Gain 12 M€.",
    "expansion": "pathfinders"
  },
  "Think Tank": {
    "name": "Think Tank",
    "type": "active",
    "cost": 12,
    "tags": [
      "mars",
      "venus",
      "science"
    ],
    "resourceType": "Data",
    "cardNumber": "Pf49",
    "expansion": "pathfinders"
  },
  "GlobalEventName.TIRED_EARTH": {
    "name": "GlobalEventName.TIRED_EARTH",
    "description": "Lose 1 plant for each Earth tag you own (max 5) then reduced by influence.",
    "expansion": "pathfinders"
  },
  "Valuable Gases:Pathfinders": {
    "name": "Valuable Gases:Pathfinders",
    "tags": [
      "jovian",
      "venus"
    ],
    "cardNumber": "PfP02",
    "description": "Gain 10 M€. PLAY AN ACTIVE FLOATER CARD FROM HAND, IGNORING GLOBAL REQUIREMENTS, and add 5 floaters to it.",
    "expansion": "pathfinders"
  },
  "Venera Base": {
    "name": "Venera Base",
    "type": "active",
    "cost": 21,
    "tags": [
      "venus",
      "venus",
      "city"
    ],
    "vp": {
      "type": "per_tag",
      "tag": "venus",
      "per": 2
    },
    "behavior": {
      "production": {
        "megacredits": 3
      },
      "city": true
    },
    "cardNumber": "Pf67",
    "description": "Requires Unity is ruling or that you have 2 delegates there. Raise your M€ production 3 steps and place a city tile ON THE RESERVED AREA.",
    "expansion": "pathfinders"
  },
  "Venus First": {
    "name": "Venus First",
    "tags": [
      "venus"
    ],
    "behavior": {
      "global": {
        "venus": 2
      }
    },
    "cardNumber": "PfP01",
    "description": "Raise Venus 2 steps. Draw 2 Venus cards.",
    "expansion": "pathfinders"
  },
  "Vital Colony": {
    "name": "Vital Colony",
    "tags": [
      "mars",
      "space"
    ],
    "cardNumber": "PfP11",
    "description": "Place a colony. Receive the placement bonus twice.",
    "expansion": "pathfinders"
  },
  "Wetlands": {
    "name": "Wetlands",
    "type": "automated",
    "cost": 20,
    "tags": [
      "plant",
      "mars"
    ],
    "requirements": {
      "oceans": 2
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "Pf03",
    "expansion": "pathfinders"
  },
  "Acquired Space Agency": {
    "name": "Acquired Space Agency",
    "behavior": {
      "stock": {
        "titanium": 6
      }
    },
    "cardNumber": "P35",
    "description": "Gain 6 titanium. Reveal cards until you reveal two cards with Space Tags. Take them into your hand, discard the rest.",
    "expansion": "prelude"
  },
  "Allied Bank": {
    "name": "Allied Bank",
    "tags": [
      "earth"
    ],
    "behavior": {
      "production": {
        "megacredits": 4
      },
      "stock": {
        "megacredits": 3
      }
    },
    "cardNumber": "P01",
    "description": "Increase your M€ production 4 steps. Gain 3 M€.",
    "expansion": "prelude"
  },
  "Aquifer Turbines": {
    "name": "Aquifer Turbines",
    "tags": [
      "power"
    ],
    "behavior": {
      "production": {
        "energy": 2
      },
      "ocean": true
    },
    "cardNumber": "P02",
    "description": "Place an ocean tile. Increase your energy production 2 steps. Pay 3 M€.",
    "expansion": "prelude"
  },
  "Biofuels": {
    "name": "Biofuels",
    "tags": [
      "microbe"
    ],
    "behavior": {
      "production": {
        "energy": 1,
        "plants": 1
      },
      "stock": {
        "plants": 2
      }
    },
    "cardNumber": "P03",
    "description": "Increase your energy and plant production 1 step. Gain 2 plants.",
    "expansion": "prelude"
  },
  "Biolab": {
    "name": "Biolab",
    "tags": [
      "science"
    ],
    "behavior": {
      "production": {
        "plants": 1
      },
      "drawCard": 3
    },
    "cardNumber": "P04",
    "description": "Increase your plant production 1 step. Draw 3 cards.",
    "expansion": "prelude"
  },
  "Biosphere Support": {
    "name": "Biosphere Support",
    "tags": [
      "plant"
    ],
    "behavior": {
      "production": {
        "plants": 2,
        "megacredits": -1
      }
    },
    "cardNumber": "P05",
    "description": "Increase your plant production 2 steps. Decrease your M€ production 1 step.",
    "expansion": "prelude"
  },
  "Buffer Gas": {
    "name": "Buffer Gas",
    "cost": 16,
    "cardNumber": "SP3",
    "expansion": "prelude"
  },
  "Business Empire": {
    "name": "Business Empire",
    "tags": [
      "earth"
    ],
    "behavior": {
      "production": {
        "megacredits": 6
      }
    },
    "cardNumber": "P06",
    "description": "Increase your M€ production 6 steps. Pay 6 M€.",
    "expansion": "prelude"
  },
  "Cheung Shing MARS": {
    "name": "Cheung Shing MARS",
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "megacredits": 3
      }
    },
    "cardDiscount": {
      "amount": 2,
      "tag": "building"
    },
    "cardNumber": "R16",
    "description": "You start with 3 M€ production and 44 M€.",
    "expansion": "prelude"
  },
  "Dome Farming": {
    "name": "Dome Farming",
    "tags": [
      "plant",
      "building"
    ],
    "behavior": {
      "production": {
        "megacredits": 2,
        "plants": 1
      }
    },
    "cardNumber": "P07",
    "description": "Increase your M€ production 2 steps and plant production 1 step.",
    "expansion": "prelude"
  },
  "Donation": {
    "name": "Donation",
    "behavior": {
      "stock": {
        "megacredits": 21
      }
    },
    "cardNumber": "P08",
    "description": "Gain 21 M€.",
    "expansion": "prelude"
  },
  "Early Settlement": {
    "name": "Early Settlement",
    "tags": [
      "building",
      "city"
    ],
    "behavior": {
      "production": {
        "plants": 1
      },
      "city": true
    },
    "cardNumber": "P09",
    "description": "Increase your plant production 1 step. Place a city tile.",
    "expansion": "prelude"
  },
  "Eccentric Sponsor": {
    "name": "Eccentric Sponsor",
    "cardNumber": "P11",
    "expansion": "prelude"
  },
  "Ecology Experts": {
    "name": "Ecology Experts",
    "tags": [
      "plant",
      "microbe"
    ],
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "P10",
    "description": "Increase your plant production 1 step. PLAY A CARD FROM HAND, IGNORING GLOBAL REQUIREMENTS.",
    "expansion": "prelude"
  },
  "Experimental Forest": {
    "name": "Experimental Forest",
    "tags": [
      "plant"
    ],
    "behavior": {
      "greenery": true
    },
    "cardNumber": "P12",
    "description": "Place 1 greenery tile and raise oxygen 1 step. Reveal cards until you reveal two cards with plant tags on them. Take them into your hand and discard the rest.",
    "expansion": "prelude"
  },
  "Galilean Mining": {
    "name": "Galilean Mining",
    "tags": [
      "jovian"
    ],
    "behavior": {
      "production": {
        "titanium": 2
      }
    },
    "cardNumber": "P13",
    "description": "Increase your titanium production 2 steps. Pay 5 M€.",
    "expansion": "prelude"
  },
  "Great Aquifer": {
    "name": "Great Aquifer",
    "behavior": {
      "ocean": true
    },
    "cardNumber": "P14",
    "description": "Place 2 ocean tiles.",
    "expansion": "prelude"
  },
  "House Printing": {
    "name": "House Printing",
    "type": "automated",
    "cost": 10,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "steel": 1
      }
    },
    "cardNumber": "P36",
    "description": "Increase your steel production 1 step.",
    "expansion": "prelude"
  },
  "Huge Asteroid": {
    "name": "Huge Asteroid",
    "behavior": {
      "global": {
        "temperature": 3
      }
    },
    "cardNumber": "P15",
    "description": "Increase temperature 3 steps. Pay 5 M€.",
    "expansion": "prelude"
  },
  "Io Research Outpost": {
    "name": "Io Research Outpost",
    "tags": [
      "jovian",
      "science"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      },
      "drawCard": 1
    },
    "cardNumber": "P16",
    "description": "Increase your titanium production 1 step. Draw a card.",
    "expansion": "prelude"
  },
  "Lava Tube Settlement": {
    "name": "Lava Tube Settlement",
    "type": "automated",
    "cost": 15,
    "tags": [
      "building",
      "city"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 2
      }
    },
    "cardNumber": "P37",
    "description": "Decrease your energy production 1 step and increase your M€ production 2 steps. Place a city tile on a VOLCANIC AREA regardless of adjacent cities.",
    "expansion": "prelude"
  },
  "Loan": {
    "name": "Loan",
    "behavior": {
      "production": {
        "megacredits": -2
      },
      "stock": {
        "megacredits": 30
      }
    },
    "cardNumber": "P17",
    "description": "Gain 30 M€. Decrease your M€ production 2 steps.",
    "expansion": "prelude"
  },
  "Martian Industries": {
    "name": "Martian Industries",
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "energy": 1,
        "steel": 1
      },
      "stock": {
        "megacredits": 6
      }
    },
    "cardNumber": "P18",
    "description": "Increase your energy and steel production 1 step. Gain 6 M€.",
    "expansion": "prelude"
  },
  "Martian Survey": {
    "name": "Martian Survey",
    "type": "event",
    "cost": 9,
    "tags": [
      "science"
    ],
    "requirements": {
      "oxygen": 4
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "drawCard": 2
    },
    "cardNumber": "P38",
    "description": "Oxygen must be 4% or lower. Draw two cards.",
    "expansion": "prelude"
  },
  "Metal-Rich Asteroid": {
    "name": "Metal-Rich Asteroid",
    "behavior": {
      "stock": {
        "titanium": 4,
        "steel": 4
      },
      "global": {
        "temperature": 1
      }
    },
    "cardNumber": "P19",
    "description": "Increase temperature 1 step. Gain 4 titanium and 4 steel.",
    "expansion": "prelude"
  },
  "Metals Company": {
    "name": "Metals Company",
    "behavior": {
      "production": {
        "megacredits": 1,
        "steel": 1,
        "titanium": 1
      }
    },
    "cardNumber": "P20",
    "description": "Increase your M€, steel and titanium production 1 step.",
    "expansion": "prelude"
  },
  "Mining Operations": {
    "name": "Mining Operations",
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 2
      },
      "stock": {
        "steel": 4
      }
    },
    "cardNumber": "P21",
    "description": "Increase your steel production 2 steps. Gain 4 steel.",
    "expansion": "prelude"
  },
  "Mohole": {
    "name": "Mohole",
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "heat": 3
      },
      "stock": {
        "heat": 3
      }
    },
    "cardNumber": "P22",
    "description": "Increase your heat production 3 steps. Gain 3 heat.",
    "expansion": "prelude"
  },
  "Mohole Excavation": {
    "name": "Mohole Excavation",
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 1,
        "heat": 2
      },
      "stock": {
        "heat": 2
      }
    },
    "cardNumber": "P23",
    "description": "Increase your steel production 1 step and heat production 2 steps. Gain 2 heat.",
    "expansion": "prelude"
  },
  "Nitrogen Shipment": {
    "name": "Nitrogen Shipment",
    "behavior": {
      "production": {
        "plants": 1
      },
      "stock": {
        "megacredits": 5
      },
      "tr": 1
    },
    "cardNumber": "P24",
    "description": "Increase your plant production 1 step. Increase your TR 1 step. Gain 5 M€.",
    "expansion": "prelude"
  },
  "Orbital Construction Yard": {
    "name": "Orbital Construction Yard",
    "tags": [
      "space"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      },
      "stock": {
        "titanium": 4
      }
    },
    "cardNumber": "P25",
    "description": "Increase your titanium production 1 step. Gain 4 titanium.",
    "expansion": "prelude"
  },
  "Point Luna": {
    "name": "Point Luna",
    "tags": [
      "space",
      "earth"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      }
    },
    "cardNumber": "R10",
    "description": "You start with 1 titanium production and 38 M€.",
    "expansion": "prelude"
  },
  "Polar Industries": {
    "name": "Polar Industries",
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "heat": 2
      },
      "ocean": true
    },
    "cardNumber": "P26",
    "description": "Increase your heat production 2 steps. Place an ocean tile.",
    "expansion": "prelude"
  },
  "Power Generation": {
    "name": "Power Generation",
    "tags": [
      "power"
    ],
    "behavior": {
      "production": {
        "energy": 3
      }
    },
    "cardNumber": "P27",
    "description": "Increase your energy production 3 steps.",
    "expansion": "prelude"
  },
  "Psychrophiles": {
    "name": "Psychrophiles",
    "type": "active",
    "cost": 2,
    "tags": [
      "microbe"
    ],
    "requirements": {
      "temperature": -20
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Microbe",
    "cardNumber": "P39",
    "description": "Temperature must be -20 C or lower.",
    "expansion": "prelude"
  },
  "Research Coordination": {
    "name": "Research Coordination",
    "type": "automated",
    "cost": 4,
    "tags": [
      "wild"
    ],
    "cardNumber": "P40",
    "description": "After being played, when you perform an action, the wild tag counts as any tag of your choice.",
    "expansion": "prelude"
  },
  "Research Network": {
    "name": "Research Network",
    "tags": [
      "wild"
    ],
    "behavior": {
      "production": {
        "megacredits": 1
      },
      "drawCard": 3
    },
    "cardNumber": "P28",
    "description": "Increase your M€ production 1 step. Draw 3 cards. After being played, when you perform an action, the wild tag counts as any tag of your choice.",
    "expansion": "prelude"
  },
  "Robinson Industries": {
    "name": "Robinson Industries",
    "cardNumber": "R27",
    "description": "You start with 47 M€.",
    "expansion": "prelude"
  },
  "Self-Sufficient Settlement": {
    "name": "Self-Sufficient Settlement",
    "tags": [
      "building",
      "city"
    ],
    "behavior": {
      "production": {
        "megacredits": 2
      },
      "city": true
    },
    "cardNumber": "P29",
    "description": "Increase your M€ production 2 steps. Place a city tile.",
    "expansion": "prelude"
  },
  "SF Memorial": {
    "name": "SF Memorial",
    "type": "automated",
    "cost": 7,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "drawCard": 1
    },
    "cardNumber": "P41",
    "description": "Draw 1 card.",
    "expansion": "prelude"
  },
  "Smelting Plant": {
    "name": "Smelting Plant",
    "tags": [
      "building"
    ],
    "behavior": {
      "stock": {
        "steel": 5
      },
      "global": {
        "oxygen": 2
      }
    },
    "cardNumber": "P30",
    "description": "Raise oxygen 2 steps. Gain 5 steel.",
    "expansion": "prelude"
  },
  "Society Support": {
    "name": "Society Support",
    "behavior": {
      "production": {
        "plants": 1,
        "energy": 1,
        "heat": 1,
        "megacredits": -1
      }
    },
    "cardNumber": "P31",
    "description": "Increase your plant, energy and heat production 1 step. Decrease M€ production 1 step.",
    "expansion": "prelude"
  },
  "Space Hotels": {
    "name": "Space Hotels",
    "type": "automated",
    "cost": 12,
    "tags": [
      "space",
      "earth"
    ],
    "requirements": {
      "count": 2,
      "tag": "earth"
    },
    "behavior": {
      "production": {
        "megacredits": 4
      }
    },
    "cardNumber": "P42",
    "description": "Requires 2 Earth tags. Increase M€ production 4 steps.",
    "expansion": "prelude"
  },
  "Supplier": {
    "name": "Supplier",
    "tags": [
      "power"
    ],
    "behavior": {
      "production": {
        "energy": 2
      },
      "stock": {
        "steel": 4
      }
    },
    "cardNumber": "P32",
    "description": "Increase your energy production 2 steps. Gain 4 steel.",
    "expansion": "prelude"
  },
  "Supply Drop": {
    "name": "Supply Drop",
    "behavior": {
      "stock": {
        "titanium": 3,
        "steel": 8,
        "plants": 3
      }
    },
    "cardNumber": "P33",
    "description": "Gain 3 titanium, 8 steel and 3 plants.",
    "expansion": "prelude"
  },
  "UNMI Contractor": {
    "name": "UNMI Contractor",
    "tags": [
      "earth"
    ],
    "behavior": {
      "tr": 3,
      "drawCard": 1
    },
    "cardNumber": "P34",
    "description": "Increase your TR 3 steps. Draw a card.",
    "expansion": "prelude"
  },
  "Valley Trust": {
    "name": "Valley Trust",
    "tags": [
      "earth"
    ],
    "cardDiscount": {
      "amount": 2,
      "tag": "science"
    },
    "cardNumber": "R34",
    "description": "You start with 37 M€. As your first action, draw 3 Prelude cards, and play one of them. Discard the other two.",
    "expansion": "prelude"
  },
  "Vitor": {
    "name": "Vitor",
    "tags": [
      "earth"
    ],
    "cardNumber": "R35",
    "description": "You start with 45 M€. As your first action, fund an award for free.",
    "expansion": "prelude"
  },
  "Applied Science": {
    "name": "Applied Science",
    "tags": [
      "wild"
    ],
    "behavior": {
      "addResources": 6
    },
    "resourceType": "Science",
    "cardNumber": "P43",
    "description": "Add 6 science resources here.",
    "expansion": "prelude2"
  },
  "Atmospheric Enhancers": {
    "name": "Atmospheric Enhancers",
    "tags": [
      "venus"
    ],
    "behavior": {
      "global": {
        "temperature": 2
      }
    },
    "cardNumber": "P44",
    "description": "Raise temperature 2 steps, or raise oxygen 2 steps, or raise Venus 2 steps. Draw 2 cards with floater icons.",
    "expansion": "prelude2"
  },
  "Board of Directors": {
    "name": "Board of Directors",
    "tags": [
      "earth"
    ],
    "behavior": {
      "addResources": 4
    },
    "resourceType": "Director",
    "cardNumber": "P45",
    "description": "Add 4 director resources here.",
    "expansion": "prelude2"
  },
  "Ceres Tech Market": {
    "name": "Ceres Tech Market",
    "type": "active",
    "cost": 12,
    "tags": [
      "science",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "stock": {
        "each": 2
      }
    },
    "cardNumber": "P68",
    "expansion": "prelude2"
  },
  "Cloud Tourism": {
    "name": "Cloud Tourism",
    "type": "active",
    "cost": 11,
    "tags": [
      "jovian",
      "venus"
    ],
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Floater",
    "cardNumber": "P69",
    "description": "Increase your M€ production 1 step for each pair of Earth and Venus tags you own. 1 VP for every 3rd floater on this card.",
    "expansion": "prelude2"
  },
  "Colonial Envoys": {
    "name": "Colonial Envoys",
    "type": "event",
    "cost": 4,
    "cardNumber": "P70",
    "description": "Requires that Unity is ruling or that you have 2 delegates there. Place 1 delegate for each colony you have. YOU MAY PLACE THEM IN SEPERATE PARTIES.",
    "expansion": "prelude2"
  },
  "Colonial Representation": {
    "name": "Colonial Representation",
    "type": "active",
    "cost": 10,
    "behavior": {
      "stock": {
        "each": 3
      }
    },
    "cardNumber": "P71",
    "description": "Gain 3 M€ per colony you have.",
    "expansion": "prelude2"
  },
  "Colony Trade Hub": {
    "name": "Colony Trade Hub",
    "tags": [
      "space"
    ],
    "behavior": {
      "production": {
        "energy": 1
      },
      "stock": {
        "titanium": 2
      }
    },
    "cardNumber": "P46",
    "description": "Increase your energy production 1 step. Gain 2 titanium",
    "expansion": "prelude2"
  },
  "Corridors of Power": {
    "name": "Corridors of Power",
    "tags": [
      "earth"
    ],
    "behavior": {
      "stock": {
        "megacredits": 4
      },
      "tr": 1
    },
    "cardNumber": "P47",
    "expansion": "prelude2"
  },
  "Early Colonization": {
    "name": "Early Colonization",
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "energy": 3
      },
      "colony": true
    },
    "cardNumber": "P48",
    "description": "Place a colony. Gain 3 energy.",
    "expansion": "prelude2"
  },
  "EcoTec": {
    "name": "EcoTec",
    "tags": [
      "microbe",
      "plant"
    ],
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "PC04",
    "description": "You start with 42 M€. Increase your plant production 1 step.",
    "expansion": "prelude2"
  },
  "Envoys From Venus": {
    "name": "Envoys From Venus",
    "type": "event",
    "cost": 1,
    "tags": [
      "venus"
    ],
    "requirements": {
      "count": 3,
      "tag": "venus"
    },
    "cardNumber": "P72",
    "description": "Requires 3 Venus tags. Place 2 delegates in 1 party.",
    "expansion": "prelude2"
  },
  "Floating Refinery": {
    "name": "Floating Refinery",
    "type": "active",
    "cost": 7,
    "tags": [
      "venus"
    ],
    "resourceType": "Floater",
    "cardNumber": "P73",
    "description": "Add 1 floater here for each Venus tag you have.",
    "expansion": "prelude2"
  },
  "Floating Trade Hub": {
    "name": "Floating Trade Hub",
    "tags": [
      "space"
    ],
    "resourceType": "Floater",
    "cardNumber": "P49",
    "expansion": "prelude2"
  },
  "Focused Organization": {
    "name": "Focused Organization",
    "behavior": {
      "drawCard": 1
    },
    "cardNumber": "P50",
    "expansion": "prelude2"
  },
  "Frontier Town": {
    "name": "Frontier Town",
    "type": "automated",
    "cost": 11,
    "tags": [
      "city",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1
      }
    },
    "cardNumber": "P74",
    "description": "Requires that Mars First is ruling or that you have 2 delegates there. ",
    "expansion": "prelude2"
  },
  "GHG Shipment": {
    "name": "GHG Shipment",
    "type": "event",
    "cost": 3,
    "tags": [
      "space"
    ],
    "behavior": {
      "production": {
        "heat": 1
      }
    },
    "cardNumber": "P75",
    "description": "Requires that Kelvinists are in power or that you have 2 delegates there. ",
    "expansion": "prelude2"
  },
  "High Circles": {
    "name": "High Circles",
    "tags": [
      "earth"
    ],
    "behavior": {
      "tr": 1
    },
    "cardNumber": "P51",
    "expansion": "prelude2"
  },
  "Industrial Complex": {
    "name": "Industrial Complex",
    "tags": [
      "building"
    ],
    "cardNumber": "P52",
    "description": "Lose 18 M€. INCREASE ALL YOUR PRODUCTIONS THAT ARE LOWER THAN 1, TO 1.",
    "expansion": "prelude2"
  },
  "Ishtar Expedition": {
    "name": "Ishtar Expedition",
    "type": "event",
    "cost": 6,
    "tags": [
      "venus"
    ],
    "requirements": {
      "venus": 10
    },
    "behavior": {
      "stock": {
        "titanium": 3
      }
    },
    "cardNumber": "P76",
    "description": "Requires Venus 10%. Gain 3 titanium and draw 2 Venus cards.",
    "expansion": "prelude2"
  },
  "Jovian Envoys": {
    "name": "Jovian Envoys",
    "type": "event",
    "cost": 2,
    "requirements": {
      "count": 2,
      "tag": "jovian"
    },
    "cardNumber": "P77",
    "description": "Requires 2 Jovian tags. Place 2 delegates in 1 party.",
    "expansion": "prelude2"
  },
  "L1 Trade Terminal": {
    "name": "L1 Trade Terminal",
    "type": "active",
    "cost": 25,
    "tags": [
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "P78",
    "expansion": "prelude2"
  },
  "Main Belt Asteroids": {
    "name": "Main Belt Asteroids",
    "type": "cardresource.asteroid",
    "tags": [
      "space"
    ],
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "resourceType": "Asteroid",
    "cardNumber": "P53",
    "description": "Lose 5 M€. 1 VP per 2 asteroids here.",
    "expansion": "prelude2"
  },
  "Microgravity Nutrition": {
    "name": "Microgravity Nutrition",
    "type": "automated",
    "cost": 11,
    "tags": [
      "microbe",
      "plant"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "P79",
    "description": "Increase your M€ production 1 step for each colony you have.",
    "expansion": "prelude2"
  },
  "Nirgal Enterprises": {
    "name": "Nirgal Enterprises",
    "tags": [
      "power",
      "plant",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": 1,
        "plants": 1,
        "steel": 1
      }
    },
    "cardNumber": "PC01",
    "description": "You start with 30 M€. Increase your energy, plant, and steel production 1 step each.",
    "expansion": "prelude2"
  },
  "Nobel Prize": {
    "name": "Nobel Prize",
    "tags": [
      "wild"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "stock": {
        "megacredits": 5
      }
    },
    "cardNumber": "P54",
    "description": "Gain 5 M€. Draw 2 cards with requirements.",
    "expansion": "prelude2"
  },
  "Old Mining Colony": {
    "name": "Old Mining Colony",
    "tags": [
      "space"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      },
      "colony": true
    },
    "cardNumber": "P55",
    "description": "Increase your titanium production 1 step. Place 1 colony. Discard 1 card.",
    "expansion": "prelude2"
  },
  "Palladin Shipping": {
    "name": "Palladin Shipping",
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "titanium": 5
      }
    },
    "cardNumber": "PC02",
    "description": "You start with 36 M€. Gain 5 titanium.",
    "expansion": "prelude2"
  },
  "Planetary Alliance": {
    "name": "Planetary Alliance",
    "tags": [
      "earth",
      "jovian",
      "venus"
    ],
    "behavior": {
      "tr": 2
    },
    "cardNumber": "P56",
    "description": "Raise your TR 2 steps. Draw 1 Jovian card and 1 Venus card.",
    "expansion": "prelude2"
  },
  "Preservation Program": {
    "name": "Preservation Program",
    "behavior": {
      "tr": 5
    },
    "cardNumber": "P57",
    "description": "Raise your TR 5 steps.",
    "expansion": "prelude2"
  },
  "Project Eden": {
    "name": "Project Eden",
    "tags": [
      "city",
      "plant"
    ],
    "cardNumber": "P58",
    "description": "Place 1 ocean tile, 1 city tile, and 1 greenery tile. Discard 3 cards.",
    "expansion": "prelude2"
  },
  "Recession": {
    "name": "Recession",
    "behavior": {
      "stock": {
        "megacredits": 10
      }
    },
    "cardNumber": "P59",
    "description": "EACH OPPONENT loses 5 M€ and decreases their M€ production 1 step. You gain 10 M€.",
    "expansion": "prelude2"
  },
  "Red Appeasement": {
    "name": "Red Appeasement",
    "type": "event",
    "cost": 0,
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "P80",
    "expansion": "prelude2"
  },
  "Rise To Power": {
    "name": "Rise To Power",
    "behavior": {
      "production": {
        "megacredits": 3
      }
    },
    "cardNumber": "P60",
    "description": "Increase your M€ production 3 steps and place 3 delegates. YOU MAY PLACE THEM IN SEPARATE PARTIES.",
    "expansion": "prelude2"
  },
  "Sagitta Frontier Services": {
    "name": "Sagitta Frontier Services",
    "behavior": {
      "production": {
        "energy": 1,
        "megacredits": 2
      }
    },
    "cardNumber": "PC03",
    "description": "You start with 31 M€. Increase energy production 1 step and M€ production 2 steps. Draw a card that has no tag.",
    "expansion": "prelude2"
  },
  "Soil Bacteria": {
    "name": "Soil Bacteria",
    "tags": [
      "microbe"
    ],
    "behavior": {
      "stock": {
        "plants": 3
      }
    },
    "cardNumber": "P61",
    "description": "Draw 2 microbe cards and gain 3 plants.",
    "expansion": "prelude2"
  },
  "Soil Studies": {
    "name": "Soil Studies",
    "type": "event",
    "cost": 13,
    "tags": [
      "microbe",
      "plant"
    ],
    "requirements": {
      "temperature": -4
    },
    "cardNumber": "P81",
    "description": "Requires that temperature is -4 C or lower. Gain 1 plant per Venus tag, plant tag, and colony you have.",
    "expansion": "prelude2"
  },
  "Space Lanes": {
    "name": "Space Lanes",
    "tags": [
      "space"
    ],
    "behavior": {
      "stock": {
        "titanium": 3
      }
    },
    "cardDiscount": {
      "amount": 2,
      "tag": "jovian"
    },
    "cardNumber": "P62",
    "description": "Gain 3 titanium.",
    "expansion": "prelude2"
  },
  "Special Permit": {
    "name": "Special Permit",
    "type": "event",
    "cost": 5,
    "tags": [
      "plant"
    ],
    "cardNumber": "P82",
    "description": "Requires that Greens are ruling or that you have 2 delegates there. Steal 4 plants from any player.",
    "expansion": "prelude2"
  },
  "Spire": {
    "name": "Spire",
    "tags": [
      "city",
      "earth"
    ],
    "resourceType": "Science",
    "cardNumber": "PC05",
    "expansion": "prelude2"
  },
  "Sponsoring Nation": {
    "name": "Sponsoring Nation",
    "type": "automated",
    "cost": 21,
    "tags": [
      "earth"
    ],
    "requirements": {
      "count": 4,
      "tag": "earth"
    },
    "behavior": {
      "tr": 3
    },
    "cardNumber": "P83",
    "description": "Requires 4 Earth tags. Gain 3 TR. Place 2 delegates.",
    "expansion": "prelude2"
  },
  "Stratospheric Expedition": {
    "name": "Stratospheric Expedition",
    "type": "event",
    "cost": 12,
    "tags": [
      "venus",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "P84",
    "description": "Add two floaters to ANY CARD. Draw 2 Venus cards.",
    "expansion": "prelude2"
  },
  "Suitable Infrastructure": {
    "name": "Suitable Infrastructure",
    "tags": [
      "building"
    ],
    "behavior": {
      "stock": {
        "steel": 5
      }
    },
    "cardNumber": "P63",
    "description": "Gain 5 steel.",
    "expansion": "prelude2"
  },
  "Summit Logistics": {
    "name": "Summit Logistics",
    "type": "automated",
    "cost": 10,
    "tags": [
      "building",
      "space"
    ],
    "behavior": {
      "drawCard": 2
    },
    "cardNumber": "P85",
    "expansion": "prelude2"
  },
  "Terraforming Deal": {
    "name": "Terraforming Deal",
    "tags": [
      "earth"
    ],
    "cardNumber": "P64",
    "expansion": "prelude2"
  },
  "Unexpected Application": {
    "name": "Unexpected Application",
    "type": "event",
    "cost": 4,
    "tags": [
      "venus"
    ],
    "behavior": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "P86",
    "description": "Discard 1 card to terraform Venus 1 step.",
    "expansion": "prelude2"
  },
  "Venus Allies": {
    "name": "Venus Allies",
    "type": "automated",
    "cost": 30,
    "tags": [
      "venus",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "stock": {
        "each": 4
      },
      "global": {
        "venus": 2
      }
    },
    "cardNumber": "P87",
    "description": "Raise Venus 2 steps. Gain 4 M€ per colony you have.",
    "expansion": "prelude2"
  },
  "Venus Contract": {
    "name": "Venus Contract",
    "tags": [
      "venus"
    ],
    "behavior": {
      "tr": 1
    },
    "cardNumber": "P65",
    "description": "Draw 1 Venus card. Raise your TR 1 step.",
    "expansion": "prelude2"
  },
  "Venus L1 Shade": {
    "name": "Venus L1 Shade",
    "tags": [
      "space"
    ],
    "behavior": {
      "global": {
        "venus": 3
      }
    },
    "cardNumber": "P66",
    "description": "Raise Venus 3 steps.",
    "expansion": "prelude2"
  },
  "Venus Orbital Survey": {
    "name": "Venus Orbital Survey",
    "type": "active",
    "cost": 18,
    "tags": [
      "venus",
      "space"
    ],
    "cardNumber": "P88",
    "expansion": "prelude2"
  },
  "Venus Shuttles": {
    "name": "Venus Shuttles",
    "type": "active",
    "cost": 9,
    "tags": [
      "venus"
    ],
    "cardNumber": "P89",
    "description": "Add 2 floaters to ANY VENUS CARD.",
    "expansion": "prelude2"
  },
  "Venus Trade Hub": {
    "name": "Venus Trade Hub",
    "type": "active",
    "cost": 12,
    "tags": [
      "venus",
      "space"
    ],
    "requirements": {
      "count": 2,
      "tag": "venus"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "P90",
    "description": "Requires 2 Venus tags.",
    "expansion": "prelude2"
  },
  "WG Project": {
    "name": "WG Project",
    "type": "automated",
    "cost": 9,
    "tags": [
      "earth"
    ],
    "cardNumber": "P91",
    "description": "Requires that you are Chairman. DRAW 3 PRELUDE CARDS AND PLAY 1 OF THEM, Discard the other 2.",
    "expansion": "prelude2"
  },
  "World Government Advisor": {
    "name": "World Government Advisor",
    "tags": [
      "earth"
    ],
    "behavior": {
      "tr": 2,
      "drawCard": 1
    },
    "cardNumber": "P67",
    "description": "Raise your TR 2 steps. Draw 1 card.",
    "expansion": "prelude2"
  },
  "16 Psyche": {
    "name": "16 Psyche",
    "type": "automated",
    "cost": 31,
    "tags": [
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "titanium": 2
      },
      "stock": {
        "titanium": 3
      }
    },
    "cardNumber": "X44",
    "description": "Increase titanium production 2 steps. Gain 3 titanium.",
    "expansion": "promo"
  },
  "Advertising": {
    "name": "Advertising",
    "type": "active",
    "cost": 4,
    "tags": [
      "earth"
    ],
    "cardNumber": "X13",
    "expansion": "promo"
  },
  "Albedo Plants": {
    "name": "Albedo Plants",
    "tags": [
      "plant"
    ],
    "behavior": {
      "production": {
        "plants": 1
      },
      "stock": {
        "plants": 1
      }
    },
    "cardNumber": "X78",
    "description": "Increase plant production 1 step. Gain 1 plant.",
    "expansion": "promo"
  },
  "Anti-desertification Techniques": {
    "name": "Anti-desertification Techniques",
    "tags": [
      "microbe",
      "plant"
    ],
    "behavior": {
      "production": {
        "plants": 1,
        "steel": 1
      },
      "stock": {
        "megacredits": 3
      }
    },
    "cardNumber": "X49",
    "description": "Gain 3 M€. Increase your plant production 1 step and your steel production 1 step.",
    "expansion": "promo"
  },
  "Aqueduct Systems": {
    "name": "Aqueduct Systems",
    "type": "automated",
    "cost": 9,
    "tags": [
      "building"
    ],
    "requirements": {
      "cities": 1,
      "oceans": 1
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "X50",
    "description": "Requires you have a city next to an ocean. Draw 3 cards with a building tag.",
    "expansion": "promo"
  },
  "Arcadian Communities": {
    "name": "Arcadian Communities",
    "behavior": {
      "stock": {
        "steel": 10
      }
    },
    "cardNumber": "R44",
    "description": "You start with 40 M€ and 10 steel. AS YOUR FIRST ACTION, PLACE A COMMUNITY [PLAYER MARKER] ON A NON-RESERVED AREA.",
    "expansion": "promo"
  },
  "Asteroid Deflection System": {
    "name": "Asteroid Deflection System",
    "type": "active",
    "cost": 13,
    "tags": [
      "space",
      "earth",
      "building"
    ],
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "behavior": {
      "production": {
        "energy": -1
      }
    },
    "resourceType": "Asteroid",
    "cardNumber": "X14",
    "description": "Decrease your energy production 1 step. 1 VP per asteroid on this card.",
    "expansion": "promo"
  },
  "Asteroid Hollowing": {
    "name": "Asteroid Hollowing",
    "type": "active",
    "cost": 16,
    "tags": [
      "space"
    ],
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "action": {
      "addResources": 1,
      "production": {
        "megacredits": 1
      }
    },
    "resourceType": "Asteroid",
    "cardNumber": "X15",
    "expansion": "promo"
  },
  "Asteroid Rights": {
    "name": "Asteroid Rights",
    "type": "active",
    "cost": 10,
    "tags": [
      "earth",
      "space"
    ],
    "behavior": {
      "addResources": 2
    },
    "resourceType": "Asteroid",
    "cardNumber": "X34",
    "description": "Add 2 asteroids to this card.",
    "expansion": "promo"
  },
  "Astra Mechanica": {
    "name": "Astra Mechanica",
    "type": "automated",
    "cost": 7,
    "tags": [
      "science"
    ],
    "cardNumber": "X51",
    "description": "RETURN UP TO 2 OF YOUR PLAYED EVENT CARDS TO YOUR HAND. THEY MAY NOT BE CARDS THAT PLACE SPECIAL TILES.",
    "expansion": "promo"
  },
  "Astrodrill": {
    "name": "Astrodrill",
    "tags": [
      "space"
    ],
    "behavior": {
      "addResources": 3
    },
    "resourceType": "Asteroid",
    "cardNumber": "R21",
    "description": "You start with 35 M€ and 3 asteroid resources.",
    "expansion": "promo"
  },
  "Bactoviral Research": {
    "name": "Bactoviral Research",
    "type": "automated",
    "cost": 10,
    "tags": [
      "microbe",
      "science"
    ],
    "behavior": {
      "drawCard": 1
    },
    "cardNumber": "X35",
    "description": "Draw 1 card. Choose 1 of your played cards and add 1 microbe to it for each science tag you have, including this.",
    "expansion": "promo"
  },
  "Bio Printing Facility": {
    "name": "Bio Printing Facility",
    "type": "active",
    "cost": 7,
    "tags": [
      "building"
    ],
    "cardNumber": "X36",
    "expansion": "promo"
  },
  "Carbon Nanosystems": {
    "name": "Carbon Nanosystems",
    "type": "active",
    "cost": 14,
    "tags": [
      "science",
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "resourceType": "Graphene",
    "cardNumber": "X52",
    "expansion": "promo"
  },
  "Casinos": {
    "name": "Casinos",
    "type": "automated",
    "cost": 5,
    "tags": [
      "building"
    ],
    "requirements": {
      "cities": 1
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 4
      }
    },
    "cardNumber": "X72",
    "description": "Requires that you have a city. Decrease your energy production 1 step and increase your M€ production 4 steps.",
    "expansion": "promo"
  },
  "City Parks": {
    "name": "City Parks",
    "type": "automated",
    "cost": 7,
    "tags": [
      "plant"
    ],
    "requirements": {
      "cities": 3
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "stock": {
        "plants": 2
      }
    },
    "cardNumber": "X71",
    "description": "Requires that you have 3 cities. Gain 2 plants.",
    "expansion": "promo"
  },
  "Comet Aiming": {
    "name": "Comet Aiming",
    "type": "active",
    "cost": 17,
    "tags": [
      "space"
    ],
    "resourceType": "Asteroid",
    "cardNumber": "X16",
    "expansion": "promo"
  },
  "Corporate Archives": {
    "name": "Corporate Archives",
    "tags": [
      "science"
    ],
    "behavior": {
      "stock": {
        "megacredits": 13
      }
    },
    "cardNumber": "X39",
    "description": "Gain 13 M€.",
    "expansion": "promo"
  },
  "Crash Site Cleanup": {
    "name": "Crash Site Cleanup",
    "type": "event",
    "cost": 4,
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "X17",
    "description": "Requires that a player removed ANOTHER PLAYER\\",
    "expansion": "promo"
  },
  "Cutting Edge Technology": {
    "name": "Cutting Edge Technology",
    "type": "active",
    "cost": 12,
    "tags": [
      "science"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "X18",
    "expansion": "promo"
  },
  "Cyberia Systems": {
    "name": "Cyberia Systems",
    "type": "automated",
    "cost": 16,
    "behavior": {
      "production": {
        "steel": 1
      }
    },
    "cardNumber": "X53",
    "description": "Increase your steel production 1 step. Copy the PRODUCTION BOXES of 2 of your cards with building tags.",
    "expansion": "promo"
  },
  "Directed Heat Usage": {
    "name": "Directed Heat Usage",
    "type": "active",
    "cost": 1,
    "action": {
      "stock": {
        "megacredits": 4
      }
    },
    "cardNumber": "X48",
    "expansion": "promo"
  },
  "Directed Impactors": {
    "name": "Directed Impactors",
    "type": "active",
    "cost": 8,
    "tags": [
      "space"
    ],
    "resourceType": "Asteroid",
    "cardNumber": "X19",
    "expansion": "promo"
  },
  "Diversity Support": {
    "name": "Diversity Support",
    "type": "event",
    "cost": 1,
    "tags": [],
    "requirements": {
      "resourceTypes": 9
    },
    "behavior": {
      "tr": 1
    },
    "cardNumber": "X20",
    "description": "Requires that you have 9 different types of resources. Gain 1 TR.",
    "expansion": "promo"
  },
  "Double Down": {
    "name": "Double Down",
    "cardNumber": "X40",
    "expansion": "promo"
  },
  "Dusk Laser Mining": {
    "name": "Dusk Laser Mining",
    "type": "automated",
    "cost": 8,
    "tags": [
      "space"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "behavior": {
      "production": {
        "energy": -1,
        "titanium": 1
      },
      "stock": {
        "titanium": 4
      }
    },
    "cardNumber": "X01",
    "description": "Requires 2 science tags. Decrease your energy production 1 step, and increase your titanium production 1 step. Gain 4 titanium.",
    "expansion": "promo"
  },
  "Energy Market": {
    "name": "Energy Market",
    "type": "active",
    "cost": 3,
    "tags": [
      "power"
    ],
    "cardNumber": "X03",
    "expansion": "promo"
  },
  "Factorum": {
    "name": "Factorum",
    "tags": [
      "power",
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 1
      }
    },
    "cardNumber": "R22",
    "description": "You start with 37 M€. Increase your steel production 1 step.",
    "expansion": "promo"
  },
  "Field-Capped City": {
    "name": "Field-Capped City",
    "type": "automated",
    "cost": 29,
    "tags": [
      "city",
      "building",
      "power"
    ],
    "behavior": {
      "production": {
        "energy": 1,
        "megacredits": 2
      },
      "stock": {
        "plants": 3
      },
      "city": true
    },
    "cardNumber": "X21",
    "description": "Increase your M€ production 2 steps, increase your energy production 1 step, gain 3 plants, and place a city tile.",
    "expansion": "promo"
  },
  "Floyd Continuum": {
    "name": "Floyd Continuum",
    "type": "active",
    "cost": 4,
    "tags": [
      "science"
    ],
    "cardNumber": "X-1",
    "expansion": "promo"
  },
  "Giant Solar Collector": {
    "name": "Giant Solar Collector",
    "tags": [
      "power",
      "space"
    ],
    "behavior": {
      "production": {
        "energy": 2
      },
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "X55",
    "description": "Increase your energy production 2 steps. Raise Venus 1 step.",
    "expansion": "promo"
  },
  "Harvest": {
    "name": "Harvest",
    "type": "event",
    "cost": 4,
    "tags": [
      "plant"
    ],
    "requirements": {
      "greeneries": 3
    },
    "behavior": {
      "stock": {
        "megacredits": 12
      }
    },
    "cardNumber": "X37",
    "description": "Requires that you have 3 greenery tiles in play. Gain 12 M€.",
    "expansion": "promo"
  },
  "Head Start": {
    "name": "Head Start",
    "behavior": {
      "stock": {
        "steel": 2
      }
    },
    "cardNumber": "X43",
    "expansion": "promo"
  },
  "Hermetic Order of Mars": {
    "name": "Hermetic Order of Mars",
    "type": "automated",
    "cost": 10,
    "requirements": {
      "oxygen": 4
    },
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "X56",
    "description": "Oxygen must be 4% or lower. Increase your M€ production 2 steps. Gain 1 M€ per empty area adjacent to your tiles.",
    "expansion": "promo"
  },
  "Hi-Tech Lab": {
    "name": "Hi-Tech Lab",
    "type": "active",
    "cost": 17,
    "tags": [
      "science",
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "X04",
    "expansion": "promo"
  },
  "Homeostasis Bureau": {
    "name": "Homeostasis Bureau",
    "type": "active",
    "cost": 16,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "heat": 2
      }
    },
    "cardNumber": "X57",
    "description": "Increase your heat production 2 steps.",
    "expansion": "promo"
  },
  "Hospitals": {
    "name": "Hospitals",
    "type": "active",
    "cost": 8,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "energy": -1
      }
    },
    "resourceType": "Disease",
    "cardNumber": "X69",
    "description": "Decrease your energy production 1 step.",
    "expansion": "promo"
  },
  "Icy Impactors": {
    "name": "Icy Impactors",
    "type": "active",
    "cost": 15,
    "tags": [
      "space"
    ],
    "resourceType": "Asteroid",
    "cardNumber": "X47",
    "expansion": "promo"
  },
  "Imported Nutrients": {
    "name": "Imported Nutrients",
    "type": "event",
    "cost": 14,
    "tags": [
      "earth",
      "space"
    ],
    "behavior": {
      "stock": {
        "plants": 4
      }
    },
    "cardNumber": "X22",
    "description": "Gain 4 plants and add 4 microbes to ANOTHER CARD.",
    "expansion": "promo"
  },
  "Interplanetary Trade": {
    "name": "Interplanetary Trade",
    "type": "automated",
    "cost": 27,
    "tags": [
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "X05",
    "description": "Increase your M€ production 1 step per different tag you have in play, including this.",
    "expansion": "promo"
  },
  "Jovian Embassy": {
    "name": "Jovian Embassy",
    "type": "automated",
    "cost": 14,
    "tags": [
      "jovian",
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "tr": 1
    },
    "cardNumber": "X23",
    "description": "Raise your TR 1 step.",
    "expansion": "promo"
  },
  "Kaguya Tech": {
    "name": "Kaguya Tech",
    "type": "automated",
    "cost": 10,
    "tags": [
      "city",
      "plant"
    ],
    "behavior": {
      "production": {
        "megacredits": 2
      },
      "drawCard": 1
    },
    "cardNumber": "X58",
    "expansion": "promo"
  },
  "Kuiper Cooperative": {
    "name": "Kuiper Cooperative",
    "tags": [
      "space",
      "space"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      }
    },
    "resourceType": "Asteroid",
    "cardNumber": "XC01",
    "description": "You start with 33 M€. Increase titanium production 1 step.",
    "expansion": "promo"
  },
  "Law Suit": {
    "name": "Law Suit",
    "type": "event",
    "cost": 2,
    "tags": [
      "earth"
    ],
    "vp": {
      "type": "special"
    },
    "cardNumber": "X06",
    "description": "Steal 3 M€ from a player that REMOVED YOUR RESOURCES OR DECREASED YOUR PRODUCTION this generation. Place this card face down in THAT PLAYER\\",
    "expansion": "promo"
  },
  "name": {
    "name": "name",
    "type": "automated",
    "cost": 22,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -4,
        "plants": 2
      },
      "tr": 3,
      "city": true
    },
    "cardNumber": "X33",
    "description": "Decrease your energy production 4 steps and increase your plant production 2 steps. Raise your TR 3 steps. Place this tile.",
    "expansion": "promo"
  },
  "Magnetic Shield": {
    "name": "Magnetic Shield",
    "type": "automated",
    "cost": 24,
    "tags": [
      "space"
    ],
    "requirements": {
      "count": 3,
      "tag": "power"
    },
    "behavior": {
      "tr": 4
    },
    "cardNumber": "X24",
    "description": "Requires 3 power tags. Raise your TR 4 steps.",
    "expansion": "promo"
  },
  "Mars Nomads": {
    "name": "Mars Nomads",
    "type": "active",
    "cost": 13,
    "cardNumber": "X59",
    "expansion": "promo"
  },
  "Martian Lumber Corp": {
    "name": "Martian Lumber Corp",
    "type": "active",
    "cost": 6,
    "tags": [
      "building",
      "plant"
    ],
    "requirements": {
      "greeneries": 2
    },
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "X60",
    "expansion": "promo"
  },
  "Meat Industry": {
    "name": "Meat Industry",
    "type": "active",
    "cost": 5,
    "tags": [
      "building"
    ],
    "cardNumber": "X25",
    "expansion": "promo"
  },
  "Meltworks": {
    "name": "Meltworks",
    "type": "active",
    "cost": 4,
    "tags": [
      "building"
    ],
    "action": {
      "stock": {
        "steel": 3
      }
    },
    "cardNumber": "X26",
    "expansion": "promo"
  },
  "Mercurian Alloys": {
    "name": "Mercurian Alloys",
    "type": "active",
    "cost": 3,
    "tags": [
      "space"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "cardNumber": "X07",
    "description": "Requires 2 science tags.",
    "expansion": "promo"
  },
  "Merger": {
    "name": "Merger",
    "cardNumber": "X41",
    "description": "Draw 4 corporation cards. Play one of them and discard the other 3. Then pay 42 M€.",
    "expansion": "promo"
  },
  "Mohole Lake": {
    "name": "Mohole Lake",
    "type": "active",
    "cost": 31,
    "tags": [
      "building"
    ],
    "behavior": {
      "stock": {
        "plants": 3
      },
      "global": {
        "temperature": 1
      },
      "ocean": true
    },
    "cardNumber": "X27",
    "description": "Gain 3 plants. Raise temperature 1 step, and place 1 ocean tile.",
    "expansion": "promo"
  },
  "Mons Insurance": {
    "name": "Mons Insurance",
    "behavior": {
      "production": {
        "megacredits": 4
      }
    },
    "cardNumber": "R46",
    "description": "You start with 48 M€. Increase your M€ production 4 steps. ALL OPPONENTS DECREASE THEIR M€ production 2 STEPS. THIS DOES NOT TRIGGER THE EFFECT BELOW.",
    "expansion": "promo"
  },
  "Neptunian Power Consultants": {
    "name": "Neptunian Power Consultants",
    "type": "active",
    "cost": 14,
    "tags": [
      "power"
    ],
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "resourceType": "Hydroelectric resource",
    "cardNumber": "X61",
    "description": "1 VP per hydroelectric resource on this card",
    "expansion": "promo"
  },
  "New Holland": {
    "name": "New Holland",
    "type": "automated",
    "cost": 20,
    "tags": [
      "city",
      "building"
    ],
    "requirements": {
      "cities": 4
    },
    "behavior": {
      "production": {
        "megacredits": 3
      },
      "city": true,
      "ocean": true
    },
    "cardNumber": "X-2",
    "description": "Requires 4 city tiles ON MARS. Increase your M€ production 3 steps. ",
    "expansion": "promo"
  },
  "New Partner": {
    "name": "New Partner",
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "X42",
    "description": "Raise your M€ production 1 step. Immediately draw 2 prelude cards. Play 1 of them, and discard the other.",
    "expansion": "promo"
  },
  "Orbital Cleanup": {
    "name": "Orbital Cleanup",
    "type": "active",
    "cost": 14,
    "tags": [
      "earth",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "megacredits": -2
      }
    },
    "cardNumber": "X08",
    "description": "Decrease your M€ production 2 steps.",
    "expansion": "promo"
  },
  "Outdoor Sports": {
    "name": "Outdoor Sports",
    "type": "automated",
    "cost": 8,
    "requirements": {
      "cities": 1,
      "oceans": 1
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "X38",
    "description": "Requires any city adjacent to an ocean. Increase your M€ production 2 steps.",
    "expansion": "promo"
  },
  "Penguins": {
    "name": "Penguins",
    "type": "active",
    "cost": 7,
    "tags": [
      "animal"
    ],
    "requirements": {
      "oceans": 8
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "212",
    "description": "Requires 8 oceans.",
    "expansion": "promo"
  },
  "Pharmacy Union": {
    "name": "Pharmacy Union",
    "resourceType": "Disease",
    "cardNumber": "R39",
    "expansion": "promo"
  },
  "Philares": {
    "name": "Philares",
    "tags": [
      "building"
    ],
    "cardNumber": "R25",
    "description": "You start with 47 M€. As your first action, place a greenery tile and raise the oxygen 1 step.",
    "expansion": "promo"
  },
  "PolderTECH Dutch": {
    "name": "PolderTECH Dutch",
    "tags": [
      "earth"
    ],
    "cardNumber": "X-3",
    "description": "You start with 35 M€. As your first action, place an ocean tile and a greenery tile next to each other IGNORING GREENERY PLACEMENT RESTRICTIONS. Raise oxygen 1 step.",
    "expansion": "promo"
  },
  "Potatoes": {
    "name": "Potatoes",
    "type": "automated",
    "cost": 2,
    "tags": [
      "plant"
    ],
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "X28",
    "description": "Lose 2 plants. Increase your M€ production 2 steps.",
    "expansion": "promo"
  },
  "Project Inspection": {
    "name": "Project Inspection",
    "type": "event",
    "cost": 0,
    "cardNumber": "X02",
    "expansion": "promo"
  },
  "Protected Growth": {
    "name": "Protected Growth",
    "type": "event",
    "cost": 2,
    "tags": [
      "plant"
    ],
    "requirements": {
      "oxygen": 7
    },
    "cardNumber": "X73",
    "description": "Oxygen must be 7% or less. Gain 1 plant per power tag you have.",
    "expansion": "promo"
  },
  "Public Baths": {
    "name": "Public Baths",
    "type": "automated",
    "cost": 6,
    "tags": [
      "building"
    ],
    "requirements": {
      "oceans": 6
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "stock": {
        "megacredits": 6
      }
    },
    "cardNumber": "X70",
    "description": "Requires 6 oceans. Gain 6 M€.",
    "expansion": "promo"
  },
  "Public Plans": {
    "name": "Public Plans",
    "type": "event",
    "cost": 7,
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "X77",
    "expansion": "promo"
  },
  "Recyclon": {
    "name": "Recyclon",
    "tags": [
      "microbe",
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 1
      }
    },
    "resourceType": "Microbe",
    "cardNumber": "R26",
    "description": "You start with 38 M€ and 1 steel production.",
    "expansion": "promo"
  },
  "Red Ships": {
    "name": "Red Ships",
    "type": "active",
    "cost": 2,
    "requirements": {
      "oxygen": 4
    },
    "cardNumber": "X62",
    "description": "Requires 4% oxygen.",
    "expansion": "promo"
  },
  "Rego Plastics": {
    "name": "Rego Plastics",
    "type": "active",
    "cost": 10,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "X10",
    "expansion": "promo"
  },
  "Robot Pollinators": {
    "name": "Robot Pollinators",
    "type": "automated",
    "cost": 9,
    "requirements": {
      "oxygen": 4
    },
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "X45",
    "description": "Requires 4% oxygen. Increase your plant production 1 step. Gain 1 plant for every plant tag you have.",
    "expansion": "promo"
  },
  "Saturn Surfing": {
    "name": "Saturn Surfing",
    "type": "active",
    "cost": 13,
    "tags": [
      "jovian",
      "earth"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "resourceType": "Floater",
    "cardNumber": "X11",
    "description": "Add 1 floater here for every Earth tag you have, including this.",
    "expansion": "promo"
  },
  "Self-replicating Robots": {
    "name": "Self-replicating Robots",
    "type": "active",
    "cost": 7,
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "cardNumber": "210",
    "description": "Requires 2 science tags.",
    "expansion": "promo"
  },
  "Small Asteroid": {
    "name": "Small Asteroid",
    "type": "event",
    "cost": 10,
    "tags": [
      "space"
    ],
    "behavior": {
      "global": {
        "temperature": 1
      },
      "removeAnyPlants": 2
    },
    "cardNumber": "209",
    "description": "Increase temperature 1 step. Remove up to 2 plants from any player.",
    "expansion": "promo"
  },
  "Snow Algae": {
    "name": "Snow Algae",
    "type": "automated",
    "cost": 12,
    "tags": [
      "plant"
    ],
    "requirements": {
      "oceans": 2
    },
    "behavior": {
      "production": {
        "plants": 1,
        "heat": 1
      }
    },
    "cardNumber": "211",
    "description": "Requires 2 oceans. Increase your plant production and your heat production 1 step each.",
    "expansion": "promo"
  },
  "Soil Enrichment": {
    "name": "Soil Enrichment",
    "type": "event",
    "cost": 6,
    "tags": [
      "microbe",
      "plant"
    ],
    "cardNumber": "X67",
    "description": "Spend 1 microbe from ANY of your cards to gain 5 plants",
    "expansion": "promo"
  },
  "Solar Logistics": {
    "name": "Solar Logistics",
    "type": "active",
    "cost": 20,
    "tags": [
      "earth",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "stock": {
        "titanium": 2
      }
    },
    "cardDiscount": {
      "amount": 2,
      "tag": "earth"
    },
    "cardNumber": "X63",
    "description": "Gain 2 titanium.",
    "expansion": "promo"
  },
  "Splice": {
    "name": "Splice",
    "tags": [
      "microbe"
    ],
    "cardNumber": "R28",
    "description": "You start with 44 M€. As your first action, reveal cards until you have revealed a microbe tag. Take it and discard the rest.",
    "expansion": "promo"
  },
  "Stanford Torus": {
    "name": "Stanford Torus",
    "type": "automated",
    "cost": 12,
    "tags": [
      "space",
      "city"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "city": true
    },
    "cardNumber": "X12",
    "description": "Place a city tile IN SPACE, outside and separate from the planet.",
    "expansion": "promo"
  },
  "Static Harvesting": {
    "name": "Static Harvesting",
    "type": "automated",
    "cost": 5,
    "tags": [
      "power"
    ],
    "requirements": {
      "oceans": 3
    },
    "behavior": {
      "production": {
        "energy": 1
      }
    },
    "cardNumber": "X74",
    "description": "Requires 3 or fewer ocean tiles. Increase your energy production 1 step. Gain 1 M€ per building tag you have.",
    "expansion": "promo"
  },
  "St. Joseph of Cupertino Mission": {
    "name": "St. Joseph of Cupertino Mission",
    "type": "active",
    "cost": 7,
    "vp": {
      "type": "special"
    },
    "cardNumber": "X64",
    "description": "1 VP per City with a Cathedral in it.",
    "expansion": "promo"
  },
  "Strategic Base Planning": {
    "name": "Strategic Base Planning",
    "tags": [
      "city",
      "building",
      "space"
    ],
    "behavior": {
      "city": true,
      "colony": true
    },
    "cardNumber": "X65",
    "description": "Pay 3M€. Place a city. Place a colony.",
    "expansion": "promo"
  },
  "Sub-Crust Measurements": {
    "name": "Sub-Crust Measurements",
    "type": "active",
    "cost": 20,
    "tags": [
      "science",
      "building",
      "earth"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "action": {
      "drawCard": 1
    },
    "cardNumber": "X29",
    "description": "Requires 2 science tags.",
    "expansion": "promo"
  },
  "Supercapacitors": {
    "name": "Supercapacitors",
    "type": "active",
    "cost": 4,
    "tags": [
      "power",
      "building"
    ],
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "X46",
    "description": "Increase M€ production 1 step.",
    "expansion": "promo"
  },
  "Supermarkets": {
    "name": "Supermarkets",
    "type": "automated",
    "cost": 9,
    "requirements": {
      "cities": 2
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "X68",
    "description": "Requires two cities in play. Increase your M€ production 2 steps.",
    "expansion": "promo"
  },
  "Teslaract": {
    "name": "Teslaract",
    "type": "active",
    "cost": 14,
    "tags": [
      "power",
      "building"
    ],
    "behavior": {
      "tr": 1
    },
    "cardNumber": "X66",
    "description": "Raise your TR 1 step.",
    "expansion": "promo"
  },
  "Topsoil Contract": {
    "name": "Topsoil Contract",
    "type": "active",
    "cost": 8,
    "tags": [
      "microbe",
      "earth"
    ],
    "behavior": {
      "stock": {
        "plants": 3
      }
    },
    "cardNumber": "X30",
    "description": "Gain 3 plants.",
    "expansion": "promo"
  },
  "Tycho Magnetics": {
    "name": "Tycho Magnetics",
    "tags": [
      "power",
      "science"
    ],
    "behavior": {
      "production": {
        "energy": 1
      }
    },
    "cardNumber": "XC02",
    "description": "You start with 42 M€. Increase your energy production 1 step.",
    "expansion": "promo"
  },
  "Vermin": {
    "name": "Vermin",
    "type": "active",
    "cost": 8,
    "tags": [
      "microbe",
      "animal"
    ],
    "vp": {
      "type": "special"
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "X75",
    "description": "Each player, including you, gets -1 VP per city they have IF THERE ARE AT LEAST 10 ANIMALS HERE.",
    "expansion": "promo"
  },
  "Weather Balloons": {
    "name": "Weather Balloons",
    "type": "active",
    "cost": 11,
    "tags": [
      "science"
    ],
    "behavior": {
      "drawCard": 1
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Floater",
    "cardNumber": "033",
    "description": "Draw 1 card.",
    "expansion": "promo"
  },
  "Behold The Emperor! (III)": {
    "name": "Behold The Emperor! (III)",
    "type": "event",
    "cost": 10,
    "tags": [
      "earth"
    ],
    "requirements": {
      "chairman": 1
    },
    "cardNumber": "SW03",
    "description": "Requires that you are Chairman. The current ruling party will automatically be the ruling party during the next Solar phase, ",
    "expansion": "starwars"
  },
  "Clone Troopers (II)": {
    "name": "Clone Troopers (II)",
    "type": "active",
    "cost": 12,
    "tags": [
      "science"
    ],
    "requirements": {
      "oceans": 6
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "resourceType": "Clone Trooper",
    "cardNumber": "SW02",
    "description": "Requires 6 ocean tiles. 1 VP per Clone Trooper on this card.",
    "expansion": "starwars"
  },
  "Cloud City (V)": {
    "name": "Cloud City (V)",
    "type": "automated",
    "cost": 5,
    "tags": [
      "venus"
    ],
    "requirements": {
      "venus": 6
    },
    "behavior": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "SW05",
    "description": "Requires Venus 6%. Raise Venus 1 step. Add 2 floaters to any card.",
    "expansion": "starwars"
  },
  "Forest Moon (VI)": {
    "name": "Forest Moon (VI)",
    "type": "automated",
    "cost": 15,
    "tags": [
      "plant",
      "animal"
    ],
    "requirements": {
      "greeneries": 4
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "decreaseAnyProduction": {
        "type": "energy",
        "count": 2
      }
    },
    "cardNumber": "SW06",
    "description": "Requires any 4 greeneries on Mars. Decrease any energy production 2 steps. Add an animal to any card.",
    "expansion": "starwars"
  },
  "Rey ... Skywalker?! (IX)": {
    "name": "Rey ... Skywalker?! (IX)",
    "type": "automated",
    "cost": 8,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": -2
    },
    "behavior": {
      "production": {
        "megacredits": 4
      }
    },
    "cardNumber": "SW09",
    "description": "Raise your M€ production 4 steps. Place a bronze cube on an empty unreserved space on Mars. No tile or token may be placed on that space for the rest of the game.",
    "expansion": "starwars"
  },
  "Takonda Castle (VII)": {
    "name": "Takonda Castle (VII)",
    "type": "automated",
    "cost": 2,
    "tags": [
      "power",
      "plant"
    ],
    "cardNumber": "SW07",
    "description": "Gain 1 M€ for each of your microbe tags and animal tags.",
    "expansion": "starwars"
  },
  "Tool with the First Order (VIII)": {
    "name": "Tool with the First Order (VIII)",
    "type": "automated",
    "cost": 5,
    "tags": [
      "space"
    ],
    "behavior": {
      "tr": 1
    },
    "cardNumber": "SW08",
    "description": "Take another action this turn. Gain 1 TR.",
    "expansion": "starwars"
  },
  "Tosche Station (IV)": {
    "name": "Tosche Station (IV)",
    "type": "active",
    "cost": 5,
    "tags": [
      "power",
      "plant"
    ],
    "cardNumber": "SW04",
    "expansion": "starwars"
  },
  "Trade Embargo (I)": {
    "name": "Trade Embargo (I)",
    "type": "event",
    "cost": 4,
    "tags": [
      "space"
    ],
    "cardNumber": "SW01",
    "expansion": "starwars"
  },
  "Aerial Lenses": {
    "name": "Aerial Lenses",
    "type": "automated",
    "cost": 2,
    "vp": {
      "type": "static",
      "vp": -1
    },
    "behavior": {
      "production": {
        "heat": 2
      },
      "removeAnyPlants": 2
    },
    "cardNumber": "T01",
    "description": "Requires that Kelvinists are ruling or that you have 2 delegates there. Remove up to 2 plants from any player. Increase your heat production 2 steps.",
    "expansion": "turmoil"
  },
  "Banned Delegate": {
    "name": "Banned Delegate",
    "type": "event",
    "cost": 0,
    "cardNumber": "T02",
    "description": "Requires that you are Chairman. Remove any NON-LEADER delegate.",
    "expansion": "turmoil"
  },
  "Cultural Metropolis": {
    "name": "Cultural Metropolis",
    "type": "automated",
    "cost": 20,
    "tags": [
      "city",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 3
      },
      "city": true
    },
    "cardNumber": "T03",
    "description": "Requires that Unity is ruling or that you have 2 delegates there. Decrease your energy production 1 step and increase your M€ production 3 steps. Place a city tile. Place 2 delegates in 1 party.",
    "expansion": "turmoil"
  },
  "Diaspora Movement": {
    "name": "Diaspora Movement",
    "type": "automated",
    "cost": 7,
    "tags": [
      "jovian"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "TO4",
    "description": "Requires that Reds are ruling or that you have 2 delegates there. Gain 1M€ for each Jovian tag in play, including this.",
    "expansion": "turmoil"
  },
  "Event Analysts": {
    "name": "Event Analysts",
    "type": "active",
    "cost": 5,
    "tags": [
      "science"
    ],
    "cardNumber": "T05",
    "description": "Requires that Scientists are ruling or that you have 2 delegates there.",
    "expansion": "turmoil"
  },
  "GMO Contract": {
    "name": "GMO Contract",
    "type": "active",
    "cost": 3,
    "tags": [
      "microbe",
      "science"
    ],
    "cardNumber": "T06",
    "description": "Requires that Greens are ruling or that you have 2 delegates there.",
    "expansion": "turmoil"
  },
  "Lakefront Resorts": {
    "name": "Lakefront Resorts",
    "tags": [
      "building"
    ],
    "cardNumber": "R38",
    "description": "You start with 54 M€.",
    "expansion": "turmoil"
  },
  "Martian Media Center": {
    "name": "Martian Media Center",
    "type": "active",
    "cost": 7,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "T07",
    "description": "Requires that Mars First is ruling or that you have 2 delegates there. Increase your M€ production 2 steps.",
    "expansion": "turmoil"
  },
  "Parliament Hall": {
    "name": "Parliament Hall",
    "type": "automated",
    "cost": 8,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "per": 3
      }
    },
    "cardNumber": "T08",
    "description": "Requires that Mars First are ruling or that you have 2 delegates there. Increase your M€ production 1 step for every 3 building tags you have, including this.",
    "expansion": "turmoil"
  },
  "Political Alliance": {
    "name": "Political Alliance",
    "type": "event",
    "cost": 4,
    "requirements": {
      "partyLeader": 2
    },
    "behavior": {
      "tr": 1
    },
    "cardNumber": "X09",
    "description": "Requires that you have 2 party leaders. Gain 1 TR.",
    "expansion": "turmoil"
  },
  "Pristar": {
    "name": "Pristar",
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "resourceType": "Preservation",
    "cardNumber": "R07",
    "description": "You start with 53 M€. Decrease your TR 2 steps. 1 VP per preservation resource here.",
    "expansion": "turmoil"
  },
  "PR Office": {
    "name": "PR Office",
    "type": "automated",
    "cost": 7,
    "tags": [
      "earth"
    ],
    "behavior": {
      "tr": 1
    },
    "cardNumber": "T09",
    "description": "Requires that Unity are ruling or that you have 2 delegates there. Gain 1 TR. Gain 1 M€ for each Earth tag you have, including this.",
    "expansion": "turmoil"
  },
  "Public Celebrations": {
    "name": "Public Celebrations",
    "type": "event",
    "cost": 8,
    "tags": [],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "T10",
    "description": "Requires that you are Chairman.",
    "expansion": "turmoil"
  },
  "Recruitment": {
    "name": "Recruitment",
    "type": "event",
    "cost": 2,
    "cardNumber": "T11",
    "description": "Exchange one NEUTRAL NON-LEADER delegate with one of your own from the reserve.",
    "expansion": "turmoil"
  },
  "Red Tourism Wave": {
    "name": "Red Tourism Wave",
    "type": "event",
    "cost": 3,
    "tags": [
      "earth"
    ],
    "cardNumber": "T12",
    "description": "Requires that Reds are ruling or that you have 2 delegates there. Gain 1 M€ from each EMPTY AREA ADJACENT TO YOUR TILES",
    "expansion": "turmoil"
  },
  "Septem Tribus": {
    "name": "Septem Tribus",
    "tags": [
      "wild"
    ],
    "cardNumber": "R15",
    "description": "You start with 36 M€. When you perform an action, the wild tag counts as any tag of your choice.",
    "expansion": "turmoil"
  },
  "Sponsored Mohole": {
    "name": "Sponsored Mohole",
    "type": "automated",
    "cost": 5,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "heat": 2
      }
    },
    "cardNumber": "T13",
    "description": "Requires that Kelvinists are ruling or that you have 2 delegates there. Increase your heat production 2 steps.",
    "expansion": "turmoil"
  },
  "Supported Research": {
    "name": "Supported Research",
    "type": "automated",
    "cost": 3,
    "tags": [
      "science"
    ],
    "behavior": {
      "drawCard": 2
    },
    "cardNumber": "T14",
    "description": "Requires that Scientists are ruling or that you have 2 delegates there. Draw 2 cards.",
    "expansion": "turmoil"
  },
  "Terralabs Research": {
    "name": "Terralabs Research",
    "tags": [
      "science",
      "earth"
    ],
    "cardNumber": "R14",
    "description": "You start with 14 M€. Lower your TR 1 step.",
    "expansion": "turmoil"
  },
  "Utopia Invest": {
    "name": "Utopia Invest",
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 1,
        "titanium": 1
      }
    },
    "cardNumber": "R33",
    "description": "You start with 40 M€. Increase your steel and titanium production 1 step each.",
    "expansion": "turmoil"
  },
  "Vote Of No Confidence": {
    "name": "Vote Of No Confidence",
    "type": "event",
    "cost": 5,
    "requirements": {
      "partyLeader": 1
    },
    "cardNumber": "T16",
    "description": "Requires that you have a Party Leader in any party and that the sitting Chairman is neutral. ",
    "expansion": "turmoil"
  },
  "Wildlife Dome": {
    "name": "Wildlife Dome",
    "type": "automated",
    "cost": 15,
    "tags": [
      "animal",
      "plant",
      "building"
    ],
    "behavior": {
      "greenery": true
    },
    "cardNumber": "T15",
    "description": "Requires that Greens are ruling or that you have 2 delegates there. Place a greenery tile and raise oxygen 1 step.",
    "expansion": "turmoil"
  },
  "Acidizing": {
    "name": "Acidizing",
    "type": "automated",
    "cost": 10,
    "tags": [
      "venus",
      "building"
    ],
    "behavior": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "U098",
    "description": "Raise Venus 1 step. Excavate an underground resource.",
    "expansion": "underworld"
  },
  "Aeron Genomics": {
    "name": "Aeron Genomics",
    "tags": [
      "animal"
    ],
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "behavior": {
      "stock": {
        "steel": 5
      },
      "addResources": 2
    },
    "resourceType": "Animal",
    "cardNumber": "UC07",
    "description": "You start with 35 M€, 5 steel, and 2 animals on this card. 1 VP per 3 animals on this card.",
    "expansion": "underworld"
  },
  "Anti-trust Crackdown": {
    "name": "Anti-trust Crackdown",
    "type": "event",
    "cost": 18,
    "tags": [
      "earth"
    ],
    "requirements": {
      "corruption": 0
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "U064",
    "expansion": "underworld"
  },
  "Anubis Securities": {
    "name": "Anubis Securities",
    "tags": [
      "earth"
    ],
    "cardNumber": "UC11",
    "description": "You start with 42 M€. As your first action, play a card ignoring global requirements.",
    "expansion": "underworld"
  },
  "Arborist Collective": {
    "name": "Arborist Collective",
    "tags": [
      "plant"
    ],
    "behavior": {
      "production": {
        "plants": 2
      },
      "stock": {
        "plants": 2
      }
    },
    "action": {
      "production": {
        "plants": 1
      },
      "stock": {
        "plants": 2
      }
    },
    "resourceType": "Activist",
    "cardNumber": "UC05",
    "description": "You start with 40 M€, 2 plants and 2 plant production.",
    "expansion": "underworld"
  },
  "Artesian Aquifer": {
    "name": "Artesian Aquifer",
    "type": "automated",
    "cost": 16,
    "tags": [
      "building"
    ],
    "cardNumber": "U059",
    "description": "Excavate 1 underground resource on ANY SPACE RESERVED FOR AN OCEAN. Then, place an ocean tile there, if possible.",
    "expansion": "underworld"
  },
  "Battery Factory": {
    "name": "Battery Factory",
    "type": "active",
    "cost": 8,
    "tags": [
      "power",
      "building"
    ],
    "cardNumber": "U075",
    "expansion": "underworld"
  },
  "Battery Shipment": {
    "name": "Battery Shipment",
    "tags": [
      "power"
    ],
    "behavior": {
      "production": {
        "energy": 2
      },
      "stock": {
        "energy": 12
      }
    },
    "cardNumber": "UP10",
    "description": "Gain 12 energy. Increase your energy production 2 steps.",
    "expansion": "underworld"
  },
  "Behemoth Excavator": {
    "name": "Behemoth Excavator",
    "type": "automated",
    "cost": 13,
    "tags": [
      "building"
    ],
    "cardNumber": "U030",
    "description": "Excavate 3 underground resources.",
    "expansion": "underworld"
  },
  "Biobatteries": {
    "name": "Biobatteries",
    "type": "automated",
    "cost": 7,
    "tags": [
      "power",
      "microbe"
    ],
    "behavior": {
      "production": {
        "energy": 1
      }
    },
    "cardNumber": "U096",
    "description": "Increase your energy production 1 step. Gain 1 energy ",
    "expansion": "underworld"
  },
  "Canyon Survey": {
    "name": "Canyon Survey",
    "type": "event",
    "cost": 4,
    "tags": [
      "science"
    ],
    "cardNumber": "U081",
    "description": "Identify 3 underground resources. Claim 1 of them.",
    "expansion": "underworld"
  },
  "Casino": {
    "name": "Casino",
    "type": "automated",
    "cost": 15,
    "tags": [
      "building",
      "crime"
    ],
    "requirements": {
      "cities": 2
    },
    "behavior": {
      "production": {
        "megacredits": 4
      }
    },
    "cardNumber": "U020",
    "description": "Requires that you own 2 city tiles. Gain 1 corruption. Increase your M€ production 4 steps.",
    "expansion": "underworld"
  },
  "Cave City": {
    "name": "Cave City",
    "type": "automated",
    "cost": 16,
    "tags": [
      "building",
      "city"
    ],
    "behavior": {
      "production": {
        "steel": 1
      }
    },
    "cardNumber": "U027",
    "description": "Increase your steel production 1 step. ",
    "expansion": "underworld"
  },
  "Central Reservoir": {
    "name": "Central Reservoir",
    "tags": [
      "building"
    ],
    "cardNumber": "UP09",
    "description": "Place an ocean ON AN AREA NOT RESERVED FOR OCEAN. ",
    "expansion": "underworld"
  },
  "Chemical Factory": {
    "name": "Chemical Factory",
    "type": "active",
    "cost": 18,
    "tags": [
      "crime",
      "building"
    ],
    "cardNumber": "U060",
    "description": "Gain 2 corruption.",
    "expansion": "underworld"
  },
  "Class-action Lawsuit": {
    "name": "Class-action Lawsuit",
    "type": "event",
    "cost": 25,
    "tags": [
      "earth"
    ],
    "vp": {
      "type": "static",
      "vp": 3
    },
    "cardNumber": "U082",
    "description": "The player with more corruption than anybody else ",
    "expansion": "underworld"
  },
  "Cloud Vortex Outpost": {
    "name": "Cloud Vortex Outpost",
    "tags": [
      "venus"
    ],
    "behavior": {
      "global": {
        "venus": 2
      },
      "addResources": 3
    },
    "resourceType": "Floater",
    "cardNumber": "UP15",
    "expansion": "underworld"
  },
  "Corporate Blackmail": {
    "name": "Corporate Blackmail",
    "type": "event",
    "cost": 5,
    "tags": [
      "crime"
    ],
    "requirements": {
      "corruption": 1
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "U039",
    "description": "Requires 1 corruption. Target a player that has at least 3 corruption. ",
    "expansion": "underworld"
  },
  "Corporate Theft": {
    "name": "Corporate Theft",
    "type": "active",
    "cost": 10,
    "tags": [
      "crime"
    ],
    "requirements": {
      "corruption": 2
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "U061",
    "description": "Requires 2 corruption.",
    "expansion": "underworld"
  },
  "Crater Survey": {
    "name": "Crater Survey",
    "type": "event",
    "cost": 5,
    "tags": [
      "science"
    ],
    "cardNumber": "U069",
    "description": "Identify 4 underground resources. Claim one of them.",
    "expansion": "underworld"
  },
  "Cut-throat Budgeting": {
    "name": "Cut-throat Budgeting",
    "type": "automated",
    "cost": 2,
    "tags": [
      "crime"
    ],
    "requirements": {
      "corruption": 1
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "behavior": {
      "production": {
        "megacredits": 1,
        "steel": 1,
        "energy": 1
      }
    },
    "cardNumber": "U080",
    "description": "Requires 1 corruption. Increase your M€, steel, and energy production 1 step each.",
    "expansion": "underworld"
  },
  "Deep Foundations": {
    "name": "Deep Foundations",
    "type": "active",
    "cost": 4,
    "tags": [
      "city",
      "building"
    ],
    "cardNumber": "U100",
    "expansion": "underworld"
  },
  "Deepmining": {
    "name": "Deepmining",
    "type": "automated",
    "cost": 11,
    "tags": [
      "building"
    ],
    "cardNumber": "U029",
    "description": "Excavate an underground resource that depicts steel or titanium ANYWHERE ON THE BOARD. ",
    "expansion": "underworld"
  },
  "Deepnuking": {
    "name": "Deepnuking",
    "type": "event",
    "cost": 6,
    "vp": {
      "type": "static",
      "vp": -1
    },
    "behavior": {
      "removeAnyPlants": 3
    },
    "cardNumber": "U006",
    "description": "Excavate 2 underground resources. Remove up to 3 plants from any player.",
    "expansion": "underworld"
  },
  "Deepwater Dome": {
    "name": "Deepwater Dome",
    "tags": [
      "plant",
      "building"
    ],
    "behavior": {
      "production": {
        "plants": 1
      },
      "ocean": true
    },
    "cardNumber": "UP11",
    "description": "Increase your plant production 1 step. Place an ocean.",
    "expansion": "underworld"
  },
  "Demetron Labs": {
    "name": "Demetron Labs",
    "tags": [
      "science"
    ],
    "behavior": {
      "addResources": 2
    },
    "resourceType": "Data",
    "cardNumber": "UC02",
    "description": "You start with 45 M€ and 2 data on this card.",
    "expansion": "underworld"
  },
  "Detective TV Series": {
    "name": "Detective TV Series",
    "type": "active",
    "cost": 5,
    "tags": [
      "earth"
    ],
    "cardNumber": "U091",
    "expansion": "underworld"
  },
  "Earthquake Machine": {
    "name": "Earthquake Machine",
    "type": "active",
    "cost": 10,
    "tags": [
      "science"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "behavior": {
      "decreaseAnyProduction": {
        "type": "plants",
        "count": 1
      }
    },
    "cardNumber": "U055",
    "expansion": "underworld"
  },
  "Election Sponsorship": {
    "name": "Election Sponsorship",
    "tags": [
      "crime"
    ],
    "cardNumber": "UP14",
    "expansion": "underworld"
  },
  "Excavator Leasing": {
    "name": "Excavator Leasing",
    "type": "active",
    "cost": 8,
    "tags": [
      "building"
    ],
    "cardNumber": "U035",
    "expansion": "underworld"
  },
  "Expedition Vehicles": {
    "name": "Expedition Vehicles",
    "type": "active",
    "cost": 10,
    "tags": [
      "science"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "U079",
    "expansion": "underworld"
  },
  "Exploitation Of Venus": {
    "name": "Exploitation Of Venus",
    "type": "active",
    "cost": 6,
    "tags": [
      "venus",
      "crime"
    ],
    "action": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "U099",
    "expansion": "underworld"
  },
  "Export Convoy": {
    "name": "Export Convoy",
    "type": "event",
    "cost": 6,
    "tags": [
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "U097",
    "description": "Pay 4 plants, or 3 microbes, or 2 animals from any of your cards. ",
    "expansion": "underworld"
  },
  "Fabricated Scandal": {
    "name": "Fabricated Scandal",
    "type": "event",
    "cost": 14,
    "tags": [
      "crime"
    ],
    "cardNumber": "U013",
    "description": "Gain 1 corruption. The players with the highest TR lose 1 TR. ",
    "expansion": "underworld"
  },
  "GlobalEventName.FAIR_TRADE_COMPLAINT": {
    "name": "GlobalEventName.FAIR_TRADE_COMPLAINT",
    "description": "Lose 1 M€ for each card in your hand over 6 (no limit) ",
    "expansion": "underworld"
  },
  "Family Connections": {
    "name": "Family Connections",
    "type": "event",
    "cost": 12,
    "tags": [
      "crime"
    ],
    "cardNumber": "U095",
    "description": "Gain 1 corruption for every city tag you have.",
    "expansion": "underworld"
  },
  "Forest Tunnels": {
    "name": "Forest Tunnels",
    "type": "automated",
    "cost": 7,
    "tags": [
      "plant"
    ],
    "cardNumber": "U016",
    "description": "Gain 1 plant for each underground token you own.",
    "expansion": "underworld"
  },
  "Free Trade Port": {
    "name": "Free Trade Port",
    "tags": [
      "earth",
      "space"
    ],
    "behavior": {
      "colony": true
    },
    "cardNumber": "UP01",
    "description": "Gain 1 corruption. Place a colony.",
    "expansion": "underworld"
  },
  "Friends in High Places": {
    "name": "Friends in High Places",
    "type": "active",
    "cost": 10,
    "tags": [
      "crime",
      "earth"
    ],
    "requirements": {
      "count": 2,
      "tag": "earth"
    },
    "cardDiscount": {
      "amount": 1
    },
    "cardNumber": "U041",
    "description": "Requires 2 Earth tags. Gain 1 corruption.",
    "expansion": "underworld"
  },
  "Gaia City": {
    "name": "Gaia City",
    "type": "automated",
    "cost": 20,
    "tags": [
      "plant",
      "building",
      "city"
    ],
    "behavior": {
      "production": {
        "energy": -1,
        "plants": 2
      }
    },
    "cardNumber": "U005",
    "description": "Reduce your energy production one step and increase your plant production 2 steps. ",
    "expansion": "underworld"
  },
  "Ganymede Trading Company": {
    "name": "Ganymede Trading Company",
    "tags": [
      "jovian",
      "space"
    ],
    "behavior": {
      "stock": {
        "titanium": 3
      },
      "tradeFleet": true
    },
    "cardNumber": "UP08",
    "description": "Gain 1 corruption, 3 titanium, and a trade fleet.",
    "expansion": "underworld"
  },
  "Gas Trust": {
    "name": "Gas Trust",
    "type": "automated",
    "cost": 12,
    "tags": [
      "crime"
    ],
    "cardNumber": "U092",
    "description": "Gain 1 corruption. Gain 3 heat for each crime tag you have INCLUDING EVENTS and this card.",
    "expansion": "underworld"
  },
  "Geological Expertise": {
    "name": "Geological Expertise",
    "cardNumber": "UP06",
    "description": "Identify 4 underground resources. Claim one of them. Draw 2 cards with science tags.",
    "expansion": "underworld"
  },
  "Geologist Team": {
    "name": "Geologist Team",
    "type": "active",
    "cost": 6,
    "tags": [
      "science"
    ],
    "cardNumber": "U001",
    "expansion": "underworld"
  },
  "Geoscan Satellite": {
    "name": "Geoscan Satellite",
    "type": "automated",
    "cost": 8,
    "tags": [
      "science",
      "space"
    ],
    "cardNumber": "U002",
    "description": "Pick a space on the board. ",
    "expansion": "underworld"
  },
  "Geothermal Network": {
    "name": "Geothermal Network",
    "type": "automated",
    "cost": 14,
    "tags": [
      "building"
    ],
    "requirements": {
      "undergroundTokens": 3
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "heat": 3
      }
    },
    "cardNumber": "U024",
    "description": "Requires 3 underground tokens. Increase your heat production 3 steps.",
    "expansion": "underworld"
  },
  "Global Audit": {
    "name": "Global Audit",
    "type": "event",
    "cost": 2,
    "tags": [
      "earth"
    ],
    "cardNumber": "U025",
    "description": "Every player with the lowest number of crime tags INCLUDING EVENTS gains 1 TR, if possible. ",
    "expansion": "underworld"
  },
  "Grey Market Exploitation": {
    "name": "Grey Market Exploitation",
    "type": "active",
    "cost": 4,
    "tags": [
      "crime"
    ],
    "requirements": {
      "corruption": 2
    },
    "cardNumber": "U034",
    "description": "Requires 2 corruption.",
    "expansion": "underworld"
  },
  "Guerilla Ecologists": {
    "name": "Guerilla Ecologists",
    "type": "automated",
    "cost": 9,
    "tags": [
      "plant"
    ],
    "requirements": {
      "corruption": 1
    },
    "cardNumber": "U089",
    "description": "Requires 1 corruption and that you lose 4 plants. Place a greenery tile IGNORING ADJACENCY RESTRICTIONS.",
    "expansion": "underworld"
  },
  "Hackers:u": {
    "name": "Hackers:u",
    "type": "automated",
    "cost": 3,
    "tags": [
      "crime"
    ],
    "requirements": {
      "corruption": 2
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "UX01",
    "description": "Requires 2 corruption. Decrease any M€ production 2 steps. Increase your M€ production 1 step for every unit of corruption you have.",
    "expansion": "underworld"
  },
  "Hadesphere": {
    "name": "Hadesphere",
    "tags": [
      "building"
    ],
    "behavior": {
      "stock": {
        "steel": 5
      }
    },
    "cardNumber": "UC01",
    "description": "You start with 40 M€ and 5 steel. As your first action, identify any 3 underground resources on Mars.",
    "expansion": "underworld"
  },
  "Hecate Speditions": {
    "name": "Hecate Speditions",
    "tags": [
      "earth",
      "space"
    ],
    "behavior": {
      "tradeFleet": true,
      "addResources": 2
    },
    "resourceType": "Supply Chain",
    "cardNumber": "UC12",
    "description": "You start with 38 M€, 2 supply chain resources here, and an extra trade fleet.",
    "expansion": "underworld"
  },
  "Henkei Genetics": {
    "name": "Henkei Genetics",
    "tags": [
      "microbe"
    ],
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "resourceType": "Microbe",
    "cardNumber": "UC04",
    "description": "You start with 47 M€ and 1 corruption. As your first action, draw 2 microbe cards. ",
    "expansion": "underworld"
  },
  "Hired Raiders:u": {
    "name": "Hired Raiders:u",
    "type": "event",
    "cost": 1,
    "tags": [
      "crime"
    ],
    "cardNumber": "UX02",
    "description": "Steal 4 M€, plus 1 extra M€ for each corruption resource you have, from any player.",
    "expansion": "underworld"
  },
  "Hyperspace Drive Prototype": {
    "name": "Hyperspace Drive Prototype",
    "type": "automated",
    "cost": 11,
    "tags": [
      "science",
      "space"
    ],
    "requirements": {
      "count": 3,
      "tag": "science"
    },
    "cardNumber": "U052",
    "description": "Requires that 3 science tags. ",
    "expansion": "underworld"
  },
  "Imported Heavy Machinery": {
    "name": "Imported Heavy Machinery",
    "type": "automated",
    "cost": 9,
    "tags": [
      "earth",
      "space"
    ],
    "cardNumber": "U021",
    "description": "Excavate 2 underground resources.",
    "expansion": "underworld"
  },
  "Induced Tremor": {
    "name": "Induced Tremor",
    "type": "event",
    "cost": 5,
    "cardNumber": "U070",
    "description": "Discard 1 underground resource from the board. Then excavate an underground resource.",
    "expansion": "underworld"
  },
  "Infrastructure Overload": {
    "name": "Infrastructure Overload",
    "type": "automated",
    "cost": 7,
    "tags": [
      "power",
      "crime"
    ],
    "vp": {
      "type": "static",
      "vp": -1
    },
    "behavior": {
      "decreaseAnyProduction": {
        "type": "energy",
        "count": 2
      }
    },
    "cardNumber": "U068",
    "description": "Gain 1 corruption. Reduce any energy production 2 steps.",
    "expansion": "underworld"
  },
  "Inherited Fortune": {
    "name": "Inherited Fortune",
    "tags": [
      "crime"
    ],
    "behavior": {
      "production": {
        "megacredits": 1
      },
      "stock": {
        "megacredits": 10
      }
    },
    "cardNumber": "U0P03",
    "description": "Gain 1 corruption and 10 M€. Increase your M€ production 1 step.",
    "expansion": "underworld"
  },
  "Investigative Journalism": {
    "name": "Investigative Journalism",
    "type": "active",
    "cost": 3,
    "tags": [
      "earth"
    ],
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "behavior": {
      "production": {
        "megacredits": -1
      }
    },
    "resourceType": "Journalism",
    "cardNumber": "U087",
    "description": "Decrease your M€ production 1 step. 1 VP per journalism resource on this card.",
    "expansion": "underworld"
  },
  "Investor Plaza": {
    "name": "Investor Plaza",
    "tags": [
      "earth",
      "city"
    ],
    "behavior": {
      "city": true
    },
    "cardNumber": "UP02",
    "description": "Place a city and gain 1 corruption.",
    "expansion": "underworld"
  },
  "Jenson-Boyle & Co": {
    "name": "Jenson-Boyle & Co",
    "tags": [
      "crime"
    ],
    "action": {
      "stock": {
        "steel": 5
      }
    },
    "cardNumber": "UC03",
    "description": "You start with 46 M€ and 2 corruption.",
    "expansion": "underworld"
  },
  "Keplertec": {
    "name": "Keplertec",
    "type": "cardresource.fighter",
    "tags": [
      "jovian",
      "space"
    ],
    "behavior": {
      "production": {
        "titanium": 1
      },
      "stock": {
        "titanium": 3
      }
    },
    "resourceType": "Fighter",
    "cardNumber": "UC08",
    "description": "You start with 33 M€, 3 titanium, and 1 titanium production.",
    "expansion": "underworld"
  },
  "Kingdom of Tauraro": {
    "name": "Kingdom of Tauraro",
    "tags": [
      "city"
    ],
    "vp": {
      "type": "static",
      "vp": -2
    },
    "behavior": {
      "production": {
        "megacredits": 6
      }
    },
    "cardNumber": "UC06",
    "description": "You start with 50 M€ and 6 M€ production. All opponents gain 2 M€ production. As your first action, place a city.",
    "expansion": "underworld"
  },
  "Labor Trafficking": {
    "name": "Labor Trafficking",
    "type": "active",
    "cost": 6,
    "tags": [
      "space",
      "crime"
    ],
    "requirements": {
      "corruption": 2
    },
    "vp": {
      "type": "static",
      "vp": -2
    },
    "cardNumber": "U014",
    "description": "Requires 2 corruption.",
    "expansion": "underworld"
  },
  "GlobalEventName.LAGGING_REGULATION": {
    "name": "GlobalEventName.LAGGING_REGULATION",
    "description": "Count crime tags (INCLUDING EVENTS) and ADD influence. Players with the most get 1 corruption and 9 M€. ",
    "expansion": "underworld"
  },
  "Landfill": {
    "name": "Landfill",
    "type": "automated",
    "cost": 2,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "static",
      "vp": -2
    },
    "cardNumber": "U036",
    "description": "Increase your M€ production 1 step for each different TYPE of production ",
    "expansion": "underworld"
  },
  "Lobbying Network": {
    "name": "Lobbying Network",
    "type": "automated",
    "cost": 5,
    "tags": [
      "earth"
    ],
    "cardNumber": "U031",
    "description": "Gain 1 corruption.",
    "expansion": "underworld"
  },
  "Man-made Volcano": {
    "name": "Man-made Volcano",
    "type": "automated",
    "cost": 26,
    "tags": [
      "power"
    ],
    "behavior": {
      "production": {
        "energy": 2,
        "heat": 4
      }
    },
    "cardNumber": "U017",
    "expansion": "underworld"
  },
  "Martian Express": {
    "name": "Martian Express",
    "type": "active",
    "cost": 5,
    "requirements": {
      "cities": 1
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "resourceType": "Ware",
    "cardNumber": "U078",
    "description": "Requires 1 city in play.",
    "expansion": "underworld"
  },
  "Media Frenzy": {
    "name": "Media Frenzy",
    "type": "event",
    "cost": 6,
    "tags": [
      "earth"
    ],
    "cardNumber": "U086",
    "description": "Remove up to 1 corruption from another player. Reveal 2 cards from the deck until you reveal 2 event cards. Take them into hand and discard the rest.",
    "expansion": "underworld"
  },
  "GlobalEventName.MEDIA_STIR": {
    "name": "GlobalEventName.MEDIA_STIR",
    "description": "Lose 3 M€ per corruption resource you have (max 5), minus influence. Players with 0 corruption gain 1 TR.",
    "expansion": "underworld"
  },
  "Mercenary Squad": {
    "name": "Mercenary Squad",
    "type": "event",
    "cost": 1,
    "tags": [
      "crime"
    ],
    "requirements": {
      "corruption": 1
    },
    "cardNumber": "U083",
    "description": "Requires 1 corruption. Remove up to 2 resources from ANY card",
    "expansion": "underworld"
  },
  "Micro-Geodesics": {
    "name": "Micro-Geodesics",
    "type": "active",
    "cost": 8,
    "tags": [
      "microbe",
      "plant"
    ],
    "behavior": {
      "addResources": 1
    },
    "resourceType": "Microbe",
    "cardNumber": "U056",
    "description": "Excavate an underground resource. Put 1 microbe on this card.",
    "expansion": "underworld"
  },
  "Microgravimetry": {
    "name": "Microgravimetry",
    "type": "active",
    "cost": 5,
    "tags": [
      "power",
      "science"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "U042",
    "expansion": "underworld"
  },
  "Microprobing Technology": {
    "name": "Microprobing Technology",
    "type": "automated",
    "cost": 8,
    "tags": [
      "science"
    ],
    "requirements": {
      "tag": "science"
    },
    "behavior": {
      "stock": {
        "plants": 3
      }
    },
    "cardNumber": "U022",
    "description": "Requires 1 science tag. Gain 3 plants. Identify 2 underground resources. Claim 1 of them.",
    "expansion": "underworld"
  },
  "GlobalEventName.MIGRATION_UNDERGROUND": {
    "name": "GlobalEventName.MIGRATION_UNDERGROUND",
    "description": "Gain 1 M€ production (max 5) for every 2 underworld tokens you own. Each point of influence counts as an extra underworld token.",
    "expansion": "underworld"
  },
  "Mining Market Insider": {
    "name": "Mining Market Insider",
    "type": "active",
    "cost": 5,
    "tags": [
      "earth"
    ],
    "action": {
      "drawCard": 1
    },
    "resourceType": "Data",
    "cardNumber": "U046",
    "expansion": "underworld"
  },
  "Monopoly": {
    "name": "Monopoly",
    "type": "active",
    "cost": 8,
    "tags": [
      "crime"
    ],
    "requirements": {
      "corruption": 2
    },
    "vp": {
      "type": "static",
      "vp": -2
    },
    "cardNumber": "U065",
    "description": "Requires 2 corruption. Choose a standard resource type. ",
    "expansion": "underworld"
  },
  "Nanofoundry": {
    "name": "Nanofoundry",
    "type": "automated",
    "cost": 18,
    "tags": [
      "power",
      "science"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "energy": -5
      }
    },
    "cardNumber": "U074",
    "description": "Requires 2 science tags. Reduce your energy production 5 steps. ",
    "expansion": "underworld"
  },
  "Narrative Spin": {
    "name": "Narrative Spin",
    "type": "event",
    "cost": 5,
    "tags": [
      "crime"
    ],
    "requirements": {
      "count": 1,
      "tag": "earth"
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "U037",
    "description": "Requires 1 Earth tag. Gain 2 corruption.",
    "expansion": "underworld"
  },
  "Neutrinograph": {
    "name": "Neutrinograph",
    "type": "automated",
    "cost": 14,
    "tags": [
      "science"
    ],
    "requirements": {
      "count": 5,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "U057",
    "description": "Requires 5 science tags. Identify 7 underground resources. Claim 3 of them.",
    "expansion": "underworld"
  },
  "Nightclubs": {
    "name": "Nightclubs",
    "type": "automated",
    "cost": 10,
    "tags": [
      "building",
      "crime"
    ],
    "requirements": {
      "cities": 1
    },
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "U008",
    "description": "Requires that you own a city in play. Gain 1 corruption and increase your M€ production 2 steps.",
    "expansion": "underworld"
  },
  "Off-World Tax Haven": {
    "name": "Off-World Tax Haven",
    "type": "automated",
    "cost": 8,
    "tags": [
      "space",
      "crime"
    ],
    "requirements": {
      "corruption": 2
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "behavior": {
      "production": {
        "megacredits": 5
      }
    },
    "cardNumber": "U010",
    "description": "Requires 2 corruption. Increase your M€ production 5 steps.",
    "expansion": "underworld"
  },
  "Old World Mafia": {
    "name": "Old World Mafia",
    "type": "automated",
    "cost": 11,
    "tags": [
      "earth",
      "crime"
    ],
    "cardNumber": "U007",
    "description": "Gain 1 corruption for every 2 Earth tags you have, including this.",
    "expansion": "underworld"
  },
  "Orbital Laser Drill": {
    "name": "Orbital Laser Drill",
    "type": "automated",
    "cost": 15,
    "tags": [
      "science",
      "space"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "U033",
    "description": "Requires 2 science tags. Excavate 2 underground resources, IGNORING PLACEMENT RESTRICTIONS.",
    "expansion": "underworld"
  },
  "Patent Manipulation": {
    "name": "Patent Manipulation",
    "type": "event",
    "cost": 7,
    "tags": [
      "crime"
    ],
    "requirements": {
      "corruption": 1
    },
    "vp": {
      "type": "static",
      "vp": -2
    },
    "cardNumber": "U026",
    "description": "RETURN 1 OF YOUR PLAYED GREEN OR BLUE CARDS TO YOUR HAND. IT MAY NOT BE A CARD THAT PLACES SPECIAL TILES OR RETURNS PLAYED CARDS TO YOUR HAND.",
    "expansion": "underworld"
  },
  "Personal Spacecruiser": {
    "name": "Personal Spacecruiser",
    "type": "active",
    "cost": 12,
    "tags": [
      "crime",
      "space"
    ],
    "action": {
      "stock": {
        "each": 2
      }
    },
    "cardNumber": "U051",
    "description": "Gain 1 corruption. Put 1 fighter on ANY card.",
    "expansion": "underworld"
  },
  "Planetary Rights Buyout": {
    "name": "Planetary Rights Buyout",
    "type": "event",
    "cost": 28,
    "tags": [
      "crime",
      "crime"
    ],
    "requirements": {
      "corruption": 5
    },
    "vp": {
      "type": "static",
      "vp": -3
    },
    "behavior": {
      "tr": 7
    },
    "cardNumber": "U085",
    "description": "Requires 5 corruption. Gain 7 TR",
    "expansion": "underworld"
  },
  "Plant Tax": {
    "name": "Plant Tax",
    "type": "event",
    "cost": 7,
    "cardNumber": "U067",
    "description": "ALL players lose 2 plants. Players can block this with corruption. Gain 1 corruption.",
    "expansion": "underworld"
  },
  "Price Wars": {
    "name": "Price Wars",
    "type": "event",
    "cost": 1,
    "requirements": {
      "corruption": 2
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "U063",
    "description": "Requires 2 corruption. Until the end of this generation, ",
    "expansion": "underworld"
  },
  "Private Investigator": {
    "name": "Private Investigator",
    "type": "event",
    "cost": 4,
    "vp": {
      "type": "special"
    },
    "behavior": {
      "tr": 1
    },
    "cardNumber": "U038",
    "description": "Gain 1 TR.",
    "expansion": "underworld"
  },
  "Private Military Contractor": {
    "name": "Private Military Contractor",
    "type": "active",
    "cost": 14,
    "tags": [
      "jovian",
      "space"
    ],
    "behavior": {
      "addResources": 1
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Fighter",
    "cardNumber": "U049",
    "description": "Add 1 fighter resource to this card.",
    "expansion": "underworld"
  },
  "Private Resorts": {
    "name": "Private Resorts",
    "type": "automated",
    "cost": 9,
    "tags": [
      "building"
    ],
    "requirements": {
      "oceans": 3
    },
    "behavior": {
      "production": {
        "heat": -1,
        "megacredits": 3
      }
    },
    "cardNumber": "U054",
    "description": "Requires 3 oceans. Reduce your heat production 1 step. ",
    "expansion": "underworld"
  },
  "Prospecting": {
    "name": "Prospecting",
    "tags": [
      "space"
    ],
    "cardNumber": "UP13",
    "description": "Pay 4 M€. Put an additional colony tile of your choice into play. Then place a colony on it.",
    "expansion": "underworld"
  },
  "Public Spaceline": {
    "name": "Public Spaceline",
    "type": "automated",
    "cost": 18,
    "tags": [
      "earth",
      "earth",
      "jovian",
      "jovian",
      "venus",
      "venus",
      "mars",
      "mars"
    ],
    "requirements": {
      "count": 5,
      "tag": "space"
    },
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "U077",
    "description": "Requires 5 space tags. This card has 2 Earth tags, 2 Jovian tags, 2 Venus tags, and 2 Mars tags.",
    "expansion": "underworld"
  },
  "Racketeering": {
    "name": "Racketeering",
    "type": "automated",
    "cost": 5,
    "tags": [
      "crime"
    ],
    "requirements": {
      "corruption": 1
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "U092",
    "description": "Requires 1 corruption. Increase your M€ production one step for each crime tag you have INCLUDING EVENTS and this card.",
    "expansion": "underworld"
  },
  "Reckless Detonation": {
    "name": "Reckless Detonation",
    "type": "event",
    "cost": 1,
    "tags": [
      "crime"
    ],
    "requirements": {
      "corruption": 2
    },
    "cardNumber": "U009",
    "description": "Requires 2 corruption. Excavate an underground resource. Remove up to 3 steel or 2 titanium from any player.",
    "expansion": "underworld"
  },
  "Research & Development Hub": {
    "name": "Research & Development Hub",
    "type": "active",
    "cost": 14,
    "tags": [
      "science",
      "building"
    ],
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "resourceType": "Data",
    "cardNumber": "U084",
    "description": "1 VP for every 3 data resources on this card.",
    "expansion": "underworld"
  },
  "Robot Moles": {
    "name": "Robot Moles",
    "type": "automated",
    "cost": 8,
    "tags": [
      "building"
    ],
    "behavior": {
      "stock": {
        "steel": 2
      }
    },
    "cardNumber": "U045",
    "description": "Gain 2 steel. Identify 4 underground resources. Claim 1 of them.",
    "expansion": "underworld"
  },
  "Scapegoat": {
    "name": "Scapegoat",
    "type": "event",
    "cost": 5,
    "tags": [
      "crime"
    ],
    "cardNumber": "U040",
    "description": "Gain 1 corruption.",
    "expansion": "underworld"
  },
  "Search for Life Underground": {
    "name": "Search for Life Underground",
    "type": "active",
    "cost": 6,
    "tags": [
      "science"
    ],
    "requirements": {
      "temperature": -18
    },
    "vp": {
      "type": "special"
    },
    "resourceType": "Science",
    "cardNumber": "U023",
    "description": "Temperature must -18° C or colder.",
    "expansion": "underworld"
  },
  "Secret Research": {
    "name": "Secret Research",
    "tags": [
      "science"
    ],
    "behavior": {
      "drawCard": 3
    },
    "cardNumber": "UP12",
    "description": "Gain 1 corruption and draw 3 cards.",
    "expansion": "underworld"
  },
  "GlobalEventName.SEISMIC_PREDICTIONS": {
    "name": "GlobalEventName.SEISMIC_PREDICTIONS",
    "description": "Discard all unclaimed underground resources. ",
    "expansion": "underworld"
  },
  "Server Sabotage": {
    "name": "Server Sabotage",
    "type": "event",
    "cost": 9,
    "tags": [
      "crime"
    ],
    "behavior": {
      "drawCard": 1
    },
    "cardNumber": "U047",
    "description": "Gain 1 corruption. Draw a card. Remove all underground resources from the board.",
    "expansion": "underworld"
  },
  "Soil Export": {
    "name": "Soil Export",
    "type": "automated",
    "cost": 3,
    "tags": [
      "venus",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "U058",
    "expansion": "underworld"
  },
  "Space Privateers": {
    "name": "Space Privateers",
    "type": "active",
    "cost": 10,
    "tags": [
      "crime",
      "space"
    ],
    "requirements": {
      "corruption": 3
    },
    "vp": {
      "type": "static",
      "vp": -2
    },
    "resourceType": "Fighter",
    "cardNumber": "U050",
    "description": "Requires 3 corruption.",
    "expansion": "underworld"
  },
  "Space Wargames": {
    "name": "Space Wargames",
    "type": "active",
    "cost": 25,
    "tags": [
      "jovian",
      "space"
    ],
    "vp": {
      "type": "per_tag",
      "tag": "jovian",
      "per": 1
    },
    "behavior": {
      "addResources": 4
    },
    "action": {
      "addResources": 2
    },
    "resourceType": "Fighter",
    "cardNumber": "U048",
    "description": "Put 4 fighters on this card.",
    "expansion": "underworld"
  },
  "Staged Protests": {
    "name": "Staged Protests",
    "type": "event",
    "cost": 6,
    "tags": [
      "crime"
    ],
    "requirements": {
      "corruption": 1
    },
    "cardNumber": "U066",
    "description": "Requires 1 corruption. Gain 1 corruption. Until the end of this generation, milestones and awards cost +8 M€.",
    "expansion": "underworld"
  },
  "Standard Technology:u": {
    "name": "Standard Technology:u",
    "type": "active",
    "cost": 6,
    "tags": [
      "science"
    ],
    "cardNumber": "UX00",
    "expansion": "underworld"
  },
  "Star Vegas": {
    "name": "Star Vegas",
    "type": "automated",
    "cost": 32,
    "tags": [
      "crime",
      "space",
      "city"
    ],
    "requirements": {
      "cities": 3
    },
    "cardNumber": "U053",
    "description": "Requires any 3 cities in play. Place a city on a space reserved for a different space city. ",
    "expansion": "underworld"
  },
  "Stem Field Subsidies": {
    "name": "Stem Field Subsidies",
    "type": "active",
    "cost": 10,
    "tags": [
      "science"
    ],
    "resourceType": "Data",
    "cardNumber": "U043",
    "expansion": "underworld"
  },
  "Sting Operation": {
    "name": "Sting Operation",
    "type": "event",
    "cost": 14,
    "tags": [
      "earth"
    ],
    "vp": {
      "type": "special"
    },
    "behavior": {
      "drawCard": 2
    },
    "cardNumber": "U094",
    "expansion": "underworld"
  },
  "Subnautic Pirates": {
    "name": "Subnautic Pirates",
    "type": "event",
    "cost": 1,
    "tags": [
      "crime"
    ],
    "requirements": {
      "undergroundTokens": 1,
      "corruption": 1
    },
    "cardNumber": "U011",
    "description": "Requires you have 1 corruption and 1 underground token. ",
    "expansion": "underworld"
  },
  "Subterranean Sea": {
    "name": "Subterranean Sea",
    "type": "automated",
    "cost": 10,
    "tags": [
      "building"
    ],
    "cardNumber": "U015",
    "description": "Place an ocean tile ON AN AREA NOT RESERVED FOR OCEAN where you have an excavation marker.",
    "expansion": "underworld"
  },
  "Thiolava Vents": {
    "name": "Thiolava Vents",
    "type": "active",
    "cost": 13,
    "tags": [
      "microbe"
    ],
    "requirements": {
      "oceans": 1
    },
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "behavior": {
      "production": {
        "heat": 2
      },
      "addResources": 2
    },
    "resourceType": "Microbe",
    "cardNumber": "U090",
    "description": "Requires an ocean. Increase your heat production 2 steps. ",
    "expansion": "underworld"
  },
  "Titan Manufacturing Colony": {
    "name": "Titan Manufacturing Colony",
    "type": "active",
    "cost": 18,
    "tags": [
      "jovian",
      "space",
      "building"
    ],
    "resourceType": "Tool",
    "cardNumber": "U044",
    "expansion": "underworld"
  },
  "Tunnel Boring Machine": {
    "name": "Tunnel Boring Machine",
    "type": "active",
    "cost": 10,
    "tags": [
      "building"
    ],
    "cardNumber": "U003",
    "expansion": "underworld"
  },
  "Tunneling Loophole": {
    "name": "Tunneling Loophole",
    "type": "event",
    "cost": 8,
    "requirements": {
      "tag": "earth"
    },
    "vp": {
      "type": "static",
      "vp": -1
    },
    "cardNumber": "U032",
    "description": "Requires 1 Earth tag. Until the end of this generation, ",
    "expansion": "underworld"
  },
  "Tunneling Operation": {
    "name": "Tunneling Operation",
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 2
      }
    },
    "cardNumber": "UP05",
    "description": "Identify 1 underground resource. Then excavate 2 underground resources. Increase your steel production 2 steps.",
    "expansion": "underworld"
  },
  "Tunneling Subcontractor": {
    "name": "Tunneling Subcontractor",
    "type": "automated",
    "cost": 9,
    "tags": [
      "crime"
    ],
    "cardNumber": "U018",
    "description": "Gain 1 corruption. Excavate an underground resource.",
    "expansion": "underworld"
  },
  "Underground Amusement Park": {
    "name": "Underground Amusement Park",
    "type": "automated",
    "cost": 5,
    "tags": [
      "building"
    ],
    "requirements": {
      "undergroundTokens": 1
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "production": {
        "megacredits": 1
      }
    },
    "cardNumber": "U019",
    "description": "Requires you have 1 underground token. Increase your M€ production 1 step.",
    "expansion": "underworld"
  },
  "Underground Habitat": {
    "name": "Underground Habitat",
    "type": "automated",
    "cost": 12,
    "tags": [
      "building",
      "plant",
      "animal"
    ],
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "U071",
    "description": "Excavate an underground resource. Increase your plant production 1 step. Add 1 animal on another card.",
    "expansion": "underworld"
  },
  "Underground Railway": {
    "name": "Underground Railway",
    "type": "automated",
    "cost": 18,
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -1
      }
    },
    "cardNumber": "U004",
    "description": "Decrease your energy production 1 step. Gain 1 TR for every 4 underground tokens you have.",
    "expansion": "underworld"
  },
  "Underground Research Center": {
    "name": "Underground Research Center",
    "type": "automated",
    "cost": 12,
    "tags": [
      "wild",
      "building"
    ],
    "requirements": {
      "undergroundTokens": 4
    },
    "cardNumber": "U062",
    "description": "Requires you have 4 underground tokens. ",
    "expansion": "underworld"
  },
  "Underground Settlement": {
    "name": "Underground Settlement",
    "tags": [
      "city",
      "building"
    ],
    "cardNumber": "UP07",
    "description": "Place a city. Then identify the underground resources in all adjacent spaces. Claim 1 of them.",
    "expansion": "underworld"
  },
  "Underground Shelters": {
    "name": "Underground Shelters",
    "type": "active",
    "cost": 14,
    "tags": [
      "building"
    ],
    "vp": {
      "type": "special"
    },
    "cardNumber": "U072",
    "description": "Excavate an underground resource.",
    "expansion": "underworld"
  },
  "Underground Smuggling Ring": {
    "name": "Underground Smuggling Ring",
    "type": "automated",
    "cost": 7,
    "tags": [
      "crime"
    ],
    "requirements": {
      "undergroundTokens": 1
    },
    "cardNumber": "U028",
    "description": "Requires you have 1 underground token. Gain 1 corruption and 2 of the same standard resource.",
    "expansion": "underworld"
  },
  "Voltagon": {
    "name": "Voltagon",
    "tags": [
      "power"
    ],
    "behavior": {
      "production": {
        "energy": 1
      }
    },
    "action": {
      "global": {
        "oxygen": 1
      }
    },
    "cardNumber": "UC09",
    "description": "You start with 38 M€ and 1 energy production.",
    "expansion": "underworld"
  },
  "Voltaic Metallurgy": {
    "name": "Voltaic Metallurgy",
    "type": "active",
    "cost": 8,
    "tags": [
      "science",
      "power"
    ],
    "requirements": {
      "count": 1,
      "tag": "science"
    },
    "cardNumber": "U076",
    "description": "Requires 1 science tag.",
    "expansion": "underworld"
  },
  "Volunteer Mining Initiative": {
    "name": "Volunteer Mining Initiative",
    "type": "event",
    "cost": 12,
    "tags": [],
    "cardNumber": "U073",
    "description": "Excavate 1 underground resource for every 3 cities in play.",
    "expansion": "underworld"
  },
  "Whales": {
    "name": "Whales",
    "type": "active",
    "cost": 10,
    "tags": [
      "animal"
    ],
    "requirements": {
      "oceans": 6
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "resourceType": "Animal",
    "cardNumber": "U088",
    "description": "Requires 6 oceans. 1 VP for each animal on this card.",
    "expansion": "underworld"
  },
  "Aerial Mappers": {
    "name": "Aerial Mappers",
    "type": "active",
    "cost": 11,
    "tags": [
      "venus"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "action": {
      "drawCard": 1
    },
    "resourceType": "Floater",
    "cardNumber": "213",
    "expansion": "venus"
  },
  "Aerosport Tournament": {
    "name": "Aerosport Tournament",
    "type": "event",
    "cost": 7,
    "requirements": {
      "floaters": 5
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "214",
    "description": "Requires that you have 5 floaters. Gain 1 M€ per each city tile in play.",
    "expansion": "venus"
  },
  "Air-Scrapping Expedition": {
    "name": "Air-Scrapping Expedition",
    "type": "event",
    "cost": 13,
    "tags": [
      "venus"
    ],
    "behavior": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "215",
    "description": "Raise Venus 1 step. Add 3 floaters to ANY Venus CARD.",
    "expansion": "venus"
  },
  "Air Scrapping (Var)": {
    "name": "Air Scrapping (Var)",
    "cost": 15,
    "cardNumber": "SP1a",
    "expansion": "venus"
  },
  "Aphrodite": {
    "name": "Aphrodite",
    "tags": [
      "plant",
      "venus"
    ],
    "behavior": {
      "production": {
        "plants": 1
      }
    },
    "cardNumber": "R01",
    "description": "You start with 1 plant production and 47 M€.",
    "expansion": "venus"
  },
  "Atalanta Planitia Lab": {
    "name": "Atalanta Planitia Lab",
    "type": "automated",
    "cost": 10,
    "tags": [
      "venus",
      "science"
    ],
    "requirements": {
      "count": 3,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "drawCard": 2
    },
    "cardNumber": "216",
    "description": "Requires 3 science tags. Draw 2 cards.",
    "expansion": "venus"
  },
  "Atmoscoop": {
    "name": "Atmoscoop",
    "type": "automated",
    "cost": 22,
    "tags": [
      "jovian",
      "space"
    ],
    "requirements": {
      "count": 3,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "217",
    "description": "Requires 3 science tags. Either raise the temperature 2 steps, or raise Venus 2 steps. Add 2 floaters to ANY card.",
    "expansion": "venus"
  },
  "Celestic": {
    "name": "Celestic",
    "type": "cardresource.floater",
    "tags": [
      "venus"
    ],
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "resourceType": "Floater",
    "cardNumber": "R05",
    "description": "You start with 42 M€. As your first action, reveal cards from the deck until you have revealed 2 cards with a floater icon on it. Take them into hand and discard the rest.",
    "expansion": "venus"
  },
  "Comet for Venus": {
    "name": "Comet for Venus",
    "type": "event",
    "cost": 11,
    "tags": [
      "space"
    ],
    "behavior": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "218",
    "description": "Raise Venus 1 step. Remove up to 4M€ from any player WITH A VENUS TAG IN PLAY.",
    "expansion": "venus"
  },
  "Corroder Suits": {
    "name": "Corroder Suits",
    "type": "automated",
    "cost": 8,
    "tags": [
      "venus"
    ],
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "219",
    "description": "Increase your M€ production 2 steps. Add 1 resource to ANY Venus CARD.",
    "expansion": "venus"
  },
  "Dawn City": {
    "name": "Dawn City",
    "type": "automated",
    "cost": 15,
    "tags": [
      "city",
      "space"
    ],
    "requirements": {
      "count": 4,
      "tag": "science"
    },
    "vp": {
      "type": "static",
      "vp": 3
    },
    "behavior": {
      "production": {
        "energy": -1,
        "titanium": 1
      },
      "city": true
    },
    "cardNumber": "220",
    "description": "Requires 4 science tags. Decrease your energy production 1 step. Increase your titanium production 1 step. Place a city tile on the RESERVED AREA.",
    "expansion": "venus"
  },
  "Deuterium Export": {
    "name": "Deuterium Export",
    "type": "active",
    "cost": 11,
    "tags": [
      "space",
      "venus",
      "power"
    ],
    "action": {
      "addResources": 1,
      "production": {
        "energy": 1
      }
    },
    "resourceType": "Floater",
    "cardNumber": "221",
    "expansion": "venus"
  },
  "Dirigibles": {
    "name": "Dirigibles",
    "type": "active",
    "cost": 11,
    "tags": [
      "venus"
    ],
    "resourceType": "Floater",
    "cardNumber": "222",
    "expansion": "venus"
  },
  "Extractor Balloons": {
    "name": "Extractor Balloons",
    "type": "active",
    "cost": 21,
    "tags": [
      "venus"
    ],
    "behavior": {
      "addResources": 3
    },
    "resourceType": "Floater",
    "cardNumber": "223",
    "description": "Add 3 floaters to this card",
    "expansion": "venus"
  },
  "Extremophiles": {
    "name": "Extremophiles",
    "type": "active",
    "cost": 3,
    "tags": [
      "venus",
      "microbe"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "resourceType": "Microbe",
    "cardNumber": "224",
    "description": "Requires 2 science tags.",
    "expansion": "venus"
  },
  "Floating Habs": {
    "name": "Floating Habs",
    "type": "active",
    "cost": 5,
    "tags": [
      "venus"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "resourceType": "Floater",
    "cardNumber": "225",
    "description": "Requires 2 science tags.",
    "expansion": "venus"
  },
  "Forced Precipitation": {
    "name": "Forced Precipitation",
    "type": "active",
    "cost": 8,
    "tags": [
      "venus"
    ],
    "resourceType": "Floater",
    "cardNumber": "226",
    "expansion": "venus"
  },
  "Freyja Biodomes": {
    "name": "Freyja Biodomes",
    "type": "automated",
    "cost": 14,
    "tags": [
      "plant",
      "venus"
    ],
    "requirements": {
      "venus": 10
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "production": {
        "energy": -1,
        "megacredits": 2
      }
    },
    "cardNumber": "227",
    "description": "Requires 10% on the Venus track. Add 2 microbes or 2 animals to another Venus card. Production: energy -1, M€ +2.",
    "expansion": "venus"
  },
  "GHG Import From Venus": {
    "name": "GHG Import From Venus",
    "type": "event",
    "cost": 23,
    "tags": [
      "space",
      "venus"
    ],
    "behavior": {
      "production": {
        "heat": 3
      },
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "228",
    "description": "Raise Venus 1 step. Increase your heat production 3 steps.",
    "expansion": "venus"
  },
  "Giant Solar Shade": {
    "name": "Giant Solar Shade",
    "type": "automated",
    "cost": 27,
    "tags": [
      "space",
      "venus"
    ],
    "behavior": {
      "global": {
        "venus": 3
      }
    },
    "cardNumber": "229",
    "description": "Raise Venus 3 steps.",
    "expansion": "venus"
  },
  "Gyropolis": {
    "name": "Gyropolis",
    "type": "automated",
    "cost": 20,
    "tags": [
      "city",
      "building"
    ],
    "behavior": {
      "production": {
        "energy": -2
      },
      "city": true
    },
    "cardNumber": "230",
    "description": "Decrease your energy production 2 steps. Increase your M€ production 1 step for each Venus and Earth tag you have. Place a city tile.",
    "expansion": "venus"
  },
  "Hydrogen to Venus": {
    "name": "Hydrogen to Venus",
    "type": "event",
    "cost": 11,
    "tags": [
      "space"
    ],
    "behavior": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "231",
    "description": "Raise Venus 1 step. Add 1 floater to A VENUS CARD for each Jovian tag you have.",
    "expansion": "venus"
  },
  "Io Sulphur Research": {
    "name": "Io Sulphur Research",
    "type": "automated",
    "cost": 17,
    "tags": [
      "science",
      "jovian"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "232",
    "description": "Draw 1 card, or draw 3 if you have at least 3 Venus tags.",
    "expansion": "venus"
  },
  "Ishtar Mining": {
    "name": "Ishtar Mining",
    "type": "automated",
    "cost": 5,
    "tags": [
      "venus"
    ],
    "requirements": {
      "venus": 8
    },
    "behavior": {
      "production": {
        "titanium": 1
      }
    },
    "cardNumber": "233",
    "description": "Requires Venus 8%. Increase your titanium production 1 step.",
    "expansion": "venus"
  },
  "Jet Stream Microscrappers": {
    "name": "Jet Stream Microscrappers",
    "type": "active",
    "cost": 12,
    "tags": [
      "venus"
    ],
    "resourceType": "Floater",
    "cardNumber": "234",
    "expansion": "venus"
  },
  "Local Shading": {
    "name": "Local Shading",
    "type": "active",
    "cost": 4,
    "tags": [
      "venus"
    ],
    "action": {
      "addResources": 1,
      "production": {
        "megacredits": 1
      }
    },
    "resourceType": "Floater",
    "cardNumber": "235",
    "expansion": "venus"
  },
  "Luna Metropolis": {
    "name": "Luna Metropolis",
    "type": "automated",
    "cost": 21,
    "tags": [
      "city",
      "space",
      "earth"
    ],
    "vp": {
      "type": "static",
      "vp": 2
    },
    "behavior": {
      "city": true
    },
    "cardNumber": "236",
    "description": "Increase your M€ production 1 step for each Earth tag you have, including this. Place a city tile on the RESERVED AREA.",
    "expansion": "venus"
  },
  "Luxury Foods": {
    "name": "Luxury Foods",
    "type": "automated",
    "cost": 8,
    "requirements": {
      "tag": "jovian"
    },
    "vp": {
      "type": "static",
      "vp": 2
    },
    "cardNumber": "237",
    "description": "Requires that you have a Venus tag, an Earth tag and a Jovian tag.",
    "expansion": "venus"
  },
  "Manutech": {
    "name": "Manutech",
    "tags": [
      "building"
    ],
    "behavior": {
      "production": {
        "steel": 1
      }
    },
    "cardNumber": "R23",
    "description": "You start with 1 steel production, and 35 M€.",
    "expansion": "venus"
  },
  "Maxwell Base": {
    "name": "Maxwell Base",
    "type": "active",
    "cost": 18,
    "tags": [
      "city",
      "venus"
    ],
    "requirements": {
      "venus": 12
    },
    "vp": {
      "type": "static",
      "vp": 3
    },
    "behavior": {
      "production": {
        "energy": -1
      },
      "city": true
    },
    "cardNumber": "238",
    "description": "Requires Venus 12%. Decrease your energy production 1 step. Place a city tile ON THE RESERVED AREA.",
    "expansion": "venus"
  },
  "Mining Quota": {
    "name": "Mining Quota",
    "type": "automated",
    "cost": 5,
    "tags": [
      "building"
    ],
    "requirements": {
      "tag": "jovian"
    },
    "behavior": {
      "production": {
        "steel": 2
      }
    },
    "cardNumber": "239",
    "description": "Requires Venus, Earth and Jovian tags. Increase your steel production 2 steps.",
    "expansion": "venus"
  },
  "Morning Star Inc.": {
    "name": "Morning Star Inc.",
    "tags": [
      "venus"
    ],
    "cardNumber": "R06",
    "description": "You start with 50 M€. As your first action, reveal cards from the deck until you have revealed 3 Venus-tag cards. Take those into hand and discard the rest.",
    "expansion": "venus"
  },
  "Neutralizer Factory": {
    "name": "Neutralizer Factory",
    "type": "automated",
    "cost": 7,
    "tags": [
      "venus"
    ],
    "requirements": {
      "venus": 10
    },
    "behavior": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "240",
    "description": "Requires Venus 10%. Increase the Venus track 1 step.",
    "expansion": "venus"
  },
  "Omnicourt": {
    "name": "Omnicourt",
    "type": "automated",
    "cost": 11,
    "tags": [
      "building"
    ],
    "requirements": {
      "tag": "jovian"
    },
    "behavior": {
      "tr": 2
    },
    "cardNumber": "241",
    "description": "Requires Venus, Earth and Jovian tags. Increase your TR 2 steps.",
    "expansion": "venus"
  },
  "Orbital Reflectors": {
    "name": "Orbital Reflectors",
    "type": "automated",
    "cost": 26,
    "tags": [
      "venus",
      "space"
    ],
    "behavior": {
      "production": {
        "heat": 2
      },
      "global": {
        "venus": 2
      }
    },
    "cardNumber": "242",
    "description": "Raise Venus 2 steps. Increase your heat production 2 steps.",
    "expansion": "venus"
  },
  "Rotator Impacts": {
    "name": "Rotator Impacts",
    "type": "active",
    "cost": 6,
    "tags": [
      "space"
    ],
    "requirements": {
      "venus": 14
    },
    "resourceType": "Asteroid",
    "cardNumber": "243",
    "description": "Venus must be 14% or lower",
    "expansion": "venus"
  },
  "Sister Planet Support": {
    "name": "Sister Planet Support",
    "type": "automated",
    "cost": 7,
    "tags": [
      "venus",
      "earth"
    ],
    "requirements": {
      "tag": "earth"
    },
    "behavior": {
      "production": {
        "megacredits": 3
      }
    },
    "cardNumber": "244",
    "description": "Requires Venus and Earth tags. Increase your M€ production 3 steps.",
    "expansion": "venus"
  },
  "Solarnet": {
    "name": "Solarnet",
    "type": "automated",
    "cost": 7,
    "requirements": {
      "tag": "jovian"
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "drawCard": 2
    },
    "cardNumber": "245",
    "description": "Requires Venus, Earth and Jovian tags. Draw 2 cards.",
    "expansion": "venus"
  },
  "Spin-Inducing Asteroid": {
    "name": "Spin-Inducing Asteroid",
    "type": "event",
    "cost": 16,
    "tags": [
      "space"
    ],
    "requirements": {
      "venus": 10
    },
    "behavior": {
      "global": {
        "venus": 2
      }
    },
    "cardNumber": "246",
    "description": "Venus must be 10% or lower. Raise Venus 2 steps.",
    "expansion": "venus"
  },
  "Sponsored Academies": {
    "name": "Sponsored Academies",
    "type": "automated",
    "cost": 9,
    "tags": [
      "earth",
      "science"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardNumber": "247",
    "description": "Discard 1 card from your hand and THEN draw 3 cards. All OPPONENTS draw 1 card.",
    "expansion": "venus"
  },
  "Stratopolis": {
    "name": "Stratopolis",
    "type": "active",
    "cost": 22,
    "tags": [
      "city",
      "venus"
    ],
    "requirements": {
      "count": 2,
      "tag": "science"
    },
    "vp": {
      "type": "per_resource",
      "per": 3
    },
    "behavior": {
      "production": {
        "megacredits": 2
      },
      "city": true
    },
    "resourceType": "Floater",
    "cardNumber": "248",
    "description": "Requires 2 science tags. Increase your M€ production 2 steps. Place a city tile ON THE RESERVED AREA",
    "expansion": "venus"
  },
  "Stratospheric Birds": {
    "name": "Stratospheric Birds",
    "type": "active",
    "cost": 12,
    "tags": [
      "venus",
      "animal"
    ],
    "requirements": {
      "venus": 12
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Animal",
    "cardNumber": "249",
    "description": "Requires Venus 12% and that you spend 1 floater from any card.",
    "expansion": "venus"
  },
  "Sulphur-Eating Bacteria": {
    "name": "Sulphur-Eating Bacteria",
    "type": "active",
    "cost": 6,
    "tags": [
      "venus",
      "microbe"
    ],
    "requirements": {
      "venus": 6
    },
    "resourceType": "Microbe",
    "cardNumber": "251",
    "description": "Requires Venus 6%",
    "expansion": "venus"
  },
  "Sulphur Exports": {
    "name": "Sulphur Exports",
    "type": "automated",
    "cost": 21,
    "tags": [
      "venus",
      "space"
    ],
    "behavior": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "250",
    "description": "Increase Venus 1 step. Increase your M€ production 1 step for each Venus tag you have, including this.",
    "expansion": "venus"
  },
  "Terraforming Contract": {
    "name": "Terraforming Contract",
    "type": "automated",
    "cost": 8,
    "tags": [
      "earth"
    ],
    "requirements": {
      "tr": 25
    },
    "behavior": {
      "production": {
        "megacredits": 4
      }
    },
    "cardNumber": "252",
    "description": "Requires that you have at least 25 TR. Increase your M€ production 4 steps.",
    "expansion": "venus"
  },
  "Thermophiles": {
    "name": "Thermophiles",
    "type": "active",
    "cost": 9,
    "tags": [
      "venus",
      "microbe"
    ],
    "requirements": {
      "venus": 6
    },
    "action": {
      "global": {
        "venus": 1
      }
    },
    "resourceType": "Microbe",
    "cardNumber": "253",
    "description": "Requires Venus 6%",
    "expansion": "venus"
  },
  "Venus Governor": {
    "name": "Venus Governor",
    "type": "automated",
    "cost": 4,
    "tags": [
      "venus",
      "venus"
    ],
    "requirements": {
      "count": 2,
      "tag": "venus"
    },
    "behavior": {
      "production": {
        "megacredits": 2
      }
    },
    "cardNumber": "255",
    "description": "Requires 2 Venus tags. Increase your M€ production 2 steps.",
    "expansion": "venus"
  },
  "Venusian Animals": {
    "name": "Venusian Animals",
    "type": "active",
    "cost": 15,
    "tags": [
      "venus",
      "animal",
      "science"
    ],
    "requirements": {
      "venus": 18
    },
    "vp": {
      "type": "per_resource",
      "per": 1
    },
    "resourceType": "Animal",
    "cardNumber": "259",
    "description": "Requires Venus 18%",
    "expansion": "venus"
  },
  "Venusian Insects": {
    "name": "Venusian Insects",
    "type": "active",
    "cost": 5,
    "tags": [
      "venus",
      "microbe"
    ],
    "requirements": {
      "venus": 12
    },
    "vp": {
      "type": "per_resource",
      "per": 2
    },
    "action": {
      "addResources": 1
    },
    "resourceType": "Microbe",
    "cardNumber": "260",
    "description": "Requires Venus 12%.",
    "expansion": "venus"
  },
  "Venusian Plants": {
    "name": "Venusian Plants",
    "type": "automated",
    "cost": 13,
    "tags": [
      "venus",
      "plant"
    ],
    "requirements": {
      "venus": 16
    },
    "vp": {
      "type": "static",
      "vp": 1
    },
    "behavior": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "261",
    "description": "Requires Venus 16%. Raise Venus 1 step. Add 1 microbe or 1 animal to ANOTHER VENUS CARD",
    "expansion": "venus"
  },
  "Venus Magnetizer": {
    "name": "Venus Magnetizer",
    "type": "active",
    "cost": 7,
    "tags": [
      "venus"
    ],
    "requirements": {
      "venus": 10
    },
    "action": {
      "production": {
        "energy": -1
      },
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "256",
    "description": "Requires Venus 10%.",
    "expansion": "venus"
  },
  "Venus Soils": {
    "name": "Venus Soils",
    "type": "automated",
    "cost": 20,
    "tags": [
      "venus",
      "plant"
    ],
    "behavior": {
      "production": {
        "plants": 1
      },
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "257",
    "description": "Raise Venus 1 step. Increase your plant production 1 step. Add 2 microbes to ANOTHER card",
    "expansion": "venus"
  },
  "Venus Waystation": {
    "name": "Venus Waystation",
    "type": "active",
    "cost": 9,
    "tags": [
      "venus",
      "space"
    ],
    "vp": {
      "type": "static",
      "vp": 1
    },
    "cardDiscount": {
      "amount": 2,
      "tag": "venus"
    },
    "cardNumber": "258",
    "expansion": "venus"
  },
  "Viron": {
    "name": "Viron",
    "tags": [
      "microbe"
    ],
    "cardNumber": "R12",
    "description": "You start with 48 M€.",
    "expansion": "venus"
  },
  "Water to Venus": {
    "name": "Water to Venus",
    "type": "event",
    "cost": 9,
    "tags": [
      "space"
    ],
    "behavior": {
      "global": {
        "venus": 1
      }
    },
    "cardNumber": "254",
    "description": "Raise Venus 1 step.",
    "expansion": "venus"
  }
};
if (typeof module !== 'undefined') module.exports = CARD_DATA;
