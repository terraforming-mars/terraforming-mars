import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {Resource} from '../../../common/Resource';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/DeferredAction';
import {GainProduction} from '../../deferredActions/GainProduction';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';
import {Board} from '../../boards/Board';

export class LakefrontResorts extends Card implements ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.LAKEFRONT_RESORTS,
      tags: [Tag.BUILDING],
      startingMegaCredits: 54,

      metadata: {
        cardNumber: 'R38',
        description: 'You start with 54 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(54);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.MEDIUM);
            ce.effect('When any ocean tile is placed, increase your M€ production 1 step. Your bonus for placing adjacent to oceans is 3M€ instead of 2 M€.', (eb) => {
              eb.oceans(1, {size: Size.SMALL, all}).colon().production((pb) => pb.megacredits(1));
              eb.emptyTile('normal', {size: Size.SMALL}).oceans(1, {size: Size.SMALL});
              eb.startEffect.megacredits(3);
            });
          });
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.oceanBonus = 3;
    return undefined;
  }

  public override onDiscard(player: Player) {
    player.oceanBonus = 2;
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: ISpace) {
    if (Board.isUncoveredOceanSpace(space)) {
      cardOwner.game.defer(
        new GainProduction(cardOwner, Resource.MEGACREDITS),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }
}
