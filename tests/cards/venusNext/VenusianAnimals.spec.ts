import {expect} from 'chai';
import {setVenusScaleLevel} from '../../TestingUtils';
import {Research} from '../../../src/server/cards/base/Research';
import {VenusianAnimals} from '../../../src/server/cards/venusNext/VenusianAnimals';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Leavitt} from '../../../src/server/cards/community/Leavitt';

describe('VenusianAnimals', function() {
  let card: VenusianAnimals;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new VenusianAnimals();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    setVenusScaleLevel(game, 16);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setVenusScaleLevel(game, 18);
    expect(card.canPlay(player)).is.true;
    player.playedCards.push(card);
    card.play(player);

    card.onCardPlayed(player, card);
    expect(card.resourceCount).to.eq(1);

    card.onCardPlayed(player, new Research());
    expect(card.resourceCount).to.eq(3);

    expect(card.getVictoryPoints(player)).to.eq(3);
  });

  it('Compatible with Leavitt #6349', () => {
    player.playedCards.push(card);

    expect(card.resourceCount).eq(0);

    const leavitt = new Leavitt();
    leavitt.addColony(player);

    expect(card.resourceCount).eq(1);
  });
});
