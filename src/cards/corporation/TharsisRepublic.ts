import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Priority} from '../../deferredActions/DeferredAction';
import {GainResources} from '../../deferredActions/GainResources';
import {GainProduction} from '../../deferredActions/GainProduction';
import {Board} from '../../boards/Board';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {all} from '../Options';

export class TharsisRepublic extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.THARSIS_REPUBLIC,
      tags: [Tags.BUILDING],
      initialActionText: 'Place a city tile',
      startingMegaCredits: 40,

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

  public initialAction(player: Player) {
    return new SelectSpace('Select space on mars for city tile', player.game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
      player.game.addCityTile(player, space.id);
      player.game.log('${0} placed a City tile', (b) => b.player(player));
      return undefined;
    });
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (Board.isCitySpace(space)) {
      if (cardOwner.id === activePlayer.id) {
        cardOwner.game.defer(new GainResources(cardOwner, Resources.MEGACREDITS, {count: 3}));
      }
      if (space.spaceType !== SpaceType.COLONY) {
        cardOwner.game.defer(
          new GainProduction(cardOwner, Resources.MEGACREDITS),
          cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
        );
      }
    }
    return;
  }

  public play(player: Player) {
    if (player.game.getPlayers().length === 1) {
      // Get bonus for 2 neutral cities
      player.addProduction(Resources.MEGACREDITS, 2);
    }
    return undefined;
  }
}
