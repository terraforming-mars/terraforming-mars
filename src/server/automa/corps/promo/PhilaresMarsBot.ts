import {TileType} from '@/common/TileType';
import {CardName} from '@/common/cards/CardName';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {Space} from '@/server/boards/Space';

export class PhilaresMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.PHILARES,
      description: 'Setup: place greenery, +1 science resource, resolve and remove Local Neural Instance, add Build Build Build to bonus deck. ' +
        'Each new adjacency between its tile and the player\'s tile: +1 science resource. ' +
        'Spend 4 science resources to advance the most-advanced track that is not maxed, but not after the game has ended.',
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.placeGreenery();
    marsBot.setCorpState('scienceResources', 1);
    marsBot.removeBonusCard(BonusCardName.LOCAL_NEURAL_INSTANCE);
    marsBot.resolveBonusCard(BonusCardName.LOCAL_NEURAL_INSTANCE);
    marsBot.addBonusCardToBonusDeck(BonusCardName.BUILD_BUILD_BUILD);
    marsBot.game.log('MarsBot (${0}): placed greenery, +1 science resource, ${1} removed, ${2} added',
      (b) => b.cardName(this.name).bonusCardName(BonusCardName.LOCAL_NEURAL_INSTANCE).bonusCardName(BonusCardName.BUILD_BUILD_BUILD));
  }

  public override onTilePlaced(marsBot: IMarsBot, placedByMarsBot: boolean, _tileType: TileType, space: Space): void {
    // Oceans belong to no one, so they never make an adjacency
    if (space.player === undefined) {
      return;
    }
    const otherSide = (s: Space) => placedByMarsBot ? s.player !== marsBot.player : s.player === marsBot.player;
    const adjacencies = marsBot.game.board.getAdjacentSpaces(space)
      .filter((s) => s.tile !== undefined && s.player !== undefined && otherSide(s)).length;
    if (adjacencies === 0) {
      return;
    }
    marsBot.setCorpState('scienceResources', marsBot.getCorpState('scienceResources') + adjacencies);
    marsBot.game.log('MarsBot (${0}): +${1} science resource(s) from new adjacencies with the player', (b) => b.cardName(this.name).number(adjacencies));
    // No track advances once the game has ended (TDaver, BGG 3513998), so the science
    // resources stay unspent rather than paying for an advance that doesn't happen
    if (marsBot.game.isDoneWithFinalProduction()) {
      return;
    }
    while (marsBot.getCorpState('scienceResources') >= 4) {
      const trackIndex = marsBot.marsBotBoard.getMostAdvancedNonMaxedTrackIndex();
      if (trackIndex === undefined) {
        return;
      }
      marsBot.setCorpState('scienceResources', marsBot.getCorpState('scienceResources') - 4);
      marsBot.game.log('MarsBot (${0}): spends 4 science resources to advance its most-advanced track', (b) => b.cardName(this.name));
      marsBot.advanceTrack(trackIndex);
    }
  }
}
