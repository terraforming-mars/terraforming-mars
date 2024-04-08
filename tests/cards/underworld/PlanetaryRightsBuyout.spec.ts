import {expect} from 'chai';
import {PlanetaryRightsBuyout} from '../../../src/server/cards/underworld/PlanetaryRightsBuyout';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';

describe('PlanetaryRightsBuyout', () => {
  it('Should play', () => {
    const card = new PlanetaryRightsBuyout();
    const [game, player] = testGame(2);

    player.underworldData.corruption = 4;
    expect(card.canPlay(player)).is.false;
    player.underworldData.corruption = 5;
    expect(card.canPlay(player)).is.true;

    expect(player.getTerraformRating()).eq(20);

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.getTerraformRating()).eq(27);
  });
});
