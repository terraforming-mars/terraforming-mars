<template>
  <div class="delta-project-board">
    <table class="delta-project-board__track">
      <tr>
        <td v-for="step in steps" :key="step.id" class="delta-project-board__step">
          <div class="delta-project-board__tag-cell">
            <div v-if="step.vpValue" class="card-points delta-project-board__vp">{{ step.vpValue }}</div>
            <div v-else class="resource-tag" :class="step.tagClass"></div>
          </div>
        </td>
      </tr>
      <tr>
        <td v-for="step in steps" :key="step.id + '-slots'" class="delta-project-board__slots-cell">
          <div class="delta-project-board__slots">
            <div
              v-for="slot in getSlotCount(step)"
              :key="slot"
              class="delta-project-board__slot"
            ></div>
          </div>
        </td>
      </tr>
      <tr>
        <td v-for="step in steps" :key="step.id + '-reward'" class="delta-project-board__reward-cell">
          <div class="delta-project-board__reward">
            <template v-for="(icon, idx) in step.rewardIcons" :key="idx">
              <span v-if="icon.separator" class="delta-project-board__separator">/</span>
              <div v-else-if="icon.production" class="delta-project-board__prod-box">
                <div v-for="n in (icon.count || 1)" :key="n" :class="icon.cssClass">{{ icon.text || '' }}</div>
              </div>
              <div v-else :class="icon.cssClass"></div>
            </template>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';

type RewardIcon = {
  cssClass: string;
  production?: boolean;
  separator?: boolean;
  count?: number;
  text?: string;
};

type DeltaBoardStep = {
  id: string;
  tagClass: string;
  vpValue: number | undefined;
  dynamicSlots: boolean;
  rewardIcons: Array<RewardIcon>;
};

const STEPS: ReadonlyArray<DeltaBoardStep> = [
  {
    id: 'building',
    tagClass: 'tag-building',
    vpValue: undefined,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'resource_icon resource_icon--steel'},
      {cssClass: 'resource_icon resource_icon--steel'},
      {cssClass: '', separator: true},
      {cssClass: 'resource_icon resource_icon--plants'},
      {cssClass: 'resource_icon resource_icon--plants'},
    ],
  },
  {
    id: 'power',
    tagClass: 'tag-power',
    vpValue: undefined,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'resource_icon resource_icon--energy', production: true},
      {cssClass: '', separator: true},
      {cssClass: 'resource_icon resource_icon--heat', production: true},
    ],
  },
  {
    id: 'earth',
    tagClass: 'tag-earth',
    vpValue: undefined,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'resource money', production: true, text: '2'},
    ],
  },
  {
    id: 'space',
    tagClass: 'tag-space',
    vpValue: undefined,
    dynamicSlots: true,
    rewardIcons: [{cssClass: 'resource_icon resource_icon--titanium', production: true}],
  },
  {
    id: 'science',
    tagClass: 'tag-science',
    vpValue: undefined,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'delta-project-board__card-icon'},
      {cssClass: 'delta-project-board__card-icon'},
      {cssClass: 'delta-project-board__card-icon delta-project-board__card-icon--discarded'},
      {cssClass: 'delta-project-board__card-icon delta-project-board__card-icon--discarded'},
    ],
  },
  {
    id: 'plant',
    tagClass: 'tag-plant',
    vpValue: undefined,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'resource_icon resource_icon--plants'},
      {cssClass: '', separator: true},
      {cssClass: 'resource-tag tag-plant delta-project-board__reward-tag'},
    ],
  },
  {
    id: 'microbe',
    tagClass: 'tag-microbe',
    vpValue: undefined,
    dynamicSlots: true,
    rewardIcons: [{cssClass: 'red-arrow'}],
  },
  {
    id: 'jovian',
    tagClass: 'tag-jovian',
    vpValue: undefined,
    dynamicSlots: true,
    rewardIcons: [{cssClass: 'resource-tag tag-jovian delta-project-board__reward-tag'}],
  },
  {
    id: 'animal',
    tagClass: 'tag-animal',
    vpValue: undefined,
    dynamicSlots: true,
    rewardIcons: [
      {cssClass: 'resource animal'},
      {cssClass: 'resource animal'},
    ],
  },
  {
    id: 'vp2',
    tagClass: '',
    vpValue: 2,
    dynamicSlots: false,
    rewardIcons: [],
  },
  {
    id: 'vp5',
    tagClass: '',
    vpValue: 5,
    dynamicSlots: false,
    rewardIcons: [],
  },
];

export default defineComponent({
  name: 'DeltaProjectBoard',
  props: {
    playersCount: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      steps: STEPS,
    };
  },
  methods: {
    getSlotCount(step: DeltaBoardStep): number {
      return step.dynamicSlots ? Math.max(2, this.playersCount) : 1;
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

.delta-project-board__header {
  font-family: Prototype, sans-serif;
  font-size: 18px;
  margin-bottom: 8px;
  text-align: center;
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
