import {expect} from 'chai';
import {Reset} from '../../src/server/routes/Reset';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {MockResponse} from './HttpMocks';
import {PlayerViewModel} from '../../src/common/models/PlayerModel';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {IGame} from '../../src/server/IGame';
import {GameId, PlayerId, SpectatorId} from '../../src/common/Types';
import {GameIdLedger} from '../../src/server/database/IDatabase';

describe('Reset', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('reloads multiplayer action state when undo is enabled', async () => {
    const currentPlayer = TestPlayer.BLACK.newPlayer();
    const currentOpponent = TestPlayer.RED.newPlayer();
    const currentGame = Game.newInstance('game-id', [currentPlayer, currentOpponent], currentPlayer, 'spectatorid', {undoOption: true});
    currentGame.undoCount = 3;
    currentGame.gameAge = 8;
    currentPlayer.actionsTakenThisRound = 1;

    const reloadedPlayer = TestPlayer.BLACK.newPlayer();
    const reloadedOpponent = TestPlayer.RED.newPlayer();
    const reloadedGame = Game.newInstance('game-id', [reloadedPlayer, reloadedOpponent], reloadedPlayer, 'spectatorid', {undoOption: true});
    reloadedGame.undoCount = 2;
    reloadedGame.gameAge = 7;
    reloadedPlayer.actionsTakenThisRound = 1;

    useReloadingGameLoader(scaffolding, currentGame, reloadedGame);
    scaffolding.url = '/reset?id=' + currentPlayer.id;

    await scaffolding.get(Reset.INSTANCE, res);

    const response: PlayerViewModel = JSON.parse(res.content);
    expect(response.id).eq(reloadedPlayer.id);
    expect(response.game.undoCount).eq(4);
    expect(response.thisPlayer.actionsTakenThisRound).eq(1);
  });

  it('blocks multiplayer reset when undo is disabled', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    const opponent = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, opponent], player, 'spectatorid', {undoOption: false});
    await scaffolding.ctx.gameLoader.add(game);
    scaffolding.url = '/reset?id=' + player.id;

    await scaffolding.get(Reset.INSTANCE, res);

    expect(res.content).eq('Bad request: Cancel action requires undo to be enabled');
  });

  it('does not reload when the current action revealed deck information', async () => {
    const currentPlayer = TestPlayer.BLACK.newPlayer();
    const currentOpponent = TestPlayer.RED.newPlayer();
    const currentGame = Game.newInstance('game-id', [currentPlayer, currentOpponent], currentPlayer, 'spectatorid', {undoOption: true});
    currentGame.projectDeck.draw(currentGame);

    const reloadedPlayer = TestPlayer.BLACK.newPlayer();
    const reloadedOpponent = TestPlayer.RED.newPlayer();
    const reloadedGame = Game.newInstance('game-id', [reloadedPlayer, reloadedOpponent], reloadedPlayer, 'spectatorid', {undoOption: true});

    let addedGame: IGame | undefined;
    useReloadingGameLoader(scaffolding, currentGame, reloadedGame, (game) => {
      addedGame = game;
    });
    scaffolding.url = '/reset?id=' + currentPlayer.id;

    await scaffolding.get(Reset.INSTANCE, res);

    expect(res.content).eq('Bad request: Cannot cancel action after hidden information was revealed');
    expect(addedGame).eq(currentGame);
  });

  it('appends canceled log messages from the current action', async () => {
    const currentPlayer = TestPlayer.BLACK.newPlayer();
    const currentOpponent = TestPlayer.RED.newPlayer();
    const currentGame = Game.newInstance('game-id', [currentPlayer, currentOpponent], currentPlayer, 'spectatorid', {undoOption: true});
    currentGame.gameLog.length = 0;
    currentGame.gameAge = 0;
    currentGame.log('Kept action');
    currentGame.log('Canceled action');

    const reloadedPlayer = TestPlayer.BLACK.newPlayer();
    const reloadedOpponent = TestPlayer.RED.newPlayer();
    const reloadedGame = Game.newInstance('game-id', [reloadedPlayer, reloadedOpponent], reloadedPlayer, 'spectatorid', {undoOption: true});
    reloadedGame.gameLog.length = 0;
    reloadedGame.gameAge = 0;
    reloadedGame.log('Kept action');

    useReloadingGameLoader(scaffolding, currentGame, reloadedGame);
    scaffolding.url = '/reset?id=' + currentPlayer.id;

    await scaffolding.get(Reset.INSTANCE, res);

    expect(reloadedGame.gameLog.map((message) => message.message)).deep.eq([
      'Kept action',
      'Canceled action',
    ]);
    expect(reloadedGame.gameLog[1].canceled).eq(true);
    expect(reloadedGame.gameAge).eq(2);
  });
});

function useReloadingGameLoader(
  scaffolding: RouteTestScaffolding,
  currentGame: IGame,
  reloadedGame: IGame,
  onAdd?: (game: IGame) => void,
) {
  scaffolding.ctx.gameLoader = {
    add(game: IGame): Promise<void> {
      onAdd?.(game);
      return Promise.resolve();
    },
    getIds(): Promise<Array<GameIdLedger>> {
      return Promise.resolve([]);
    },
    getGame(_id: GameId | PlayerId | SpectatorId, forceLoad?: boolean): Promise<IGame | undefined> {
      return Promise.resolve(forceLoad === true ? reloadedGame : currentGame);
    },
    getGameAt(): Promise<IGame> {
      return Promise.reject(new Error('not implemented'));
    },
    restoreGameAt(): Promise<IGame> {
      return Promise.reject(new Error('not implemented'));
    },
    mark() {},
    saveGame(): Promise<void> {
      return Promise.resolve();
    },
    completeGame(): Promise<void> {
      return Promise.resolve();
    },
    maintenance(): Promise<void> {
      return Promise.resolve();
    },
  };
}
