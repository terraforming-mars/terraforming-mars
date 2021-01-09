import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class MicroMills extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MICRO_MILLS,
      cost: 3,

      metadata: {
        cardNumber: '164',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(1));
        }),
        description: 'Increase your heat production 1 step.',
      },
    });
  }

  public play(player: Player, _game: Game) {
    player.addProduction(Resources.HEAT);
    return undefined;
  }
}

