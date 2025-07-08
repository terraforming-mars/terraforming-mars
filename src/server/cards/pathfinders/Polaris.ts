import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';
import {Space} from '../../boards/Space';
import {GainResources} from '../../deferredActions/GainResources';
import {Priority} from '../../deferredActions/Priority';
import {Size} from '../../../common/cards/render/Size';
import {Board} from '../../boards/Board';
import {Phase} from '../../../common/Phase';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class Polaris extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.POLARIS,
      tags: [Tag.SPACE],
      startingMegaCredits: 32,

      firstAction: {
        text: 'Place your initial ocean.',
        ocean: {},
      },

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

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (Board.isUncoveredOceanSpace(space)) {
      // TODO(kberg): Find a way to add Card to addProduction log options.
      cardOwner.production.add(Resource.MEGACREDITS, 1);
      activePlayer.game.log(
        '${0} gained 1 ${1} production from ${2}',
        (b) => b.player(cardOwner).string(Resource.MEGACREDITS).cardName(this.name));
      if (activePlayer.id === cardOwner.id && cardOwner.game.phase !== Phase.SOLAR) {
        cardOwner.game.defer(
          new GainResources(cardOwner, Resource.MEGACREDITS, {
            count: 4,
          }).andThen(() => activePlayer.game.log(
            '${0} gained ${1} from ${2}',
            (b) => b.player(cardOwner).string(Resource.MEGACREDITS).cardName(this.name))),
          cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
        );
      }
    }
  }
}
