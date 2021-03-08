import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class LunaFirstIncorporated implements CorporationCard {
  public name = CardName.LUNA_FIRST_INCORPORATED;
  public startingMegaCredits = 40;
  public tags = [Tags.MOON];
  public cardType = CardType.CORPORATION;

  public play(player: Player) {
    MoonExpansion.moonData(player.game).lunaFirstPlayer = player;
    player.steel = 2;
    player.titanium = 2;
    return undefined;
  }

  public readonly metadata: CardMetadata = {
    description: 'You start with 40 MC, 2 steel, and 2 Ctitanium.',
    cardNumber: '',
    renderData: CardRenderer.builder((b) => {
      b.megacredits(40).steel(2).titanium(2).br;
      b.effect('When you raise any Moon Rate, increase your MC production 1 step per step.', (eb) => {
        eb.moonColonyRate({size: CardRenderItemSize.SMALL}).slash()
          .moonMiningRate({size: CardRenderItemSize.SMALL}).slash()
          .moonLogisticsRate({size: CardRenderItemSize.SMALL})
          .startEffect.production((pb) => pb.megacredits(1));
      }).br,
      b.effect('When any player raises any Moon Rate, gain 1MC per step.', (eb) => {
        eb.moonColonyRate({size: CardRenderItemSize.SMALL}).any.slash()
          .moonMiningRate({size: CardRenderItemSize.SMALL}).any.slash()
          .moonLogisticsRate({size: CardRenderItemSize.SMALL}).any.
          startEffect.megacredits(1);
      }).br;
    }),
  }
}
