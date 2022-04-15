import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {CardResource} from '../../common/CardResource';
import {Resources} from '../../common/Resources';
import {Units} from '../../common/Units';
import {all, played} from '../Options';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {Size} from '../../common/cards/render/Size';
import {ICard} from '../ICard';

export class CommunicationCenter extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.COMMUNICATION_CENTER,
      cost: 13,
      tags: [Tags.SPACE, Tags.MARS, Tags.BUILDING],
      resourceType: CardResource.DATA,
      productionBox: Units.of({energy: -1}),

      metadata: {
        cardNumber: 'Pf28',
        renderData: CardRenderer.builder((b) => {
          b.event({all, played}).colon().data({amount: 1}).nbsp.data({amount: 3, digit: true}).colon().cards(1).br;
          b.text('(Effect: Whenever ANY PLAYER plays an event, add 1 data to this card.)', Size.TINY, false, false).br;
          b.text('(Effect: Remove 3 data to draw a card automatically.)', Size.TINY, false, false).br;
          b.minus().production((pb) => pb.energy(1)).data({amount: 2});
        }),
        description: 'Decrease your energy production 1 step. Place 2 data on this card.',
      },
    });
  }

  public override resourceCount = 0;

  // Card behavior is in PathfindersExpansion.onCardPlayed. Card.onCardPlayed
  // does not apply to _any card played_

  public override canPlay(player: Player) {
    return player.getProduction(Resources.ENERGY) > 0;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.game.defer(new DeferredAction(player, () => {
      // Play this after the card's been put in hand. Otherwise it will generate an error.
      player.addResourceTo(this, 2);
      return undefined;
    }));
    return undefined;
  }

  public onResourceAdded(player: Player, playedCard: ICard) {
    if (playedCard.name !== this.name) return;
    while (this.resourceCount >= 3) {
      this.resourceCount -= 3;
      player.drawCard(1);
      player.game.log('${0} automatically removed 3 data from ${1} to draw a card.', (b) => {
        b.player(player).card(this);
      });
    }
  }
}

