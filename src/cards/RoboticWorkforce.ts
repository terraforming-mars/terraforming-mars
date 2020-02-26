
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";

// Cards with building tags and production boxes
import { AICentral } from "./AICentral";
import { BiomassCombustors } from "./BiomassCombustors";
import { BuildingIndustries } from "./BuildingIndustries";
import { Capital } from "./Capital";
import { CarbonateProcessing } from "./CarbonateProcessing";
import { CommercialDistrict } from "./CommercialDistrict";
import { CorporateStronghold } from "./CorporateStronghold";
import { CupolaCity } from "./CupolaCity";
import { DeepWellHeating } from "./DeepWellHeating";
import { DomedCrater } from "./DomedCrater";
import { ElectroCatapult } from "./ElectroCatapult";
import { EosChasmaNationalPark } from "./EOSChasmaNationalPark";
import { FoodFactory } from "./FoodFactory";
import { FueledGenerators } from "./FueledGenerators";
import { FuelFactory } from "./FuelFactory";
import { FusionPower } from "./FusionPower";
import { GeothermalPower } from "./GeothermalPower";
import { GHGFactories } from "./GHGFactories";
import { GreatDam } from "./GreatDam";
import { HeatTrappers } from "./HeatTrappers";
import { ImmigrantCity } from "./ImmigrantCity";
import { IndustrialMicrobes } from "./IndustrialMicrobes";
import { MagneticFieldDome } from "./MagneticFieldDome";
import { MagneticFieldGenerators } from "./MagneticFieldGenerators";
import { MedicalLab } from "./MedicalLab";
import { Mine } from "./Mine";
import { MoholeArea } from "./MoholeArea";
import { NaturalPreserve } from "./NaturalPreserve";
import { NoctisCity } from "./NoctisCity";
import { NoctisFarming } from "./NoctisFarming";
import { NuclearPower } from "./NuclearPower"
import { OpenCity } from "./OpenCity";
import { PeroxidePower } from "./PeroxidePower";
import { PowerPlant } from "./PowerPlant";
import { ProtectedValley } from "./ProtectedValley";
import { RadChemFactory } from "./RadChemFactory";
import { SoilFactory } from "./SoilFactory";
import { SolarPower } from "./SolarPower";
import { SpaceElevator } from "./SpaceElevator";
import { StripMine } from "./StripMine";
import { TectonicStressPower } from "./TectonicStressPower";
import { TitaniumMine } from "./TitaniumMine";
import { TropicalResort } from "./TropicalResort"
import { UndergroundCity } from "./UndergroundCity";
import { UrbanizedArea } from "./UrbanizedArea";
import { Windmills } from "./Windmills";
//Prelude cards
import { HousePrinting } from "./prelude/HousePrinting";
import { LavaTubeSettlement } from "./prelude/LavaTubeSettlement";
import { Resources } from '../Resources';
import { SpacePort } from './colonies/SpacePort';
import { CardName } from '../CardName';
import { MiningArea } from './MiningArea';
import { MiningRights } from './MiningRights';
import { MiningQuota } from './venusNext/MiningQuota';
import { Gyropolis } from './venusNext/Gyropolis';
import { DomeFarming } from './prelude/DomeFarming';
import { EarlySettlement } from './prelude/EarlySettlement';
import { MartianIndustries } from './prelude/MartianIndustries';
import { MiningOperations } from './prelude/MiningOperations';
import { Mohole } from './prelude/Mohole';
import { MoholeExcavation } from './prelude/MoholeExcavation';
import { PolarIndustries } from './prelude/PolarIndustries';
import { SelfSufficientSettlement } from './prelude/SelfSufficientSettlement';

