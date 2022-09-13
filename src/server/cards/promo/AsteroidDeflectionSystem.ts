import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {played} from '../Options';

export class AsteroidDeflectionSystem extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ASTEROID_DEFLECTION_SYSTEM,
      tags: [Tag.SPACE, Tag.EARTH, Tag.BUILDING],
      cost: 13,

      resourceType: CardResource.ASTEROID,
      victoryPoints: VictoryPoints.resource(1, 1),

      behavior: {
        production: {energy: -1},
      },

      metadata: {
        cardNumber: 'X14',
        renderData: CardRenderer.builder((b) => {
          b.action('REVEAL AND DISCARD the top card of the deck. If it has a space tag, add an asteroid here.', (eb) => {
            eb.empty().startAction.cards(1).asterix().nbsp.space({played}).colon().asteroids(1);
          }).br;
          b.production((pb) => pb.minus().energy(1)).text('opponents may not remove your plants', Size.SMALL, true);
        }),
        description: {
          text: 'Decrease your energy production 1 step. 1VP per asteroid on this card.',
          align: 'left',
        },
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const topCard = player.game.projectDeck.draw(player.game);
    if (topCard.tags.includes(Tag.SPACE)) player.addResourceTo(this);
    player.game.log('${0} revealed and discarded ${1}', (b) => b.player(player).card(topCard));
    player.game.projectDeck.discard(topCard);
    return undefined;
  }
}
