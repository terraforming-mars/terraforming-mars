import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class Poseidon extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.POSEIDON,
      startingMegaCredits: 40,

      firstAction: {
        text: 'Place a colony',
        // title: 'Poseidon first action - Select where to build colony
        colonies: {buildColony: {}},
      },
      metadata: {
        cardNumber: 'R02',
        description: 'You start with 40 M€. As your first action, place a colony and become a Miepdoggy',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(40).nbsp.colonies(1);
          b.corpBox('effect', (ce) => {
            ce.effect('When you place a colony, including this, raise your M€ production 2 steps.', (eb) => {
              eb.colonies(1).startEffect.production((pb) => pb.megacredits(2));
            });
          });
        }),
      },
    });
  }

  public onColonyAddedByAnyPlayer(cardOwner: IPlayer, colonyOwner: IPlayer) {
    if (cardOwner === colonyOwner) {
      cardOwner.production.add(Resource.MEGACREDITS, 2, {log: true});
    }
  }
}
