import { STATE } from './state.js';

export const ARENA = {
  cx: 360,
  cy: 270,
  trackRadius: 180,
  coreRadius: 40,
};

const ENEMY_TYPES = {
  grunt: { speed: 0.7, hp: 20, reward: 3, color: 'rgba(62,198,182,0.9)' },
  swift: { speed: 1.2, hp: 12, reward: 2, color: 'rgba(196,154,63,0.9)' },
};

export function spawnWaveEnemies(wave) {
  const count = 5 + wave * 2;
  const enemies = [];
  for (let i = 0; i < count; i++) {
    const type = Math.random() < Math.min(0.2 + wave * 0.03, 0.6) ? 'swift' : 'grunt';
    enemies.push(createEnemy(type, (-i * Math.PI) / 8));
  }
  STATE.enemies.push(...enemies);
}

export function createEnemy(type, angle = 0) {
  const def = ENEMY_TYPES[type] || ENEMY_TYPES.grunt;
  return {
    type,
    angle,
    speed: def.speed + Math.random() * 0.1,
    hp: def.hp + Math.max(0, STATE.wave - 1) * 2,
    reward: def.reward,
    color: def.color,
    slowedUntil: 0,
    burnTicks: 0,
  };
}

export function updateEnemies(dt, now, onBreach, onKill = () => {}) {
  const speedScale = 1 - Math.min(0.4, STATE.effects.slowStacks * 0.05);
  const survivors = [];
  for (const enemy of STATE.enemies) {
    const effectiveSpeed = enemy.speed * speedScale;
    enemy.angle += effectiveSpeed * dt * 0.4; // clockwise around the ring
    if (enemy.angle > Math.PI * 2) {
      onBreach(enemy);
      continue;
    }
    // burn damage over time
    if (enemy.burnTicks > 0 && Math.floor(now * 2) % 2 === 0) {
      enemy.hp -= 1 + STATE.effects.burnStacks * 0.5;
      enemy.burnTicks -= dt;
    }
    if (enemy.hp <= 0) {
      onKill(enemy);
    } else {
      survivors.push(enemy);
    }
  }
  STATE.enemies = survivors;
}

export function enemyPosition(enemy) {
  return angleToPoint(enemy.angle, ARENA.trackRadius);
}

export function towerPosition(slot) {
  const angleStep = (Math.PI * 2) / STATE.towerSlots;
  const angle = slot * angleStep;
  return angleToPoint(angle, ARENA.trackRadius);
}

export function angleToPoint(angle, radius) {
  return {
    x: ARENA.cx + Math.cos(angle) * radius,
    y: ARENA.cy + Math.sin(angle) * radius,
  };
}

export function updateTowers(dt, now, onShoot) {
  const angleStep = (Math.PI * 2) / STATE.towerSlots;
  for (const tower of STATE.towers) {
    tower.cooldown -= dt;
    if (tower.cooldown > 0) continue;
    const towerAngle = tower.slot * angleStep;
    const target = findTarget(towerAngle, tower.range);
    if (!target) continue;
    tower.cooldown = 1 / tower.fireRate;
    applyDamageToEnemy(target, tower.damage, tower.effects, now);
    onShoot(towerAngle, target.angle, tower);
  }
}

function findTarget(towerAngle, range) {
  let closest = null;
  let smallest = Infinity;
  for (const enemy of STATE.enemies) {
    const diff = angularDistance(towerAngle, enemy.angle);
    if (diff <= range && diff < smallest) {
      smallest = diff;
      closest = enemy;
    }
  }
  return closest;
}

function angularDistance(a, b) {
  let diff = Math.abs(a - b);
  if (diff > Math.PI) diff = Math.PI * 2 - diff;
  return diff;
}

function applyDamageToEnemy(enemy, damage, effects, now) {
  enemy.hp -= damage;
  if (effects.burn) enemy.burnTicks = 2;
  if (effects.slow) enemy.slowedUntil = now + 1.5;
  if (effects.chain) {
    const neighbors = STATE.enemies
      .filter((e) => e !== enemy)
      .sort((a, b) => angularDistance(enemy.angle, a.angle) - angularDistance(enemy.angle, b.angle))
      .slice(0, 2);
    for (const n of neighbors) {
      n.hp -= damage * 0.5;
    }
  }
}
