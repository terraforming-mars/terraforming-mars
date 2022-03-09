import {expect} from 'chai';
import {HabitatMarte} from '../../../src/cards/pathfinders/HabitatMarte';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TestingUtils} from '../../TestingUtils';
import {Tags} from '../../../src/common/cards/Tags';
import {ValleyTrust} from '../../../src/cards/prelude/ValleyTrust';
import {OlympusConference} from '../../../src/cards/base/OlympusConference';

describe('HabitatMarte', () => {
  let card: HabitatMarte;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new HabitatMarte();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('tag count', () => {
    player.corporationCard = card;
    expect(player.getTagCount(Tags.SCIENCE, 'raw')).eq(0);
    expect(player.getTagCount(Tags.SCIENCE)).eq(1);
  });

  it('card cost', () => {
    player.playedCards.push(new ValleyTrust()); // -2 per science tag
    player.corporationCard = undefined;
    expect(player.getCardCost(TestingUtils.fakeCard({cost: 10, tags: [Tags.MARS]}))).eq(10);
    expect(player.getCardCost(TestingUtils.fakeCard({cost: 10, tags: [Tags.SCIENCE]}))).eq(8);
    expect(player.getCardCost(TestingUtils.fakeCard({cost: 10, tags: [Tags.MARS, Tags.MARS]}))).eq(10);

    player.corporationCard = card;
    expect(player.getCardCost(TestingUtils.fakeCard({cost: 10, tags: [Tags.MARS]}))).eq(8);
    expect(player.getCardCost(TestingUtils.fakeCard({cost: 10, tags: [Tags.SCIENCE]}))).eq(8);
    expect(player.getCardCost(TestingUtils.fakeCard({cost: 10, tags: [Tags.MARS, Tags.MARS]}))).eq(6);
  });

  it('Olympus Conference', () => {
    player.popWaitingFor();
    const marsCard = TestingUtils.fakeCard({tags: [Tags.MARS]});
    const olympusConference = new OlympusConference();
    player.playedCards = [olympusConference];
    expect(olympusConference.resourceCount).eq(0);

    olympusConference.onCardPlayed(player, marsCard);
    TestingUtils.runAllActions(game);
    expect(player.getWaitingFor()).is.undefined;
    expect(olympusConference.resourceCount).eq(0);

    player.corporationCard = card;
    olympusConference.onCardPlayed(player, marsCard);
    TestingUtils.runAllActions(game);
    expect(player.getWaitingFor()).is.undefined;
    expect(olympusConference.resourceCount).eq(1);
  });
});
