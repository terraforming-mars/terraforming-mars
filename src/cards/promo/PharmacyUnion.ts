import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "../corporation/CorporationCard";
import { CardName } from "../../CardName";
import { ResourceType } from "../../ResourceType";
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { Game } from "../../Game";
import { IProjectCard } from "../IProjectCard";
import { CorporationName } from "../../CorporationName";
import { ICard } from "../ICard";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../../constants";
import { CardType } from "../CardType";

export class PharmacyUnion implements CorporationCard {
    public name: CardName = CardName.PHARMACY_UNION;
    public tags: Array<Tags> = [Tags.MICROBES, Tags.MICROBES];
    public startingMegaCredits: number = 46; // 54 minus 8 for the 2 deseases
    public resourceType: ResourceType = ResourceType.DISEASE;
    public cardType: CardType = CardType.CORPORATION;
    public resourceCount: number = 0;
    public isDisabled: boolean = false;

    public play(player: Player, game: Game) {
        this.resourceCount = 2;

        player.cardsInHand.push(game.drawCardsByTag(Tags.SCIENCE, 1)[0]);
        const drawnCard = game.getCardsInHandByTag(player, Tags.SCIENCE).slice(-1)[0];

        game.log("${0} drew ${1}", b => b.player(player).card(drawnCard));

        return undefined;
    }

    public onCardPlayed(player: Player, game: Game, card: IProjectCard): void {
        if (this.isDisabled) return undefined;

        if (card.tags.includes(Tags.MICROBES)) {
            const microbeTagCount = card.tags.filter((cardTag) => cardTag === Tags.MICROBES).length;
            const player = game.getPlayers().find((p) => p.isCorporation(this.name))!;
            player.addResourceTo(this, microbeTagCount);
            player.megaCredits = Math.max(player.megaCredits - microbeTagCount * 4, 0)
        }
            
        if (player.isCorporation(CorporationName.PHARMACY_UNION) && card.tags.includes(Tags.SCIENCE)) {
            this.runInterrupts(player, game, card.tags.filter((tag) => tag === Tags.SCIENCE).length);
            return undefined;
        }
    }

    public onCorpCardPlayed(player: Player, game: Game, card: CorporationCard) {
        return this.onCardPlayed(player,game,card as ICard as IProjectCard);
    }

    private runInterrupts(player: Player, game: Game, scienceTags: number): void {
        if (scienceTags <= 0) return;

        if (this.resourceCount > 0) {
            this.resourceCount--;
            player.increaseTerraformRating(game);
            game.log("${0} removed a disease from ${1} to gain 1 TR", b => b.player(player).card(this));
            this.runInterrupts(player, game, scienceTags - 1);
            return undefined;
        } else {
            const availableOptions: OrOptions = new OrOptions();
            const redsAreRuling = PartyHooks.shouldApplyPolicy(game, PartyName.REDS);

            if (!redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST * 3))) {
                availableOptions.options.push(
                    new SelectOption("Turn this card face down and gain 3 TR", 
                    "Gain TR", () => {
                        this.isDisabled = true;
                        player.increaseTerraformRatingSteps(3, game);
                        game.log("${0} turned ${1} face down to gain 3 TR", b => b.player(player).card(this));
                        return undefined;
                    })
                );
            }

            availableOptions.options.push(
                new SelectOption("Do nothing", "Confirm", () => {
                    this.runInterrupts(player, game, scienceTags - 1);
                    return undefined;
                })
            );

            game.addInterrupt({ player, playerInput: availableOptions});
        }
      }
}
