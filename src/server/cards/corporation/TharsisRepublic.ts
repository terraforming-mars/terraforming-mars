import {CorporationCard} from './CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Space} from '../../boards/Space';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/Priority';
import {GainResources} from '../../deferredActions/GainResources';
import {GainProduction} from '../../deferredActions/GainProduction';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class TharsisRepublic extends CorporationCard {
  constructor() {
    super({
      name: CardName.THARSIS_REPUBLIC,
      tags: [Tag.BUILDING],
      startingMegaCredits: 40,

      firstAction: {
        text: 'Place a city tile',
        city: {},
      },

      metadata: {
        cardNumber: 'R31',
        description: 'You start with 40 M€. As your first action in the game, place a city tile.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(40).nbsp.city();
          b.corpBox('effect', (ce) => {
            ce.effect('When any city tile is placed ON MARS, increase your M€ production 1 step. When you place a city tile, gain 3 M€.', (eb) => {
              eb.city({size: Size.SMALL, all}).asterix().colon();
              eb.production((pb) => pb.megacredits(1)).nbsp;
              eb.city({size: Size.SMALL}).startEffect.megacredits(3);
            });
          });
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (Board.isCitySpace(space)) {
      if (cardOwner.id === activePlayer.id) {
        cardOwner.game.defer(new GainResources(cardOwner, Resource.MEGACREDITS, {count: 3}));
      }
      if (space.spaceType !== SpaceType.COLONY) {
        cardOwner.game.defer(
          new GainProduction(cardOwner, Resource.MEGACREDITS),
          cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
        );
      }
    }
    return;
  }

  public override bespokePlay(player: IPlayer) {
    if (player.game.isSoloMode()) {
      // Get bonus for 2 neutral cities
      player.production.add(Resource.MEGACREDITS, 2);
    }
    return undefined;
  }
}
