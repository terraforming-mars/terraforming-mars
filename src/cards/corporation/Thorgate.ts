import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {CorporationCard} from './CorporationCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Thorgate implements CorporationCard {
    public name = CardName.THORGATE;
    public tags = [Tags.ENERGY];
    public startingMegaCredits: number = 48;
    public cardType = CardType.CORPORATION;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
      if (card.tags.indexOf(Tags.ENERGY) !== -1) {
        return 3;
      }
      return 0;
    }
    public play(player: Player, _game: Game) {
      player.powerPlantCost -= 3;
      player.addProduction(Resources.ENERGY);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'R13',
      description: 'You start with 1 energy production and 48 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.productionBox((pb) => pb.energy(1)).nbsp.megacredits(48);
        b.corpBox('effect', (ce) => {
          ce.effectBox((eb) => {
            // TODO(chosta): energy().played needs to be power() [same for space()]
            eb.energy(1).played.asterix().startEffect.megacredits(-3);
            eb.description('Effect: When playing a power card OR THE STANDARD PROJECT POWER PLANT, you pay 3 MC less for it.');
          });
        });
      }),
    }
}

