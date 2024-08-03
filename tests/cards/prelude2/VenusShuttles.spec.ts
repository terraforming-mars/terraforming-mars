import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {VenusShuttles} from '../../../src/server/cards/prelude2/VenusShuttles';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {JetStreamMicroscrappers} from '../../../src/server/cards/venusNext/JetStreamMicroscrappers';
import {IGame} from '../../../src/server/IGame';

describe('VenusShuttles', function() {
  let card: VenusShuttles;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new VenusShuttles();
    [game, player] = testGame(2, {venusNextExtension: true});
  });

  it('Should play, no cards', function() {
    card.play(player);
  });

  it('Should play, one option', function() {
    const celestic = new Celestic(); // Stores floaters, has Venus tag.
    player.corporations.push(celestic);

    card.play(player);
    runAllActions(game);

    expect(celestic.resourceCount).to.eq(2);
  });

  it('Should Play, multiple cards.', function() {
    const celestic = new Celestic(); // Stores floaters. has Venus tag
    const jsr = new JetStreamMicroscrappers(); // Stores floaters, has Venus tag.
    player.corporations.push(celestic);
    player.playedCards.push(jsr);
    expect(card.play(player)).is.undefined;
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).includes(celestic);
    expect(selectCard.cards).includes(jsr);

    selectCard.cb([celestic]);
    expect(celestic.resourceCount).to.eq(2);
  });

  it('Should act without venus tags', function() {
    player.megaCredits = 11;
    expect(card.canAct(player)).is.false;
    const celestic = new Celestic(); // Stores floaters. has Venus tag
    player.corporations.push(celestic);
    expect(card.canAct(player)).is.true;
  });

  it('Should act with 5 venus tags', function() {
    player.tagsForTest = {venus: 5};
    player.megaCredits = 6;
    expect(card.canAct(player)).is.false;
    player.megaCredits = 7;
    expect(card.canAct(player)).is.true;
  });

  it('Should act with 12 venus tags', function() {
    player.tagsForTest = {venus: 12};
    player.megaCredits = 0;
    expect(card.canAct(player)).is.true;
  });

  it('Should act with 15 venus tags', function() {
    player.tagsForTest = {venus: 15};
    player.megaCredits = 0;
    expect(card.canAct(player)).is.true;
    card.action(player);
    expect(player.megaCredits).eq(0);
  });
});
