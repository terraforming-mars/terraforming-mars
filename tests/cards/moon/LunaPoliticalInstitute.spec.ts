import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {cast, fakeCard} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunaPoliticalInstitute} from '../../../src/server/cards/moon/LunaPoliticalInstitute';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {Tag} from '../../../src/common/cards/Tag';

describe('LunaPoliticalInstitute', () => {
  let player: TestPlayer;
  let game: IGame;
  let card: LunaPoliticalInstitute;
  let turmoil: Turmoil;

  beforeEach(() => {
    [game, player] = testGame(1, {turmoilExtension: true, moonExpansion: true});
    card = new LunaPoliticalInstitute();
    turmoil = game.turmoil!;
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.playedCards = [fakeCard({tags: [Tag.MOON]})];
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.playedCards = [fakeCard({tags: [Tag.MOON, Tag.MOON]})];
    expect(player.getPlayableCardsForTest()).includes(card);
  });

  it('can act', () => {
    turmoil.delegateReserve.clear();
    turmoil.delegateReserve.add(player);
    expect(card.canAct(player)).is.true;

    turmoil.delegateReserve.clear();
    turmoil.delegateReserve.add('NEUTRAL');
    expect(card.canAct(player)).is.false;
  });

  it('action', () => {
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);

    expect(marsFirst.delegates.get(player)).eq(0);

    const selectParty = cast(game.deferredActions.peek()!.execute(), SelectParty);
    selectParty.cb(PartyName.MARS);

    expect(marsFirst.delegates.get(player)).eq(1);
  });
});

