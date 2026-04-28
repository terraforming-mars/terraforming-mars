import {expect} from 'chai';
import {AsteroidStandardProject} from '../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {SellPatentsStandardProject} from '../../../src/server/cards/base/standardProjects/SellPatentsStandardProject';
import {StandardTechnology} from '../../../src/server/cards/base/StandardTechnology';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {GreeneryStandardProject} from '../../../src/server/cards/base/standardProjects/GreeneryStandardProject';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Payment} from '../../../src/common/inputs/Payment';

describe('StandardTechnology', () => {
  let card: StandardTechnology;
  let player: TestPlayer;

  beforeEach(() => {
    [/* game */, player] = testGame(1);
    card = new StandardTechnology();
  });

  it('play', () => {
    expect(card.play(player)).is.undefined;
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

    greeneryStandardProject.payAndExecute(player, Payment.of({megacredits: greeneryStandardProject.cost}));
    runAllActions(player.game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const availableSpace = selectSpace.spaces[0];

    selectSpace?.cb(availableSpace);

    expect(player.megaCredits).eq(3);
  });
});
