import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { ResourceType } from "../../ResourceType";
import { Game } from "../../Game";
import { IResourceCard } from "../ICard";

export class MartianZoo implements IProjectCard, IResourceCard {
    public cost = 12;
    public tags = [Tags.ANIMAL, Tags.STEEL];
    public name = CardName.MARTIAN_ZOO;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.EARTH) !== -1) {
            player.addResourceTo(this, card.tags.filter(tag => tag === Tags.EARTH).length);
        }
    }

    public canPlay(_player: Player, game: Game): boolean {
        return game.getCitiesInPlay() >= 2;
    }

    public canAct(): boolean {
        return this.resourceCount > 0;
    }

    public action(player: Player, _game: Game) {
        player.megaCredits += this.resourceCount;
        return undefined;
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints(): number {
        return 1;
    }
}