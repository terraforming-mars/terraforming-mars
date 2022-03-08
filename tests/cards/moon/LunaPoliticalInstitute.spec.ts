import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunaPoliticalInstitute} from '../../../src/cards/moon/LunaPoliticalInstitute';
import {expect} from 'chai';
import {SelectPartyToSendDelegate} from '../../../src/inputs/SelectPartyToSendDelegate';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {Tags} from '../../../src/common/cards/Tags';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunaPoliticalInstitute', () => {
  let player: Player;
  let game: Game;
  let card: LunaPoliticalInstitute;
  let turmoil: Turmoil;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new LunaPoliticalInstitute();
    turmoil = game.turmoil!;
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.not.include(card);

    player.playedCards = [TestingUtils.fakeCard({tags: [Tags.MOON]})];
    expect(player.getPlayableCards()).does.not.include(card);

    player.playedCards = [TestingUtils.fakeCard({tags: [Tags.MOON, Tags.MOON]})];
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

