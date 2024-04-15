import {expect} from 'chai';
import {InvestigativeJournalism} from '../../../src/server/cards/underworld/InvestigativeJournalism';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';

describe('InvestigativeJournalism', () => {
  it('canPlay', () => {
    const card = new InvestigativeJournalism();
    const [/* game */, player] = testGame(2);

    player.production.override({megacredits: -4});

    expect(card.canPlay(player)).is.false;

    player.production.override({megacredits: -3});

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new InvestigativeJournalism();
    const [game, player] = testGame(2);

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.production.megacredits).eq(-2);
  });

  const canActRuns = [
    {megacredits: 4, corruptions: [0, 0], canPlay: false},
    {megacredits: 5, corruptions: [0, 0], canPlay: false},
    {megacredits: 5, corruptions: [2, 2], canPlay: false},
    {megacredits: 5, corruptions: [3, 2], canPlay: false},
    {megacredits: 5, corruptions: [2, 3], canPlay: true},
  ] as const;
  for (const run of canActRuns) {
    it('canAct ' + JSON.stringify(run), () => {
      const card = new InvestigativeJournalism();
      const [/* game */, player, player2] = testGame(2, {underworldExpansion: true});

      player.megaCredits = run.megacredits;
      player.underworldData.corruption = run.corruptions[0];
      player2.underworldData.corruption = run.corruptions[1];

      expect(card.canAct(player)).eq(run.canPlay);
    });
  }

  const actionRuns = [
    {corruptions: [2, 3, 0], candidates: ['p-player2-id'], selected: 'p-player2-id', expected: {corruptions: [2, 2, 0]}},
    {corruptions: [2, 3, 1], candidates: ['p-player2-id'], selected: 'p-player2-id', expected: {corruptions: [2, 2, 1]}},
    {corruptions: [2, 3, 2], candidates: ['p-player2-id'], selected: 'p-player2-id', expected: {corruptions: [2, 2, 2]}},
    {corruptions: [2, 3, 3], candidates: ['p-player2-id', 'p-player3-id'], selected: 'p-player2-id', expected: {corruptions: [2, 2, 3]}},
    {corruptions: [2, 3, 3], candidates: ['p-player2-id', 'p-player3-id'], selected: 'p-player3-id', expected: {corruptions: [2, 3, 2]}},
  ] as const;
  for (const run of actionRuns) {
    it('action ' + JSON.stringify(run), () => {
      const card = new InvestigativeJournalism();
      const [game, player, player2, player3] = testGame(3, {underworldExpansion: true});

      player.megaCredits = 5;
      player.underworldData.corruption = run.corruptions[0];
      player2.underworldData.corruption = run.corruptions[1];
      player3.underworldData.corruption = run.corruptions[2];
      card.resourceCount = 0;

      card.action(player);
      runAllActions(game);
      expect(player.megaCredits).eq(0);

      const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);

      expect(selectPlayer.players.map((p) => p.id)).to.have.members(run.candidates);
      selectPlayer.cb(game.getPlayerById(run.selected));
      expect(card.resourceCount).eq(1);

      expect(player.underworldData.corruption).eq(run.expected.corruptions[0]);
      expect(player2.underworldData.corruption).eq(run.expected.corruptions[1]);
      expect(player3.underworldData.corruption).eq(run.expected.corruptions[2]);
    });
  }
});
