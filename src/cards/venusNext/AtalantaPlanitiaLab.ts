import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class AtalantaPlanitiaLab implements IProjectCard {
  public cost = 10;
  public tags = [Tags.VENUS, Tags.SCIENCE];
  public name = CardName.ATALANTA_PLANITIA_LAB;
  public cardType = CardType.AUTOMATED;
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 3;
  }
  public play(player: Player) {
    player.drawCard(2);
    return undefined;
  }

  public getVictoryPoints() {
    return 2;
  }
  public metadata: CardMetadata = {
    cardNumber: '216',
    description: 'Requires 3 science tags. Draw 2 cards.',
    requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
    renderData: CardRenderer.builder((b) => b.cards(2)),
    victoryPoints: 2,
  }
}
