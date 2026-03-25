import {expect} from 'chai';
import {MicroGeodesics} from '../../../src/server/cards/underworld/MicroGeodesics';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {SelectClaimedUndergroundToken} from '../../../src/server/inputs/SelectClaimedUndergroundToken';

describe('MicroGeodesics', () => {
  let card: MicroGeodesics;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MicroGeodesics();
    [game, player] = testGame(2, {underworldExpansion: true});
  });

  it('play - simple', () => {
    card.play(player);
    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);

    expect(card.resourceCount).eq(1);
  });

  for (const run of [
    {microbes: 0, tokens: [], expected: false},
    {microbes: 0, tokens: [{token: 'nothing', shelter: false, active: false}], expected: false},
    {microbes: 1, tokens: [], expected: false},
    {microbes: 1, tokens: [{token: 'nothing', shelter: false, active: false}], expected: true},
  ] as const) {
    it('canAct ' + JSON.stringify(run), () => {
      player.playedCards.push(card);
      card.resourceCount = run.microbes;
      player.underworldData.tokens.push(...run.tokens);

      expect(card.canAct(player)).eq(run.expected);
    });
  }

  it('action', () => {
    player.playedCards.push(card);
    card.resourceCount = 1;
    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});

    card.action(player);
    runAllActions(game);

    const selectClaimedUndergroundToken = cast(player.popWaitingFor(), SelectClaimedUndergroundToken);
    expect(selectClaimedUndergroundToken.tokens).has.length(1);
    selectClaimedUndergroundToken.cb([0]);

    cast(player.popWaitingFor(), undefined);

    expect(card.resourceCount).eq(0);
    expect(player.underworldData.tokens).is.empty;
    expect(player.plants).eq(3);
  });
});
