import {expect} from 'chai';
import {PowerPlant} from '../../../src/server/cards/pathfinders/PowerPlant';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {cast, testGame} from '../../TestingUtils';

describe('PowerPlant', () => {
  let card: PowerPlant;
  let player: TestPlayer;

  beforeEach(() => {
    card = new PowerPlant();
    [/* game */, player] = testGame(1);
    player.playedCards.push(card);
  });

  it('play', () => {
    cast(card.play(player), undefined);
    expect(player.production.asUnits()).deep.eq(Units.of({heat: 2, energy: 1}));
  });
});
