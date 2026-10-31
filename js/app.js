/**
 * js/app.js
 * ─────────────────────────────────────────────────────────
 * Application controller — event wiring, AI simulation,
 * and real ingredient-based / budget-based search logic.
 *
 * Dependencies (loaded before this file):
 *   data.js  — state, ALL_RECIPES, RECIPES_BUDGET, AI_MESSAGES, CUISINES, CITIES
 *   ui.js    — renderCuisineChips, renderCityChips, renderIngredientTags,
 *              buildRecipeCard, buildEmptyState, toggleSteps,
 *              shakeElement, escapeHTML
 * ─────────────────────────────────────────────────────────
 */

'use strict';

/* ── DOM references ───────────────────────────────────────── */
var $modeBadge    = document.getElementById('mode-badge');
var $btnFridge    = document.getElementById('btn-fridge');
var $btnBudget    = document.getElementById('btn-budget');
var $panelFridge  = document.getElementById('panel-fridge');
var $panelBudget  = document.getElementById('panel-budget');
var $submitBtn    = document.getElementById('submit-btn');
var $processing   = document.getElementById('processing-section');
var $results      = document.getElementById('results-section');
var $resultsGrid  = document.getElementById('results-grid');
var $resultsTitle = document.getElementById('results-title');
var $aiMsg        = document.getElementById('ai-status-msg');
var $aiProgress   = document.getElementById('ai-progress-fill');
var $budgetSlider = document.getElementById('budget-slider');
var $budgetVal    = document.getElementById('budget-val');
var $tagWrap      = document.querySelector('.tag-input-wrap');
var $ingInput     = document.getElementById('ingredient-input');


/* ── Bootstrap ────────────────────────────────────────────── */
(function init() {
  renderCuisineChips(state);
  renderCityChips(state);
  _setupIngredientInput();
  _setupBudgetSlider();
})();


/* ══════════════════════════════════════════════════════════
   MATCHING ENGINE
   ══════════════════════════════════════════════════════════

   FRIDGE MODE — ingredient matching algorithm
   ─────────────────────────────────────────────
   For each recipe in ALL_RECIPES (non dine-out), we compute a
   relevance SCORE based on how many of the user's typed
   ingredients appear in the recipe's `keywords` array.

   Score formula:
     score = matchCount / userIngredientCount

   Rules:
   1. Normalise both user terms and recipe keywords to lowercase,
      trimmed, diacritics stripped.
   2. A keyword "hits" if the user term is a substring of the
      keyword, or the keyword is a substring of the user term
      (handles "ayam geprek" vs "ayam", "noodle" vs "noodles").
   3. Cuisine filter: if user selected anything other than "Any",
      only include recipes matching that cuisine.
   4. A recipe needs at least 1 matching ingredient to appear.
   5. Results are sorted descending by score, then capped at 5.
   6. If zero recipes match, show the empty-state card.

   BUDGET MODE — city + price filter
   ────────────────────────────────────
   1. Take all recipes available in the selected city.
   2. Filter by priceRaw <= budget.
   3. If nothing fits the budget, fall back to all city recipes
      (with a warning note in the title).
   4. Cap at 5 results.
══════════════════════════════════════════════════════════ */

/**
 * normalise — lowercase + trim a string.
 * Used before comparing keywords.
 * @param {string} s
 * @returns {string}
 */
function normalise(s) {
  return String(s).toLowerCase().trim();
}

/**
 * termHits — returns true when `userTerm` and `keyword`
 * share a meaningful substring match.
 * @param {string} userTerm  normalised user ingredient
 * @param {string} keyword   normalised recipe keyword
 * @returns {boolean}
 */
function termHits(userTerm, keyword) {
  if (userTerm === keyword) return true;
  if (keyword.indexOf(userTerm) !== -1) return true;
  if (userTerm.indexOf(keyword) !== -1) return true;
  return false;
}

/**
 * scoreRecipe — returns the match score [0–1] of a recipe
 * against the array of user ingredient terms.
 * @param {object}   recipe
 * @param {string[]} userTerms  normalised ingredient strings
 * @returns {number}
 */
function scoreRecipe(recipe, userTerms) {
  if (userTerms.length === 0) return 0;
  var normKeywords = recipe.keywords.map(normalise);
  var hits = 0;
  userTerms.forEach(function(term) {
    var matched = normKeywords.some(function(kw) {
      return termHits(term, kw);
    });
    if (matched) hits++;
  });
  return hits / userTerms.length;
}

