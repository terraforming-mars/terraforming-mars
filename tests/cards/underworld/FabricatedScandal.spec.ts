import {expect} from 'chai';
import {FabricatedScandal} from '../../../src/server/cards/underworld/FabricatedScandal';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('FabricatedScandal', () => {
  it('Should play', () => {
    const card = new FabricatedScandal();
    const [/* game */, ...players] = testGame(4);

    players[0].setTerraformRating(20);
    players[1].setTerraformRating(18);
    players[2].setTerraformRating(22);
    players[3].setTerraformRating(23);

    const player = players[0];

    player.underworldData.corruption = 0;

    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).to.eq(1);
    expect(players.map((p) => p.getTerraformRating())).deep.eq([20, 19, 22, 22]);
  });
});
