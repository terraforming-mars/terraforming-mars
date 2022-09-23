import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {fakeCard, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {EarthEmbassy} from '../../../src/server/cards/moon/EarthEmbassy';
import {Tag} from '../../../src/common/cards/Tag';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {MartianZoo} from '../../../src/server/cards/colonies/MartianZoo';

describe('EarthEmbassy', () => {
  let player: TestPlayer;
  let earthEmbassy: EarthEmbassy;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    earthEmbassy = new EarthEmbassy();
  });

  it('play', () => {
    const fake = fakeCard({tags: [Tag.EARTH, Tag.MOON, Tag.MOON]});

    player.playedCards = [fake];
    expect(player.tags.count(Tag.EARTH, 'raw')).eq(1);
    expect(player.tags.count(Tag.EARTH, 'default')).eq(1);

    // This changes the results because Earth Embassy has one earth tag and one moon tag.
    // [ Earth Embassy: earth/moon, Fake Card: earth/moon/moon ]
    player.playedCards.push(earthEmbassy);
    expect(player.tags.count(Tag.EARTH, 'raw')).eq(2);
    expect(player.tags.count(Tag.EARTH, 'default')).eq(5);
  });

  it('Works for Luna Governor', () => {
    // Luna Governor requires 3 earth tags.
    const lunaGovernor = new LunaGovernor();
    // Earth Embassy has an earth tag and a moon tag.
    // Business Contacts has an earth tag.
    player.playedCards.push(earthEmbassy, new BusinessNetwork());
    expect(player.canPlayIgnoringCost(lunaGovernor)).is.true;
  });

  it('Works for Martian Zoo', () => {
    const martianZoo = new MartianZoo();
    player.playedCards.push(martianZoo);

    const fake = fakeCard({tags: [Tag.EARTH, Tag.MOON, Tag.MOON]});
    martianZoo.resourceCount = 0;
    martianZoo.onCardPlayed(player, fake);

    expect(martianZoo.resourceCount).eq(1);

    player.playedCards.push(earthEmbassy);
    martianZoo.resourceCount = 0;
    martianZoo.onCardPlayed(player, fake);

    expect(martianZoo.resourceCount).eq(3);
  });
});

