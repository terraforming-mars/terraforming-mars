import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AsteroidMining extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ASTEROID_MINING,
      tags: [Tags.JOVIAN, Tags.SPACE],
      cost: 30,
      victoryPoints: 2,

      metadata: {
        description: 'Increase your titanium production 2 steps.',
        cardNumber: '040',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.titanium(2))),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 2);
    return undefined;
  }
}
