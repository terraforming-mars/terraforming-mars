import {expect} from 'chai';
import {Psychrophiles} from '../../../src/cards/prelude/Psychrophiles';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('Psychrophiles', function() {
  let card : Psychrophiles; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Psychrophiles();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Can\'t play', function() {
    (game as any).temperature = -18;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Should act', function() {
    expect(player.getMicrobesCanSpend()).to.eq(0);
    player.playedCards.push(card);

    card.action(player);
    expect(player.getCardsWithResources()).has.lengthOf(1);
    expect(player.getMicrobesCanSpend()).to.eq(1);
  });
});
