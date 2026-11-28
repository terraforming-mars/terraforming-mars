import {CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {SILVER_CUBE_MC} from '@/server/automa/corps/corpHelpers';

export class MorningStarIncMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.MORNING_STAR_INC,
      description: 'Tags: 2 Venus. Setup: remove Lobbyists, add Venusian Lobby. Silver resource cubes on Venus track earn 5 M€ each.',
      tags: [Tag.VENUS, Tag.VENUS],
      requiredExpansions: ['venus'],
      // Silver resource cubes on the Venus track (index 7, present only on the Venus board) at positions 5-9 and 11-12.
      trackCubes: [5, 6, 7, 8, 9, 11, 12].map((position) => ({trackIndex: 7, position, cubeType: 'credit' as const})),
    });
  }

  public override setup(marsBot: IMarsBot): void {
    // With Venus Next the bonus deck's Lobbyists is B15
    marsBot.removeBonusCard(BonusCardName.LOBBYISTS);
    marsBot.removeBonusCard(BonusCardName.LOBBYISTS_VENUS);
    marsBot.addBonusCardToBonusDeck(BonusCardName.VENUSIAN_LOBBY);
    marsBot.game.log('MarsBot (${0}): ${1} removed, ${2} added', (b) => b.cardName(this.name).bonusCardName(BonusCardName.LOBBYISTS).bonusCardName(BonusCardName.VENUSIAN_LOBBY));
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, _trackIndex: number, _position: number, cubeType: CubeType): void {
    if (cubeType === 'credit') {
      marsBot.gainMc(SILVER_CUBE_MC);
      marsBot.game.log('MarsBot (${0}): silver resource cube, +5:r:mc:', (b) => b.cardName(this.name));
    }
  }
}
