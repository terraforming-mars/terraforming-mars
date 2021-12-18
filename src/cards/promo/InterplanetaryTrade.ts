import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardRenderer} from '../../cards/render/CardRenderer';

export class InterplanetaryTrade extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INTERPLANETARY_TRADE,
      tags: [Tags.SPACE],
      cost: 27,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'X05',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1));
          b.slash().diverseTag();
        }),
        description: 'Increase your M€ production 1 step per different tag you have in play, including this.',
      },
    });
  }

  public play(player: Player) {
    // This card's tag also counts.
    const availableTags = player.getDistinctTagCount(true, Tags.SPACE);
    player.addProduction(Resources.MEGACREDITS, availableTags, {log: true});
    return undefined;
  }
}
