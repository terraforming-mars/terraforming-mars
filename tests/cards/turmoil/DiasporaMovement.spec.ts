import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../../src/server/cards/base/ColonizerTrainingCamp';
import {MethaneFromTitan} from '../../../src/server/cards/base/MethaneFromTitan';
import {DiasporaMovement} from '../../../src/server/cards/turmoil/DiasporaMovement';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {IParty} from '../../../src/server/turmoil/parties/IParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('DiasporaMovement', function() {
  let card: DiasporaMovement;
  let player: Player;
  let player2: Player;
  let game: Game;
  let turmoil: Turmoil;
  let reds: IParty;

  beforeEach(function() {
    card = new DiasporaMovement();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, player2], player, testGameOptions({turmoilExtension: true}));
    turmoil = game.turmoil!;
    reds = turmoil.getPartyByName(PartyName.REDS)!;
  });

  it('Can not play', function() {
    reds.sendDelegate(player.id, game);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    reds.sendDelegate(player.id, game);
    reds.sendDelegate(player.id, game);
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.playedCards.push(new ColonizerTrainingCamp());
    player2.playedCards.push(new MethaneFromTitan());
    card.play(player);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
  });
});
