import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {CardResource} from '../../../common/CardResource';
import {Player} from '../../Player';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {MoonCards} from '../../moon/MoonCards';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class NanotechIndustries extends Card implements IActionCard, ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.NANOTECH_INDUSTRIES,
      tags: [Tag.SCIENCE, Tag.MOON],
      startingMegaCredits: 42,
      resourceType: CardResource.SCIENCE,
      initialActionText: 'Draw 3 cards and keep 2.',

      victoryPoints: VictoryPoints.resource(1, 2),

      metadata: {
        cardNumber: 'MC1',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).cards(3).minus().cards(1).br;
          b.action('Add 1 science resource to ANY card [except those giving 2 or more VP per 1 science resource.]', (eb) => {
            eb.empty().startAction.science(1).asterix();
          });
        }),
        description: 'You start with 42 M€. As your first action, draw 3 cards. Take 2 of them into hand, and discard the rest. ' +
          '1 VP for every 2 science resources here.',
      },
    });
  }


  public initialAction(player: Player): PlayerInput {
    return player.drawCardKeepSome(3, {keepMax: 2});
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(
      player,
      CardResource.SCIENCE,
      {filter: (card): boolean => MoonCards.scienceCardsWithLessThan2VP.has(card.name)},
    ));
    return undefined;
  }
}
