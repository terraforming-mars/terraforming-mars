import { IProjectCard } from "../IProjectCard";
import { IActionCard, IResourceCard } from "../ICard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";
import { Game } from "../../Game";
import { CardName } from "../../CardName";
import { MAX_VENUS_SCALE, REDS_RULING_POLICY_COST } from "../../constants";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { CardSpecial } from "../../cards/CardSpecial";
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRow } from "../../cards/CardRow";
import { CardBonus } from "../../cards/CardBonus";
import { CardAction } from "../../cards/CauseAndEffect";

export class ExtractorBalloons implements IActionCard, IProjectCard, IResourceCard {
    public cost = 21;
    public tags = [Tags.VENUS];
    public name = CardName.EXTRACTOR_BALLOONS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;
    public resourceCount = 0;

    public play() {
        this.resourceCount += 3;
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
        const cannotAffordRed =
            PartyHooks.shouldApplyPolicy(game, PartyName.REDS) &&
            !player.canAfford(REDS_RULING_POLICY_COST);
        if (this.resourceCount < 2 || venusMaxed || cannotAffordRed) {
            this.resourceCount++;
            return undefined;
        }
        return new OrOptions(
            new SelectOption(
                "Remove 2 floaters to raise Venus scale 1 step",
                "Remove floaters",
                () => {
                    this.resourceCount -= 2;
                    game.increaseVenusScaleLevel(player, 1);
                    return undefined;
                }
            ),
            new SelectOption("Add 1 floater to this card", "Add floater", () => {
                this.resourceCount++;
                return undefined;
            })
        );
    }
    public metadata: CardMetadata = {
        cardNumber: "223",
        description: "Add 3 Floaters to this card.",
        onPlay: [
            CardRow.add([
                CardAction.add(
                    undefined,
                    [CardBonus.floaters(1)]
                ),
            ]),
            CardRow.add([
                CardAction.add(
                    [CardSpecial.or().small(), CardBonus.floaters(2)],
                    [CardBonus.venus(1)],
                    "Add 1 Floater to this card, or remove 2 Floaters here to raise Venus 1 step."
                ),
            ]),
            CardRow.add([
                CardBonus.floaters(3)
            ])
        ],
    };
}
