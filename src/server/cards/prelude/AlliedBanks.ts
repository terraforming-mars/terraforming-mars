import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard2} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AlliedBanks extends PreludeCard2 {
  constructor() {
    super({
      name: CardName.ALLIED_BANKS,
      tags: [Tag.EARTH],

      productionBox: {megacredits: 4},
      startingMegacredits: 3,

      metadata: {
        cardNumber: 'P01',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(4)).br;
          b.megacredits(3);
        }),
        description: 'Increase your M€ production 4 steps. Gain 3 M€.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.megaCredits += this.startingMegaCredits;
    return undefined;
  }
}

