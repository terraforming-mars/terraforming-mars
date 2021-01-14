import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {TileType} from '../../TileType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class LakefrontResorts implements CorporationCard {
    public name = CardName.LAKEFRONT_RESORTS;
    public tags = [Tags.BUILDING];
    public startingMegaCredits: number = 54;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.oceanBonus = 3;
      return undefined;
    }
    public onTilePlaced(player: Player, space: ISpace) {
      if (space.tile !== undefined && space.tile.tileType === TileType.OCEAN) {
        player.addProduction(Resources.MEGACREDITS);
      }
    }
    public metadata: CardMetadata = {
      cardNumber: 'R38',
      description: 'You start with 54 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br.br.br;
        b.megacredits(54);
        b.corpBox('effect', (ce) => {
          ce.vSpace(CardRenderItemSize.MEDIUM);
          ce.effect('When any ocean tile is placed, increase your MC production 1 step. Your bonus for placing adjacent to oceans is 3MC instead of 2MC.', (eb) => {
            eb.oceans(1, CardRenderItemSize.SMALL).any.colon().production((pb) => pb.megacredits(1));
            eb.emptyTile('normal', CardRenderItemSize.SMALL).oceans(1, CardRenderItemSize.SMALL);
            eb.startEffect.megacredits(3);
          });
        });
      }),
    }
}
