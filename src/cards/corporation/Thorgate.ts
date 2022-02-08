import {Card} from '../Card';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {CorporationCard} from './CorporationCard';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Thorgate extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.THORGATE,
      tags: [Tags.ENERGY],
      startingMegaCredits: 48,

      cardDiscount: {tag: Tags.ENERGY, amount: 3},
      metadata: {
        cardNumber: 'R13',
        description: 'You start with 1 energy production and 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.energy(1)).nbsp.megacredits(48);
          b.corpBox('effect', (ce) => {
            ce.effect('When playing a power card OR THE STANDARD PROJECT POWER PLANT, you pay 3 M€ less for it.', (eb) => {
              // TODO(chosta): energy().played needs to be power() [same for space()]
              eb.energy(1, {played}).asterix().startEffect.megacredits(-3);
            });
          });
        }),
      },
    });
  }

  public getCardDiscount(_player: Player, card: IProjectCard) {
    if (card.tags.includes(Tags.ENERGY)) {
      return 3;
    }
    return 0;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    return undefined;
  }
}

