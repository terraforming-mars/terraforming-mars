import {CorporationCard} from './CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class EcoLine implements CorporationCard {
  public get name() {
    return CardName.ECOLINE;
  }
  public get tags() {
    return [Tags.PLANT];
  }
  public get startingMegaCredits() {
    return 36;
  }
  public get cardType() {
    return CardType.CORPORATION;
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 2);
    player.plants = 3;
    player.plantsNeededForGreenery = 7;
    return undefined;
  }

  public get metadata() {
    return {
      cardNumber: 'R17',
      description: 'You start with 2 plant production, 3 plants, and 36 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.productionBox((pb) => pb.plants(2)).nbsp.megacredits(36).plants(3).digit;
        b.corpBox('effect', (ce) => {
          ce.effectBox((eb) => {
            eb.plants(7).digit.startAction.greenery();
            eb.description('Effect: You may always pay 7 plants, instead of 8, to place greenery.');
          });
        });
      }),
    };
  }
}
