/**
 * js/ui.js
 * ─────────────────────────────────────────────────────────
 * Pure UI helpers — DOM construction and rendering.
 * No application logic; depends only on data.js (state
 * and recipe constants passed in as arguments or globals).
 * ─────────────────────────────────────────────────────────
 */

'use strict';

/**
 * escapeHTML — sanitise any string before injection into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * renderCuisineChips — builds the cuisine-filter pill buttons
 * inside #cuisine-chips and wires click handlers.
 * @param {object} appState  — shared state object
 */
function renderCuisineChips(appState) {
  var wrap = document.getElementById('cuisine-chips');
  wrap.innerHTML = '';
  CUISINES.forEach(function(c, i) {
    var btn = document.createElement('button');
    btn.className = 'city-chip' + (i === 0 ? ' active' : '');
    btn.textContent = c;
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.onclick = function() {
      wrap.querySelectorAll('.city-chip').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      appState.selectedCuisines = [c];
    };
    wrap.appendChild(btn);
  });
  appState.selectedCuisines = [CUISINES[0]];
}

/**
 * renderCityChips — builds the city-selector pill buttons
 * inside #city-chips and wires click handlers.
 * @param {object} appState
 */
function renderCityChips(appState) {
  var wrap = document.getElementById('city-chips');
  wrap.innerHTML = '';
  CITIES.forEach(function(city, i) {
    var btn = document.createElement('button');
    btn.className = 'city-chip' + (i === 0 ? ' active' : '');
    btn.textContent = city;
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.onclick = function() {
      wrap.querySelectorAll('.city-chip').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      appState.selectedCity = city;
    };
    wrap.appendChild(btn);
  });
}

/**
 * renderIngredientTags — re-renders the tag chips inside
 * the ingredient input wrapper to match appState.ingredients.
 * @param {object}      appState
 * @param {HTMLElement} tagWrap
 * @param {HTMLElement} ingInput
 */
function renderIngredientTags(appState, tagWrap, ingInput) {
  tagWrap.querySelectorAll('.tag-chip').forEach(function(el) { el.remove(); });
  appState.ingredients.forEach(function(ing, i) {
    var chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML =
      escapeHTML(ing) +
      '<button onclick="removeIngredient(' + i + ')" aria-label="Remove ' + escapeHTML(ing) + '">×</button>';
    tagWrap.insertBefore(chip, ingInput);
  });
}

/**
 * buildRecipeCard — constructs a full recipe <article> card
 * with a prominent food photo on the left and recipe details
 * on the right.
 *
 * Card anatomy:
 * ┌──────────────────────────────────────────────────────────┐
 * │  [Photo — 220px wide, object-fit:cover, h-100%]         │
 * │  [Content: name · meta pills · tags · steps accordion]  │
 * └──────────────────────────────────────────────────────────┘
 *
 * On screens ≤640px the photo moves above the content (column).
 *
 * @param {object} recipe  — data object from data.js
 * @param {number} idx     — position index (for IDs + staggered animation)
 * @returns {HTMLArticleElement}
 */
function buildRecipeCard(recipe, idx) {
  var card = document.createElement('article');
  card.className = 'recipe-card ' + recipe.stripe;
  card.style.animationDelay = (idx * 0.1) + 's';
  card.style.animation = 'fadeSlide .45s ease both';

  /* ── Tags HTML ─────────────────────────────────────── */
  var tagsHTML = recipe.tags
    .map(function(t) { return '<span class="recipe-tag">' + escapeHTML(t) + '</span>'; })
    .join('');

  /* ── Steps HTML ────────────────────────────────────── */
  var stepsHTML = recipe.steps
    .map(function(s, i) {
      return (
        '<div class="step-item">' +
          '<div class="step-num">' + (i + 1) + '</div>' +
          '<p class="step-text">' + escapeHTML(s) + '</p>' +
        '</div>'
      );
    })
    .join('');

  var toggleId = 'steps-toggle-' + idx;
  var bodyId   = 'steps-body-'   + idx;

  /* ── Photo: primary src = Unsplash URL ─────────────── */
  var imgSrc = escapeHTML(recipe.img.src);
  var imgAlt = escapeHTML(recipe.img.alt);

  card.innerHTML =
    /* Left / top: food photo */
    '<div class="recipe-photo-wrap">' +
      '<img' +
        ' src="' + imgSrc + '"' +
        ' alt="' + imgAlt + '"' +
        ' class="recipe-photo"' +
        ' loading="lazy"' +
        ' decoding="async"' +
      '/>' +
    '</div>' +

    /* Right / bottom: text content */
    '<div class="recipe-content">' +
      '<h3 class="recipe-name">' + escapeHTML(recipe.name) + '</h3>' +

      '<div class="recipe-meta">' +
        '<span class="meta-pill cost">' + escapeHTML(recipe.cost) + '</span>' +
        '<span class="meta-pill time">⏱ ' + escapeHTML(recipe.time) + '</span>' +
        '<span class="meta-pill difficulty">' + escapeHTML(recipe.difficulty) + '</span>' +
      '</div>' +

      '<div class="recipe-tags">' + tagsHTML + '</div>' +

      '<button class="steps-toggle" id="' + toggleId + '" ' +
        'onclick="toggleSteps(\'' + toggleId + '\',\'' + bodyId + '\')" ' +
        'aria-expanded="false" aria-controls="' + bodyId + '">' +
        '<span>View Step-by-Step Instructions</span>' +
        '<em class="chevron">▾</em>' +
      '</button>' +

      '<div class="steps-body" id="' + bodyId + '" role="region" aria-labelledby="' + toggleId + '">' +
        stepsHTML +
      '</div>' +
    '</div>';

  return card;
}

/**
 * buildEmptyState — creates a friendly "no results" card when
 * the matching engine finds zero recipes for the given input.
 * @param {string[]} ingredients  the terms that failed to match
 * @returns {HTMLElement}
 */
function buildEmptyState(ingredients) {
  var el = document.createElement('div');
  el.className = 'empty-state';

  var hint = ingredients.length > 0
    ? 'Try adding more common ingredients like <strong>ayam</strong>, <strong>telur</strong>, <strong>tahu</strong>, or <strong>mie</strong>.'
    : 'Select a city or raise your budget to see more options.';

  el.innerHTML =
    '<div class="empty-icon">🍽️</div>' +
    '<h3 class="empty-title">No matching recipes found</h3>' +
    '<p class="empty-hint">' + hint + '</p>';

  return el;
}

/**
 * toggleSteps — opens/closes an accordion steps panel.
 * Called via inline onclick attributes set by buildRecipeCard().
 * @param {string} toggleId
 * @param {string} bodyId
 */
function toggleSteps(toggleId, bodyId) {
  var toggle = document.getElementById(toggleId);
  var body   = document.getElementById(bodyId);
  var isOpen = toggle.classList.contains('open');
  toggle.classList.toggle('open', !isOpen);
  body.classList.toggle('open', !isOpen);
  toggle.setAttribute('aria-expanded', String(!isOpen));
}

/**
 * shakeElement — briefly animates a card to signal validation error.
 * @param {string} id  element id
 */
function shakeElement(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  void el.offsetHeight; /* force reflow */
  el.style.animation = 'shake .35s ease';
}
