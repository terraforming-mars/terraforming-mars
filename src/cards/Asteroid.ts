import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { MAX_TEMPERATURE, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { CardMetadata } from "../cards/CardMetadata";
import { CardRow } from "../cards/CardRow";
import { CardBonus } from "../cards/CardBonus";
import { RemoveAnyPlants } from "../deferredActions/RemoveAnyPlants";

export class Asteroid implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.ASTEROID;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const temperatureMaxed = game.getVenusScaleLevel() === MAX_TEMPERATURE;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !temperatureMaxed) {
            return player.canAfford(
                player.getCardCost(game, this) + REDS_RULING_POLICY_COST,
                game,
                false,
                true
            );
        }

        return true;
    }

    public play(player: Player, game: Game) {
        game.increaseTemperature(player, 1);
        game.defer(new RemoveAnyPlants(player, game, 3));
        player.titanium += 2;
        return undefined;
    }

    public metadata: CardMetadata = {
        description:
            "Raise temperature 1 step and gain 2 titanium. Remove up to 3 Plants from any player.",
        cardNumber: "009",
        onPlay: [
            CardRow.add([CardBonus.temperature(1)]),
            CardRow.add([CardBonus.titanium(2)]),
            CardRow.add([CardBonus.plants(-3).any()]),
        ],
    };
}
