import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class IronExtractionCenter extends Card {
  constructor() {
    super({
      name: CardName.IRON_EXTRACTION_CENTER,
      cardType: CardType.AUTOMATED,
      tags: [Tag.BUILDING],
      cost: 10,
      reserveUnits: {titanium: 1},

      metadata: {
        description: 'Spend 1 titanium. Increase your steel production 1 step for every 2 raised steps of mining rate.',
        cardNumber: 'M25',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.production((pb) => pb.steel(1)).slash().moonMiningRate({amount: 2});
        }),
      },
    });
  }

  public produce(player: Player) {
    const miningRate = MoonExpansion.moonData(player.game).miningRate;
    const productionIncrease = Math.floor(miningRate / 2);
    player.production.add(Resources.STEEL, productionIncrease, {log: true});
  }

  public override bespokePlay(player: Player) {
    this.produce(player);
    return undefined;
  }
}
