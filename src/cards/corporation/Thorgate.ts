import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {CorporationCard} from './CorporationCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class Thorgate implements CorporationCard {
  public get name() {
    return CardName.THORGATE;
  }
  public get tags() {
    return [Tags.ENERGY];
  }
  public get startingMegaCredits() {
    return 48;
  }
  public get cardType() {
    return CardType.CORPORATION;
  }

  public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
    if (card.tags.indexOf(Tags.ENERGY) !== -1) {
      return 3;
    }
    return 0;
  }
  public play(player: Player, _game: Game) {
    player.addProduction(Resources.ENERGY);
    return undefined;
  }
  public get metadata() {
    return {
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
    };
  }
}

