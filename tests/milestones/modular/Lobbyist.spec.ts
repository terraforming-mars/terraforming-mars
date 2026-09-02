import {expect} from 'chai';
import {Lobbyist} from '../../../src/server/milestones/modular/Lobbyist';
import {testGame} from '../../TestingUtils';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {IParty} from '../../../src/server/turmoil/parties/IParty';

describe('Lobbyist Milestone', () => {
  let milestone: Lobbyist;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let turmoil: Turmoil;
  let greens: IParty;
  let scientists: IParty;
  let reds: IParty;

  beforeEach(() => {
    [game, player, player2] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
    milestone = new Lobbyist();
    scientists = turmoil.getPartyByName(PartyName.SCIENTISTS)!;
    greens = turmoil.getPartyByName(PartyName.GREENS)!;
    reds = turmoil.getPartyByName(PartyName.REDS)!;
  });

  it('Gives 0 score if player has no delegates', () => {
    expect(milestone.getScore(player)).to.eq(0);
  });

  it('Counts delegates placed in parties', () => {
    turmoil.sendDelegateToParty(player, reds.name, game);
    expect(milestone.getScore(player)).to.eq(1);
    turmoil.sendDelegateToParty(player, scientists.name, game);
    expect(milestone.getScore(player)).to.eq(2);
    turmoil.sendDelegateToParty(player, greens.name, game);
    expect(milestone.getScore(player)).to.eq(3);
    turmoil.sendDelegateToParty(player, greens.name, game);
    expect(milestone.getScore(player)).to.eq(4);
  });

  it('Achieves milestone with exactly 7 delegates', () => {
    turmoil.sendDelegateToParty(player, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player, PartyName.KELVINISTS, game);
    turmoil.sendDelegateToParty(player, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player, PartyName.MARS, game);
    turmoil.sendDelegateToParty(player, PartyName.MARS, game);
    turmoil.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    expect(milestone.getScore(player)).to.eq(7); // 5 party leaders + 2 delegate
  });

  it('Only counts player’s own delegates, ignoring other players’ delegates', () => {
    turmoil.sendDelegateToParty(player, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(player2, PartyName.KELVINISTS, game);
    turmoil.sendDelegateToParty(player2, PartyName.KELVINISTS, game);
    expect(milestone.getScore(player)).to.eq(2); // Only player delegates, ignores player2 chairman and delegate
    expect(milestone.getScore(player2)).to.eq(2); // Only player’s 2 delegates, ignores player delegates and party leaders
  });
});
