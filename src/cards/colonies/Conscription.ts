import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Conscription implements IProjectCard {
    public cardType = CardType.EVENT;
    public cost = 5;
    public tags = [Tags.EARTH];
    public name = CardName.CONSCRIPTION;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.EARTH) >= 2;
    }

    public getCardDiscount(player: Player, _game: Game) {
      if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
        return 16;
      }
      return 0;
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return -1;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C05',
      requirements: CardRequirements.builder((b) => b.tag(Tags.EARTH, 2)),
      renderData: CardRenderer.builder((b) => {
        b.text('next card', CardRenderItemSize.SMALL, true).colon().megacredits(-16);
      }),
      description: 'Requires 2 Earth tags. The next card you play this generation costs 16 MC less.',
      victoryPoints: -1,
    }
}
