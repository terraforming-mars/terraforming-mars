import {Card} from '../Card';
import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {DrawCards} from '../../deferredActions/DrawCards';
import {SpaceType} from '../../SpaceType';

export class CuriosityII extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.CURIOSITY_II,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      startingMegaCredits: 40,

      metadata: {
        cardNumber: '',
        description: 'You start with 40 MC and 2 steel production.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(40).nbsp.production((pb) => pb.steel(2));
          b.corpBox('effect', (ce) => {
            ce.effect('When you place a tile on a non-empty space ON MARS, you may pay 3 MC to draw a card.', (eb) => {
              eb.emptyTile('normal', CardRenderItemSize.SMALL).startEffect.megacredits(3).arrow().cards(1);
            });
          });
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (cardOwner.id === activePlayer.id && space.bonus.length > 0 && space.spaceType !== SpaceType.COLONY) {
      cardOwner.game.defer(new DeferredAction(cardOwner, () => this.corpAction(cardOwner)));
    }
  }

  public play(player: Player) {
    player.addProduction(Resources.STEEL, 2);
    return undefined;
  }

  private corpAction(player: Player) {
    if (!player.canAfford(3)) return undefined;

    return new OrOptions(
      new SelectOption('Pay 3 MC to draw a card', 'Confirm', () => {
        player.game.defer(new SelectHowToPayDeferred(player, 3, {title: 'Select how to pay for action'}));
        player.game.defer(DrawCards.keepAll(player));
        return undefined;
      }),
      new SelectOption('Do nothing', 'Confirm', () => {
        return undefined;
      }),
    );
  }
}
