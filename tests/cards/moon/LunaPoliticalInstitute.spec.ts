import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {fakeCard, setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunaPoliticalInstitute} from '../../../src/server/cards/moon/LunaPoliticalInstitute';
import {expect} from 'chai';
import {SelectPartyToSendDelegate} from '../../../src/server/inputs/SelectPartyToSendDelegate';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {Tag} from '../../../src/common/cards/Tag';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('LunaPoliticalInstitute', () => {
  let player: Player;
  let game: Game;
  let card: LunaPoliticalInstitute;
  let turmoil: Turmoil;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new LunaPoliticalInstitute();
    turmoil = game.turmoil!;
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.not.include(card);

    player.playedCards = [fakeCard({tags: [Tag.MOON]})];
    expect(player.getPlayableCards()).does.not.include(card);

    player.playedCards = [fakeCard({tags: [Tag.MOON, Tag.MOON]})];
    expect(player.getPlayableCards()).includes(card);
  });

  it('can act', () => {
    turmoil.delegateReserve = [player.id];
    expect(card.canAct(player)).is.true;

    turmoil.delegateReserve = ['NEUTRAL'];
    expect(card.canAct(player)).is.false;
  });

  it('action', () => {
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);

    expect(marsFirst.delegates.filter((d) => d === player.id)).has.lengthOf(0);

    const selectParty = game.deferredActions.peek()!.execute() as SelectPartyToSendDelegate;
    selectParty.cb(PartyName.MARS);

    expect(marsFirst.delegates.filter((d) => d === player.id)).has.lengthOf(1);
  });
});

