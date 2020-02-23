import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';

export class MartianZoo implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.ANIMAL, Tags.STEEL];
    public name: string = CardName.MARTIAN_ZOO;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.EARTH) !== -1) {
            player.addResourceTo(this, card.tags.filter(tag => tag === Tags.EARTH).length);
        }
    }

    public canPlay(_player: Player, game: Game): boolean {
        return game.getCitiesInPlay() >= 2;
    }

    public canAct(player: Player): boolean {
        return player.getResourcesOnCard(this) > 0;
    }

    public action(player: Player, _game: Game) {
        player.megaCredits += player.getResourcesOnCard(this);
        return undefined;
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints(): number {
        return 1;
    }
}