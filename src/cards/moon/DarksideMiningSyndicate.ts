import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class DarksideMiningSyndicate extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.DARKSIDE_MINING_SYNDICATE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.SPACE],
      cost: 18,

      metadata: {
        description: 'Increase your Titanium production 2 steps, or ' +
        '1 step if the Mining Rate is at least 2. And then raise the Mining Rate 1 step.',
        cardNumber: 'M66',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.titanium(2).nbsp.or().br;
            pb.moonMiningRate({size: CardRenderItemSize.SMALL, amount: 2}).colon().nbsp.titanium(1);
          }).br;
          b.moonMiningRate().br;
        }),
      },
    });
  };

  public play(player: Player) {
    const productionBonus = (MoonExpansion.moonData(player.game).miningRate >= 2) ? 1 : 2;
    player.addProduction(Resources.TITANIUM, productionBonus);
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
