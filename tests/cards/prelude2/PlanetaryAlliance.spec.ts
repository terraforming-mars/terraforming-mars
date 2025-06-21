import {expect} from 'chai';
import {PlanetaryAlliance} from '../../../src/server/cards/prelude2/PlanetaryAlliance';
import {Tag} from '../../../src/common/cards/Tag';
import {testGame} from '../../TestingUtils';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';

describe('PlanetaryAlliance', () => {
  it('Should play', () => {
    const card = new PlanetaryAlliance();
    const [/* game*/, player] = testGame(1, {venusNextExtension: true});
    card.play(player);

    expect(player.getTerraformRating()).to.eq(16);
    expect(player.cardsInHand).has.lengthOf(2);

    const jovianCards = (c: IProjectCard) => c.tags.includes(Tag.JOVIAN);
    const venusCards = (c: IProjectCard) => c.tags.includes(Tag.VENUS);

    expect(player.cardsInHand.filter(jovianCards).length).to.be.oneOf([1, 2]);
    expect(player.cardsInHand.filter(venusCards).length).to.be.oneOf([1, 2]);

    const badCards = (c: IProjectCard) =>
      (!c.tags.includes(Tag.JOVIAN) && !c.tags.includes(Tag.VENUS));

    expect(player.cardsInHand.filter(badCards)).has.lengthOf(0);
  });
});
