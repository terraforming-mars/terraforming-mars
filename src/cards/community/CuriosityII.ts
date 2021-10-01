import {Card} from '../Card';
import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {DrawCards} from '../../deferredActions/DrawCards';
import {SpaceType} from '../../SpaceType';
import {SpaceBonus} from '../../SpaceBonus';
import {Phase} from '../../Phase';
import {Units} from '../../Units';

export class CuriosityII extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.CURIOSITY_II,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      startingMegaCredits: 40,
      productionBox: Units.of({steel: 2}),

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
    const eligibleBonuses = [SpaceBonus.STEEL, SpaceBonus.TITANIUM, SpaceBonus.HEAT, SpaceBonus.PLANT, SpaceBonus.MEGACREDITS, SpaceBonus.ANIMAL, SpaceBonus.MICROBE];

    if (cardOwner.id !== activePlayer.id) return;
    if (cardOwner.game.phase === Phase.SOLAR) return;
    if (space.spaceType === SpaceType.COLONY) return;

    if (space.bonus.some((bonus) => eligibleBonuses.includes(bonus)) || space.tile?.covers !== undefined) {
      cardOwner.game.defer(new DeferredAction(cardOwner, () => this.corpAction(cardOwner)));
    }
  }

  public play(player: Player) {
    player.addProduction(Resources.STEEL, 2);
    return undefined;
  }

  private corpAction(player: Player) {
    if (!player.canAfford(2)) return undefined;

    return new OrOptions(
      new SelectOption('Pay 2 M€ to draw a card', 'Confirm', () => {
        player.game.defer(new SelectHowToPayDeferred(player, 2, {title: 'Select how to pay for action'}));
        player.game.defer(DrawCards.keepAll(player));
        return undefined;
      }),
      new SelectOption('Do nothing', 'Confirm', () => {
        return undefined;
      }),
    );
  }
}
