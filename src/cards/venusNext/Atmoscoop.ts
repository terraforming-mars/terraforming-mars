import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { AndOptions } from "../../inputs/AndOptions";
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
    public cost = 22;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.ATMOSCOOP;
    public cardType = CardType.AUTOMATED;

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
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);

        if (this.temperatureIsMaxed(game) && this.venusIsMaxed(game) && floaterCards.length === 0) {
            return undefined;
        }

        const increaseTemp = new SelectOption("Raise temperature 2 steps", "Raise temperature", () => {
            game.increaseTemperature(player,2);
            return undefined;
        });
        const increaseVenus = new SelectOption("Raise Venus 2 steps", "Raise venus",() => {
            game.increaseVenusScaleLevel(player,2);
            return undefined;
        });
        const addFloaters = new SelectCard(
            "Select card to add 2 floaters",
            "Add floaters",
            floaterCards,
            (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 2);
                LogHelper.logAddResource(game, player, foundCards[0], 2);
                return undefined;
            }
        );

        if (!this.temperatureIsMaxed(game) && this.venusIsMaxed(game)) {
            game.increaseTemperature(player,2);
        } else if (this.temperatureIsMaxed(game) && !this.venusIsMaxed(game)) {
            game.increaseVenusScaleLevel(player,2);
        }

        switch (floaterCards.length) {
            case 1:
                player.addResourceTo(floaterCards[0], 2);
                LogHelper.logAddResource(game, player, floaterCards[0], 2);

            case 0:
                if (!this.temperatureIsMaxed(game) && !this.venusIsMaxed(game)) {
                    return new OrOptions(increaseTemp, increaseVenus);
                }
                return undefined;

            default:
                if (!this.temperatureIsMaxed(game) && !this.venusIsMaxed(game)) {
                    return new AndOptions(
                        () => undefined,
                        new OrOptions(increaseTemp, increaseVenus),
                        addFloaters
                    );
                }
                return addFloaters;
        }
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
