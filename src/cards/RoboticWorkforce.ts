
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

import { SelectCard } from "../inputs/SelectCard";
import { SelectPlayer } from "../inputs/SelectPlayer";

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
import { EOSChasmaNationalPark } from "./EOSChasmaNationalPark";
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

export class RoboticWorkforce implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Robotic Workforce";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Duplicate only the production box of one of your building cards.";
    public description: string = "Enhancing your production capacity.";
    public play(player: Player, game: Game): Promise<void> {
        const builderCards: Array<IProjectCard> = [
            new AICentral(),
            new BiomassCombustors(),
            new BuildingIndustries(),
            new Capital(),
            new CarbonateProcessing(),
            new CommercialDistrict(),
            new CorporateStronghold(),
            new CupolaCity(),
            new DeepWellHeating(),
            new DomedCrater(),
            new ElectroCatapult(),
            new EOSChasmaNationalPark(),
            new FoodFactory(),
            new FueledGenerators(),
            new FuelFactory(),
            new FusionPower(),
            new GeothermalPower(),
            new GHGFactories(),
            new GreatDam(),
            new HeatTrappers(),
            new ImmigrantCity(),
            new IndustrialMicrobes(),
            new MagneticFieldDome(),
            new MagneticFieldGenerators(),
            new MedicalLab(),
            new Mine(),
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
            new Windmills()
        ];
        const availableCards = player.playedCards.filter((card) => {
            for (let i = 0; i < builderCards.length; i++) {
                if (builderCards[i].name === card.name) {
                    return true;
                }
            }
            return false;
        });
        if (availableCards.length === 0) {
            return Promise.reject("No builder cards to duplicate");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectCard(this, "Select builder card to copy", availableCards), (options: {[x: string]: string}) => {
                const foundCard = availableCards.filter((card) => card.name === options.option1)[0];
                if (foundCard === undefined) {
                    reject("Card not found");
                    return;
                }
                // this is the only card which requires additional user input
                if (foundCard.name === new BiomassCombustors().name) {
                    player.setWaitingFor(new SelectPlayer(this, game.getPlayers()), (subOptions: {[x: string]: string}) => {
                        const foundPlayer = game.getPlayer(subOptions.option1);
                        if (foundPlayer === undefined) {
                            reject("Player not found");
                            return;
                        }
                        foundPlayer.plantProduction--;
                        player.energyProduction += 2;
                        resolve();
                    });
                    return;
                }
                // the rest can make updates synchronously
                if (foundCard.name === new NoctisCity().name || foundCard.name === new DomedCrater().name) {
                    player.energyProduction--;
                    player.megaCreditProduction += 3;
                } else if (foundCard.name === new ElectroCatapult().name) {
                    player.energyProduction--;
                } else if (foundCard.name === new Windmills().name) {
                    player.energyProduction++;
                } else if (foundCard.name === new ImmigrantCity().name) {
                    player.energyProduction--;
                    player.megaCreditProduction -= 2;
                } else if (foundCard.name === new BuildingIndustries().name) {
                    player.energyProduction--;
                    player.steelProduction += 2;
                } else if (foundCard.name === new SolarPower().name) {
                    player.energyProduction++;
                } else if (foundCard.name === new RadChemFactory().name) {
                    player.energyProduction--;
                } else if (foundCard.name === new PeroxidePower().name) {
                    player.megaCreditProduction--;
                    player.energyProduction += 2;
                } else if (foundCard.name === new MedicalLab().name) {
                    player.megaCreditProduction += Math.floor(player.getTagCount(Tags.STEEL) / 2);
                } else if (foundCard.name === new GeothermalPower().name) {
                    player.energyProduction += 2;
                } else if (foundCard.name === new AICentral().name) {
                    player.energyProduction--;
                } else if (foundCard.name === new Capital().name) {
                    player.energyProduction -= 2;
                    player.megaCreditProduction += 5;
                } else if (foundCard.name === new CupolaCity().name) {
                    player.energyProduction--;
                    player.megaCreditProduction += 3;
                } else if (foundCard.name === new OpenCity().name) {
                    player.energyProduction--;
                    player.megaCreditProduction += 4;
                } else if (foundCard.name === new EOSChasmaNationalPark().name) {
                    player.megaCreditProduction += 2;
                } else if (foundCard.name === new StripMine().name) {
                    player.energyProduction -= 2;
                    player.steelProduction += 2;
                    player.titaniumProduction++;
                } else if (foundCard.name === new MagneticFieldDome().name) {
                    player.energyProduction -= 2;
                    player.plantProduction++;
                } else if (foundCard.name === new MagneticFieldGenerators().name) {
                    player.energyProduction -= 4;
                    player.plantProduction += 2;
                } else if (foundCard.name === new FueledGenerators().name) {
                    player.megaCreditProduction--;
                    player.energyProduction++;
                } else if (foundCard.name === new UrbanizedArea().name) {
                    player.energyProduction--;
                    player.megaCreditProduction += 2;
                } else if (foundCard.name === new PowerPlant().name) {
                    player.energyProduction++;
                } else if (foundCard.name === new HeatTrappers().name) {
                    player.heatProduction -= 2;
                    player.energyProduction++;
                } else if (foundCard.name === new TectonicStressPower().name) {
                    player.energyProduction += 3;
                } else if (foundCard.name === new UndergroundCity().name) {
                    player.energyProduction -= 2;
                    player.steelProduction += 2;
                } else if (foundCard.name === new NuclearPower().name) {
                    player.megaCreditProduction -= 2;
                    player.energyProduction += 3;
                } else if (foundCard.name === new GHGFactories().name) {
                    player.energyProduction--;
                    player.heatProduction += 4;
                } else if (foundCard.name === new Mine().name) {
                    player.steelProduction++;
                } else if (foundCard.name === new DeepWellHeating().name) {
                    player.energyProduction++;
                } else if (foundCard.name === new CarbonateProcessing().name) {
                    player.energyProduction--;
                    player.heatProduction += 3;
                } else if (foundCard.name === new IndustrialMicrobes().name) {
                    player.energyProduction++;
                    player.steelProduction++;
                } else if (foundCard.name === new CommercialDistrict().name) {
                    player.energyProduction--;
                    player.megaCreditProduction += 4;
                } else if (foundCard.name === new TropicalResort().name) {
                    player.heatProduction -= 2;
                    player.megaCreditProduction += 3;
                } else if (foundCard.name === new CorporateStronghold().name) {
                    player.energyProduction--;
                    player.megaCreditProduction += 3;
                } else if (foundCard.name === new SpaceElevator().name) {
                    player.titaniumProduction++;
                } else if (foundCard.name === new GreatDam().name) {
                    player.energyProduction += 2;
                } else if (foundCard.name === new NoctisFarming().name) {
                    player.megaCreditProduction++;
                } else if (foundCard.name === new SoilFactory().name) {
                    player.energyProduction--;
                    player.plantProduction++;
                } else if (foundCard.name === new FoodFactory().name) {
                    player.plantProduction--;
                    player.megaCreditProduction += 4;
                } else if (foundCard.name === new TitaniumMine().name) {
                    player.titaniumProduction--;
                } else if (foundCard.name === new FusionPower().name) {
                    player.energyProduction += 3;
                } else if (foundCard.name === new FuelFactory().name) {
                    player.energyProduction--;
                    player.titaniumProduction++;
                    player.megaCreditProduction++;
                } else if (foundCard.name === new ProtectedValley().name) {
                    player.megaCreditProduction += 2;
                } else if (foundCard.name === new MoholeArea().name) {
                    player.heatProduction += 4;
                } else if (foundCard.name === new NaturalPreserve().name) {
                    player.energyProduction++;
                } else {
                    reject("Production not found for selected card");
                    return;
                }
                resolve();
            });
        });
    }
}
