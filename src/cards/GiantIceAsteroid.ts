import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { MAX_OCEAN_TILES, MAX_TEMPERATURE, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { CardMetadata } from "../cards/CardMetadata";
import { CardRow } from "../cards/CardRow";
import { CardBonus } from "../cards/CardBonus";

export class GiantIceAsteroid implements IProjectCard {
    public cost: number = 36;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.GIANT_ICE_ASTEROID;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const remainingOceans = MAX_OCEAN_TILES - game.board.getOceansOnBoard();
        const remainingTemperatureSteps = (MAX_TEMPERATURE - game.getTemperature()) / 2;
        const stepsRaised = Math.min(remainingTemperatureSteps, 2) + Math.min(remainingOceans, 2);

        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            return player.canAfford(
                player.getCardCost(game, this) + REDS_RULING_POLICY_COST * stepsRaised,
                game,
                false,
                true
            );
        }

        return true;
    }

    public play(player: Player, game: Game) {
        game.increaseTemperature(player, 2);
        game.addOceanInterrupt(player, "Select space for first ocean");
        game.addOceanInterrupt(player, "Select space for second ocean");
        game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 6);
        return undefined;
    }

    public metadata: CardMetadata = {
        description:
            "Raise temperature 2 steps and place 2 ocean tiles. Remove up to 6 plants from any player.",
        cardNumber: "080",
        onPlay: [
            CardRow.add([CardBonus.temperature(2)]),
            CardRow.add([CardBonus.oceans(2)]),
            CardRow.add([CardBonus.plants(-6).any()]),
        ],
    };
}
