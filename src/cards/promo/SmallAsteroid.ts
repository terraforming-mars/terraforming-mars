import { IProjectCard } from '../IProjectCard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { Game } from '../../Game';
import { Resources } from '../../Resources';

export class SmallAsteroid implements IProjectCard {

    public cost: number = 10;
    public name: CardName = CardName.SMALL_ASTEROID;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
        game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 2);
        return game.increaseTemperature(player, 1);
    }

}