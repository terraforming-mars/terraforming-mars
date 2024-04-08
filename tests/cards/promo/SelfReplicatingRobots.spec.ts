import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Research} from '../../../src/server/cards/base/Research';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {HousePrinting} from '../../../src/server/cards/prelude/HousePrinting';
import {SelfReplicatingRobots} from '../../../src/server/cards/promo/SelfReplicatingRobots';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';
import {deserializeProjectCard, serializeProjectCard} from '../../../src/server/cards/CardSerialization';

describe('SelfReplicatingRobots', function() {
  let card: SelfReplicatingRobots;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SelfReplicatingRobots();
    player = TestPlayer.BLUE.newPlayer();
    card.player = player;
    Game.newInstance('gameid', [player], player);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;

    player.cardsInHand.push(new EarthOffice());
    expect(card.canAct(player)).is.not.true;

    player.cardsInHand.push(new HousePrinting());
    expect(card.canAct(player)).is.true;
  });

  it('act', () => {
    const earthOffice = new EarthOffice();
    player.cardsInHand.push(earthOffice);
    const housePrinting = new HousePrinting();
    player.cardsInHand.push(housePrinting);

    const action = cast(card.action(player), OrOptions);
    action.options[0].cb([cast(action.options[0], SelectCard<IProjectCard>).cards[0]]);
    expect(card.data.attachedCards[housePrinting.name]).to.eq(2);
    expect(Object.entries(card.data.attachedCards)).has.lengthOf(1);

    const action2 = cast(card.action(player), OrOptions);
    action2.process({
      type: 'or',
      index: 0,
      response: {type: 'card', cards: [housePrinting.name]},
    }, player);
    expect(card.data.attachedCards[housePrinting.name]).to.eq(4);
  });

  it('Survives serialization', () => {
    const card = new SelfReplicatingRobots();

    let serialized = serializeProjectCard(card);
    expect(serialized.played).is.not.true;
    let deserialized = deserializeProjectCard(serialized, player) as SelfReplicatingRobots;
    expect(deserialized.player).is.undefined;

    player.playCard(card);
    expect(card.player).deep.eq(player);

    serialized = serializeProjectCard(card);
    expect(serialized.played).is.true;
    deserialized = deserializeProjectCard(serialized, player) as SelfReplicatingRobots;
    expect(deserialized.player).eq(player);
  });

  // See CEOsFavoriteProject.spec.ts for cross-compatability test
});