export class RoboticWorkforce implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Robotic Workforce";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return this.getAvailableCards(player, game).length > 0;
    }
    private miningSteelProduction: number = 0;
    private miningTitaniumProduction: number = 0;

    private getAvailableCards(player: Player, game: Game): Array<IProjectCard> {
        const builderCards: Array<IProjectCard> = [
            new AICentral(),
            new BiomassCombustors(),
            new BuildingIndustries(),
            new Capital(),
            new DomeFarming(),
            new EarlySettlement(),
            new MartianIndustries(),
            new MiningOperations(),
            new Mohole(),
            new MoholeExcavation(),
            new PolarIndustries(),
            new SelfSufficientSettlement(),
            new CarbonateProcessing(),
            new CommercialDistrict(),
            new CorporateStronghold(),
            new CupolaCity(),
            new DeepWellHeating(),
            new DomedCrater(),
            new ElectroCatapult(),
            new EosChasmaNationalPark(),
            new FoodFactory(),
            new FueledGenerators(),
            new FuelFactory(),
            new FusionPower(),
            new GeothermalPower(),
            new GHGFactories(),
            new GreatDam(),
            new Gyropolis(),
            new HeatTrappers(),
            new ImmigrantCity(),
            new IndustrialMicrobes(),
            new MagneticFieldDome(),
            new MagneticFieldGenerators(),
            new MedicalLab(),
            new Mine(),
            new MiningArea(),
            new MiningQuota(),
            new MiningRights(),
            new MoholeArea(),
            new NaturalPreserve(),
            new NoctisCity(),
            new NoctisFarming(),
            new NuclearPower(),
            new OpenCity(),
            new PeroxidePower(),
            new PowerPlant(),
            new ProtectedValley(),
            new RadChemFactory(),
            new SoilFactory(),
            new SolarPower(),
            new SpaceElevator(),
            new StripMine(),
            new TectonicStressPower(),
            new TitaniumMine(),
            new TropicalResort(),
            new UndergroundCity(),
            new UrbanizedArea(),
            new Windmills(),
            new HousePrinting(),
            new LavaTubeSettlement(),
            new SpacePort()
        ];
        const availableCards = player.playedCards.filter((card) => {
            for (let i = 0; i < builderCards.length; i++) {
                if (builderCards[i].name === card.name  && card.name === CardName.BIOMASS_COMBUSTORS) {
                    if (game.getPlayers().length == 1 || game.getPlayers().filter((p) => p.getProduction(Resources.PLANTS) > 0).length > 0) {
                        return true;
                    }
                } else if (builderCards[i].name === card.name  && card.name === CardName.MAGNETIC_FIELD_GENERATORS) {
                    if (player.getProduction(Resources.ENERGY) >= 4) {
                        return true;
                    }
                } else if (builderCards[i].name === card.name  
                    && (card.name === CardName.GYROPOLIS
                        || card.name === CardName.STRIP_MINE
                        || card.name === CardName.CAPITAL
                        || card.name === CardName.MAGNETIC_FIELD_DOME
                        || card.name === CardName.UNDERGROUND_CITY
                        )
                ) {
                    if (player.getProduction(Resources.ENERGY) >= 2) {
                        return true;
                    }
                } else if (builderCards[i].name === card.name  
                    && (card.name === CardName.AI_CENTRAL
                        || card.name === CardName.BUILDING_INDUSTRIES
                        || card.name === CardName.CABONATE_PROCESSING
                        || card.name === CardName.COMMERCIAL_DISTRICT
                        || card.name === CardName.CORPORATE_STRONGHOLD
                        || card.name === CardName.DOMED_CREATER
                        || card.name === CardName.ELECTRO_CATAPULT
                        || card.name === CardName.FUEL_FACTORY
                        || card.name === CardName.GHG_FACTORIES
                        || card.name === CardName.IMMIGRANT_CITY
                        || card.name === CardName.NOCTIS_CITY
                        || card.name === CardName.OPEN_CITY
                        || card.name === CardName.RAD_CHEM_FACTORY
                        || card.name === CardName.SOIL_FACTORY
                        || card.name === CardName.UNDERGROUND_CITY
                        || card.name === CardName.URBANIZED_AREA
                        || card.name === CardName.LAVA_TUBE_SETTLEMENT
                        )
                ) {
                    if (player.getProduction(Resources.ENERGY) >= 1) {
                        return true;
                    }

                } else if (builderCards[i].name === card.name  && card.name === CardName.HEAT_TRAPPERS) {
                    if (game.getPlayers().length == 1 || game.getPlayers().filter((p) => p.getProduction(Resources.HEAT) >= 2).length > 0) {
                        return true;
                    }    
                } else if (builderCards[i].name === card.name) {
                    return true;
                }
            }
            return false;
        });
        return availableCards;
    }

    public play(player: Player, game: Game) {
        const availableCards = this.getAvailableCards(player, game);
        if (availableCards.length === 0) {
            return undefined;
        }

        return new SelectCard("Select builder card to copy", availableCards, (selectedCards: Array<IProjectCard>) => {
                const foundCard: IProjectCard = selectedCards[0];
                // this cards require additional user input
                if (foundCard.name === CardName.BIOMASS_COMBUSTORS) {
                    player.setProduction(Resources.ENERGY,2);
                    game.addResourceProductionDecreaseInterrupt(player, Resources.PLANTS, 1);
                    return undefined;
                }
                if (foundCard.name === CardName.HEAT_TRAPPERS) {
                    player.setProduction(Resources.ENERGY,1);
                    game.addResourceProductionDecreaseInterrupt(player, Resources.HEAT, 2);
                    return undefined;
                }

                // Mining resource definition
                if (foundCard.name === CardName.MINING_AREA || foundCard.name === CardName.MINING_RIGHTS ) {
                    if (foundCard.bonusResource !== undefined && foundCard.bonusResource === Resources.STEEL) {
                        this.miningSteelProduction++;
                    }
                    if (foundCard.bonusResource !== undefined && foundCard.bonusResource === Resources.TITANIUM) {
                        this.miningTitaniumProduction++;
                    }
                }    

                class Updater {
                    constructor (
                        public energyProduction: number,
                        public megaCreditProduction: number,
                        public steelProduction: number,
                        public titaniumProduction: number,
                        public plantProduction: number,
                        public heatProduction: number) {}
                }

                const updater = {
                    [new DomeFarming().name]: new Updater(2, 0, 0, 0, 1, 0),
                    [new EarlySettlement().name]: new Updater(0, 0, 0, 0, 1, 0),
                    [new MartianIndustries().name]: new Updater(1, 0, 1, 0, 0, 0),
                    [new MiningOperations().name]: new Updater(0, 0, 2, 0, 0, 0),
                    [new Mohole().name]: new Updater(0, 0, 0, 0, 0, 3),
                    [new MoholeExcavation().name]: new Updater(0, 0, 1, 0, 0, 2),
                    [new PolarIndustries().name]: new Updater(0, 0, 0, 0, 0, 2),
                    [new SelfSufficientSettlement().name]: new Updater(2, 0, 0, 0, 0, 0),
                    [new NoctisCity().name]: new Updater(-1, 3, 0, 0, 0, 0),
                    [new DomedCrater().name]: new Updater(-1, 3, 0, 0, 0, 0),
                    [new ElectroCatapult().name]: new Updater(-1, 0, 0, 0, 0, 0),
                    [new Windmills().name]: new Updater(1, 0, 0, 0, 0, 0),
                    [new ImmigrantCity().name]: new Updater(-1, -2, 0, 0, 0, 0),
                    [new BuildingIndustries().name]: new Updater(-1, 0, 2, 0, 0, 0),
                    [new SolarPower().name]: new Updater(1, 0, 0, 0, 0, 0),
                    [new RadChemFactory().name]: new Updater(-1, 0, 0, 0, 0, 0),
                    [new PeroxidePower().name]: new Updater(2, -1, 0, 0, 0, 0),
                    [new MedicalLab().name]: new Updater(0, Math.floor(player.getTagCount(Tags.STEEL) / 2), 0, 0, 0, 0),
                    [new GeothermalPower().name]: new Updater(2, 0, 0, 0, 0, 0),
                    [new Gyropolis().name]: new Updater(-2, player.getMultipleTagCount([Tags.VENUS, Tags.EARTH]), 0, 0, 0, 0),
                    [new AICentral().name]: new Updater(-1, 0, 0, 0, 0, 0),
                    [new Capital().name]: new Updater(-2, 5, 0, 0, 0, 0),
                    [new CupolaCity().name]: new Updater(-1, 3, 0, 0, 0, 0),
                    [new OpenCity().name]: new Updater(-1, 4, 0, 0, 0, 0),
                    [new EosChasmaNationalPark().name]: new Updater(2, 0, 0, 0, 0, 0),
                    [new StripMine().name]: new Updater(-2, 0, 2, 1, 0, 0),
                    [new MagneticFieldDome().name]: new Updater(-2, 0, 0, 0, 1, 0),
                    [new MagneticFieldGenerators().name]: new Updater(-4, 0, 0, 0, 2, 0),
                    [new MiningRights().name]: new Updater(0, 0, this.miningSteelProduction, this.miningTitaniumProduction, 0, 0),
                    [new MiningQuota().name]: new Updater(0, 0, 2, 0, 0, 0),
                    [new MiningArea().name]: new Updater(0, 0, this.miningSteelProduction, this.miningTitaniumProduction, 0, 0),
                    [new FueledGenerators().name]: new Updater(1, -1, 0, 0, 0, 0),
                    [new UrbanizedArea().name]: new Updater(-1, 2, 0, 0, 0, 0),
                    [new PowerPlant().name]: new Updater(1, 0, 0, 0, 0, 0),
                    [new TectonicStressPower().name]: new Updater(3, 0, 0, 0, 0, 0),
                    [new UndergroundCity().name]: new Updater(-2, 0, 2, 0, 0, 0),
                    [new NuclearPower().name]: new Updater(3, -2, 0, 0, 0, 0),
                    [new GHGFactories().name]: new Updater(-1, 0, 0, 0, 0, 4),
                    [new Mine().name]: new Updater(0, 0, 1, 0, 0, 0),
                    [new DeepWellHeating().name]: new Updater(1, 0, 0, 0, 0, 0),
                    [new CarbonateProcessing().name]: new Updater(-1, 0, 0, 0, 0, 3),
                    [new IndustrialMicrobes().name]: new Updater(1, 0, 1, 0, 0, 0),
                    [new CommercialDistrict().name]: new Updater(-1, 4, 0, 0, 0, 0),
                    [new TropicalResort().name]: new Updater(0, 3, 0, 0, 0, -2),
                    [new CorporateStronghold().name]: new Updater(-1, 3, 0, 0, 0, 0),
                    [new SpaceElevator().name]: new Updater(0, 0, 0, 1, 0, 0),
                    [new GreatDam().name]: new Updater(2, 0, 0, 0, 0, 0),
                    [new NoctisFarming().name]: new Updater(0, 1, 0, 0, 0, 0),
                    [new SoilFactory().name]: new Updater(-1, 0, 0, 0, 1, 0),
                    [new FoodFactory().name]: new Updater(0, 4, 0, 0, -1, 0),
                    [new TitaniumMine().name]: new Updater(0, 0, 0, 1, 0, 0),
                    [new FusionPower().name]: new Updater(3, 0, 0, 0, 0, 0),
                    [new FuelFactory().name]: new Updater(-1, 1, 0, 1, 0, 0),
                    [new ProtectedValley().name]: new Updater(0, 2, 0, 0, 0, 0),
                    [new MoholeArea().name]: new Updater(0, 0, 0, 0, 0, 4),
                    [new NaturalPreserve().name]: new Updater(1, 0, 0, 0, 0, 0),
                    [new HousePrinting().name]: new Updater(0, 0, 1, 0, 0, 0),
                    [new LavaTubeSettlement().name]: new Updater(-1, 2, 0, 0, 0, 0),
                    [new SpacePort().name]: new Updater(-1, 4, 0, 0, 0, 0)
                 }[foundCard.name];

                if (!updater) {
                    throw "Production not found for selected card";
                }

                if (player.getProduction(Resources.ENERGY) + updater.energyProduction < 0) {
                    throw "not enough energy production";
                }
                if (player.getProduction(Resources.TITANIUM) + updater.titaniumProduction < 0) {
                    throw "not enough titanium production";
                }
                if (player.getProduction(Resources.PLANTS) + updater.plantProduction < 0) {
                    throw "not enough plant production";
                }
                if (player.getProduction(Resources.HEAT) + updater.heatProduction < 0) {
                    throw "not enough heat production";
                }

                player.setProduction(Resources.ENERGY,updater.energyProduction);
                player.setProduction(Resources.MEGACREDITS,updater.megaCreditProduction);
                player.setProduction(Resources.STEEL,updater.steelProduction);
                player.setProduction(Resources.TITANIUM,updater.titaniumProduction);
                player.setProduction(Resources.PLANTS,updater.plantProduction);
                player.setProduction(Resources.HEAT,updater.heatProduction);

               return undefined;
            });
    }
}
