import {expect} from 'chai';
import {Psychrophiles} from '../../../src/server/cards/prelude/Psychrophiles';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setTemperature} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Psychrophiles', () => {
  let card: Psychrophiles;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Psychrophiles();
    [game, player] = testGame(1);
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
