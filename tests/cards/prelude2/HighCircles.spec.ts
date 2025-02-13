import {expect} from 'chai';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {HighCircles} from '../../../src/server/cards/prelude2/HighCircles';
import {cast, runAllActions, testGame} from '../../TestingUtils';

describe('HighCircles', () => {
  let card: HighCircles;
  let player: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;
  beforeEach(() => {
    card = new HighCircles();
    [game, player] = testGame(2, {turmoilExtension: true});
    turmoil = player.game.turmoil!;
  });

  it('Influence check', () => {
    game.turmoil!.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    game.turmoil!.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    game.turmoil!.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    card.play(player);
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(3);
  });

  it('TR check', () => {
    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Delegates check', () => {
    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    expect(marsFirst.delegates.get(player)).eq(0);
    card.play(player);
    runAllActions(player.game);
    const action = cast(player.getWaitingFor(), SelectParty);
    action.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player)).eq(5);
    expect(marsFirst.delegates.get(player)).eq(2);
  });

  it('Card Check', () => {
    card.play(player);
    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand.every((card) => card.requirements.some((req) => req.party !== undefined)));
  });
});
