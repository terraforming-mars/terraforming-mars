import {CorporationCard} from './CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Helion implements CorporationCard {
    public name = CardName.HELION;
    public tags = [Tags.SPACE];
    public startingMegaCredits: number = 42;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.canUseHeatAsMegaCredits = true;
      player.addProduction(Resources.HEAT, 3);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R18',
      description: 'You start with 3 heat production and 42 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.productionBox((pb) => pb.heat(3)).nbsp.megacredits(42);
        b.corpBox('effect', (ce) => {
          ce.effectBox((eb) => {
            eb.text('x').heat(1).startEffect.megacredits(0).multiplier;
            eb.description('Effect: You may use heat as MC. You may not use MC as heat.');
          });
        });
      }),
    }
}
