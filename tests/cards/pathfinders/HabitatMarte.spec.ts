import {expect} from 'chai';
import {HabitatMarte} from '../../../src/server/cards/pathfinders/HabitatMarte';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {ValleyTrust} from '../../../src/server/cards/prelude/ValleyTrust';
import {OlympusConference} from '../../../src/server/cards/base/OlympusConference';
import {InterstellarColonyShip} from '../../../src/server/cards/base/InterstellarColonyShip';

describe('HabitatMarte', () => {
  let card: HabitatMarte;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new HabitatMarte();
    [game, player] = testGame(1);
  });

  it('tag count', () => {
    player.corporations.push(card);
    expect(player.tags.count(Tag.SCIENCE, 'raw')).eq(0);
    expect(player.tags.count(Tag.SCIENCE)).eq(1);
  });

  it('card cost', () => {
    player.corporations.push(new ValleyTrust()); // -2 per science tag
    expect(player.getCardCost(fakeCard({cost: 10, tags: [Tag.MARS]}))).eq(10);
    expect(player.getCardCost(fakeCard({cost: 10, tags: [Tag.SCIENCE]}))).eq(8);
    expect(player.getCardCost(fakeCard({cost: 10, tags: [Tag.MARS, Tag.MARS]}))).eq(10);

    player.corporations.push(card);
    expect(player.getCardCost(fakeCard({cost: 10, tags: [Tag.MARS]}))).eq(8);
    expect(player.getCardCost(fakeCard({cost: 10, tags: [Tag.SCIENCE]}))).eq(8);
    expect(player.getCardCost(fakeCard({cost: 10, tags: [Tag.MARS, Tag.MARS]}))).eq(6);
  });

  it('card requirements', () => {
    const fourScienceTags = fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]});
    const oneMarsTag = fakeCard({tags: [Tag.MARS]});
    const fiveMarsTags = fakeCard({tags: [Tag.MARS, Tag.MARS, Tag.MARS, Tag.MARS, Tag.MARS]});

    // Requires five science tags
    const interstellar = new InterstellarColonyShip();
    player.playedCards.push(fourScienceTags);
    player.megaCredits = interstellar.cost;

    expect(player.canPlay(interstellar)).is.false;

    player.playedCards.push(oneMarsTag);

    expect(player.canPlay(interstellar)).is.false;

    player.corporations.push(card);
    expect(player.canPlay(interstellar)).is.true;

    player.playedCards = [fiveMarsTags];

    expect(player.canPlay(interstellar)).is.true;

    player.corporations = [];

    expect(player.canPlay(interstellar)).is.false;
  });

  it('Olympus Conference', () => {
    player.popWaitingFor();
    const marsCard = fakeCard({tags: [Tag.MARS]});
    const olympusConference = new OlympusConference();
    player.playedCards = [olympusConference];
    expect(olympusConference.resourceCount).eq(0);

    olympusConference.onCardPlayed(player, marsCard);
    runAllActions(game);
    cast(player.getWaitingFor(), undefined);
    expect(olympusConference.resourceCount).eq(0);

    player.corporations.push(card);
    olympusConference.onCardPlayed(player, marsCard);
    runAllActions(game);
    cast(player.getWaitingFor(), undefined);
    expect(olympusConference.resourceCount).eq(1);
  });
});
