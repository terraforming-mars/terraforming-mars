import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {EarthEmbassy} from '../../../src/cards/moon/EarthEmbassy';
import {expect} from 'chai';
import {Tags} from '../../../src/cards/Tags';
import {CardType} from '../../../src/cards/CardType';
import {CardName} from '../../../src/CardName';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {CardMetadata} from '../../../src/cards/CardMetadata';

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
    const tags: Array<Tags> = [Tags.EARTH, Tags.MOON, Tags.MOON];
    const fakeCard: IProjectCard = {
      cost: 0,
      cardType: CardType.AUTOMATED,
      name: CardName.ZEPPELINS,
      tags: tags,
      metadata: {} as CardMetadata,
      play: () => undefined,
    };

    player.playedCards = [fakeCard];
    expect(player.getTagCount(Tags.EARTH, false, false)).eq(1);
    expect(player.getTagCount(Tags.EARTH, false, true)).eq(1);

    // This changes the results because Earth Embassy has one earth tag and one moon tag.
    // [ Earth Embassy: earth/moon, Fake Card: earth/moon/moon ]
    player.playedCards.push(earthEmbassy);
    expect(player.getTagCount(Tags.EARTH, false, false)).eq(2);
    expect(player.getTagCount(Tags.EARTH, false, true)).eq(5);
  });
});

