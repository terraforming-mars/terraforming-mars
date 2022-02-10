import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Size} from '../render/Size';
import {Card} from '../Card';
import {all} from '../Options';

export class LunaFirstIncorporated extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.LUNA_FIRST_INCORPORATED,
      tags: [Tags.MOON],
      startingMegaCredits: 40,

      metadata: {
        description: 'You start with 40 M€, 2 steel, and 2 Titanium.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(40).steel(2).titanium(2).br;
          b.effect('When you raise any Moon Rate, increase your M€ production 1 step per step.', (eb) => {
            eb.moonColonyRate({size: Size.SMALL}).slash()
              .moonMiningRate({size: Size.SMALL}).slash()
              .moonLogisticsRate({size: Size.SMALL})
              .startEffect.production((pb) => pb.megacredits(1));
          }).br,
          b.effect('When any player raises any Moon Rate, gain 1M€ per step.', (eb) => {
            eb.moonColonyRate({size: Size.SMALL, all}).slash()
              .moonMiningRate({size: Size.SMALL, all}).slash()
              .moonLogisticsRate({size: Size.SMALL, all})
              .startEffect.megacredits(1);
          }).br;
        }),
      },
    });
  }

  public play(player: Player) {
    MoonExpansion.moonData(player.game).lunaFirstPlayer = player;
    player.steel = 2;
    player.titanium = 2;
    return undefined;
  }
}
