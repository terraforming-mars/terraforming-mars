import {IProjectCard} from '../IProjectCard';
import {IResourceCard, VictoryPoints} from '../ICard';
import {IActionCard} from '../ICard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ResourceType} from '../../common/ResourceType';
import {Tags} from '../../common/cards/Tags';
import {CardRequirements} from '../CardRequirements';
import {SelectCard} from '../../inputs/SelectCard';

export class FloaterUrbanism extends Card implements IProjectCard, IActionCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.FLOATER_URBANISM,
      cost: 7,
      tags: [Tags.VENUS],
      resourceType: ResourceType.VENUSIAN_HABITAT,
      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS, 4)),
      victoryPoints: VictoryPoints.resource(1, 1),

      metadata: {
        cardNumber: 'PfTMP',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 floater from any card and add 1 Venusian habitat on this card.', (ab) => {
            ab.floaters(1).startAction.venusianHabitat(1);
          }).br;
          b.vpText('1 VP for every Venusian habitat on this card.');
        }),
        description: 'Requires 4 Venus tags.',
      },
    });
  }

  public override resourceCount = 0;

  public canAct(player: Player) {
    return player.getResourceCount(ResourceType.FLOATER) > 0;
  }

  public action(player: Player) {
    const cards = player.getCardsWithResources(ResourceType.FLOATER);
    const input = new SelectCard(
      'Choose a card to move a floater to a Venusian habitat.',
      'Choose',
      cards,
      (selected) => {
        player.removeResourceFrom(selected[0], 1, player.game, undefined, true);
        player.addResourceTo(this, {log: true});
        return undefined;
      });
    if (cards.length === 0) {
      return undefined;
    }
    if (cards.length === 1) {
      input.cb(cards);
      return undefined;
    }
    return input;
  }

  public play() {
    return undefined;
  }
}
