import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MineralDeposit implements IProjectCard {
    public cost = 5;
    public tags = [];
    public name = CardName.MINERAL_DEPOSIT;
    public cardType = CardType.EVENT;

    public play(player: Player, _game: Game) {
      player.steel += 5;
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '062',
      renderData: CardRenderer.builder((b) => b.steel(5).digit),
      description: 'Gain 5 steel.',
    }
}
