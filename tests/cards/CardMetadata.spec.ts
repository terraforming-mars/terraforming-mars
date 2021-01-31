import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {ALL_CARD_MANIFESTS} from '../../src/cards/AllCards';
import {CardRenderDynamicVictoryPoints} from '../../src/cards/render/CardRenderDynamicVictoryPoints';
import {setCustomGameOptions, TestPlayers} from '../TestingUtils';

describe('CardMetadata', function() {
  let player : Player;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player, setCustomGameOptions({moonExpansion: true}));
  });

  it('should have a VP icon', function() {
    ALL_CARD_MANIFESTS.forEach((manifest) => {
      manifest.projectCards.factories.forEach((c) => {
        const card = new c.Factory();
        if (card.metadata !== undefined && card.getVictoryPoints !== undefined) {
          expect(card.metadata.victoryPoints, card.name + ' is missing VP metadata').is.not.undefined;
          const vp = card.getVictoryPoints(player);
          if (vp !== 0) {
            if (card.metadata.victoryPoints instanceof CardRenderDynamicVictoryPoints && card.metadata.victoryPoints.anyPlayer === true) {
              expect(card.metadata.victoryPoints.points, card.name + ' has invalid VP metadata').to.eq(vp);
            } else {
              expect(card.metadata.victoryPoints, card.name + ' has invalid VP metadata').to.eq(vp);
            }
          }
          // If vp === 0 that means it's a variable VP card, so we can't check the actual value
        }
      });
    });
  });
});
