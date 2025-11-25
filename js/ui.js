import { STATE } from './state.js';

let hudRefs = {};
let upgradeGrid;
let upgradeOverlay;
let previewGrid;
let gameOverOverlay;
let summaryText;
let upgradeSelectHandler = null;

export function initUI(onUpgradeSelect, onRestart) {
  hudRefs = {
    wave: document.getElementById('wave-value'),
    hp: document.getElementById('hp-value'),
    breach: document.getElementById('breach-value'),
    resource: document.getElementById('resource-value'),
    enemies: document.getElementById('enemy-value'),
  };
  upgradeGrid = document.getElementById('upgrade-grid');
  upgradeOverlay = document.getElementById('upgrade-overlay');
  previewGrid = document.getElementById('upgrade-preview');
  gameOverOverlay = document.getElementById('gameover-overlay');
  summaryText = document.getElementById('summary-text');
  upgradeSelectHandler = onUpgradeSelect;

  document.getElementById('play-again').addEventListener('click', onRestart);
}

export function renderHUD(state) {
  hudRefs.wave.textContent = state.wave;
  hudRefs.hp.textContent = `${state.coreHP} / ${state.maxHP}`;
  hudRefs.breach.textContent = `${state.breaches} / ${state.breachLimit}`;
  hudRefs.resource.textContent = state.resources;
  hudRefs.enemies.textContent = state.enemies.length;
  if (state.coreHP <= state.maxHP * 0.3) {
    hudRefs.hp.classList.add('status-text', 'danger');
  } else {
    hudRefs.hp.classList.remove('danger');
  }
}

export function showUpgradeDraft(upgrades) {
  upgradeOverlay.classList.add('active');
  upgradeGrid.innerHTML = '';
  upgrades.forEach((upg) => {
    const card = document.createElement('button');
    card.className = 'upgrade-card';
    card.innerHTML = `<h3>${upg.name}</h3><p>${upg.description}</p>`;
    card.addEventListener('click', () => {
      upgradeSelectHandler(upg);
      upgradeOverlay.classList.remove('active');
      renderPreview(upg);
    });
    upgradeGrid.appendChild(card);
  });
}

export function hideUpgradeDraft() {
  upgradeOverlay.classList.remove('active');
}

export function renderPreview(upgrade) {
  previewGrid.innerHTML = '';
  if (!upgrade) return;
  const card = document.createElement('div');
  card.className = 'upgrade-card selected';
  card.innerHTML = `<h3>${upgrade.name}</h3><p>${upgrade.description}</p>`;
  previewGrid.appendChild(card);
}

export function showGameOver(state) {
  summaryText.textContent = `The eclipse dims at wave ${state.wave}. Resources gathered: ${state.resources}. Breaches: ${state.breaches}.`;
  gameOverOverlay.classList.add('active');
}

export function hideGameOver() {
  gameOverOverlay.classList.remove('active');
}
