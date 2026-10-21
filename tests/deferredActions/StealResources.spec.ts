import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {StealResources} from '../../src/server/deferredActions/StealResources';
import {Resource} from '../../src/common/Resource';
import {BotanicalExperience} from '../../src/server/cards/pathfinders/BotanicalExperience';
import {ProtectedHabitats} from '../../src/server/cards/base/ProtectedHabitats';
import {LunarSecurityStations} from '../../src/server/cards/moon/LunarSecurityStations';

describe('StealResources.getViableCandidates', () => {
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(() => {
    [/* game */, player, player2, player3] = testGame(3);
  });

  it('excludes opponents with fewer than count plants', () => {
    player2.plants = 3;
    player3.plants = 4;
    const candidates = StealResources.getCandidates(player, Resource.PLANTS, 4, true);
    expect(candidates).deep.equals([player3]);
  });

  it('excludes opponents whose plants are protected', () => {
    player2.plants = 4;
    player2.playedCards.push(new ProtectedHabitats());
    expect(StealResources.getCandidates(player, Resource.PLANTS, 4)).is.empty;
  });

  it('excludes opponents whose alloys are protected for steel', () => {
    player2.steel = 4;
    player2.playedCards.push(new LunarSecurityStations());
    expect(StealResources.getCandidates(player, Resource.STEEL, 4)).is.empty;
  });

  it('excludes opponents whose alloys are protected for titanium', () => {
    player2.titanium = 4;
    player2.playedCards.push(new LunarSecurityStations());
    expect(StealResources.getCandidates(player, Resource.TITANIUM, 4)).is.empty;
  });

  it('opponent with Botanical Experience requires double the plants for mandatory steal', () => {
    player2.playedCards.push(new BotanicalExperience());

    player2.plants = 7;
    expect(StealResources.getCandidates(player, Resource.PLANTS, 4, true)).is.empty;

    player2.plants = 8;
    expect(StealResources.getCandidates(player, Resource.PLANTS, 4, true)).deep.equals([player2]);
  });

  it('Botanical Experience does not affect non-plant resources', () => {
    player2.playedCards.push(new BotanicalExperience());
    player2.megaCredits = 4;
    expect(StealResources.getCandidates(player, Resource.MEGACREDITS, 4)).deep.equals([player2]);
  });
});
