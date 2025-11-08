import {expect} from 'chai';
import {StingOperation} from '../../../src/server/cards/underworld/StingOperation';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {zip} from '../../../src/common/utils/utils';

describe('StingOperation', () => {
  const canPlayRuns = [
    {corruption: [0, 0, 0], expected: false, warning: false},
    {corruption: [3, 3, 3], expected: false, warning: false},
    {corruption: [3, 3, 4], expected: true, warning: false},
    {corruption: [4, 3, 3], expected: true, warning: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      const card = new StingOperation();
      const [game, player] = testGame(3, {underworldExpansion: true});
      zip(run.corruption, game.players).map(([corruption, player]) => player.underworldData.corruption = corruption);

      expect(card.canPlay(player)).eq(run.expected);
      if (run.warning) {
        expect(card.warnings.has('selfTarget')).eq(true);
      }
    });
  }

  it('play', () => {
    const card = new StingOperation();
    const [/* game */, player, player2, player3] = testGame(3, {underworldExpansion: true});

    player.underworldData.corruption = 3;
    player2.underworldData.corruption = 4;
    player3.underworldData.corruption = 4;

    const selectPlayer = cast(card.play(player), SelectPlayer);

    expect(selectPlayer.players).to.have.members([player2, player3]);
    expect(selectPlayer.players).to.not.have.members([player]);
    expect(player3.getVictoryPoints().victoryPoints).eq(0);

    selectPlayer.cb(player3);

    expect(player.cardsInHand).has.length(2);
    expect(player3.playedCards.asArray()).includes(card);
    expect(player3.getVictoryPoints().victoryPoints).eq(0);
    player3.underworldData.corruption = 0;
    expect(player3.getVictoryPoints().victoryPoints).eq(-2);
  });

  it('play - target self', () => {
    const card = new StingOperation();
    const [game, player, player2, player3] = testGame(3, {underworldExpansion: true});

    player.underworldData.corruption = 4;
    player2.underworldData.corruption = 4;
    player3.underworldData.corruption = 4;

    cast(player.playCard(card), undefined);
    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);

    expect(selectPlayer.players).to.have.members([player, player2, player3]);
    expect(player3.getVictoryPoints().victoryPoints).eq(0);

    selectPlayer.cb(player);

    expect(player.cardsInHand).has.length(2);
    expect(player.playedCards.asArray()).includes(card);
    player.underworldData.corruption = 0;
    expect(player.getVictoryPoints().victoryPoints).eq(-2);
  });
});
