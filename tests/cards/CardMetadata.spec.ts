import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {ALL_CARD_MANIFESTS} from '../../src/server/cards/AllCards';
import {testGameOptions} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';

describe('CardMetadata', function() {
  let player: Player;

  beforeEach(function() {
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player, testGameOptions({moonExpansion: true}));
  });

  it('should have a VP icon', function() {
    ALL_CARD_MANIFESTS.forEach((manifest) => {
      manifest.projectCards.factories.forEach((c) => {
        const card = new c.Factory();
        if (card.victoryPoints !== undefined) {
          // if (card.victoryPoints === 'special') {
          expect(card.metadata.victoryPoints, card.name + ' should have victoryPoints metadata').is.not.undefined;
        } else if (card.victoryPoints === undefined) {
          expect(card.metadata.victoryPoints, card.name + ' should not have victoryPoints metadata').is.undefined;
        }
      });
    });
  });
});
