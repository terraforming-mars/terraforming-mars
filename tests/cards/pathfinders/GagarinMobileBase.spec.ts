import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {GagarinMobileBase} from '../../../src/server/cards/pathfinders/GagarinMobileBase';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';
import {Space} from '../../../src/server/boards/Space';
import {TileType} from '../../../src/common/TileType';
import {AmazonisBoard} from '../../../src/server/boards/AmazonisBoard';
import {UnseededRandom} from '../../../src/common/utils/Random';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {cast} from '../../../src/common/utils/utils';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('GagarinMobileBase', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let card: GagarinMobileBase;
  let space13: Space;

  beforeEach(() => {
    [game, player, player2] = testGame(2);
    card = new GagarinMobileBase();
    space13 = game.board.getSpaceOrThrow('13');
    player.playedCards.push(card);
  });

  it('solo game, initial action includes fewer spaces', () => {
    [game, player] = testGame(1); // 2 players simplifies
    const selectSpace = cast(card.initialAction(player), SelectSpace);
    expect(selectSpace.spaces).to.have.length(57); // 61 - 2 cities - 2 greeneries
  });

  it('initialAction', () => {
    expect(game.gagarinBase).deep.eq([]);
    expect(player.cardsInHand).to.have.length(0);
    const selectSpace = cast(card.initialAction(player), SelectSpace);
    expect(selectSpace.spaces).to.have.length(61);
    selectSpace.process({type: 'space', spaceId: '13'}); // draw two cards
    expect(player.cardsInHand).to.have.length(2);
    expect(game.gagarinBase).deep.eq(['13']);
  });

  it('action', () => {
    game.gagarinBase = ['13'];
    const selectSpace = cast(card.action(player), SelectSpace);
    expect(selectSpace.spaces.map((s) => s.id)).to.have.members(['07', '12', '19', '20']);
    selectSpace.process({type: 'space', spaceId: '07'});
    const selectSpace2 = cast(card.action(player), SelectSpace);
    expect(selectSpace2.spaces.map((s) => s.id)).to.have.members(['06', '12']);
    expect(game.gagarinBase).deep.eq(['07', '13']);
  });

  it('action - cannot select restricted space', () => {
    // Restricted space is 33.
    game.gagarinBase = ['32', '24', '23', '31', '40', '41'];
    const selectSpace = cast(card.action(player), SelectSpace);

    expect(selectSpace.spaces.map((s) => s.id)).to.have.members(['33']);

    game.board = AmazonisBoard.newInstance(game.gameOptions, UnseededRandom.INSTANCE);

    const selectSpace2 = cast(card.action(player), SelectSpace);
    expect(selectSpace2.spaces.map((s) => s.id)).to.have.members(
      ['15', '16', '22', '17', '25', '34', '42', '49', '48', '47', '39', '30']);
  });

  it('action - blocked in', () => {
    game.gagarinBase = ['13', '07', '19', '12', '20'];
    const selectSpace = cast(card.action(player), SelectSpace);
    expect(selectSpace.spaces.map((s) => s.id)).to.have.members(['06', '11', '18', '26', '27', '28']);
  });

  it('onTilePlaced, self', () => {
    game.gagarinBase = [space13.id];
    game.addCity(player, space13);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  it('onTilePlaced, opponent', () => {
    game.simpleAddTile(player2, game.board.getSpaceOrThrow('07'), {tileType: TileType.NUCLEAR_ZONE});
    game.gagarinBase = [space13.id];
    game.addCity(player2, space13);
    runAllActions(game);
    cast(player2.getWaitingFor(), undefined);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(selectSpace.spaces.map((s) => s.id)).to.have.members(['12', '19', '20']);

    const space12 = game.board.getSpaceOrThrow('12');
    space12.bonus = [SpaceBonus.DRAW_CARD];

    // When gagarin moves, it gets a bonus, not the opponent.
    player.cardsInHand = [];
    player2.cardsInHand = [];
    selectSpace.cb(space12);

    expect(player2.cardsInHand).is.empty;
    expect(player.cardsInHand).has.length(1);
  });

  it('Hellas ocean space is filtered out when player cannot afford bonus', () => {
    [game, player] = testGame(2, {boardName: BoardName.HELLAS});
    card = new GagarinMobileBase();
    player.playedCards.push(card);
    const board = game.board;

    const gagarinSpace = board.getAdjacentSpaces(board.getSpaceOrThrow(SpaceName.HELLAS_OCEAN_TILE))[0];
    game.gagarinBase = [gagarinSpace.id];

    player.megaCredits = 5;
    expect(cast(card.action(player), SelectSpace).spaces.map((s) => s.id))
      .to.not.include(SpaceName.HELLAS_OCEAN_TILE);

    player.megaCredits = 6;
    expect(cast(card.action(player), SelectSpace).spaces.map((s) => s.id))
      .to.include(SpaceName.HELLAS_OCEAN_TILE);
  });

  describe('delegate bonus spaces', () => {
    // On Amazonis Planitia, H8 (71) is next to H7 (70, two delegates) and H9 (72, one delegate).
    function setup(reserve: number) {
      [game, player] = testGame(2, {boardName: BoardName.AMAZONIS_PLANITIA, turmoilExtension: true});
      card = new GagarinMobileBase();
      player.playedCards.push(card);
      const turmoil = Turmoil.getTurmoil(game);
      while (turmoil.getAvailableDelegateCount(player) > reserve) {
        turmoil.delegateReserve.remove(player);
      }
    }

    it('initial action, without delegates, excludes every delegate space', () => {
      setup(0);
      const ids = cast(card.initialAction(player), SelectSpace).spaces.map((s) => s.id);
      expect(ids).does.not.include('10');
      expect(ids).does.not.include('70');
      expect(ids).does.not.include('72');
    });

    it('action, with one delegate, offers only the single delegate space', () => {
      setup(1);
      game.gagarinBase = ['71'];
      const ids = cast(card.action(player), SelectSpace).spaces.map((s) => s.id);
      expect(ids).includes('72');
      expect(ids).does.not.include('70');
    });

    it('action, with two delegates, offers the double delegate space and sends both', () => {
      setup(2);
      game.gagarinBase = ['71'];
      const selectSpace = cast(card.action(player), SelectSpace);
      expect(selectSpace.spaces.map((s) => s.id)).includes('70');
      selectSpace.cb(game.board.getSpaceOrThrow('70'));
      runAllActions(game);
      cast(player.popWaitingFor(), SelectParty).cb(PartyName.MARS);
      expect(player.totalDelegatesPlaced).eq(2);
      expect(Turmoil.getTurmoil(game).getAvailableDelegateCount(player)).eq(0);
    });
  });
});
