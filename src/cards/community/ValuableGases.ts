import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./../prelude/PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { SelectCard } from "../../inputs/SelectCard";
import { ResourceType } from "../../ResourceType";
import { SelectHowToPayDeferred } from "../../deferredActions/SelectHowToPayDeferred";
import { DeferredAction } from "../../deferredActions/DeferredAction";

export class ValuableGases extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.VENUS];
    public name: CardName = CardName.VALUABLE_GASES;

    public play(player: Player) {     
        player.megaCredits += 6;
        return undefined;
    }

    public addPlayCardDeferredAction(player: Player, game: Game) {
        const playableCards = player.getPlayableCards(game).filter((card) => card.resourceType === ResourceType.FLOATER && card.tags.indexOf(Tags.VENUS) !== -1);
            
        if (playableCards.length > 0) {
            game.defer(new DeferredAction(
                player,
                () => new SelectCard(
                    "Select Venus floater card to play and add 4 floaters",
                    "Save",
                    playableCards,
                    (cards: Array<IProjectCard>) => {
                        const canUseSteel = cards[0].tags.indexOf(Tags.STEEL) !== -1;
                        const canUseTitanium = cards[0].tags.indexOf(Tags.SPACE) !== -1;
                        const cardCost = player.getCardCost(game, cards[0]);

                        game.defer(new SelectHowToPayDeferred(player, cardCost, canUseSteel, canUseTitanium, "Select how to pay for card"));
                        player.playCard(game, cards[0]);
                        player.addResourceTo(cards[0], 4);
                        return undefined;
                    }
                )
            ));
        }
    }
}

