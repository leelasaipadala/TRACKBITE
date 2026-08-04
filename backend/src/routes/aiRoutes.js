const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { callGeminiFlashApi } = require('../services/geminiService');

// POST /api/ai/recipe - Generate AI recipe with Gemini Flash
router.post('/recipe', auth, async (req, res) => {
  try {
    const { ingredients = [], dietPreference = 'balanced', goal = 'maintain weight' } = req.body;
    
    const prompt = `Create a gourmet recipe with ingredients: ${ingredients.join(', ')}. Diet: ${dietPreference}. Goal: ${goal}. Return strict JSON with keys: title, category, calories, protein, carbs, fat, prepTime, ingredients (array), instructions (array), healthScore, aiInsights. No markdown around JSON.`;
    const sys = 'You are Gemini Flash 3.5, elite AI sports nutritionist and chef.';

    const aiResponse = await callGeminiFlashApi(prompt, sys);

    if (aiResponse) {
      try {
        const clean = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const recipeData = JSON.parse(clean);
        return res.json({ success: true, recipe: recipeData, source: 'gemini-flash-3.5' });
      } catch (e) {
        // Fallback
      }
    }

    // Local Fast Fallback
    const primary = ingredients[0] || 'Chicken Breast';
    const secondary = ingredients[1] || 'Quinoa & Veggies';

    res.json({
      success: true,
      source: 'local-fast-ai',
      recipe: {
        title: `Skeuo-Chef ${primary} & ${secondary}`,
        category: 'High Protein',
        calories: 460,
        protein: 36,
        carbs: 42,
        fat: 14,
        prepTime: '15 mins',
        ingredients: [primary, secondary, '1 tbsp Olive Oil', 'Seasonings'],
        instructions: ['Heat skillet with olive oil.', `Add ${primary} and cook thoroughly.`, `Stir in ${secondary} and season well.`, 'Serve immediately.'],
        healthScore: 94,
        aiInsights: `Formulated fast for your ${goal} target!`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI recipe generation failed', error: error.message });
  }
});

// POST /api/ai/coach - AI Nutrition Coach Chat
router.post('/coach', auth, async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const sys = 'You are TrackBite AI, expert nutrition coach powered by Gemini Flash 3.5. Provide concise, high-value advice.';
    const prompt = `User question: "${question}". Goal: ${context?.goal || 'Maintain Weight'}. Calories: ${context?.calories || 2000}.`;

    const aiText = await callGeminiFlashApi(prompt, sys);

    if (aiText) {
      return res.json({ success: true, advice: aiText, source: 'gemini-flash-3.5' });
    }

    // Local Fallback
    res.json({
      success: true,
      source: 'local-fast-ai',
      advice: `⚡ **TrackBite AI Coach**:
- Maintain a balanced ratio of macronutrients tailored to your ${context?.goal || 'fitness'} goal.
- Ensure proper hydration (3+ Liters daily) and prioritize whole nutrient-dense foods.
- Consistency is key — keep tracking daily!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI coach response failed', error: error.message });
  }
});

module.exports = router;
