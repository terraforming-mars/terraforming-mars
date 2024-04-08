import {expect} from 'chai';
import {Psychrophiles} from '../../../src/server/cards/prelude/Psychrophiles';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setTemperature} from '../../TestingUtils';

describe('Psychrophiles', () => {
  let card: Psychrophiles;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Psychrophiles();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
  });

  it('Cannot play', () => {
    setTemperature(game, -18);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    setTemperature(game, -20);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.true;
    cast(card.play(player), undefined);
  });

  it('Can act', () => {
    expect(card.canAct(player)).is.true;
  });

  it('Should act', () => {
    expect(player.getSpendable('microbes')).to.eq(0);
    player.playedCards.push(card);

    card.action(player);
    runAllActions(game);
    expect(player.getCardsWithResources()).has.lengthOf(1);
    expect(player.getSpendable('microbes')).to.eq(1);
  });
});
