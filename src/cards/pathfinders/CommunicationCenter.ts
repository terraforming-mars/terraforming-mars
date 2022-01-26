import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {ResourceType} from '../../common/ResourceType';
import {Resources} from '../../common/Resources';
import {Units} from '../../Units';
import {all, played} from '../Options';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class CommunicationCenter extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.COMMUNICATION_CENTER,
      cost: 13,
      tags: [Tags.SPACE, Tags.MARS, Tags.BUILDING],
      resourceType: ResourceType.DATA,
      productionBox: Units.of({energy: -1}),

      metadata: {
        cardNumber: 'Pf28',
        renderData: CardRenderer.builder((b) => {
          b.effect('Whenever ANY PLAYER plays an event, add 1 data to this card.', (eb) => {
            eb.event({all, played}).startEffect.data({amount: 1});
          }).br;
          b.effect('Remove 3 data to draw a card automatically.', (eb) => {
            eb.data({amount: 3}).startEffect.cards(1);
          }).br;
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
}

