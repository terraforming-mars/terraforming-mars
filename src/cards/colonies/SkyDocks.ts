import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class SkyDocks implements IProjectCard {
    public cost = 18;
    public tags = [Tags.SPACE, Tags.EARTH];
    public name = CardName.SKY_DOCKS;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.EARTH) >= 2;
    }

    public play(player: Player) {
      player.increaseFleetSize();
      return undefined;
    }

    public getCardDiscount() {
      return 1;
    }

    public getVictoryPoints() {
      return 2;
    }

    public onDiscard(player: Player): void {
      player.decreaseFleetSize();
    }

    public metadata: CardMetadata = {
      cardNumber: 'C36',
      requirements: CardRequirements.builder((b) => b.tag(Tags.EARTH, 2)),
      renderData: CardRenderer.builder((b) => {
        b.effect('When you play a card, you pay 1 MC less for it.', (eb) => {
          eb.empty().startEffect.megacredits(-1);
        }).br;
        b.tradeFleet();
      }),
      description: 'Requires 2 Earth tags. Gain 1 Trade Fleet.',
      victoryPoints: 2,
    }
}
