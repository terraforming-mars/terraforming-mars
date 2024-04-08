import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {fakeCard} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {EarthEmbassy} from '../../../src/server/cards/moon/EarthEmbassy';
import {Tag} from '../../../src/common/cards/Tag';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {MartianZoo} from '../../../src/server/cards/colonies/MartianZoo';
import {PointLuna} from '../../../src/server/cards/prelude/PointLuna';

describe('EarthEmbassy', () => {
  let player: TestPlayer;
  let earthEmbassy: EarthEmbassy;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
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
    expect(lunaGovernor.canPlay(player)).is.true;
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

  it('Works with Point Luna', () => {
    const pointLuna = new PointLuna();
    player.corporations.push(pointLuna);

    const fake = fakeCard({tags: [Tag.MOON]});
    pointLuna.onCardPlayed(player, fake);

    expect(player.cardsInHand).has.length(0);

    player.playedCards = [earthEmbassy];
    pointLuna.onCardPlayed(player, fake);

    expect(player.cardsInHand).has.length(1);
  });
});

