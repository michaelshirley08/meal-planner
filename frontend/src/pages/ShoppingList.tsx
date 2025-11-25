import { useEffect, useState, useCallback } from 'react';
import { shoppingListService } from '../services/shoppingListService';
import { formatQuantity } from '../utils/fractionUtils';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useToast } from '../hooks/useToast';
import { format, startOfWeek, addDays } from 'date-fns';
import type { ShoppingList as ShoppingListType } from '../types';
import './ShoppingList.css';

export function ShoppingList() {
  const toast = useToast();
  const [shoppingList, setShoppingList] = useState<ShoppingListType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [dateRange, setDateRange] = useState<'week' | 'custom'>('week');
  const [startDate, setStartDate] = useState(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return format(weekStart, 'yyyy-MM-dd');
  });
  const [endDate, setEndDate] = useState(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);
    return format(weekEnd, 'yyyy-MM-dd');
  });

  const loadShoppingList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (dateRange === 'week') {
        data = await shoppingListService.getWeekShoppingList(startDate);
      } else {
        data = await shoppingListService.getShoppingList(startDate, endDate);
      }
      setShoppingList(data);
    } catch (error) {
      console.error('Failed to load shopping list:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load shopping list';
      setError(errorMessage);
      toast.error('Failed to load shopping list');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, dateRange, toast]);

  const loadCheckedItems = useCallback(async () => {
    try {
      const ids = await shoppingListService.getCheckedItems();
      setCheckedItems(new Set(ids));
    } catch (error) {
      console.error('Failed to load checked items:', error);
    }
  }, []);

  useEffect(() => {
    loadShoppingList();
    loadCheckedItems();
  }, [loadShoppingList, loadCheckedItems]);

  const toggleItem = async (ingredientId: number) => {
    const newChecked = new Set(checkedItems);
    const isChecked = newChecked.has(ingredientId);

    if (isChecked) {
      newChecked.delete(ingredientId);
    } else {
      newChecked.add(ingredientId);
    }

    setCheckedItems(newChecked);

    try {
      await shoppingListService.toggleItem(ingredientId, !isChecked);
    } catch (error) {
      console.error('Failed to toggle item:', error);
      setCheckedItems(checkedItems);
      toast.error('Failed to update item');
    }
  };

  const clearAllChecked = async () => {
    if (!window.confirm('Clear all checked items?')) return;

    try {
      await shoppingListService.clearCheckedItems();
      setCheckedItems(new Set());
      toast.success('Checked items cleared');
    } catch (error) {
      console.error('Failed to clear checked items:', error);
      toast.error('Failed to clear checked items');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const setThisWeek = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    setStartDate(format(weekStart, 'yyyy-MM-dd'));
    const weekEnd = addDays(weekStart, 6);
    setEndDate(format(weekEnd, 'yyyy-MM-dd'));
    setDateRange('week');
  };

  const setNextWeek = () => {
    const nextWeekStart = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 7);
    setStartDate(format(nextWeekStart, 'yyyy-MM-dd'));
    const weekEnd = addDays(nextWeekStart, 6);
    setEndDate(format(weekEnd, 'yyyy-MM-dd'));
    setDateRange('week');
  };

  if (loading && !shoppingList) {
    return <LoadingSpinner message="Loading shopping list..." />;
  }

  if (error) {
    return (
      <div className="shopping-list-page">
        <div className="page-header">
          <h1>Shopping List</h1>
        </div>
        <ErrorMessage
          message={error}
          onRetry={loadShoppingList}
        />
      </div>
    );
  }

  const totalItems = shoppingList?.ingredientsByCategory.reduce(
    (sum, cat) => sum + cat.ingredients.length,
    0
  ) || 0;

  const checkedCount = shoppingList?.ingredientsByCategory.reduce(
    (sum, cat) => sum + cat.ingredients.filter(i => checkedItems.has(i.ingredientId)).length,
    0
  ) || 0;

  return (
    <div className="shopping-list-page">
      <div className="page-header">
        <h1>Shopping List</h1>
        <div className="header-actions">
          <button onClick={handlePrint} className="btn-secondary">Print</button>
          {checkedCount > 0 && (
            <button onClick={clearAllChecked} className="btn-secondary">
              Clear Checked ({checkedCount})
            </button>
          )}
        </div>
      </div>

      <div className="date-controls">
        <div className="date-presets">
          <button onClick={setThisWeek} className="btn-preset">This Week</button>
          <button onClick={setNextWeek} className="btn-preset">Next Week</button>
          <button
            onClick={() => setDateRange('custom')}
            className={`btn-preset ${dateRange === 'custom' ? 'active' : ''}`}
          >
            Custom Range
          </button>
        </div>

        <div className="date-inputs">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setDateRange('custom');
            }}
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setDateRange('custom');
            }}
          />
        </div>
      </div>

      {shoppingList && (
        <div className="list-summary">
          <p>
            Shopping list for {format(new Date(shoppingList.startDate), 'MMM d')} - {format(new Date(shoppingList.endDate), 'MMM d, yyyy')}
          </p>
          <p>
            {shoppingList.totalMeals} meals planned • {totalItems} ingredients • {checkedCount} checked
          </p>
        </div>
      )}

      {!shoppingList || shoppingList.ingredientsByCategory.length === 0 ? (
        <div className="empty-state">
          <p>No meals planned for this period</p>
          <p className="empty-hint">Add meals to your meal plan to generate a shopping list</p>
        </div>
      ) : (
        <div className="shopping-categories">
          {shoppingList.ingredientsByCategory
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((category) => (
              <section key={category.category} className="category-section">
                <h2 className="category-title">{category.category}</h2>
                <ul className="items-list">
                  {category.ingredients.map((item) => {
                    const isChecked = checkedItems.has(item.ingredientId);
                    return (
                      <li key={item.ingredientId} className={`item ${isChecked ? 'checked' : ''}`}>
                        <label className="item-checkbox">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleItem(item.ingredientId)}
                          />
                          <span className="checkmark"></span>
                        </label>

                        <div className="item-content">
                          <div className="item-main">
                            <span className="item-quantity">
                              {formatQuantity(item.quantity)} {item.unit}
                            </span>
                            <span className="item-name">{item.ingredientName}</span>
                            {item.prepNotes.length > 0 && (
                              <span className="item-prep">({item.prepNotes.join(', ')})</span>
                            )}
                          </div>

                          {item.recipeReferences.length > 0 && (
                            <div className="item-recipes">
                              Used in: {item.recipeReferences.map(ref => ref.recipeName).join(', ')}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
