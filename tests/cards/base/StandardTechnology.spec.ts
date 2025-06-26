import {expect} from 'chai';
import {AsteroidStandardProject} from '../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {SellPatentsStandardProject} from '../../../src/server/cards/base/standardProjects/SellPatentsStandardProject';
import {StandardTechnology} from '../../../src/server/cards/base/StandardTechnology';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, churn} from '../../TestingUtils';
import {GreeneryStandardProject} from '../../../src/server/cards/base/standardProjects/GreeneryStandardProject';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('StandardTechnology', () => {
  let card: StandardTechnology;
  let player: TestPlayer;

  beforeEach(() => {
    [/* game */, player] = testGame(1);
    card = new StandardTechnology();
  });

  it('play', () => {
    expect(churn(card.play(player), player)).is.undefined;
  });

  it('Rebate for Asteroid Standard Project', () => {
    player.playedCards.push(card);
    card.onStandardProject(player, new AsteroidStandardProject());
    expect(player.megaCredits).to.eq(3);
  });

  it('No rebate for Asteroid standard project', () => {
    player.playedCards.push(card);
    card.onStandardProject(player, new SellPatentsStandardProject());
    expect(player.megaCredits).to.eq(0);
  });


  it('Rebate for Greenery standard project -- using fuller operation', () => {
    player.playedCards.push(card);
    player.megaCredits = 23;
    player.setTerraformRating(20);

    const greeneryStandardProject = new GreeneryStandardProject();

    const selectSpace = cast(churn(greeneryStandardProject.action(player), player), SelectSpace);
    const availableSpace = selectSpace.spaces[0];

    selectSpace?.cb(availableSpace);

    expect(player.megaCredits).eq(3);
  });
});
