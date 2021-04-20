import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class IoMiningIndustries extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.IO_MINING_INDUSTRIES,
      tags: [Tags.JOVIAN, Tags.SPACE],
      cost: 41,

      metadata: {
        cardNumber: '092',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(2).megacredits(2)).br;
          b.vpText('1 VP per Jovian tag you have.');
        }),
        description: 'Increase your titanium production 2 steps and your M€ production 2 steps.',
        victoryPoints: CardRenderDynamicVictoryPoints.jovians(1, 1),
      },
    });
  }

  public getVictoryPoints(player: Player) {
    return player.getTagCount(Tags.JOVIAN, false, false);
  }
  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 2);
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
}
