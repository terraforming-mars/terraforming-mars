import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class LunaFirstIncorporated extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.LUNA_FIRST_INCORPORATED,
      tags: [Tag.MOON],
      startingMegaCredits: 40,

      behavior: {
        // stock: {steel: 2, titanium: 2},
        stock: {steel: 1, titanium: 1},
      },

      metadata: {
        // description: 'You start with 40 M€, 2 steel, and 2 titanium.',
        description: 'You start with 40 M€, 1 steel, and 1 titanium.',
        cardNumber: 'MC6',
        renderData: CardRenderer.builder((b) => {
          // b.megacredits(40).steel(2).titanium(2).br;
          b.megacredits(40).steel(1).titanium(1).br;
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

  public override bespokePlay(player: IPlayer) {
    MoonExpansion.moonData(player.game).lunaFirstPlayer = player;
    return undefined;
  }
}
