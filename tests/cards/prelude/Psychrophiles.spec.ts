import {expect} from 'chai';
import {Psychrophiles} from '../../../src/cards/prelude/Psychrophiles';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Psychrophiles', () => {
  let card : Psychrophiles; let player : Player; let game : Game;

  beforeEach(() => {
    card = new Psychrophiles();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Cannot play', () => {
    (game as any).temperature = -18;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    (game as any).temperature = -20;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.true;
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Can act', () => {
    expect(card.canAct()).is.true;
  });

  it('Should act', () => {
    expect(player.getMicrobesCanSpend()).to.eq(0);
    player.playedCards.push(card);

    card.action(player);
    expect(player.getCardsWithResources()).has.lengthOf(1);
    expect(player.getMicrobesCanSpend()).to.eq(1);
  });
});
