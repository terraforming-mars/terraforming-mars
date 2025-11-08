import {expect} from 'chai';
import {LobbyHalls} from '../../src/server/cards/pathfinders/LobbyHalls';
import {Tag} from '../../src/common/cards/Tag';
import {deserializeProjectCard, serializeProjectCard} from '../../src/server/cards/cardSerialization';
import {cast, fakeCard} from '../TestingUtils';
import {Asimov} from '../../src/server/cards/ceos/Asimov';
import {SerializedCard} from '../../src/server/SerializedCard';
import {CardName} from '../../src/common/cards/CardName';

describe('CardSerialization', () => {
  it('undefiend clone tags serialize and deserialize', () => {
    const card = new LobbyHalls();
    expect(card.tags).deep.eq([Tag.CLONE, Tag.BUILDING]);

    const serializedCard = serializeProjectCard(card);

    expect(serializedCard.cloneTag).eq(Tag.CLONE);
    const deserialized = deserializeProjectCard(serializedCard);
    const lobbyHalls = cast(deserialized, LobbyHalls);
    expect(lobbyHalls.cloneTag).eq(Tag.CLONE);
    expect(lobbyHalls.tags).deep.eq([Tag.CLONE, Tag.BUILDING]);
  });

  it('defined clone tags serialize and deserialize', () => {
    const card = new LobbyHalls();
    card.cloneTag = Tag.SCIENCE;
    const serializedCard = serializeProjectCard(card);

    expect(serializedCard.cloneTag).eq(Tag.SCIENCE);

    const deserialized = deserializeProjectCard(serializedCard);
    const lobbyHalls = cast(deserialized, LobbyHalls);
    expect(lobbyHalls.cloneTag).eq(Tag.SCIENCE);
    expect(lobbyHalls.tags).deep.eq([Tag.SCIENCE, Tag.BUILDING]);
  });

  it('CEO cards are serialized and deserialized properly', () => {
    const card = new Asimov();

    expect(serializeProjectCard(card).isDisabled).is.false;

    card.isDisabled = true;
    expect(serializeProjectCard(card).isDisabled).is.true;

    const serialized = serializeProjectCard(card);

    serialized.isDisabled = false;
    expect(cast(deserializeProjectCard(serialized), Asimov).isDisabled).is.false;

    serialized.isDisabled = true;
    expect(cast(deserializeProjectCard(serialized), Asimov).isDisabled).is.true;
  });

  it('custom .serialized works', () => {
    let serializedCalled = false;
    let deserializedCalled = false;
    const card = fakeCard({name: CardName.MICRO_MILLS});
    card.serialize = (serialized: SerializedCard) => {
      serializedCalled = true;
      serialized.data = 'hello';
    };
    card.deserialize = (serialized: SerializedCard) => {
      deserializedCalled = true;
      expect(serialized.data).eq('hello');
    };

    const serialized = serializeProjectCard(card);
    expect(serialized.data).eq('hello');
    expect(serializedCalled).is.true;
    expect(deserializedCalled).is.false;

    // It's not possible to call deserialize on a new fake
    // and no project cards use Deserialize yet.
    //
    // const newCard = deserializeProjectCard(serialized);
    // expect(deserializedCalled).is.true;
    // expect(newCard.data).eq('hello');
  });
});
