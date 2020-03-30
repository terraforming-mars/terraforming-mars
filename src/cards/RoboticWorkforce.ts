import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";
import { CardName } from '../CardName';
import { Resources } from '../Resources';
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";

export class RoboticWorkforce implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.ROBOTIC_WORKFORCE;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return this.getAvailableCards(player, game).length > 0;
    }
    private miningSteelProduction: number = 0;
    private miningTitaniumProduction: number = 0;

    private getAvailableCards(player: Player, game: Game): Array<IProjectCard> {

        const builderCardsNames: Array<CardName> = [
            CardName.AI_CENTRAL,
            CardName.BIOMASS_COMBUSTORS,
            CardName.BUILDING_INDUSTRIES,
            CardName.CAPITAL,
            CardName.DOME_FARMING,
            CardName.EARLY_SETTLEMENT,
            CardName.MARTIAN_INDUSTRIES,
            CardName.MINING_OPERATIONS,
            CardName.MOHOLE,
            CardName.MOHOLE_EXCAVATION,
            CardName.POLAR_INDUSTRIES,
            CardName.SELF_SUFFICIENT_SETTLEMENT,
            CardName.CARBONATE_PROCESSING,
            CardName.COMMERCIAL_DISTRICT,
            CardName.CORPORATE_STRONGHOLD,
            CardName.CUPOLA_CITY,
            CardName.DEEP_WELL_HEATING,
            CardName.DOMED_CRATER,
            CardName.ELECTRO_CATAPULT,
            CardName.EOS_CHASMA_NATIONAL_PARK,
            CardName.FOOD_FACTORY,
            CardName.FUELED_GENERATORS,
            CardName.FUEL_FACTORY,
            CardName.FUSION_POWER,
            CardName.GEOTHERMAL_POWER,
            CardName.GHG_FACTORIES,
            CardName.GREAT_DAM,
            CardName.GYROPOLIS,
            CardName.HEAT_TRAPPERS,
            CardName.IMMIGRANT_CITY,
            CardName.INDUSTRIAL_MICROBES,
            CardName.MAGNETIC_FIELD_DOME,
            CardName.MAGNETIC_FIELD_GENERATORS,
            CardName.MEDICAL_LAB,
            CardName.MINE,
            CardName.MINING_AREA,
            CardName.MINING_QUOTA,
            CardName.MINING_RIGHTS,
            CardName.MOHOLE_AREA,
            CardName.NATURAL_PRESERVE,
            CardName.NOCTIS_CITY,
            CardName.NOCTIS_FARMING,
            CardName.NUCLEAR_POWER,
            CardName.OPEN_CITY,
            CardName.PEROXIDE_POWER,
            CardName.POWER_PLANT,
            CardName.PROTECTED_VALLEY,
            CardName.RAD_CHEM_FACTORY,
            CardName.SOIL_FACTORY,
            CardName.SOLAR_POWER,
            CardName.SPACE_ELEVATOR,
            CardName.STRIP_MINE,
            CardName.TECTONIC_STRESS_POWER,
            CardName.TITANIUM_MINE,
            CardName.TROPICAL_RESORT,
            CardName.UNDERGROUND_CITY,
            CardName.URBANIZED_AREA,
            CardName.WINDMILLS,
            CardName.HOUSE_PRINTING,
            CardName.LAVA_TUBE_SETTLEMENT,
            CardName.SPACE_PORT
        ];

        const availableCards = player.playedCards.filter((card) => {
            for (let i = 0; i < builderCardsNames.length; i++) {
                if (builderCardsNames[i] === card.name  && card.name === CardName.BIOMASS_COMBUSTORS) {
                    if (game.getPlayers().length == 1 || game.getPlayers().filter((p) => p.getProduction(Resources.PLANTS) > 0).length > 0) {
                        return true;
                    }
                } else if (builderCardsNames[i] === card.name  && card.name === CardName.MAGNETIC_FIELD_GENERATORS) {
                    if (player.getProduction(Resources.ENERGY) >= 4) {
                        return true;
                    }
                } else if (builderCardsNames[i] === card.name  && card.name === CardName.TROPICAL_RESORT) {
                    if (player.getProduction(Resources.HEAT) >= 2) {
                        return true;
                    }
                } else if (builderCardsNames[i] === card.name  
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
                } else if (builderCardsNames[i] === card.name  
                    && (card.name === CardName.AI_CENTRAL
                        || card.name === CardName.BUILDING_INDUSTRIES
                        || card.name === CardName.CARBONATE_PROCESSING
                        || card.name === CardName.COMMERCIAL_DISTRICT
                        || card.name === CardName.CORPORATE_STRONGHOLD
                        || card.name === CardName.DOMED_CRATER
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

                } else if (builderCardsNames[i] === card.name  && card.name === CardName.HEAT_TRAPPERS) {
                    if (game.getPlayers().length == 1 || game.getPlayers().filter((p) => p.getProduction(Resources.HEAT) >= 2).length > 0) {
                        return true;
                    }    
                } else if (builderCardsNames[i] === card.name) {
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
                        public name: CardName,
                        public energyProduction: number,
                        public megaCreditProduction: number,
                        public steelProduction: number,
                        public titaniumProduction: number,
                        public plantProduction: number,
                        public heatProduction: number) {}
                }

                let updaters: Array<Updater> = [
                    new Updater(CardName.DOME_FARMING, 2, 0, 0, 0, 1, 0),
                    new Updater(CardName.EARLY_SETTLEMENT, 0, 0, 0, 0, 1, 0),
                    new Updater(CardName.MARTIAN_INDUSTRIES, 1, 0, 1, 0, 0, 0),
                    new Updater(CardName.MINING_OPERATIONS, 0, 0, 2, 0, 0, 0),
                    new Updater(CardName.MOHOLE, 0, 0, 0, 0, 0, 3),
                    new Updater(CardName.MOHOLE_EXCAVATION, 0, 0, 1, 0, 0, 2),
                    new Updater(CardName.POLAR_INDUSTRIES, 0, 0, 0, 0, 0, 2),
                    new Updater(CardName.SELF_SUFFICIENT_SETTLEMENT, 2, 0, 0, 0, 0, 0),
                    new Updater(CardName.NOCTIS_CITY, -1, 3, 0, 0, 0, 0),
                    new Updater(CardName.DOMED_CRATER, -1, 3, 0, 0, 0, 0),
                    new Updater(CardName.ELECTRO_CATAPULT, -1, 0, 0, 0, 0, 0),
                    new Updater(CardName.WINDMILLS, 1, 0, 0, 0, 0, 0),
                    new Updater(CardName.IMMIGRANT_CITY, -1, -2, 0, 0, 0, 0),
                    new Updater(CardName.BUILDING_INDUSTRIES, -1, 0, 2, 0, 0, 0),
                    new Updater(CardName.SOLAR_POWER, 1, 0, 0, 0, 0, 0),
                    new Updater(CardName.RAD_CHEM_FACTORY, -1, 0, 0, 0, 0, 0),
                    new Updater(CardName.PEROXIDE_POWER, 2, -1, 0, 0, 0, 0),
                    new Updater(CardName.MEDICAL_LAB, 0, Math.floor(player.getTagCount(Tags.STEEL) / 2), 0, 0, 0, 0),
                    new Updater(CardName.GEOTHERMAL_POWER, 2, 0, 0, 0, 0, 0),
                    new Updater(CardName.GYROPOLIS, -2, player.getMultipleTagCount([Tags.VENUS, Tags.EARTH]), 0, 0, 0, 0),
                    new Updater(CardName.AI_CENTRAL, -1, 0, 0, 0, 0, 0),
                    new Updater(CardName.CAPITAL, -2, 5, 0, 0, 0, 0),
                    new Updater(CardName.CUPOLA_CITY, -1, 3, 0, 0, 0, 0),
                    new Updater(CardName.OPEN_CITY, -1, 4, 0, 0, 0, 0),
                    new Updater(CardName.EOS_CHASMA_NATIONAL_PARK, 2, 0, 0, 0, 0, 0),
                    new Updater(CardName.STRIP_MINE, -2, 0, 2, 1, 0, 0),
                    new Updater(CardName.MAGNETIC_FIELD_DOME, -2, 0, 0, 0, 1, 0),
                    new Updater(CardName.MAGNETIC_FIELD_GENERATORS, -4, 0, 0, 0, 2, 0),
                    new Updater(CardName.MINING_RIGHTS, 0, 0, this.miningSteelProduction, this.miningTitaniumProduction, 0, 0),
                    new Updater(CardName.MINING_QUOTA, 0, 0, 2, 0, 0, 0),
                    new Updater(CardName.MINING_AREA, 0, 0, this.miningSteelProduction, this.miningTitaniumProduction, 0, 0),
                    new Updater(CardName.FUELED_GENERATORS, 1, -1, 0, 0, 0, 0),
                    new Updater(CardName.URBANIZED_AREA, -1, 2, 0, 0, 0, 0),
                    new Updater(CardName.POWER_PLANT, 1, 0, 0, 0, 0, 0),
                    new Updater(CardName.TECTONIC_STRESS_POWER, 3, 0, 0, 0, 0, 0),
                    new Updater(CardName.UNDERGROUND_CITY, -2, 0, 2, 0, 0, 0),
                    new Updater(CardName.NUCLEAR_POWER, 3, -2, 0, 0, 0, 0),
                    new Updater(CardName.GHG_FACTORIES,-1, 0, 0, 0, 0, 4),
                    new Updater(CardName.MINE, 0, 0, 1, 0, 0, 0),
                    new Updater(CardName.DEEP_WELL_HEATING, 1, 0, 0, 0, 0, 0),
                    new Updater(CardName.CARBONATE_PROCESSING, -1, 0, 0, 0, 0, 3),
                    new Updater(CardName.INDUSTRIAL_MICROBES, 1, 0, 1, 0, 0, 0),
                    new Updater(CardName.COMMERCIAL_DISTRICT, -1, 4, 0, 0, 0, 0),
                    new Updater(CardName.TROPICAL_RESORT, 0, 3, 0, 0, 0, -2),
                    new Updater(CardName.CORPORATE_STRONGHOLD, -1, 3, 0, 0, 0, 0),
                    new Updater(CardName.SPACE_ELEVATOR, 0, 0, 0, 1, 0, 0),
                    new Updater(CardName.GREAT_DAM, 2, 0, 0, 0, 0, 0),
                    new Updater(CardName.NOCTIS_FARMING, 0, 1, 0, 0, 0, 0),
                    new Updater(CardName.SOIL_FACTORY, -1, 0, 0, 0, 1, 0),
                    new Updater(CardName.FOOD_FACTORY, 0, 4, 0, 0, -1, 0),
                    new Updater(CardName.TITANIUM_MINE, 0, 0, 0, 1, 0, 0),
                    new Updater(CardName.FUSION_POWER, 3, 0, 0, 0, 0, 0),
                    new Updater(CardName.FUEL_FACTORY, -1, 1, 0, 1, 0, 0),
                    new Updater(CardName.PROTECTED_VALLEY, 0, 2, 0, 0, 0, 0),
                    new Updater(CardName.MOHOLE_AREA, 0, 0, 0, 0, 0, 4),
                    new Updater(CardName.NATURAL_PRESERVE, 1, 0, 0, 0, 0, 0),
                    new Updater(CardName.HOUSE_PRINTING, 0, 0, 1, 0, 0, 0),
                    new Updater(CardName.LAVA_TUBE_SETTLEMENT, -1, 2, 0, 0, 0, 0),
                    new Updater(CardName.SPACE_PORT, -1, 4, 0, 0, 0, 0)                    
                ]

                let result:Updater = updaters.filter(u => u.name === foundCard.name)[0];

                if (!result) {
                    throw "Production not found for selected card";
                }

                if (player.getProduction(Resources.ENERGY) + result.energyProduction < 0) {
                    throw "not enough energy production";
                }
                if (player.getProduction(Resources.TITANIUM) + result.titaniumProduction < 0) {
                    throw "not enough titanium production";
                }
                if (player.getProduction(Resources.PLANTS) + result.plantProduction < 0) {
                    throw "not enough plant production";
                }
                if (player.getProduction(Resources.HEAT) + result.heatProduction < 0) {
                    throw "not enough heat production";
                }

                player.setProduction(Resources.ENERGY,result.energyProduction);
                player.setProduction(Resources.MEGACREDITS,result.megaCreditProduction);
                player.setProduction(Resources.STEEL,result.steelProduction);
                player.setProduction(Resources.TITANIUM,result.titaniumProduction);
                player.setProduction(Resources.PLANTS,result.plantProduction);
                player.setProduction(Resources.HEAT,result.heatProduction);

                game.log(
                  LogMessageType.DEFAULT,
                  "${0} copied ${1} production with ${2}",
                  new LogMessageData(LogMessageDataType.PLAYER, player.name),
                  new LogMessageData(LogMessageDataType.CARD, result.name),
                  new LogMessageData(LogMessageDataType.CARD, this.name)
                );

                return undefined;
            });
    }
}
