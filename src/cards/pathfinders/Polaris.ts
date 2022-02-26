import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {ISpace} from '../../boards/ISpace';
import {GainResources} from '../../deferredActions/GainResources';
import {Priority} from '../../deferredActions/DeferredAction';
import {Size} from '../../common/cards/render/Size';
import {Board} from '../../boards/Board';

export class Polaris extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.POLARIS,
      tags: [Tags.SPACE],
      startingMegaCredits: 32,

      initialActionText: 'Place your initial ocean.',

      metadata: {
        cardNumber: 'PfC1',
        description: 'You start with 32 M€. As your first action, place an ocean tile.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(32).oceans(1);
          b.corpBox('effect', (ce) => {
            ce.effect('When any ocean tile is placed ON MARS, increase your M€ production 1 step. When you place an ocean tile, gain 4M€.', (eb) => {
              eb.oceans(1, {size: Size.SMALL, all}).colon().production((pb) => pb.megacredits(1));
              eb.nbsp;
              eb.oceans(1, {size: Size.SMALL}).startEffect.megacredits(4, {digit});
            });
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public initialAction(player: Player) {
    player.game.defer(new PlaceOceanTile(player));
    return undefined;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (Board.isUncoveredOceanSpace(space)) {
      // TODO(kberg): Find a way to add Card to addProduction log options.
      cardOwner.addProduction(Resources.MEGACREDITS, 1);
      activePlayer.game.log(
        '${0} gained 1 ${1} production from ${2}',
        (b) => b.player(cardOwner).string(Resources.MEGACREDITS).cardName(this.name));
      if (activePlayer.id === cardOwner.id) {
        cardOwner.game.defer(
          new GainResources(cardOwner, Resources.MEGACREDITS, {
            count: 4,
            cb: () => activePlayer.game.log(
              '${0} gained ${1} from ${2}',
              (b) => b.player(cardOwner).string(Resources.MEGACREDITS).cardName(this.name)),
          }),
          cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
        );
      }
    }
  }
}
