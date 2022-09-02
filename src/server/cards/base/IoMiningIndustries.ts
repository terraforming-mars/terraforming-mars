import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {VictoryPoints} from '../ICard';

export class IoMiningIndustries extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.IO_MINING_INDUSTRIES,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 41,
      victoryPoints: VictoryPoints.tags(Tag.JOVIAN, 1, 1),

      metadata: {
        cardNumber: '092',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(2).megacredits(2)).br;
          b.vpText('1 VP per Jovian tag you have.');
        }),
        description: 'Increase your titanium production 2 steps and your M€ production 2 steps.',
      },
    });
  }

  public play(player: Player) {
    player.production.add(Resources.TITANIUM, 2);
    player.production.add(Resources.MEGACREDITS, 2);
    return undefined;
  }
}
