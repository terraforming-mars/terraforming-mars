import {expect} from 'chai';
import {Hackers} from '../../../src/server/cards/base/Hackers';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';

describe('Hackers', () => {
  let card: Hackers;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Hackers();
    [game, player, player2] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;
  });

  it('Decreases each opponent MC production by 1', () => {
    player.production.add(Resource.ENERGY, 1);
    player2.production.add(Resource.MEGACREDITS, 3);

    card.play(player);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(2);
    expect(player2.production.megacredits).to.eq(2);
  });

  it('Decreases all opponents MC production by 1 each in a 3-player game', () => {
    const [game3, p1, p2, p3] = testGame(3);
    void game3;

    p1.production.add(Resource.ENERGY, 1);
    p2.production.add(Resource.MEGACREDITS, 4);
    p3.production.add(Resource.MEGACREDITS, 2);

    card.play(p1);

    expect(p1.production.energy).to.eq(0);
    expect(p1.production.megacredits).to.eq(2);
    expect(p2.production.megacredits).to.eq(3);
    expect(p3.production.megacredits).to.eq(1);
  });
});
