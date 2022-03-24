import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';

export class MarketingExperts extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MARKETING_EXPERTS,
      tags: [Tags.EARTH],
      cost: 5,

      metadata: {
        cardNumber: 'A12',
        renderData: CardRenderer.builder((b) => {
          b.effect('When an ADJACENCY BONUS is collected from a tile you own, you gain 1 M€.', (eb) => {
            eb.emptyTile().emptyTile('golden').startEffect.megacredits(1);
          }).br;
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Increase your M€ production 1 step.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1);
    return undefined;
  }
}
