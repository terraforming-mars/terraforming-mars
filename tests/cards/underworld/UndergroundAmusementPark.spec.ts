import {expect} from 'chai';
import {UndergroundAmusementPark} from '../../../src/server/cards/underworld/UndergroundAmusementPark';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('UndergroundAmusementPark', () => {
  it('canPlay', () => {
    const card = new UndergroundAmusementPark();
    const [game, player] = testGame(2);

    expect(card.canPlay(player)).is.false;
    game.board.getAvailableSpacesOnLand(player)[0].excavator = player;
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new UndergroundAmusementPark();
    const [/* game */, player] = testGame(2);

    cast(card.play(player), undefined);

    expect(player.production.megacredits).to.eq(1);
  });
});
