import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {Tag} from '../../../common/cards/Tag';

export class ExperiencedMartians extends PreludeCard {
  constructor() {
    super({
      name: CardName.EXPERIENCED_MARTIANS,

      behavior: {
        production: {megacredits: 2},
        drawCard: {count: 2, tag: Tag.MARS},
      },

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.delegates(1).cards(1, {secondaryTag: Tag.MARS}).cards(1, {secondaryTag: Tag.MARS}).production((pb) => pb.megacredits(2));
        }),
        description: 'Place 1 delegate in any party. Draw 2 cards with a Mars tag. Increase your M€ production 2 steps.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.game.defer(new SendDelegateToArea(player, undefined, {count: 1, source: 'reserve'}));
    return undefined;
  }
}
