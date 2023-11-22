import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class MonsInsurance extends CorporationCard {
  constructor() {
    super({
      name: CardName.MONS_INSURANCE,
      startingMegaCredits: 48,

      behavior: {
        production: {megacredits: 4},
      },

      metadata: {
        cardNumber: 'R46',
        description: 'You start with 48 M€. Increase your M€ production 4 steps. ALL OPPONENTS DECREASE THEIR M€ production 2 STEPS. THIS DOES NOT TRIGGER THE EFFECT BELOW.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(48).production((pb) => {
            pb.megacredits(4).nbsp.megacredits(-2, {all}).asterix();
          });
          b.corpBox('effect', (cb) => {
            cb.vSpace(Size.SMALL);
            cb.effect('When a player causes another player to decrease production or lose resources, pay 3M€ to the victim, or as much as possible.', (eb) => {
              eb.production((pb) => pb.wild(1, {all})).or().minus().wild(1, {all});
              eb.startEffect.text('pay', Size.SMALL, true).megacredits(3);
            });
          });
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    for (const p of player.game.getPlayers()) {
      if (p.id !== player.id) {
        p.production.add(Resource.MEGACREDITS, -2, {log: true});
      }
    }
    player.game.monsInsuranceOwner = player.id;
    return undefined;
  }

  // When `insured` is undefined, it's the neutral player.
  public payDebt(player: IPlayer, claimant : IPlayer | undefined) {
    if (player !== claimant) {
      const retribution = Math.min(player.megaCredits, 3);
      if (claimant) claimant.megaCredits += retribution;
      player.stock.deduct(Resource.MEGACREDITS, retribution);
      if (retribution > 0) {
        if (claimant !== undefined) {
          player.game.log('${0} received ${1} M€ from ${2} owner (${3})', (b) =>
            b.player(claimant)
              .number(retribution)
              .cardName(CardName.MONS_INSURANCE)
              .player(player));
        } else {
          player.game.log('Neutral player received ${0} M€ from ${1} owner (${2})', (b) =>
            b.number(retribution)
              .cardName(CardName.MONS_INSURANCE)
              .player(player));
        }
      }
    }
  }
}
