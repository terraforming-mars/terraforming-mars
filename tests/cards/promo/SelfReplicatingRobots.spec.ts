import {expect} from 'chai';
import {cast, testGame} from '../../TestingUtils';
import {Research} from '../../../src/server/cards/base/Research';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {HousePrinting} from '../../../src/server/cards/prelude/HousePrinting';
import {SelfReplicatingRobots} from '../../../src/server/cards/promo/SelfReplicatingRobots';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';
import {SerializedCard} from '../../../src/server/SerializedCard';
import {CardName} from '../../../src/common/cards/CardName';

describe('SelfReplicatingRobots', () => {
  let card: SelfReplicatingRobots;
  let player: TestPlayer;

  beforeEach(() => {
    card = new SelfReplicatingRobots();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.true;
  });

  it('Should act', () => {
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
    player.cardsInHand.push(new HousePrinting());

    const action = cast(card.action(player), OrOptions);
    action.options[0].cb([cast(action.options[0], SelectCard<IProjectCard>).cards[0]]);
    expect(card.targetCards[0].resourceCount).to.eq(2);
    expect(player.cardsInHand).deep.eq([earthOffice]);
    expect(card.targetCards).has.lengthOf(1);

    const action2 = cast(card.action(player), OrOptions);
    action2.options[0].cb([cast(action2.options[0], SelectCard<IProjectCard>).cards[0]]);
    expect(card.targetCards[0].resourceCount).to.eq(4);
  });

  it('serialization', () => {
    const housePrinting = new HousePrinting();
    housePrinting.resourceCount = 4;
    card.targetCards.push(housePrinting);

    const serialized: SerializedCard = {name: CardName.SELF_REPLICATING_ROBOTS};
    card.serialize(serialized);
    expect(serialized).deep.eq({
      'name': 'Self-replicating Robots',
      'targetCards': [
        {
          'card': {
            'name': 'House Printing',
          },
          'resourceCount': 4,
        },
      ],
    });

    const deserialized = new SelfReplicatingRobots();
    deserialized.deserialize(serialized);
    expect(deserialized.targetCards).has.length(1);
    const deserializedTargetCard = deserialized.targetCards[0];
    expect(deserializedTargetCard.name).eq(CardName.HOUSE_PRINTING);
    expect(deserializedTargetCard.resourceCount).eq(4);
  });
});
