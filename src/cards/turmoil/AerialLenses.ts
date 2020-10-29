import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { Game } from "../../Game";
import { PartyName } from "../../turmoil/parties/PartyName";
import { CardMetadata } from "../CardMetadata";
import { CardRow } from "../CardRow";
import { CardBonus } from "../CardBonus";
import { CardRequirements } from "../CardRequirements";
import { CardRequirement } from "../CardRequirement";
import { CardProductionBox } from "../CardProductionBox";
import { RemoveAnyPlants } from "../../deferredActions/RemoveAnyPlants";

export class AerialLenses implements IProjectCard {
    public cost = 2;
    public tags = [];
    public name = CardName.AERIAL_LENSES;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.canPlay(player, PartyName.KELVINISTS);
        }
        return false;
    }

    public play(player: Player, game: Game) {
        player.addProduction(Resources.HEAT, 2);
        game.defer(new RemoveAnyPlants(player, game, 2));
        return undefined;
    }

    public getVictoryPoints() {
        return -1;
    }

    public metadata: CardMetadata = {
        description:
            "Requires that Kelvinists are ruling or that you have 2 delegates there. Remove up to 2 plants from any player. Increase your heat production 2 steps.",
        cardNumber: "T01",
        requirements: new CardRequirements([
            CardRequirement.party(PartyName.KELVINISTS)
        ]),
        onPlay: [
            CardRow.add([
                CardBonus.plants(-2).any(),
                CardProductionBox.add([
                    [CardBonus.heat(2)],
                ]),
            ]),
        ],
        victoryPoints: -1,
    };
}
