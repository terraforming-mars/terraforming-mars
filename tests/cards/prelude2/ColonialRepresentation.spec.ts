import {expect} from 'chai';
import {ColonialRepresentation} from '../../../src/server/cards/prelude2/ColonialRepresentation';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {Luna} from '../../../src/server/colonies/Luna';
import {Pluto} from '../../../src/server/colonies/Pluto';

describe('ColonialRepresentation', () => {
  let card: ColonialRepresentation;
  let player: TestPlayer;
  let game: IGame;
  beforeEach(() => {
    card = new ColonialRepresentation();
    [game, player] = testGame(1, {turmoilExtension: true});
  });

  it('Influence check', () => {
    game.turmoil!.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    game.turmoil!.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    game.turmoil!.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    card.play(player);
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(3);
  });

  it('Megacredits check', () => {
    const colony1 = new Luna();
    const colony2 = new Pluto();
    colony1.colonies.push(player.id);
    game.colonies.push(colony1);
    colony2.colonies.push(player.id);
    game.colonies.push(colony2);

    card.play(player);
    expect(player.megaCredits).eq(6);
  });
});
