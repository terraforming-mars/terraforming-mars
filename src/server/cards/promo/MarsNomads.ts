import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {IActionCard} from '@/server/cards/ICard';
import {Player} from '@/server/Player';
import {intersection} from '@/common/utils/utils';
import {message} from '@/server/logs/MessageBuilder';
import {AresHandler} from '@/server/ares/AresHandler';

export class MarsNomads extends Card implements IActionCard {
  /*
   * A good page about this card: https://boardgamegeek.com/thread/3154812.
   *
   * 1. Arcadian Communities and Land Claim block Mars Nomads.
   *  1a. Even if it's your AC.
   * 2. Mining Guild and Philares cannot take advantage of it.
   * 3. Placing next to an ocean tile gives a placement bonus.
   *
   * Ares: Adjacency bonuses are not placement bonuses.
   */
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MARS_NOMADS,
      cost: 13,

      metadata: {
        cardNumber: 'X59',
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
    const spaces = player.game.board.getNonReservedLandSpaces();
    return spaces.length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectSpace(
      message('Select space for ${0}', (b) => b.card(this)),
      player.game.board.getNonReservedLandSpaces())
      .andThen((space) => {
        player.game.nomadSpace = space.id;
        return undefined;
      });
  }

  private eliglbleDestinationSpaces(player: IPlayer) {
    const game = player.game;
    const board = game.board;
    if (game.nomadSpace === undefined) {
      return [];
    }

    const availableSpaces = board.getNonReservedLandSpaces();
    const currentNomadSpace = board.getSpaceOrThrow(game.nomadSpace);
    const adjacentSpaces = board.getAdjacentSpaces(currentNomadSpace);
    return intersection(availableSpaces, adjacentSpaces);
  }

  public canAct(player: IPlayer) {
    return this.eliglbleDestinationSpaces(player).length > 0;
  }

  public action(player: Player) {
    const spaces = this.eliglbleDestinationSpaces(player);

    return new SelectSpace(
      message('Select new space for ${0}', (b) => b.card(this)),
      spaces)
      .andThen((space) => {
        player.game.nomadSpace = space.id;

        // Don't grant bonuses when moving onto hazard tiles. Even though you're allowed
        // to move Mars Nomads onto that space.
        const coveringExistingSpace = AresHandler.hasHazardTile(space);
        player.game.grantPlacementBonuses(player, space, coveringExistingSpace);

        return undefined;
      });
  }
}
