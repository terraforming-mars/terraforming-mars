import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {SpaceType} from '../../../common/boards/SpaceType';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {Tag} from '../../../common/cards/Tag';
import {Space} from '../../boards/Space';
import {SelectSpace} from '../../inputs/SelectSpace';
import {IActionCard} from '../ICard';
import {BoardType} from '../../boards/BoardType';
import {Board} from '../../boards/Board';

export class GagarinMobileBase extends Card implements IActionCard, ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.GAGARIN_MOBILE_BASE,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 42,
      initialActionText: 'Place Gagarin Mobile Base on ANY space ON MARS',

      metadata: {
        cardNumber: 'PfC13',
        description: 'You start with 42 M€. As your first action, put Gagarin Mobile Base on ANY area on Mars. Collect the bonus.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).br;
          b.action('Move the Base to ANY nearest empty area where it has not yet been. Collect the bonus.', (ab) =>
            ab.empty().startAction.text('move').asterix());
          b.br;
          b.effect('When another player places a tile where the Base is, move the Base.', (eb) =>
            eb.emptyTile().startEffect.text('move').asterix());
          b.br;
        }),
      },
    });
  }

  private closestSpaces(board: Board, availableSpaces: Array<Space>, space: Space): Array<Space> {
    const visitedSpaces = new Set<Space>();

    function searchSet(spaces: Set<Space>): Array<Space> {
      if (spaces.size === 0) {
        return [];
      }
      const adjacentSpaces = new Set(Array.from(spaces).map((s) => board.getAdjacentSpaces(s)).flat());
      const sizeBefore = visitedSpaces.size;
      adjacentSpaces.forEach((s) => visitedSpaces.add(s));
      const sizeAfter = visitedSpaces.size;
      if (sizeBefore === sizeAfter) {
        return [];
      }

      const candidateSpaces = [...adjacentSpaces].filter((s) => availableSpaces.includes(s));
      if (candidateSpaces.length > 0) {
        return candidateSpaces;
      }
      return searchSet(adjacentSpaces);
    }

    visitedSpaces.add(space);
    return searchSet(new Set([space]));
  }

  private availableSpaces(player: IPlayer) {
    const board = player.game.board;
    const visited = player.game.gagarinBase;
    const availableSpaces = board.spaces
      .filter((space) => space.spaceType !== SpaceType.COLONY)
      .filter((space) => !space.bonus.includes(SpaceBonus.RESTRICTED))
      .filter((space) => space.tile === undefined)
      .filter((space) => !visited.includes(space.id));

    if (visited[0] === undefined) {
      return availableSpaces;
    }
    const currentSpace = board.getSpace(visited[0]);
    return this.closestSpaces(board, availableSpaces, currentSpace);
  }

  public canAct(player: IPlayer): boolean {
    return this.availableSpaces(player).length > 0;
  }

  public action(player: IPlayer) {
    const spaces = this.availableSpaces(player);
    if (spaces.length > 0) {
      return new SelectSpace('Select new space for Gagarin Mobile Base', this.availableSpaces(player), (space) => {
        player.game.gagarinBase.unshift(space.id);
        player.game.grantSpaceBonuses(player, space);

        return undefined;
      });
    }
    return undefined;
  }

  public initialAction(player: IPlayer) {
    return this.action(player);
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    if (boardType === BoardType.MOON) {
      return;
    }
    if (cardOwner === activePlayer) {
      return;
    }
    if (space.id === activePlayer.game.gagarinBase[0]) {
      cardOwner.defer(this.action(activePlayer));
    }
  }
}
