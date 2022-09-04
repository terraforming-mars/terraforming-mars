import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../../common/cards/CardName';
import {Resources} from '../../../common/Resources';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Flooding extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
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

  public override bespokePlay(player: Player) {
    if (player.game.isSoloMode()) {
      player.game.defer(new PlaceOceanTile(player));
      return undefined;
    }

    if (!player.game.canAddOcean()) return undefined;

    return new SelectSpace(
      'Select space for ocean tile',
      player.game.board.getAvailableSpacesForOcean(player),
      (space: ISpace) => {
        const adjacentPlayers: Set<Player> = new Set<Player>();
        player.game.addOceanTile(player, space.id);

        player.game.board.getAdjacentSpaces(space).forEach((space) => {
          if (space.player && space.player !== player && space.tile) {
            adjacentPlayers.add(space.player);
          }
        });

        if (adjacentPlayers.size > 0) {
          return new OrOptions(
            new SelectPlayer(
              Array.from(adjacentPlayers),
              'Select adjacent player to remove 4 M€ from',
              'Remove credits',
              (selectedPlayer: Player) => {
                selectedPlayer.deductResource(Resources.MEGACREDITS, 4, {log: true, from: player});
                return undefined;
              },
            ),
            new SelectOption(
              'Don\'t remove M€ from adjacent player',
              'Confirm',
              () => {
                return undefined;
              },
            ),
          );
        }
        return undefined;
      },
    );
  }
}
