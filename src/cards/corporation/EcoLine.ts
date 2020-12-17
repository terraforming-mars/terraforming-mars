import {CorporationCard} from './CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class EcoLine implements CorporationCard {
    public name = CardName.ECOLINE;
    public tags = [Tags.PLANT];
    public startingMegaCredits: number = 36;
    public cardType = CardType.CORPORATION;
    public play(player: Player) {
      player.addProduction(Resources.PLANTS, 2);
      player.plants = 3;
      player.plantsNeededForGreenery = 7;
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R17',
      description: 'You start with 2 plant production, 3 plants, and 36 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.productionBox((pb) => pb.plants(2)).megacredits(36).plants(3).digit;
        b.corpBox('effect', (ce) => {
          ce.effectBox((eb) => {
            eb.plants(7).digit.startAction.greenery();
            eb.description('Effect: You may always pay 7 plants, instead of 8, to place greenery.');
          });
        });
      }),
    }
}
