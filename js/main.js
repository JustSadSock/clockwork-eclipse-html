import { resetState, addTower } from './state.js';
import { initCore, startGame, beginWave } from './core.js';
import { initUI, hideGameOver, hideUpgradeDraft } from './ui.js';

function setup() {
  const canvas = document.getElementById('game-canvas');
  initCore(canvas, () => {});
  initUI(handleUpgradeSelect, restartGame);
  document.getElementById('start-btn').addEventListener('click', startRun);
  document.getElementById('restart-btn').addEventListener('click', restartGame);
  resetState();
  addTower(0);
  addTower(3);
}

function startRun() {
  document.getElementById('start-btn').disabled = true;
  beginWave();
  startGame();
}

function handleUpgradeSelect(upgrade) {
  upgrade.apply();
  beginWave();
}

function restartGame() {
  hideGameOver();
  hideUpgradeDraft();
  resetState();
  addTower(0);
  addTower(3);
  document.getElementById('start-btn').disabled = false;
  startRun();
}

window.addEventListener('DOMContentLoaded', setup);
