import { IProjectCard } from '../IProjectCard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { Resources } from '../../Resources';
import { Game } from '../../Game';

export class Advertising implements IProjectCard {
    public name: CardName = CardName.ADVERTISING;
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.EARTH];
    public cardType: CardType = CardType.ACTIVE;

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.cost >= 20) {
            player.setProduction(Resources.MEGACREDITS);
        }
    }

    public play() {
        return undefined;
    }
}