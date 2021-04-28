import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Size} from '../render/Size';

export class AsteroidDeflectionSystem extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ASTEROID_DEFLECTION_SYSTEM,
      tags: [Tags.SPACE, Tags.EARTH, Tags.BUILDING],
      cost: 13,
      resourceType: ResourceType.ASTEROID,

      metadata: {
        cardNumber: 'X14',
        renderData: CardRenderer.builder((b) => {
          b.action('REVEAL AND DISCARD the top card of the deck. If it has a space tag, add an asteroid here.', (eb) => {
            eb.empty().startAction.cards(1).asterix().nbsp.space().played.colon().asteroids(1);
          }).br;
          b.production((pb) => pb.minus().energy(1)).text('opponents may not remove your plants', Size.SMALL, true);
        }),
        description: {
          text: 'Decrease your energy production 1 step. 1VP per asteroid on this card.',
          align: 'left',
        },
        victoryPoints: CardRenderDynamicVictoryPoints.asteroids(1, 1),
      },
    });
  }
  public resourceCount = 0;

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const topCard = player.game.dealer.dealCard(player.game);
    if (topCard.tags.includes(Tags.SPACE)) player.addResourceTo(this);
    player.game.log('${0} revealed and discarded ${1}', (b) => b.player(player).card(topCard));
    player.game.dealer.discard(topCard);
    return undefined;
  }

  public getVictoryPoints(): number {
    return this.resourceCount;
  }
}
