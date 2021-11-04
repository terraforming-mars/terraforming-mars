import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {ALL_CARD_MANIFESTS} from '../../src/cards/AllCards';
import {TestingUtils} from '../TestingUtils';
import {TestPlayers} from '../TestPlayers';

describe('CardMetadata', function() {
  let player : Player;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player, TestingUtils.setCustomGameOptions({moonExpansion: true}));
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
