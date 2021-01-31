import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class MonsInsurance extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.MONS_INSURANCE,
      startingMegaCredits: 48,

      metadata: {
        cardNumber: 'R46',
        description: 'You start with 48 MC. Increase your MC production 4 steps. ALL OPPONENTS DECREASE THEIR MC PRODUCTION 2 STEPS. THIS DOES NOT TRIGGER THE EFFECT BELOW.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(48).production((pb) => {
            pb.megacredits(4).nbsp.megacredits(-2).any.asterix();
          });
          b.corpBox('effect', (cb) => {
            cb.vSpace(CardRenderItemSize.SMALL);
            cb.effect('When a player causes another player to decrease production or lose resources, pay 3MC to the victim, or as much as possible.', (eb) => {
              eb.production((pb) => pb.wild(1).any).or().minus().wild(1).any;
              eb.startEffect.text('pay', CardRenderItemSize.SMALL, true).megacredits(3);
            });
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 6);
    for (const p of player.game.getPlayers()) {
      p.addProduction(Resources.MEGACREDITS, -2);
    }
    player.game.monsInsuranceOwner = player.id;
    return undefined;
  }
}
