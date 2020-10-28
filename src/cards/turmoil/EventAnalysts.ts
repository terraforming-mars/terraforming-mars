import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PartyName } from "../../turmoil/parties/PartyName";
import { CardName } from "../../CardName";
import { CardSpecial } from "../../cards/CardSpecial";
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRow } from "../../cards/CardRow";
import { CardBonus } from "../../cards/CardBonus";
import { CardEffect } from "../CauseAndEffect";
import { CardRequirements } from "../../cards/CardRequirements";
import { CardRequirement } from "../../cards/CardRequirement";

export class EventAnalysts implements IProjectCard {
    public cost = 5;
    public tags = [Tags.SCIENCE];
    public name = CardName.EVENT_ANALYSTS;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.canPlay(player, PartyName.SCIENTISTS);
        }
        return false;
    }

    public play(player: Player, game: Game) {
        if (game.turmoil) {
            game.turmoil.addInfluenceBonus(player);
        }
        return undefined;
    }
    public metadata: CardMetadata = {
        description: "Requires that Scientists are ruling or that you have 2 delegates there.",
        cardNumber: "T05",
        requirements: new CardRequirements([CardRequirement.party(PartyName.SCIENTISTS)]),
        onPlay: [
            CardRow.add([
                CardEffect.add(
                    undefined,
                    [CardSpecial.plus(), CardBonus.influence(1)],
                    "You have influence +1"
                ),
            ]),
        ],
    };
}
