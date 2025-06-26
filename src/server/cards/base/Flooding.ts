import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Flooding extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.FLOODING,
      cost: 7,
      tr: {oceans: 1},
      victoryPoints: -1,

      metadata: {
        cardNumber: '188',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).nbsp.minus().megacredits(4, {all}).asterix();
        }),
        description: 'Place an ocean tile. IF THERE ARE TILES ADJACENT TO THIS OCEAN TILE, YOU MAY REMOVE 4 M€ FROM THE OWNER OF ONE OF THOSE TILES.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    if (player.game.isSoloMode()) {
      game.defer(new PlaceOceanTile(player));
      return undefined;
    }

    game.defer(new PlaceOceanTile(player)).andThen((space) => {
      const adjacentPlayers: Set<IPlayer> = new Set();
      game.board.getAdjacentSpaces(space).forEach((space) => {
        if (space.player && space.player !== player && space.tile) {
          adjacentPlayers.add(space.player);
        }
      });

      // TODO(kberg) This has got to be a common thing, right? Reuse this, right?
      if (adjacentPlayers.size > 0) {
        return new OrOptions(
          new SelectPlayer(
            Array.from(adjacentPlayers),
            'Select adjacent player to remove 4 M€ from',
            'Remove credits',
          ).andThen((target) => {
            target.attack(player, Resource.MEGACREDITS, 4, {log: true});
            return undefined;
          }),
          new SelectOption('Don\'t remove M€ from adjacent player'));
      }
      return undefined;
    });
    return undefined;
  }
}
