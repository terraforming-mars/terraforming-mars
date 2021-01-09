import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Aphrodite implements CorporationCard {
    public name = CardName.APHRODITE;
    public tags = [Tags.PLANT, Tags.VENUS];
    public startingMegaCredits: number = 47;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'R01',
      description: 'You start with 1 plant production and 47 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.production((pb) => pb.plants(1)).nbsp.megacredits(47);
        b.corpBox('effect', (ce) => {
          ce.effect('Whenever Venus is terraformed 1 step, you gain 2MC.', (eb) => {
            eb.venus(1).any.startEffect.megacredits(2);
          });
        });
      }),
    }
}
