import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {Priority} from '../../deferredActions/Priority';

export class OldMiningColony extends PreludeCard {
  constructor() {
    super({
      name: CardName.OLD_MINING_COLONY,
      tags: [Tag.SPACE],

      behavior: {
        production: {titanium: 1},
        colonies: {buildColony: {}},
      },

      metadata: {
        cardNumber: 'P55',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).colonies(1).minus().cards(1);
        }),
        description: 'Increase your titanium production 1 step. Place 1 colony. Discard 1 card.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    return player.cardsInHand.length > 0;
  }
  public override bespokePlay(player: IPlayer) {
    player.game.defer(new DiscardCards(player, 1), Priority.DISCARD_CARDS);
    return undefined;
  }
}
