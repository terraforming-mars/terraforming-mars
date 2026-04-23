<template>
  <div class="delta-project-board">
    <table class="delta-project-board__track">
      <tr>
        <td class="delta-project-board__step delta-project-board__step--start">
          <div class="delta-project-board__tag-cell"></div>
        </td>
        <td v-for="step in steps" :key="step.tag ?? 'vp-' + step.vpValue" class="delta-project-board__step">
          <div class="delta-project-board__tag-cell">
            <div v-if="step.vpValue" class="card-points delta-project-board__vp">{{ step.vpValue }}</div>
            <div v-else class="resource-tag" :class="'tag-' + step.tag"></div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="delta-project-board__slots-cell delta-project-board__slots-cell--start">
          <div class="delta-project-board__slots">
            <i
              v-for="color in playersAtPosition(0)"
              :key="color"
              :class="cubeCss(color)"
              class="delta-project-board__cube"
            ></i>
            <div
              v-for="n in emptySlotsStart()"
              :key="'empty-start-' + n"
              class="delta-project-board__slot"
            ></div>
          </div>
        </td>
        <td v-for="(step, idx) in steps" :key="(step.tag ?? 'vp-' + step.vpValue) + '-slots'" class="delta-project-board__slots-cell">
          <div class="delta-project-board__slots">
            <i
              v-for="color in playersAtPosition(idx + 1)"
              :key="color"
              :class="cubeCss(color)"
              class="delta-project-board__cube"
            ></i>
            <div
              v-for="n in emptySlots(idx + 1, step)"
              :key="'empty-' + n"
              class="delta-project-board__slot"
            ></div>
          </div>
        </td>
      </tr>
      <tr>
        <td class="delta-project-board__reward-cell delta-project-board__reward-cell--start">
          <div class="delta-project-board__reward delta-project-board__reward--start"></div>
        </td>
        <td v-for="step in steps" :key="(step.tag ?? 'vp-' + step.vpValue) + '-reward'" class="delta-project-board__reward-cell">
          <div class="delta-project-board__reward">
            <template v-for="(icon, idx) in step.rewardIcons" :key="idx">
              <span v-if="icon.or" class="delta-project-board__or">or</span>
              <span v-else-if="icon.separator" class="delta-project-board__separator">/</span>
              <div v-else-if="icon.production" class="delta-project-board__prod-box">
                <div v-for="n in (icon.count || 1)" :key="n" :class="icon.cssClass">{{ icon.text || '' }}</div>
              </div>
              <span v-else-if="icon.asterisk" class="delta-project-board__asterisk">*</span>
              <div v-else :class="icon.cssClass"></div>
            </template>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Color} from '@/common/Color';
import {Tag} from '@/common/cards/Tag';
import {DeltaProjectModel} from '@/common/models/DeltaProjectModel';
import {getPreferences} from '@/client/utils/PreferencesManager';

type RewardIcon = {
  cssClass: string;
  production?: boolean;
  separator?: boolean;
  or?: boolean;
  asterisk?: boolean;
  count?: number;
  text?: string;
};

type DeltaBoardStep = {
  tag?: Tag;
  vpValue?: number;
  dynamicSlots: boolean;
  rewardIcons: Array<RewardIcon>;
};

const STEPS: ReadonlyArray<DeltaBoardStep> = [
  {
    tag: Tag.BUILDING,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'resource_icon resource_icon--steel'},
      {cssClass: 'resource_icon resource_icon--steel'},
      {cssClass: '', or: true},
      {cssClass: 'resource_icon resource_icon--plants'},
      {cssClass: 'resource_icon resource_icon--plants'},
    ],
  },
  {
    tag: Tag.POWER,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'resource_icon resource_icon--energy', production: true},
      {cssClass: '', or: true},
      {cssClass: 'resource_icon resource_icon--heat', production: true},
    ],
  },
  {
    tag: Tag.EARTH,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'resource money', production: true, text: '2'},
    ],
  },
  {
    tag: Tag.SPACE,
    dynamicSlots: true,
    rewardIcons: [{cssClass: 'resource_icon resource_icon--titanium', production: true}],
  },
  {
    tag: Tag.SCIENCE,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'delta-project-board__card-icon'},
      {cssClass: 'delta-project-board__card-icon'},
      {cssClass: 'delta-project-board__card-icon delta-project-board__card-icon--discarded'},
      {cssClass: 'delta-project-board__card-icon delta-project-board__card-icon--discarded'},
    ],
  },
  {
    tag: Tag.PLANT,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'resource_icon resource_icon--plants'},
      {cssClass: '', separator: true},
      {cssClass: 'resource-tag tag-plant delta-project-board__reward-tag'},
    ],
  },
  {
    tag: Tag.MICROBE,
    dynamicSlots: true,
    rewardIcons: [{cssClass: 'red-arrow'}],
  },
  {
    tag: Tag.JOVIAN,
    dynamicSlots: true,
    rewardIcons: [{cssClass: 'resource-tag tag-jovian delta-project-board__reward-tag'}],
  },
  {
    tag: Tag.ANIMAL,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'resource animal'},
      {cssClass: 'resource animal'},
      {cssClass: '', asterisk: true},
    ],
  },
  {
    vpValue: 2,
    dynamicSlots: false,
    rewardIcons: [],
  },
  {
    vpValue: 5,
    dynamicSlots: false,
    rewardIcons: [],
  },
];

