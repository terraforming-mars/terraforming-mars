import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';

export class ExperiencedMartians extends PreludeCard {
  constructor() {
    super({
      name: CardName.EXPERIENCED_MARTIANS,

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.delegates(1).cards(1, {secondaryTag: Tags.MARS}).cards(1, {secondaryTag: Tags.MARS}).production((pb) => pb.megacredits(2));
        }),
        description: 'Place 1 delegate in any party. Draw 2 cards with a Mars tag. Increase your M€ production 2 steps.',
      },
    });
  }
  public play(player: Player) {
    player.game.defer(new SendDelegateToArea(player, undefined, {count: 1, source: 'reserve'}));
    player.drawCard(2, {tag: Tags.MARS});
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
}
