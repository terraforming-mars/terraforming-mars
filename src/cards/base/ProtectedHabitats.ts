
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';

export class ProtectedHabitats implements IProjectCard {
    public cardType = CardType.ACTIVE;
    public cost = 5;
    public tags = [];
    public name = CardName.PROTECTED_HABITATS;

    public play(_player: Player, _game: Game) {
      return undefined;
    }
}
