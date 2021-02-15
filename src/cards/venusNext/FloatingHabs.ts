import {ICard, IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Card} from '../Card';

export class FloatingHabs extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.FLOATING_HABS,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS],
      cost: 5,
      resourceType: ResourceType.FLOATER,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      metadata: {
        cardNumber: '225',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 MC to add 1 Floater to ANY card', (eb) => {
            eb.megacredits(2).startAction.floaters(1).asterix();
          }).br;
          b.vpText('1 VP for every 2nd Floater on this card.');
        }),
        description: 'Requires 2 Science tags. 1 VP for every 2nd Floater on this card',
        victoryPoints: CardRenderDynamicVictoryPoints.floaters(1, 2),
      },
    });
  };
  public resourceCount: number = 0;
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 2;
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.canAfford(2);
  }

  public getVictoryPoints(): number {
    return Math.floor(this.resourceCount / 2);
  }

  public action(player: Player) {
    const floaterCards = player.getResourceCards(ResourceType.FLOATER);

    // add to itself if no other available target
    if (floaterCards.length === 1) {
      player.game.defer(new SelectHowToPayDeferred(player, 2, {title: 'Select how to pay for Floating Habs action'}));
      LogHelper.logAddResource(player, floaterCards[0]);
      player.addResourceTo(floaterCards[0], 1);
      return undefined;
    }

    return new SelectCard(
      'Spend 2 MC and select card to add 1 floater',
      'Add floater',
      floaterCards,
      (foundCards: Array<ICard>) => {
        player.game.defer(new SelectHowToPayDeferred(player, 2, {title: 'Select how to pay for Floating Habs action'}));
        LogHelper.logAddResource(player, foundCards[0]);
        player.addResourceTo(foundCards[0], 1);
        return undefined;
      },
    );
  }
}
