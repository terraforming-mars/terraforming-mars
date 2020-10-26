import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST, MAX_TEMPERATURE } from "../../constants";
<<<<<<< HEAD
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRow } from "../../cards/CardRow";
import { CardBonus } from "../../cards/CardBonus";
=======
import { RemoveAnyPlants } from "../../deferredActions/RemoveAnyPlants";
>>>>>>> master

export class SmallAsteroid implements IProjectCard {
    public cost: number = 10;
    public name: CardName = CardName.SMALL_ASTEROID;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const canRaiseTemperature = game.getTemperature() < MAX_TEMPERATURE;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && canRaiseTemperature) {
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
        game.defer(new RemoveAnyPlants(player, game, 2));
        return undefined;
    }
<<<<<<< HEAD
    public metadata: CardMetadata = {
        description: "Increase temperature 1 step. Remove up to 2 plants from any player.",
        cardNumber: "209",
        onPlay: [
            CardRow.add([CardBonus.temperature(1)]),
            CardRow.add([CardBonus.plants(-2).any()]),
        ],
    };
=======

>>>>>>> master
}
