import {expect} from 'chai';
import {UndergroundRailway} from '../../../src/server/cards/underworld/UndergroundRailway';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('UndergroundRailway', () => {
  it('canPlay', () => {
    const card = new UndergroundRailway();
    const [/* game */, player] = testGame(1);

    expect(card.canPlay(player)).is.false;
    player.production.override({energy: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const card = new UndergroundRailway();
    const [/* game */, player] = testGame(1);

    player.production.override({energy: 1});
    player.underworldData.tokens.push(
      {token: 'nothing', shelter: false, active: false},
      {token: 'nothing', shelter: false, active: false},
      {token: 'nothing', shelter: false, active: false},
      {token: 'nothing', shelter: false, active: false},
      {token: 'nothing', shelter: false, active: false},
      {token: 'nothing', shelter: false, active: false},
      {token: 'nothing', shelter: false, active: false},
      {token: 'nothing', shelter: false, active: false},
    );
    player.setTerraformRating(20);
    cast(card.play(player), undefined);
    expect(player.production.energy).eq(0);
    expect(player.terraformRating).eq(22);
  });
});
