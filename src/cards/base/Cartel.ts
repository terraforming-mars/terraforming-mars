
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Cartel extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CARTEL,
      tags: [Tags.EARTH],
      cost: 8,

      metadata: {
        cardNumber: '137',
        description: 'Increase your MC production 1 step for each Earth tag you have, including this.',
        renderData: CardRenderer.builder((b) => b.productionBox((pb) => {
          pb.megacredits(1).slash().earth().played;
        })),
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH) + 1);
    return undefined;
  }
}
