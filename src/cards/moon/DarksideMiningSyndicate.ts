import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../Resources';
import {Card} from '../Card';

export class DarksideMiningSyndicate extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.DARKSIDE_MINING_SYNDICATE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.SPACE],
      cost: 18,

      metadata: {
        description: 'Increase your Titanium production 2 steps if Mining Rate is 0 or 1 OR ' +
        'increase your Titanium production 1 step if Mining Rate is at least 2. ' +
        'And then raise the Mining Rate 1 step.',
        cardNumber: 'M66',
        renderData: CardRenderer.builder((_b) => {}),
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
