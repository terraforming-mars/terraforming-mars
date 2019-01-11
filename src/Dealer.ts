
import { AerobrakedAmmoniaAsteroid } from "./cards/AerobrakedAmmoniaAsteroid";
import { AntiGravityTechnology } from "./cards/AntiGravityTechnology";
import { AquiferPumping } from "./cards/AquiferPumping";
import { BiomassCombustors } from "./cards/BiomassCombustors";
import { Cartel } from "./cards/Cartel";
import { CEOsFavoriteProject } from "./cards/CEOsFavoriteProject";
import { CorporateStronghold } from "./cards/CorporateStronghold";
import { EnergySaving } from "./cards/EnergySaving";
import { Flooding } from "./cards/Flooding";
import { FuelFactory } from "./cards/FuelFactory";
import { HeatTrappers } from "./cards/HeatTrappers";
import { Herbivores } from "./cards/Herbivores";
import { IceCapMelting } from "./cards/IceCapMelting";
import { ImportOfAdvancedGHG } from "./cards/ImportOfAdvancedGHG";
import { IndenturedWorkers } from "./cards/IndenturedWorkers";
import { Insects } from "./cards/Insects";
import { InventionContest } from "./cards/InventionContest";
import { LagrangeObservatory } from "./cards/LagrangeObservatory";
import { Livestock } from "./cards/Livestock";
import { LocalHeatTrapping } from "./cards/LocalHeatTrapping";
import { MagneticFieldDome } from "./cards/MagneticFieldDome";
import { MicroMills } from "./cards/MicroMills";
import { NitrophilicMoss } from "./cards/NitrophilicMoss";
import { NoctisFarming } from "./cards/NoctisFarming";
import { OlympusConference } from "./cards/OlympusConference";
import { Pets } from "./cards/Pets";
import { PermafrostExtraction } from "./cards/PermafrostExtraction";
import { Plantation } from "./cards/Plantation";
import { PowerInfrastructure } from "./cards/PowerInfrastructure";
import { ProtectedHabitats } from "./cards/ProtectedHabitats";
import { ProtectedValley } from "./cards/ProtectedValley";
import { RadSuits } from "./cards/RadSuits";
import { Satellites } from "./cards/Satellites";
import { Shuttles } from "./cards/Shuttles";
import { SoilFactory } from "./cards/SoilFactory";
import { StripMine } from "./cards/StripMine";
import { TectonicStressPower } from "./cards/TectonicStressPower";
import { TitaniumMine } from "./cards/TitaniumMine";
import { TundraFarming } from "./cards/TundraFarming";
import { WaterSplittingPlant } from "./cards/WaterSplittingPlant";
import { Windmills } from "./cards/Windmills";

import { IProjectCard } from "./cards/IProjectCard";

const ALL_CARDS: Array<IProjectCard> = [
    new AerobrakedAmmoniaAsteroid(),
    new AntiGravityTechnology(),
    new AquiferPumping(),
    new BiomassCombustors(),
    new Cartel(),
    new CEOsFavoriteProject(),
    new CorporateStronghold(),
    new EnergySaving(),
    new Flooding(),
    new FuelFactory(),
    new HeatTrappers(),
    new Herbivores(),
    new IceCapMelting(),
    new ImportOfAdvancedGHG(),
    new IndenturedWorkers(),
    new Insects(),
    new InventionContest(),
    new LagrangeObservatory(),
    new Livestock(),
    new LocalHeatTrapping(),
    new MagneticFieldDome(),
    new MicroMills(),
    new NitrophilicMoss(),
    new NoctisFarming(),
    new OlympusConference(),
    new PermafrostExtraction(),
    new Pets(),
    new Plantation(),
    new PowerInfrastructure(),
    new ProtectedHabitats(),
    new ProtectedValley(),
    new RadSuits(),
    new Satellites(),
    new Shuttles(),
    new SoilFactory(),
    new StripMine(),
    new TectonicStressPower(),
    new TitaniumMine(),
    new TundraFarming(),
    new WaterSplittingPlant(),
    new Windmills()
];

export class Dealer {
    public getCards(count: number): Array<IProjectCard> {
        return [];
    }    
}
