import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Game} from '../../src/server/Game';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {DELEGATES_PER_PLAYER} from '../../src/common/constants';
import {cast} from '@/common/utils/utils';

describe('AutomaGameSetup', () => {
  it('does nothing without the automa option', () => {
    const [game] = testGame(1);

    cast(game.automaHooks, undefined);
    expect(game.isSoloMode()).is.true;
  });

  it('creates the MarsBot player outside game.players', () => {
    const [game, human] = testGame(1, {automaOption: true});

    const marsBotPlayer = game.automaHooks!.marsBotPlayer;
    expect(marsBotPlayer.name).to.eq('MarsBot');
    expect(game.players).to.deep.eq([human]);
    expect(marsBotPlayer.id).to.eq('p-' + game.id + '-marsbot');
  });

  it('an automa game is not solo mode', () => {
    const [game] = testGame(1, {automaOption: true});

    expect(game.isSoloMode()).is.false;
  });

  it('an automa game starts without the solo neutral tiles', () => {
    const [game] = testGame(1, {automaOption: true});

    expect(game.board.spaces.filter((space) => space.tile !== undefined)).is.empty;
  });

  it('seeds MarsBot delegates when Turmoil is on', () => {
    const [game] = testGame(1, {automaOption: true, turmoilExtension: true});

    const turmoil = Turmoil.getTurmoil(game);
    const marsBotPlayer = game.automaHooks!.marsBotPlayer;
    expect(turmoil.getAvailableDelegateCount(marsBotPlayer)).to.eq(DELEGATES_PER_PLAYER);
  });

  it('a reload recreates the player and keeps its Turmoil delegates', () => {
    const [game] = testGame(1, {automaOption: true, turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);
    const marsBotPlayer = game.automaHooks!.marsBotPlayer;
    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.GREENS, game);

    const restored = Game.deserialize(game.serialize());

    const restoredBot = restored.automaHooks!.marsBotPlayer;
    expect(restoredBot.id).to.eq(marsBotPlayer.id);
    const restoredTurmoil = Turmoil.getTurmoil(restored);
    expect(restoredTurmoil.getPartyByName(PartyName.GREENS).delegates.get(restoredBot)).to.eq(1);
    expect(restoredTurmoil.getAvailableDelegateCount(restoredBot)).to.eq(DELEGATES_PER_PLAYER - 1);
    expect(restored.isSoloMode()).is.false;
  });
});
