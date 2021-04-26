import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {IProjectCard} from '../IProjectCard';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class CoreMine extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.CORE_MINE,
      tags: [Tags.MOON],
      metadata: {
        description: 'Place a mine tile on the Moon and raise the Mining Rate 1 step. Increase your titanium production 1 step.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).moonMine().secondaryTag(AltSecondaryTag.MOON_MINING_RATE);
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 1, {log: true});
    player.game.defer(new PlaceMoonMineTile(player));
    return undefined;
  }
}
