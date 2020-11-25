import {expect} from 'chai';
import {Color} from '../../src/Color';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {ALL_CARD_MANIFESTS} from '../../src/cards/AllCards';

describe('CardMetadata', function() {
  let player : Player; let game : Game;

  beforeEach(function() {
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player], player);
  });

  it('should have a VP icon', function() {
    ALL_CARD_MANIFESTS.forEach((manifest) => {
      manifest.projectCards.cards.forEach((c) => {
        const card = new c.Factory();
        if (card.metadata !== undefined && card.getVictoryPoints !== undefined) {
          expect(card.metadata.victoryPoints, card.name + ' is missing VP metadata').is.not.undefined;
          const vp = card.getVictoryPoints(player, game);
          if (vp !== 0) {
            expect(card.metadata.victoryPoints, card.name + ' has invalid VP metadata').to.eq(vp);
          }
        }
      });
    });
  });
});
