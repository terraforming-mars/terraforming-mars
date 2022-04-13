import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {EarthEmbassy} from '../../../src/cards/moon/EarthEmbassy';
import {expect} from 'chai';
import {Tags} from '../../../src/common/cards/Tags';
import {LunaGovernor} from '../../../src/cards/colonies/LunaGovernor';
import {BusinessNetwork} from '../../../src/cards/base/BusinessNetwork';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('EarthEmbassy', () => {
  let player: TestPlayer;
  let earthEmbassy: EarthEmbassy;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    earthEmbassy = new EarthEmbassy();
  });

  it('play', () => {
    const fakeCard = TestingUtils.fakeCard({tags: [Tags.EARTH, Tags.MOON, Tags.MOON]});

    player.playedCards = [fakeCard];
    expect(player.getTagCount(Tags.EARTH, 'raw')).eq(1);
    expect(player.getTagCount(Tags.EARTH, 'default')).eq(1);

    // This changes the results because Earth Embassy has one earth tag and one moon tag.
    // [ Earth Embassy: earth/moon, Fake Card: earth/moon/moon ]
    player.playedCards.push(earthEmbassy);
    expect(player.getTagCount(Tags.EARTH, 'raw')).eq(2);
    expect(player.getTagCount(Tags.EARTH, 'default')).eq(5);
  });

  it('Works for Luna Governor', () => {
    // Luna Governor requires 3 earth tags.
    const lunaGovernor = new LunaGovernor();
    // Earth Embassy has an earth tag and a moon tag.
    // Business Contacts has an earth tag.
    player.playedCards.push(earthEmbassy, new BusinessNetwork());
    expect(player.canPlayIgnoringCost(lunaGovernor)).is.true;
  });
});

