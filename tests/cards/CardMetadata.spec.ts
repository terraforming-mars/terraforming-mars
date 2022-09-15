import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {ALL_MODULE_MANIFESTS} from '../../src/server/cards/AllCards';
import {testGameOptions} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {CardManifest} from '../../src/server/cards/ModuleManifest';
import {ICard} from '../../src/server/cards/ICard';

describe('CardMetadata', function() {
  let player: Player;

  beforeEach(function() {
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player, testGameOptions({moonExpansion: true}));
  });

  it('should have a VP icon', function() {
    ALL_MODULE_MANIFESTS.forEach((manifest) => {
      const factories: CardManifest<ICard> = {...manifest.projectCards, ...manifest.corporationCards};

      for (const factory of CardManifest.values(factories)) {
        const card = new factory.Factory();
        if (card.victoryPoints !== undefined) {
          // if (card.victoryPoints === 'special') {
          expect(card.metadata.victoryPoints, card.name + ' should have victoryPoints metadata').is.not.undefined;
        } else if (card.victoryPoints === undefined) {
          expect(card.metadata.victoryPoints, card.name + ' should not have victoryPoints metadata').is.undefined;
        }
      }
    });
  });
});
