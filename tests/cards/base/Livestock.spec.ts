import {expect} from 'chai';
import {Livestock} from '../../../src/server/cards/base/Livestock';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Livestock', () => {
  let card: Livestock;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Livestock();
    [game, player] = testGame(2);
  });

  it('Can not play without plant production', () => {
    setOxygenLevel(game, 9);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if oxygen level too low', () => {
    setOxygenLevel(game, 8);
    player.production.add(Resource.PLANTS, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.PLANTS, 1);
    setOxygenLevel(game, 9);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    player.playedCards.push(card);
    expect(player.production.plants).to.eq(0);
    expect(player.production.megacredits).to.eq(2);

    player.addResourceTo(card, 4);
    expect(card.getVictoryPoints(player)).to.eq(4);
  });

  it('Should act', () => {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });
});
