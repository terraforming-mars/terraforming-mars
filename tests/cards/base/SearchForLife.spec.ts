import {expect} from 'chai';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {Tag} from '../../../src/common/cards/Tag';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard, runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('SearchForLife', function() {
  let card: SearchForLife;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new SearchForLife();
    [game, player] = testGame(2);
  });

  it('Can not act if no MC', function() {
    player.megaCredits = 0;
    expect(card.canAct(player)).is.not.true;
    player.megaCredits = 1;
    expect(card.canAct(player)).is.true;
  });

  it('Can not play if oxygen level too high', function() {
    setOxygenLevel(game, 7);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setOxygenLevel(game, 6);
    expect(card.canPlay(player)).is.true;
    player.playedCards.push(card);
    card.play(player);

    expect(card.getVictoryPoints()).to.eq(0);
    player.addResourceTo(card);
    expect(card.getVictoryPoints()).to.eq(3);
  });


  it('action fails, no tags', function() {
    player.playedCards.push(card);

    player.megaCredits = 1;

    game.projectDeck.drawPile.push(fakeCard());

    card.action(player);
    runAllActions(game); // pays for card.
    expect(player.megaCredits).to.eq(0);
    expect(card.resourceCount).eq(0);
  });

  it('action fails, wrong tag', function() {
    player.playedCards.push(card);

    player.megaCredits = 1;

    game.projectDeck.drawPile.push(fakeCard({tags: [Tag.SCIENCE]}));

    card.action(player);
    runAllActions(game); // pays for card.
    expect(player.megaCredits).to.eq(0);
    expect(card.resourceCount).eq(0);
  });

  it('action fails, wild tag', function() {
    player.playedCards.push(card);

    player.megaCredits = 1;

    game.projectDeck.drawPile.push(fakeCard({tags: [Tag.WILD]}));

    card.action(player);
    runAllActions(game); // pays for card.
    expect(player.megaCredits).to.eq(0);
    expect(card.resourceCount).eq(0);
  });

  it('action succeeds', function() {
    player.playedCards.push(card);

    player.megaCredits = 1;

    game.projectDeck.drawPile.push(fakeCard({tags: [Tag.WILD, Tag.MICROBE]}));

    card.action(player);
    runAllActions(game); // pays for card.
    expect(player.megaCredits).to.eq(0);
    expect(card.resourceCount).eq(1);
  });
});
