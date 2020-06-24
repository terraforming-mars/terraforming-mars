
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { ResourceType } from "../ResourceType";
import { CardName } from '../CardName';
import { IResourceCard } from './ICard';

export class OlympusConference implements IProjectCard, IResourceCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.EARTH, Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.SCIENCE;
    public resourceCount: number = 0;
    public name: CardName = CardName.OLYMPUS_CONFERENCE;

    private runInterrupts(player: Player, game: Game, scienceTags: number): void {

      // No science tags
      if (scienceTags <= 0) {
        return;
      }

      // Can't remove a resource
      if (this.resourceCount === 0) {
        this.resourceCount++;
        this.runInterrupts(player, game, scienceTags - 1);
        return;
      }

      game.addInterrupt({ player, playerInput: new OrOptions(
        new SelectOption("Remove a science resource from this card to draw a card", () => {
          player.removeResourceFrom(this);
          player.cardsInHand.push(game.dealer.dealCard());
          this.runInterrupts(player, game, scienceTags - 1);
          return undefined;
        }),
        new SelectOption("Add a science resource to this card", () => {
          this.resourceCount++;
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