export default defineComponent({
  name: 'DeltaProjectBoard',
  props: {
    model: {
      type: Object as () => DeltaProjectModel,
      required: true,
    },
    playersCount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      steps: STEPS,
    };
  },
  methods: {
    cubeCss(color: Color): string {
      const css = 'board-cube board-cube--' + color;
      return getPreferences().symbol_overlay ? css + ' overlay' : css;
    },
    playersAtPosition(position: number): Array<Color> {
      const result: Array<Color> = [];
      for (const [color, progress] of Object.entries(this.model.players)) {
        if (progress && progress.position === position) {
          result.push(color as Color);
        }
      }
      return result;
    },
    emptySlots(position: number, step: DeltaBoardStep): number {
      const occupied = this.playersAtPosition(position).length;
      const minSlots = step.dynamicSlots ? this.playersCount : 1;
      return Math.max(0, minSlots - occupied);
    },
    emptySlotsStart(): number {
      const occupied = this.playersAtPosition(0).length;
      return Math.max(0, this.playersCount - occupied);
    },
  },
});
</script>

<style scoped>
.delta-project-board {
  margin: 20px;
  display: block;
  overflow-x: auto;
}

.delta-project-board__track {
  border-spacing: 0;
  background: #303030;
  border-radius: 4px;
}

.delta-project-board__step {
  padding: 8px 6px;
  text-align: center;
  border-left: 2px solid rgba(0, 0, 0, 0.5);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
  min-width: 50px;
}

.delta-project-board__step:first-child {
  border-left: none;
}

.delta-project-board__step--start {
  min-width: 44px;
}

.delta-project-board__step--start .delta-project-board__tag-cell {
  min-height: 36px;
}

.delta-project-board__slots-cell--start {
  vertical-align: middle;
}

.delta-project-board__reward-cell--start {
  min-height: 28px;
}

.delta-project-board__reward--start {
  min-height: 1em;
}

.delta-project-board__tag-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.delta-project-board__tag-cell :deep(.resource-tag) {
  width: 36px;
  height: 36px;
  background-size: 40px 40px;
  background-position: -2px -2px;
}

.delta-project-board__vp {
  font-family: Prototype, sans-serif;
  font-size: 18px;
  font-weight: normal;
  justify-content: center;
  text-shadow: 0 0 2px darkorange;
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  border-radius: 6px;
  border-top: 2px solid #dddddd;
  border-left: 2px solid #dddddd;
  border-bottom: 2px solid #898989;
  border-right: 2px solid #898989;
  background: linear-gradient(#cc8b00, #805700, #805700);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(0, 0, 0, 0.3);
}

.delta-project-board__slots-cell {
  padding: 4px 6px;
  text-align: center;
  border-left: 2px solid rgba(0, 0, 0, 0.5);
}

.delta-project-board__slots-cell:first-child {
  border-left: none;
}

.delta-project-board__slots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3px;
}

.delta-project-board__cube {
  position: relative;
  width: 21px;
  height: 21px;
  margin: 0;
  filter: drop-shadow(2px 2px 3px black);
}

.delta-project-board__cube::after {
  margin-left: 0 !important;
  margin-top: 0 !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delta-project-board__slot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px dashed #8fb1c7;
  background: rgba(143, 177, 199, 0.15);
}

.delta-project-board__reward-cell {
  padding: 6px 4px 8px;
  text-align: center;
  border-left: 2px solid rgba(0, 0, 0, 0.5);
}

.delta-project-board__reward-cell:first-child {
  border-left: none;
}

.delta-project-board__reward {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
}

.delta-project-board__separator {
  font-family: Prototype, sans-serif;
  font-size: 24px;
  margin: 0 2px;
}

.delta-project-board__or {
  font-family: Prototype, sans-serif;
  font-size: 16px;
  margin: 0 3px;
  text-transform: lowercase;
}

.delta-project-board__asterisk {
  font-family: Prototype, sans-serif;
  font-size: 18px;
  line-height: 1;
  margin-left: 2px;
  align-self: flex-start;
  padding-top: 2px;
  color: #c5c5c5;
}

.delta-project-board__prod-box {
  display: inline-flex;
  flex-flow: row;
  align-items: center;
  padding: 4px;
  margin: 0 2px;
  border-top: 2px solid #dddddd;
  border-left: 2px solid #dddddd;
  border-bottom: 2px solid #898989;
  border-right: 2px solid #898989;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(0, 0, 0, 0.3);
  background-image: url(/assets/misc/production.png);
  background-size: cover;
}

.delta-project-board__prod-box :deep(.resource) {
  margin: 0;
  width: 36px;
  height: 36px;
  background-size: 36px;
  line-height: 36px;
}

.delta-project-board__reward-tag {
  width: 36px;
  height: 36px;
  background-size: 38px 38px;
  background-position: -2px -2px;
  box-shadow: none;
  filter: none;
}

.delta-project-board__reward :deep(.resource_icon) {
  display: block;
}

.delta-project-board__card-icon {
  background: url(/assets/resources/card.png) no-repeat;
  background-size: 24px 32px;
  width: 24px;
  height: 32px;
}

.delta-project-board__card-icon--discarded {
  opacity: 0.5;
}
</style>
