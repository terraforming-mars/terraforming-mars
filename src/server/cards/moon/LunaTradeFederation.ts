import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {ISpace} from '../../boards/ISpace';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';
// import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Card} from '../Card';
// import {all, multiplier} from '../Options';
import {multiplier} from '../Options';

export class LunaTradeFederation extends Card implements ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.LUNA_TRADE_FEDERATION,
      tags: [Tag.MOON, Tag.SPACE],
      startingMegaCredits: 15,

      behavior: {
        stock: {titanium: 10},
      },
      // firstAction: {
      //   text: 'Place a mine tile on The Moon.',
      //   moon: {mineTile: {}},
      // },

      metadata: {
        // description: 'You start with 15 M€ and 10 titanium. As your first action, place a mine tile on The Moon and raise the mining rate 1 step.',
        description: 'You start with 15 M€ and 10 titanium.',
        cardNumber: 'MC9',
        renderData: CardRenderer.builder((b) => {
          // b.megacredits(15).titanium(10).moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE}).br;
          b.megacredits(15).titanium(10).br;
          // b.effect('When any mine tile is placed on The Moon, raise your titanium production 1 step.', (eb) => {
          //   eb.moonMine({size: Size.SMALL, all}).startEffect.production((pb) => pb.titanium(1)).nbsp;
          // });
          b.effect('When you place a mine tile on The Moon, raise your titanium production 1 step.', (eb) => {
            eb.moonMine({size: Size.SMALL}).startEffect.production((pb) => pb.titanium(1)).nbsp;
          });
          b.br;
          b.effect('You may use titanium resources as 2M€ each.', (eb) => {
            eb.startEffect.text('X').titanium(1).equals().megacredits(2, {multiplier});
          });
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.canUseTitaniumAsMegacredits = true;
    return undefined;
  }

  // public onTilePlaced(cardOwner: IPlayer, _activePlayer: IPlayer, , space: ISpace) {
  //   if (MoonExpansion.spaceHasType(space, TileType.MOON_MINE)) {
  //     cardOwner.production.add(Resources.TITANIUM, 1, {log: true});
  //   }
  // }
  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: ISpace) {
    if (activePlayer === cardOwner && MoonExpansion.spaceHasType(space, TileType.MOON_MINE)) {
      cardOwner.production.add(Resource.TITANIUM, 1, {log: true});
    }
  }
}
