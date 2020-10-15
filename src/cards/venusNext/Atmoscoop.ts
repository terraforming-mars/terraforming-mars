import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";
import { ResourceType } from "../../ResourceType";
import { SelectCard } from "../../inputs/SelectCard";
import { ICard } from "../ICard";
import { CardName } from "../../CardName";
import { LogHelper } from "../../components/LogHelper";
import * as constants from "./../../constants";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";

export class Atmoscoop implements IProjectCard {
    public cost: number = 22;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: CardName = CardName.ATMOSCOOP;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        const meetsTagRequirements = player.getTagCount(Tags.SCIENCE) >= 3;
        const remainingTemperatureSteps = (constants.MAX_TEMPERATURE - game.getTemperature()) / 2;
        const remainingVenusSteps = (constants.MAX_VENUS_SCALE - game.getVenusScaleLevel()) / 2;
        const stepsRaised = Math.min(remainingTemperatureSteps, remainingVenusSteps, 2);
        
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(this.cost + constants.REDS_RULING_POLICY_COST * stepsRaised, game, false, true) && meetsTagRequirements;
        }
  
        return meetsTagRequirements;
    }
    
    public play(player: Player, game: Game) {
        let result = new OrOptions();
        let options: Array<SelectCard<ICard> | SelectOption> = [];

        const floaterCards = player.getResourceCards(ResourceType.FLOATER);

        if (floaterCards.length === 0) {
            if (!this.temperatureIsMaxed(game)) {
                options.push(new SelectOption("Raise temperature 2 steps", "Raise temperature", () => {
                    game.increaseTemperature(player,2);
                    return undefined;
                }));
            }
            
            if (!this.venusIsMaxed(game)) {
                options.push(new SelectOption("Raise Venus 2 steps", "Raise venus",() => {
                    game.increaseVenusScaleLevel(player,2);
                    return undefined;
                }));
            }
        } else if (floaterCards.length === 1) {
            if (!this.temperatureIsMaxed(game)) {
                options.push(new SelectOption(
                    "Raise temperature 2 steps and add 2 floaters to " + floaterCards[0].name,
                    "Raise temperature and add floaters",
                    () => {
                        player.addResourceTo(floaterCards[0], 2);
                        LogHelper.logAddResource(game, player, floaterCards[0], 2);
                        game.increaseTemperature(player,2);
                        return undefined;
                }));
            }

            if (!this.venusIsMaxed(game)) {
                options.push(new SelectOption(
                    "Raise Venus 2 steps and add 2 floaters to " + floaterCards[0].name,
                    "Raise Venus and add floaters",
                    () => {
                        player.addResourceTo(floaterCards[0], 2);
                        LogHelper.logAddResource(game, player, floaterCards[0], 2);
                        game.increaseVenusScaleLevel(player,2);
                        return undefined;
                }));
            }

            if (this.temperatureIsMaxed(game) && this.venusIsMaxed(game)) {
                options.push(new SelectOption(
                    "Add 2 floaters to " + floaterCards[0].name,
                    "Add floaters",
                    () => {
                        player.addResourceTo(floaterCards[0], 2);
                        LogHelper.logAddResource(game, player, floaterCards[0], 2);
                        return undefined;
                }));
            }
        } else {
            if (!this.temperatureIsMaxed(game)) {
                options.push(new SelectCard(
                    "Raise temperature 2 steps and select card to add 2 floaters",
                    "Raise temperature and add floaters",
                    floaterCards,
                    (foundCards: Array<ICard>) => {
                        player.addResourceTo(foundCards[0], 2);
                        LogHelper.logAddResource(game, player, foundCards[0], 2);
                        game.increaseTemperature(player,2);
                        return undefined;
                }));
            }

            if (!this.venusIsMaxed(game)) {
                options.push(new SelectCard(
                    "Raise Venus 2 steps and select card to add 2 floaters",
                    "Raise Venus and add floaters",
                    floaterCards,
                    (foundCards: Array<ICard>) => {
                    player.addResourceTo(foundCards[0], 2);
                    LogHelper.logAddResource(game, player, foundCards[0], 2);
                    game.increaseVenusScaleLevel(player,2);
                    return undefined;
                }));
            }

            if (this.temperatureIsMaxed(game) && this.venusIsMaxed(game)) {
                options.push(new SelectCard(
                    "Select card to add 2 floaters",
                    "Add floaters",
                    floaterCards,
                    (foundCards: Array<ICard>) => {
                    player.addResourceTo(foundCards[0], 2);
                    LogHelper.logAddResource(game, player, foundCards[0], 2);
                    return undefined;
                }));
            }
        }

        if (options.length === 1) {
            if (options[0] instanceof SelectOption) return (options[0] as SelectOption).cb();

            const selectCard = options[0] as SelectCard<ICard>;
            if (floaterCards.length === 1) return selectCard.cb([floaterCards[0]]);
            
            return selectCard;
        };

        result.options = options;
        return result;
    }
    
    public getVictoryPoints() {
        return 1;
    }

    private temperatureIsMaxed(game: Game) {
        return game.getTemperature() === constants.MAX_TEMPERATURE;
    }

    private venusIsMaxed(game: Game) {
        return game.getVenusScaleLevel() === constants.MAX_VENUS_SCALE;
    }
}