/**
 * matchFridgeRecipes — filters and ranks ALL_RECIPES by
 * ingredient overlap with the user's input.
 *
 * @param {string[]} ingredients  raw ingredient strings from state
 * @param {string}   cuisinePref  selected cuisine ("Any" = no filter)
 * @returns {object[]}  top-5 ranked recipe objects
 */
function matchFridgeRecipes(ingredients, cuisinePref) {
  var userTerms = ingredients.map(normalise).filter(function(t) { return t.length > 0; });

  /* Pool: only cookable recipes (not dine-out) */
  var pool = ALL_RECIPES.filter(function(r) {
    return r.difficulty !== 'Dine-out';
  });

  /* Apply cuisine filter when not "Any" */
  if (cuisinePref && cuisinePref !== 'Any') {
    var filtered = pool.filter(function(r) {
      return normalise(r.cuisine) === normalise(cuisinePref);
    });
    /* If no recipes of that cuisine exist, ignore the filter */
    if (filtered.length > 0) pool = filtered;
  }

  /* Score every recipe */
  var scored = pool.map(function(r) {
    return { recipe: r, score: scoreRecipe(r, userTerms) };
  });

  /* Keep only recipes with at least 1 matching keyword */
  scored = scored.filter(function(item) { return item.score > 0; });

  /* Sort descending by score */
  scored.sort(function(a, b) { return b.score - a.score; });

  /* Return up to 5 best matches */
  return scored.slice(0, 5).map(function(item) { return item.recipe; });
}

/**
 * matchBudgetRecipes — filters city recipes by price.
 *
 * @param {string} city
 * @param {number} budget   numeric IDR budget
 * @returns {{ recipes: object[], budgetExceeded: boolean }}
 */
function matchBudgetRecipes(city, budget) {
  var cityPool = RECIPES_BUDGET[city] || [];

  /* Try to stay within budget */
  var withinBudget = cityPool.filter(function(r) {
    return r.priceRaw <= budget;
  });

  if (withinBudget.length > 0) {
    /* Sort cheapest first so user gets value-for-money ideas */
    withinBudget.sort(function(a, b) { return a.priceRaw - b.priceRaw; });
    return { recipes: withinBudget.slice(0, 5), budgetExceeded: false };
  }

  /* Nothing fits; return all city recipes sorted by price */
  cityPool.sort(function(a, b) { return a.priceRaw - b.priceRaw; });
  return { recipes: cityPool.slice(0, 5), budgetExceeded: true };
}


/* ── Mode switching ───────────────────────────────────────── */

/**
 * switchMode — called from the mode-toggle buttons (inline onclick).
 * @param {'fridge'|'budget'} mode
 */
function switchMode(mode) {
  state.mode = mode;
  var isFridge = mode === 'fridge';

  $btnFridge.classList.toggle('active', isFridge);
  $btnBudget.classList.toggle('active', !isFridge);
  $btnFridge.setAttribute('aria-pressed', String(isFridge));
  $btnBudget.setAttribute('aria-pressed', String(!isFridge));

  $panelFridge.classList.toggle('active', isFridge);
  $panelBudget.classList.toggle('active', !isFridge);

  $modeBadge.textContent = isFridge ? 'Fridge Mode' : 'Budget Mode';
}


/* ── Ingredient tag input ─────────────────────────────────── */

function _setupIngredientInput() {
  $ingInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredient($ingInput.value);
    }
    if (e.key === 'Backspace' && $ingInput.value === '' && state.ingredients.length > 0) {
      removeIngredient(state.ingredients.length - 1);
    }
  });
  $ingInput.addEventListener('blur', function() {
    if ($ingInput.value.trim()) addIngredient($ingInput.value);
  });
}

function addIngredient(raw) {
  var val = raw.replace(/,/g, '').trim().toLowerCase();
  if (!val || state.ingredients.indexOf(val) !== -1) {
    $ingInput.value = '';
    return;
  }
  state.ingredients.push(val);
  renderIngredientTags(state, $tagWrap, $ingInput);
  $ingInput.value = '';
}

function removeIngredient(idx) {
  state.ingredients.splice(idx, 1);
  renderIngredientTags(state, $tagWrap, $ingInput);
}


/* ── Budget slider ────────────────────────────────────────── */

function _setupBudgetSlider() {
  $budgetSlider.addEventListener('input', function() {
    state.budget = parseInt($budgetSlider.value, 10);
    $budgetVal.textContent = state.budget.toLocaleString('id-ID');
  });
}


