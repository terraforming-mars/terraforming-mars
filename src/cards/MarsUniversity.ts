
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectCard } from "../inputs/SelectCard";
import { SelectOption } from "../inputs/SelectOption";
import { CardName } from "../CardName";

export class MarsUniversity implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public name: CardName = CardName.MARS_UNIVERSITY;
    public cardType: CardType = CardType.ACTIVE;
    private runInterrupts(player: Player, game: Game, scienceTags: number): void {
      if (scienceTags <= 0) {
        return;
      }
      if (player.cardsInHand.length === 0) {
        this.runInterrupts(player, game, scienceTags - 1);
        return;
      }
      game.addInterrupt({ player, playerInput: new OrOptions(
        new SelectCard("Select a card to discard", "Discard", player.cardsInHand, (foundCards: Array<IProjectCard>) => {
          player.cardsInHand.splice(player.cardsInHand.indexOf(foundCards[0]), 1);
          game.dealer.discard(foundCards[0]);
          player.cardsInHand.push(game.dealer.dealCard());
          this.runInterrupts(player, game, scienceTags - 1);
          return undefined;
        }),
        new SelectOption("Do nothing", "Confirm", () => {
          this.runInterrupts(player, game, scienceTags - 1);
          return undefined;
        })
      ) });
    }
    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
        this.runInterrupts(player, game, card.tags.filter((tag) => tag === Tags.SCIENCE).length);
        return undefined;
    }
    public play() {
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
