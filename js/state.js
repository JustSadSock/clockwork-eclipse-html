export const STATE = {
  wave: 0,
  coreHP: 100,
  maxHP: 100,
  breaches: 0,
  breachLimit: 10,
  resources: 0,
  enemies: [],
  towers: [],
  towerSlots: 8,
  paused: true,
  betweenWaves: true,
  effects: {
    burnStacks: 0,
    slowStacks: 0,
    chainStacks: 0,
  },
};

export function resetState() {
  STATE.wave = 0;
  STATE.coreHP = STATE.maxHP = 100;
  STATE.breaches = 0;
  STATE.resources = 0;
  STATE.enemies = [];
  STATE.towers = [];
  STATE.paused = true;
  STATE.betweenWaves = true;
  STATE.effects = {
    burnStacks: 0,
    slowStacks: 0,
    chainStacks: 0,
  };
}

export function addTower(slotIndex) {
  if (slotIndex < 0 || slotIndex >= STATE.towerSlots) return false;
  const occupied = STATE.towers.some((t) => t.slot === slotIndex);
  if (occupied) return false;
  STATE.towers.push({
    slot: slotIndex,
    damage: 6,
    fireRate: 1.2,
    range: Math.PI / 3,
    cooldown: 0,
    effects: { slow: false, burn: false, chain: false },
  });
  return true;
}

export function randomFreeSlot() {
  const used = new Set(STATE.towers.map((t) => t.slot));
  const slots = [];
  for (let i = 0; i < STATE.towerSlots; i++) {
    if (!used.has(i)) slots.push(i);
  }
  if (!slots.length) return null;
  return slots[Math.floor(Math.random() * slots.length)];
}

export function applyDamage(amount) {
  STATE.coreHP = Math.max(0, STATE.coreHP - amount);
}

export function registerBreach() {
  STATE.breaches += 1;
}

export function addResources(amount) {
  STATE.resources += amount;
}

export function startWave() {
  STATE.wave += 1;
  STATE.betweenWaves = false;
  STATE.paused = false;
}

export function endWave() {
  STATE.betweenWaves = true;
  STATE.paused = true;
}

export function isGameOver() {
  return STATE.coreHP <= 0 || STATE.breaches >= STATE.breachLimit;
}
