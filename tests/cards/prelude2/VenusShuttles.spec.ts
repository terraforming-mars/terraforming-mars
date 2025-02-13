import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {VenusShuttles} from '../../../src/server/cards/prelude2/VenusShuttles';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {JetStreamMicroscrappers} from '../../../src/server/cards/venusNext/JetStreamMicroscrappers';
import {IGame} from '../../../src/server/IGame';

describe('VenusShuttles', () => {
  let card: VenusShuttles;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new VenusShuttles();
    [game, player] = testGame(1, {venusNextExtension: true});
  });

  it('Should play, no cards', () => {
    card.play(player);
  });

  it('Should play, one option', () => {
    const celestic = new Celestic(); // Stores floaters, has Venus tag.
    player.corporations.push(celestic);

    card.play(player);
    runAllActions(game);

    expect(celestic.resourceCount).to.eq(2);
  });

  it('Should Play, multiple cards.', () => {
    const celestic = new Celestic(); // Stores floaters. has Venus tag
    const jsr = new JetStreamMicroscrappers(); // Stores floaters, has Venus tag.
    player.corporations.push(celestic);
    player.playedCards.push(jsr);
    cast(card.play(player), undefined);
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).includes(celestic);
    expect(selectCard.cards).includes(jsr);

    selectCard.cb([celestic]);
    expect(celestic.resourceCount).to.eq(2);
  });

  const canActRuns = [
    {mc: 11, tags: 0, expected: false},
    {mc: 12, tags: 0, expected: true},
    {mc: 6, tags: 5, expected: false},
    {mc: 7, tags: 5, expected: true},
    {mc: 0, tags: 12, expected: true},
  ] as const;
  for (const run of canActRuns) {
    it('canAct ' + JSON.stringify(run), () => {
      player.megaCredits = run.mc;
      player.tagsForTest = {venus: run.tags};
      expect(card.canAct(player)).eq(run.expected);
    });
  }

  it('action', () => {
    player.megaCredits = 13;
    expect(player.getTerraformRating()).eq(14);
    expect(game.getVenusScaleLevel()).eq(0);

    cast(card.action(player), undefined);

    runAllActions(game);

    expect(player.megaCredits).eq(1);
    expect(game.getVenusScaleLevel()).eq(2);
    expect(player.getTerraformRating()).eq(15);
  });

  it('Action 15 venus tags', () => {
    expect(game.getVenusScaleLevel()).eq(0);
    player.tagsForTest = {venus: 15};
    player.megaCredits = 0;

    card.action(player);

    expect(player.megaCredits).eq(0);
  });
});
