import {expect} from 'chai';
import {SpaceLanes} from '../../../src/server/cards/prelude2/SpaceLanes';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Ants} from '../../../src/server/cards/base/Ants';
import {CorroderSuits} from '../../../src/server/cards/venusNext/CorroderSuits';
import {IoMiningIndustries} from '../../../src/server/cards/base/IoMiningIndustries';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';
import {PublicSpaceline} from '../../../src/server/cards/underworld/PublicSpaceline';

describe('SpaceLanes', () => {
  let card: SpaceLanes;
  let player: TestPlayer;

  beforeEach(() => {
    card = new SpaceLanes();
    [/* game */, player] = testGame(2);
  });

  it('play', () => {
    card.play(player);
    expect(player.titanium).eq(3);
  });

  it('card discount', () => {
    player.playedCards.push(card);
    expect(card.getCardDiscount(player, new Ants())).eq(0);
    expect(card.getCardDiscount(player, new CorroderSuits())).eq(2);
    expect(card.getCardDiscount(player, new IoMiningIndustries())).eq(2);
    expect(card.getCardDiscount(player, new EarthOffice())).eq(2);
    expect(card.getCardDiscount(player, new PublicSpaceline())).eq(12);
  });
});
