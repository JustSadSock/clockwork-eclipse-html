import { STATE, addTower, randomFreeSlot } from './state.js';

const upgradePool = [
  {
    id: 'tower-slot',
    name: 'Summon Turret',
    description: 'Place a new bronze turret in a free slot.',
    apply: () => {
      const slot = randomFreeSlot();
      if (slot !== null) addTower(slot);
    },
  },
  {
    id: 'damage',
    name: 'Sharpened Gears',
    description: 'Increase tower damage by 20%.',
    apply: () => {
      for (const t of STATE.towers) t.damage *= 1.2;
    },
  },
  {
    id: 'firerate',
    name: 'Accelerated Cogs',
    description: 'Increase tower fire rate by 15%.',
    apply: () => {
      for (const t of STATE.towers) t.fireRate *= 1.15;
    },
  },
  {
    id: 'range',
    name: 'Extended Arc',
    description: 'Increase tower range by 10%.',
    apply: () => {
      for (const t of STATE.towers) t.range *= 1.1;
    },
  },
  {
    id: 'slow',
    name: 'Frosted Bearings',
    description: 'Towers apply a brief slow on hit.',
    apply: () => {
      for (const t of STATE.towers) t.effects.slow = true;
      STATE.effects.slowStacks += 1;
    },
  },
  {
    id: 'burn',
    name: 'Solar Ember',
    description: 'Hits ignite enemies for bonus burn damage.',
    apply: () => {
      for (const t of STATE.towers) t.effects.burn = true;
      STATE.effects.burnStacks += 1;
    },
  },
  {
    id: 'chain',
    name: 'Chain Spark',
    description: 'Shots arc to nearby foes.',
    apply: () => {
      for (const t of STATE.towers) t.effects.chain = true;
      STATE.effects.chainStacks += 1;
    },
  },
];

export function generateUpgradeChoices() {
  const choices = [];
  const poolCopy = [...upgradePool];
  for (let i = 0; i < 3 && poolCopy.length; i++) {
    const index = Math.floor(Math.random() * poolCopy.length);
    choices.push(poolCopy.splice(index, 1)[0]);
  }
  return choices;
}
