import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import recipesRoutes from './routes/recipes';
import ingredientsRoutes from './routes/ingredients';
import mealPlansRoutes from './routes/mealPlans';
import shoppingListsRoutes from './routes/shoppingLists';

// Import middleware
import { errorHandler } from './middleware/authMiddleware';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  })
);

// Routes
app.use('/auth', authRoutes);
app.use('/recipes', recipesRoutes);
app.use('/ingredients', ingredientsRoutes);
app.use('/meal-plans', mealPlansRoutes);
app.use('/shopping-lists', shoppingListsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Start server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for testing
export default app;

// Export all utilities
export * from './utils/types';
export * from './utils/fractionParser';
export * from './utils/fractionMath';
export * from './utils/unitConverter';
