import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mealPlanService } from '../services/mealPlanService';
import { recipeService } from '../services/recipeService';
import type { MealPlan, Recipe } from '../types';
import './Dashboard.css';

export function Dashboard() {
  const [upcomingMeals, setUpcomingMeals] = useState<MealPlan[]>([]);
  const [frequentRecipes, setFrequentRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [meals, recipes] = await Promise.all([
        mealPlanService.getUpcomingMeals(),
        recipeService.getFrequentRecipes(),
      ]);
      setUpcomingMeals(meals);
      setFrequentRecipes(recipes);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/recipes/new" className="action-btn">Create Recipe</Link>
            <Link to="/meal-plan" className="action-btn">Plan Meals</Link>
            <Link to="/shopping-list" className="action-btn">Shopping List</Link>
          </div>
        </section>

        <section className="dashboard-card">
          <h2>Upcoming Meals</h2>
          {upcomingMeals.length === 0 ? (
            <p className="empty-state">No meals planned yet</p>
          ) : (
            <ul className="meal-list">
              {upcomingMeals.slice(0, 5).map((meal) => (
                <li key={meal.id} className="meal-item">
                  <span className="meal-date">{new Date(meal.date).toLocaleDateString()}</span>
                  <span className="meal-type">{meal.mealType}</span>
                  <span className="meal-recipe">{meal.recipe.name}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/meal-plan" className="view-all">View All</Link>
        </section>

        <section className="dashboard-card">
          <h2>Frequent Recipes</h2>
          {frequentRecipes.length === 0 ? (
            <p className="empty-state">No recipes yet</p>
          ) : (
            <ul className="recipe-list">
              {frequentRecipes.slice(0, 5).map((recipe) => (
                <li key={recipe.id} className="recipe-item">
                  <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
                  <span className="recipe-meta">
                    {recipe.timesMade} times • {recipe.averageRating?.toFixed(1)} ⭐
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/recipes" className="view-all">View All Recipes</Link>
        </section>
      </div>
    </div>
  );
}
