import {ActiveCorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';

export class BioSol extends ActiveCorporationCard {
  constructor() {
    super({
      name: CardName.BIO_SOL,
      tags: [Tag.MICROBE],
      startingMegaCredits: 42,
      resourceType: CardResource.MICROBE,
      victoryPoints: {resourcesHere: {}, per: 3},

      firstAction: {
        text: 'Draw 2 cards with a microbe tag',
        drawCard: {count: 2, tag: Tag.MICROBE},
      },

      action: {
        addResourcesToAnyCard: {type: CardResource.MICROBE, count: 1},
      },

      metadata: {
        cardNumber: 'PfC14',
        description: 'You start with 42 M€. As your first action, draw 2 cards with a microbe tag.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).cards(2, {secondaryTag: Tag.MICROBE}).br;
          b.corpBox('action', (corpbox) => corpbox.action(
            'Add 1 microbe to ANY card',
            (ab) => ab.empty().startAction.resource(CardResource.MICROBE).asterix()));
        }),
      },
    });
  }
}
