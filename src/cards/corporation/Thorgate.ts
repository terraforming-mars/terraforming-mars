import {Card} from '../Card';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {CorporationCard} from './CorporationCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class Thorgate extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.THORGATE,
      tags: [Tags.ENERGY],
      startingMegaCredits: 48,

      metadata: {
        cardNumber: 'R13',
        description: 'You start with 1 energy production and 48 MC.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.energy(1)).nbsp.megacredits(48);
          b.corpBox('effect', (ce) => {
            ce.effect('When playing a power card OR THE STANDARD PROJECT POWER PLANT, you pay 3 MC less for it.', (eb) => {
              // TODO(chosta): energy().played needs to be power() [same for space()]
              eb.energy(1).played.asterix().startEffect.megacredits(-3);
            });
          });
        }),
      },
    });
  }
  public getCardDiscount(_player: Player, card: IProjectCard) {
    if (card.tags.indexOf(Tags.ENERGY) !== -1) {
      return 3;
    }
    return 0;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY);
    return undefined;
  }
}

