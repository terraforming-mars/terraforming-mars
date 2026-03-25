import {expect} from 'chai';
import {CorporateBlackmail} from '../../../src/server/cards/underworld/CorporateBlackmail';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('CorporateBlackmail', () => {
  let card: CorporateBlackmail;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3 : TestPlayer;
  let player4 : TestPlayer;

  beforeEach(() => {
    card = new CorporateBlackmail();
    [game, player, player2, player3, player4] = testGame(4, {underworldExpansion: true});
  });

  for (const run of [
    {corruption: [1, 2], expected: false},
    {corruption: [0, 3], expected: false},
    {corruption: [1, 3], expected: true},
    {corruption: [3, 2], expected: false},
  ] as const) {
    it('canPlay ' + JSON.stringify(run), () => {
      player.underworldData.corruption = run.corruption[0];
      player2.underworldData.corruption = run.corruption[1];

      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play, selectplayer', () => {
    player.underworldData.corruption = 3;
    player2.underworldData.corruption = 3;
    player3.underworldData.corruption = 1;
    player3.megaCredits = 20;
    player4.underworldData.corruption = 3;
    const selectPlayer = cast(card.play(player), SelectPlayer);

    expect(selectPlayer.players).to.have.members([player2, player4]);
  });

  it('play, not enough M€', () => {
    player2.underworldData.corruption = 3;
    player2.megaCredits = 9;

    const selectPlayer = cast(card.play(player), SelectPlayer);
    cast(selectPlayer.cb(player2), undefined);

    expect(player2.megaCredits).eq(9);
    expect(player2.underworldData.corruption).eq(1);
    expect(player.megaCredits).eq(0);
  });

  it('play, choose M€', () => {
    player2.underworldData.corruption = 3;
    player2.megaCredits = 11;

    const selectPlayer = cast(card.play(player), SelectPlayer);
    cast(selectPlayer.cb(player2), undefined);
    runAllActions(game);
    const orOptions = cast(player2.popWaitingFor(), OrOptions);
    orOptions.options[0].cb(undefined);

    expect(player2.megaCredits).eq(1);
    expect(player2.underworldData.corruption).eq(3);
    expect(player.megaCredits).eq(10);
    expect(player.underworldData.corruption).eq(0);
  });

  it('play, choose corruption', () => {
    player2.underworldData.corruption = 3;
    player2.megaCredits = 11;

    const selectPlayer = cast(card.play(player), SelectPlayer);
    cast(selectPlayer.cb(player2), undefined);
    runAllActions(game);
    const orOptions = cast(player2.popWaitingFor(), OrOptions);
    orOptions.options[1].cb(undefined);

    expect(player2.megaCredits).eq(11);
    expect(player2.underworldData.corruption).eq(1);
    expect(player.underworldData.corruption).eq(2);
    expect(player.megaCredits).eq(0);
  });
});
