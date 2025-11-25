import { STATE, startWave, endWave, addResources, applyDamage, registerBreach, isGameOver } from './state.js';
import { ARENA, spawnWaveEnemies, updateEnemies, updateTowers, enemyPosition, towerPosition } from './entities.js';
import { generateUpgradeChoices } from './upgrades.js';
import { renderHUD, showUpgradeDraft, hideUpgradeDraft, showGameOver } from './ui.js';

let ctx;
let lastTime = 0;
let animationId = null;
let projectileArcs = [];
let onWaveClearCallback = null;

export function initCore(canvas, onWaveClear) {
  ctx = canvas.getContext('2d');
  onWaveClearCallback = onWaveClear;
}

export function startGame() {
  cancelAnimationFrame(animationId);
  lastTime = performance.now();
  animationId = requestAnimationFrame(loop);
}

function loop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  if (!STATE.paused) {
    updateEnemies(dt, now / 1000, handleBreach, handleKill);
    updateTowers(dt, now / 1000, (from, to, tower) => recordShot(from, to, tower));
    cleanupProjectiles(dt);
  }

  render(now / 1000);
  renderHUD(STATE);

  if (!STATE.betweenWaves && STATE.enemies.length === 0) {
    handleWaveClear();
  }

  if (!STATE.paused || STATE.betweenWaves) {
    animationId = requestAnimationFrame(loop);
  }
}

function handleWaveClear() {
  endWave();
  const upgrades = generateUpgradeChoices();
  showUpgradeDraft(upgrades);
  if (onWaveClearCallback) onWaveClearCallback(upgrades);
}

export function beginWave() {
  hideUpgradeDraft();
  startWave();
  spawnWaveEnemies(STATE.wave);
}

function handleBreach(enemy) {
  STATE.enemies = STATE.enemies.filter((e) => e !== enemy);
  applyDamage(10);
  registerBreach();
  if (isGameOver()) {
    endWave();
    showGameOver(STATE);
  }
}

function handleKill(enemy) {
  addResources(enemy.reward || 1);
}

function recordShot(fromAngle, toAngle, tower) {
  projectileArcs.push({ fromAngle, toAngle, life: 0.3, color: tower.effects.chain ? '#9EE7E0' : '#3EC6B6' });
}

function cleanupProjectiles(dt) {
  projectileArcs = projectileArcs
    .map((p) => ({ ...p, life: p.life - dt }))
    .filter((p) => p.life > 0);
}

function render(time) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawBackground();
  drawTrack();
  drawCore();
  drawTowers(time);
  drawEnemies();
  drawProjectiles();
}

function drawBackground() {
  const gradient = ctx.createRadialGradient(ARENA.cx, ARENA.cy, 40, ARENA.cx, ARENA.cy, 260);
  gradient.addColorStop(0, 'rgba(62,198,182,0.12)');
  gradient.addColorStop(1, 'rgba(5,8,20,0.9)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawTrack() {
  ctx.save();
  ctx.strokeStyle = 'rgba(196,154,63,0.8)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(ARENA.cx, ARENA.cy, ARENA.trackRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = 'rgba(62,198,182,0.4)';
  ctx.beginPath();
  ctx.arc(ARENA.cx, ARENA.cy, ARENA.trackRadius + 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawCore() {
  ctx.save();
  ctx.fillStyle = '#0f1b2d';
  ctx.strokeStyle = '#C49A3F';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(ARENA.cx, ARENA.cy, ARENA.coreRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(62,198,182,0.6)';
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.arc(ARENA.cx, ARENA.cy, ARENA.coreRadius + 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawEnemies() {
  for (const enemy of STATE.enemies) {
    const { x, y } = enemyPosition(enemy);
    ctx.save();
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.stroke();
  }
}

function drawTowers(time) {
  ctx.save();
  ctx.fillStyle = '#8B6A2B';
  const angleStep = (Math.PI * 2) / STATE.towerSlots;
  for (let i = 0; i < STATE.towerSlots; i++) {
    const { x, y } = towerPosition(i);
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(196,154,63,0.8)';
    ctx.stroke();
  }
  for (const tower of STATE.towers) {
    const { x, y } = towerPosition(tower.slot);
    ctx.beginPath();
    ctx.fillStyle = '#C49A3F';
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#9EE7E0';
    ctx.stroke();
    // subtle pulse
    ctx.globalAlpha = 0.2 + Math.abs(Math.sin(time * tower.fireRate)) * 0.3;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function drawProjectiles() {
  ctx.save();
  ctx.strokeStyle = '#3EC6B6';
  ctx.lineWidth = 3;
  for (const arc of projectileArcs) {
    const from = angleToVector(arc.fromAngle, ARENA.trackRadius - 10);
    const to = angleToVector(arc.toAngle, ARENA.trackRadius);
    ctx.globalAlpha = Math.max(0, arc.life / 0.3);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
  ctx.restore();
}

function angleToVector(angle, radius) {
  return {
    x: ARENA.cx + Math.cos(angle) * radius,
    y: ARENA.cy + Math.sin(angle) * radius,
  };
}

export function awardResourcesFor(enemy) {
  addResources(enemy.reward || 1);
}

export function handleEnemyDefeat(enemy) {
  STATE.enemies = STATE.enemies.filter((e) => e !== enemy);
  awardResourcesFor(enemy);
}

export function damageEnemy(enemy, amount) {
  enemy.hp -= amount;
  if (enemy.hp <= 0) {
    handleEnemyDefeat(enemy);
  }
}
