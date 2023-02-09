import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';

export class AsteroidResources extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ASTEROID_RESOURCES,
      cost: 17,
      tags: [Tag.JOVIAN, Tag.SPACE],
      reserveUnits: {energy: 3},
      victoryPoints: 1,

      metadata: {
        cardNumber: 'Pf40',
        renderData: CardRenderer.builder((b) => {
          b.minus().energy(3, {digit}).production((pb) => pb.steel(1).titanium(1)).br
            .or(Size.SMALL).br;
          b.minus().energy(3, {digit}).oceans(1, {size: Size.SMALL}).steel(2, {digit}).titanium(1);
        }),
        description: 'Spend 3 energy. Either increase your steel and titanium production one step, OR ' +
          'place an ocean, and gain 2 steel and one titanium.',
      },
    });
  }

  public override bespokeCanPlay(player: Player) {
    return player.hasUnits(this.reserveUnits);
  }
  public override bespokePlay(player: Player) {
    const options = new OrOptions(
      new SelectOption('Increase your steel and titanium production 1 step.', 'Select', () => {
        player.deductUnits(this.reserveUnits);
        player.production.add(Resources.STEEL, 1, {log: true});
        player.production.add(Resources.TITANIUM, 1, {log: true});
        return undefined;
      }),
      new SelectOption('Place an ocean, and gain 2 steel and one titanium.', 'Select', () => {
        player.deductUnits(this.reserveUnits);
        player.addResource(Resources.STEEL, 2, {log: true});
        player.addResource(Resources.TITANIUM, 1, {log: true});
        player.game.defer(new PlaceOceanTile(player));
        return undefined;
      }),
    );

    // Autoresolve the first option if Reds are in power and the player can't pay the reds tax for an ocean.
    if (!player.canAfford(0, {tr: {oceans: 1}})) {
      options.options[0].cb();
      return undefined;
    }
    return options;
  }
}
