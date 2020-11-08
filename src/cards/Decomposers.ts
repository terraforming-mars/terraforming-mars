
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";
import { CardName } from "../CardName";
import { IResourceCard } from "./ICard";

export class Decomposers implements IProjectCard, IResourceCard {
    public cost = 5;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public tags = [Tags.MICROBES];
    public cardType = CardType.ACTIVE;
    public name = CardName.DECOMPOSERS;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 3 - player.getRequirementsBonus(game);
    }
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
      player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT ||  tag === Tags.MICROBES).length);
    }
    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 3);
    }
    public play() {
      return undefined;
    }
}

