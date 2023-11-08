import {expect} from 'chai';
import {UndergroundRailway} from '../../../src/server/cards/underworld/UndergroundRailway';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('UndergroundRailway', () => {
  //        description: 'Decrease your energy production 1 step. Gain 1 TR for every 4 excavation markers you own.',

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
    const spaces = UnderworldExpansion.excavatableSpaces(player);
    spaces[0].excavator = player;
    spaces[1].excavator = player;
    spaces[2].excavator = player;
    spaces[3].excavator = player;
    spaces[4].excavator = player;
    spaces[5].excavator = player;
    spaces[6].excavator = player;
    spaces[7].excavator = player;
    player.setTerraformRating(20);
    cast(card.play(player), undefined);
    expect(player.production.energy).eq(0);
    expect(player.getTerraformRating()).eq(22);
  });
});
