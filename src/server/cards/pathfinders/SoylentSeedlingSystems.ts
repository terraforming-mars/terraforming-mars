import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {played} from '../Options';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardResource} from '../../../common/CardResource';
import {Space} from '../../boards/Space';
import {Board} from '../../boards/Board';

export class SoylentSeedlingSystems extends CorporationCard {
  constructor() {
    super({
      name: CardName.SOYLENT_SEEDLING_SYSTEMS,
      tags: [Tag.SCIENCE, Tag.PLANT],
      startingMegaCredits: 38,
      resourceType: CardResource.SEED,

      behavior: {
        addResources: 2,
      },

      metadata: {
        cardNumber: 'PfC8',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(38).seed().seed().br;
          b.effect('When you place a greenery tile, add 1 seed resource to this card.', (eb) => {
            eb.greenery().startEffect.seed();
          }).br;
          b.effect('When paying for a plant card, or the STANDARD GREENERY PROJECT, seeds here may be used as 5 M€ each.', (eb) => {
            eb.plants(1, {played}).slash().greenery().startEffect.seed().equals().megacredits(5);
          }).br;
        }),
        description: 'You start with 38M€ and 2 seeds on this card.',
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (cardOwner.id !== activePlayer.id) {
      return;
    }
    if (Board.isGreenerySpace(space)) {
      cardOwner.addResourceTo(this, {log: true});
    }
  }
}

