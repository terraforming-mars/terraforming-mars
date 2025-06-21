import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {Hackers} from '../../../src/server/cards/underworld/Hackers';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';

describe('Hackers', () => {
  let card: Hackers;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(() => {
    card = new Hackers();
    [game, player, player2, player3] = testGame(3);
  });

  it('canPlay', () => {
    player.underworldData.corruption = 1;
    expect(card.canPlay(player)).is.false;
    player.underworldData.corruption = 2;
    expect(card.canPlay(player)).is.true;
  });

  it('Play, corruption', () => {
    player.production.override({megacredits: 3});
    player2.production.override({megacredits: 3});
    player3.production.override({megacredits: 3});
    player.underworldData.corruption = 5;

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    expect(selectPlayer.players).has.lengthOf(3);
    selectPlayer.cb(player2);
    runAllActions(game);
    expect(player.production.megacredits).to.eq(8);
    expect(player2.production.megacredits).to.eq(1);
  });

  it('Works in solo', () => {
    [/* game */, player] = testGame(1);
    player.underworldData.corruption = 5;

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.production.megacredits).to.eq(5);
  });
});