/* ── AI simulation ────────────────────────────────────────── */

/**
 * runAI — entry point called by the submit button.
 * Validates input, shows the processing state, then calls
 * displayResults() once the simulation completes.
 */
function runAI() {
  if (state.mode === 'fridge' && state.ingredients.length === 0) {
    shakeElement('input-card');
    alert('Please add at least one ingredient before generating recommendations.');
    return;
  }

  /* Hide previous results */
  $results.classList.remove('visible');
  $results.style.display = 'none';

  /* Show processing card */
  $processing.classList.add('visible');
  $submitBtn.disabled = true;

  _simulateProcessing(function() {
    $processing.classList.remove('visible');
    displayResults();
    $submitBtn.disabled = false;
  });
}

/**
 * _simulateProcessing — steps through AI_MESSAGES with a
 * progress bar, then fires `onComplete`.
 * @param {function} onComplete
 */
function _simulateProcessing(onComplete) {
  var step = 0;
  var total = AI_MESSAGES.length;
  var duration = 480;

  $aiProgress.style.width = '0%';

  function tick() {
    if (step >= total) {
      $aiProgress.style.width = '100%';
      setTimeout(onComplete, 300);
      return;
    }
    $aiMsg.textContent = AI_MESSAGES[step];
    $aiProgress.style.width = ((step + 1) / total * 100) + '%';
    step++;
    setTimeout(tick, duration);
  }

  tick();
}


/* ── Results rendering ────────────────────────────────────── */

/**
 * displayResults — runs the appropriate matching function,
 * sets the results-section title, and renders cards.
 */
function displayResults() {
  var recipes = [];
  var subtitle = '';

  if (state.mode === 'fridge') {
    var cuisinePref = state.selectedCuisines.length > 0 ? state.selectedCuisines[0] : 'Any';
    recipes = matchFridgeRecipes(state.ingredients, cuisinePref);

    if (recipes.length === 0) {
      /* No matches — show helpful empty state */
      subtitle = '🔍 No recipes found for: ' + state.ingredients.join(', ');
      $resultsTitle.textContent = subtitle;
      $resultsGrid.innerHTML = '';
      $resultsGrid.appendChild(buildEmptyState(state.ingredients));
    } else {
      subtitle = '🍳 ' + recipes.length + ' recipe' +
        (recipes.length > 1 ? 's' : '') + ' matching "' +
        state.ingredients.slice(0, 3).join(', ') +
        (state.ingredients.length > 3 ? '…' : '') + '"';
      $resultsTitle.textContent = subtitle;
      _renderCards(recipes);
    }

  } else {
    var result = matchBudgetRecipes(state.selectedCity, state.budget);
    recipes = result.recipes;

    if (recipes.length === 0) {
      subtitle = '😔 No eateries found in ' + state.selectedCity;
      $resultsTitle.textContent = subtitle;
      $resultsGrid.innerHTML = '';
      $resultsGrid.appendChild(buildEmptyState([]));
    } else if (result.budgetExceeded) {
      subtitle = '⚠️ Budget exceeded — showing cheapest options in ' +
        state.selectedCity + ' (from Rp ' +
        recipes[0].priceRaw.toLocaleString('id-ID') + ')';
      $resultsTitle.textContent = subtitle;
      _renderCards(recipes);
    } else {
      subtitle = '🗺️ ' + recipes.length + ' spot' +
        (recipes.length > 1 ? 's' : '') + ' in ' +
        state.selectedCity + ' under Rp ' +
        state.budget.toLocaleString('id-ID');
      $resultsTitle.textContent = subtitle;
      _renderCards(recipes);
    }
  }

  /* Reveal results section with smooth scroll */
  $results.style.display = 'block';
  requestAnimationFrame(function() {
    $results.classList.add('visible');
    $results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/**
 * _renderCards — clears the grid and appends a card for
 * each recipe in the array.
 * @param {object[]} recipes
 */
function _renderCards(recipes) {
  $resultsGrid.innerHTML = '';
  recipes.forEach(function(recipe, idx) {
    $resultsGrid.appendChild(buildRecipeCard(recipe, idx));
  });
}

/**
 * resetUI — hides results and scrolls back to the input form.
 * Called from the "New Search" button.
 */
function resetUI() {
  $results.classList.remove('visible');
  $results.style.display = 'none';
  state.ingredients = [];
  renderIngredientTags(state, $tagWrap, $ingInput);
  $ingInput.value = '';
  document.getElementById('input-card').scrollIntoView({ behavior: 'smooth' });
}
