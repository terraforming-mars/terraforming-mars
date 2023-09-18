import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectSpace} from '../../inputs/SelectSpace';
import {IActionCard} from '../ICard';
import {Player} from '../../Player';
import {Space} from '../../boards/Space';
import {intersection} from '../../../common/utils/utils';

export class MarsNomads extends Card implements IActionCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MARS_NOMADS,
      cost: 13,

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.action('MOVE THE NOMADS to an adjacent, non-reserved empty area and collect THE PLACEMENT BONUS ' +
            'as if placing a special tile there. No tiles may be placed on the Nomad area.', (ab) => {
            ab.empty().startAction.nomads().asterix();
          }).br;

          b.nomads().asterix().br;
          b.plainText('PLACE THE NOMADS on a non-reserved, empty area on the game board.');
        }),
      },
    });
  }


  public override bespokeCanPlay(player: IPlayer) {
    const spaces = player.game.board.getAvailableSpacesOnLand(player);
    return spaces.length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectSpace(
      'Select space for Nomads',
      player.game.board.getAvailableSpacesOnLand(player),
      (space: Space) => {
        player.game.nomadSpace = space.id;
        player.game.grantSpaceBonuses(player, space);
        return undefined;
      },
    );
  }

  private eliglbleDestinationSpaces(player: IPlayer) {
    const game = player.game;
    const board = game.board;
    if (game.nomadSpace === undefined) {
      return [];
    }

    const availableSpaces = board.getAvailableSpacesOnLand(player);
    const currentNomadSpace = board.getSpace(game.nomadSpace);
    const adjacentSpaces = board.getAdjacentSpaces(currentNomadSpace);
    return intersection(availableSpaces, adjacentSpaces);
  }

  public canAct(player: IPlayer) {
    return this.eliglbleDestinationSpaces(player).length > 0;
  }

  public action(player: Player) {
    const spaces = this.eliglbleDestinationSpaces(player);

    return new SelectSpace(
      'Select new destination for Mars Nomads',
      spaces,
      (space: Space) => {
        player.game.nomadSpace = space.id;
        player.game.grantSpaceBonuses(player, space);

        return undefined;
      },
    );
  }
}
