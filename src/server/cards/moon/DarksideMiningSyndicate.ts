import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../../common/Resources';
import {Card} from '../Card';

export class DarksideMiningSyndicate extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.DARKSIDE_MINING_SYNDICATE,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.SPACE],
      cost: 18,
      tr: {moonMining: 1},

      metadata: {
        description: 'Increase your titanium production 2 steps, or ' +
        '1 step if the Mining Rate is at least 2. And then raise the Mining Rate 1 step.',
        cardNumber: 'M66',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(2)).or().br;
          b.moonMiningRate({amount: 2}).colon().production((pb) => pb.titanium(1)).br;
          b.moonMiningRate().br;
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    const productionBonus = (MoonExpansion.moonData(player.game).miningRate >= 2) ? 1 : 2;
    player.production.add(Resources.TITANIUM, productionBonus, {log: true});
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
