import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard, VictoryPoints} from '../ICard';
import {CardResource} from '../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class BioSol extends Card implements ICorporationCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.BIO_SOL,
      tags: [Tags.MICROBE],
      startingMegaCredits: 42,
      resourceType: CardResource.MICROBE,
      victoryPoints: VictoryPoints.resource(1, 3),

      initialActionText: 'Draw 2 cards with a microbe tag',

      metadata: {
        cardNumber: 'PfC14',
        description: 'You start with 42 M€. As your first action, draw 2 cards with a microbe tag.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).cards(2, {secondaryTag: Tags.MICROBE}).br;
          b.corpBox('action', (corpbox) => corpbox.action(
            'Add 1 microbe to ANY card',
            (ab) => ab.empty().startAction.microbes(1).asterix()));
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public initialAction(player: Player) {
    player.drawCard(2, {tag: Tags.MICROBE});
    return undefined;
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE));
    return undefined;
  }
}
