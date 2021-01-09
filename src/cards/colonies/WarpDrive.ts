import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class WarpDrive implements IProjectCard {
    public cost = 14;
    public tags = [Tags.SCIENCE];
    public name = CardName.WARP_DRIVE;
    public cardType = CardType.ACTIVE;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
      if (card.tags.indexOf(Tags.SPACE) !== -1) {
        return 4;
      }
      return 0;
    }

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 5;
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints() {
      return 2;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C49',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 5)),
      renderData: CardRenderer.builder((b) => {
        b.effect('When you play a Space card, you pay 4 MC less for it.', (eb) => {
          eb.space().played.startEffect.megacredits(-4);
        });
      }),
      description: 'Requires 5 Science tags.',
      victoryPoints: 2,
    }
}
