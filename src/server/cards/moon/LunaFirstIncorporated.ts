import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Size} from '../../../common/cards/render/Size';
import {Card} from '../Card';
import {all} from '../Options';

export class LunaFirstIncorporated extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.LUNA_FIRST_INCORPORATED,
      tags: [Tag.MOON],
      startingMegaCredits: 40,

      behavior: {
        stock: {steel: 2, titanium: 2},
      },

      metadata: {
        description: 'You start with 40 M€, 2 steel, and 2 Titanium.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(40).steel(2).titanium(2).br;
          b.effect('When you raise any Moon Rate, increase your M€ production 1 step per step.', (eb) => {
            eb.moonHabitatRate({size: Size.SMALL}).slash()
              .moonMiningRate({size: Size.SMALL}).slash()
              .moonLogisticsRate({size: Size.SMALL})
              .startEffect.production((pb) => pb.megacredits(1));
          }).br,
          b.effect('When any player raises any Moon Rate, gain 1M€ per step.', (eb) => {
            eb.moonHabitatRate({size: Size.SMALL, all}).slash()
              .moonMiningRate({size: Size.SMALL, all}).slash()
              .moonLogisticsRate({size: Size.SMALL, all})
              .startEffect.megacredits(1);
          }).br;
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    MoonExpansion.moonData(player.game).lunaFirstPlayer = player;
    return undefined;
  }
}
