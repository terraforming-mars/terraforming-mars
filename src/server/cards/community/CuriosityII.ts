import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {DrawCards} from '../../deferredActions/DrawCards';
import {SpaceType} from '../../../common/boards/SpaceType';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {Phase} from '../../../common/Phase';

export class CuriosityII extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.CURIOSITY_II,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      startingMegaCredits: 40,

      behavior: {
        production: {steel: 2},
      },

      metadata: {
        cardNumber: '',
        description: 'You start with 40 M€ and 2 steel production.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(40).nbsp.production((pb) => pb.steel(2));
          b.corpBox('effect', (ce) => {
            ce.vSpace();
            ce.effect(
              'When you place a tile on an area that has a RESOURCE placement bonus, ' +
              'or on top of another tile, you may pay 2 M€ to draw a card.',
              (eb) => {
                eb.emptyTile('normal', {size: Size.SMALL}).nbsp.asterix().startEffect.megacredits(-2).cards(1);
              });
          });
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    const eligibleBonuses = [SpaceBonus.STEEL, SpaceBonus.TITANIUM, SpaceBonus.HEAT, SpaceBonus.PLANT, SpaceBonus.MEGACREDITS, SpaceBonus.ANIMAL, SpaceBonus.MICROBE, SpaceBonus.ENERGY];

    if (cardOwner.id !== activePlayer.id) return;
    if (cardOwner.game.phase === Phase.SOLAR) return;
    if (space.spaceType === SpaceType.COLONY) return;

    if (space.bonus.some((bonus) => eligibleBonuses.includes(bonus)) || space.tile?.covers !== undefined) {
      cardOwner.game.defer(new SimpleDeferredAction(cardOwner, () => this.corpAction(cardOwner)));
    }
  }

  private corpAction(player: Player) {
    if (!player.canAfford(2)) return undefined;

    return new OrOptions(
      new SelectOption('Pay 2 M€ to draw a card', 'Confirm', () => {
        player.game.defer(new SelectPaymentDeferred(player, 2, {title: 'Select how to pay for action'}));
        player.game.defer(DrawCards.keepAll(player));
        return undefined;
      }),
      new SelectOption('Do nothing', 'Confirm', () => {
        return undefined;
      }),
    );
  }
}
