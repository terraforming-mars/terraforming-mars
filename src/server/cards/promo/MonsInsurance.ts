import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class MonsInsurance extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.MONS_INSURANCE,
      startingMegaCredits: 48,

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

  public override bespokePlay(player: Player) {
    player.production.add(Resources.MEGACREDITS, 6);
    for (const p of player.game.getPlayers()) {
      p.production.add(Resources.MEGACREDITS, -2, {log: true});
    }
    player.game.monsInsuranceOwner = player.id;
    return undefined;
  }

  // When `insured` is undefined, it's the neutral player.
  public payDebt(player: Player, claimant : Player | undefined) {
    if (player !== claimant) {
      const retribution = Math.min(player.megaCredits, 3);
      if (claimant) claimant.megaCredits += retribution;
      player.deductResource(Resources.MEGACREDITS, retribution);
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
