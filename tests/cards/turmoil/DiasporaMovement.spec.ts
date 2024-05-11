import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../../src/server/cards/base/ColonizerTrainingCamp';
import {MethaneFromTitan} from '../../../src/server/cards/base/MethaneFromTitan';
import {DiasporaMovement} from '../../../src/server/cards/turmoil/DiasporaMovement';
import {IGame} from '../../../src/server/IGame';
import {IParty} from '../../../src/server/turmoil/parties/IParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('DiasporaMovement', function() {
  let card: DiasporaMovement;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;
  let reds: IParty;

  beforeEach(function() {
    card = new DiasporaMovement();
    [game, player, player2] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
    reds = turmoil.getPartyByName(PartyName.REDS);
  });

  it('Can not play', function() {
    reds.sendDelegate(player, game);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    reds.sendDelegate(player, game);
    reds.sendDelegate(player, game);
    expect(card.canPlay(player)).is.true;

    player.playedCards.push(new ColonizerTrainingCamp());
    player2.playedCards.push(new MethaneFromTitan());
    card.play(player);
    expect(player.megaCredits).to.eq(3);
  });
});
