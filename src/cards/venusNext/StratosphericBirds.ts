import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class StratosphericBirds extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.STRATOSPHERIC_BIRDS,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS, Tags.ANIMAL],
      cost: 12,
      resourceType: CardResource.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 1),

      requirements: CardRequirements.builder((b) => b.venus(12)),
      metadata: {
        cardNumber: '249',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.minus().floaters(1).br;
          b.vpText('1 VP for each Animal on this card.');
        }),
        description: {
          text: 'Requires Venus 12% and that you spend 1 Floater from any card.',
          align: 'left',
        },
      },
    });
  }
  public override resourceCount: number = 0;
  public override canPlay(player: Player): boolean {
    const cardsWithFloater = player.getCardsWithResources(CardResource.FLOATER);
    if (cardsWithFloater.length === 0) return false;

    if (cardsWithFloater.length > 1) {
      return true;
    } else {
      const floaterCard = cardsWithFloater[0];
      if (floaterCard.name !== CardName.DIRIGIBLES) return true;

      const canPayForFloater = ((floaterCard.resourceCount - 1) * 3 + player.megaCredits) >= player.getCardCost(this);
      return canPayForFloater;
    }
  }
  public play(player: Player) {
    player.game.defer(new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, true));
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }
}
