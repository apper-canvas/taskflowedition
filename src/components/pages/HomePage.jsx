import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { isAfter, isToday, parseISO } from 'date-fns';
import TaskForm from '@/components/molecules/TaskForm';
import CategoryFilterPanel from '@/components/organisms/CategoryFilterPanel';
import TaskList from '@/components/organisms/TaskList';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // This is not used after refactor
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setShowForm(false);
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      if (updates.completed !== undefined) {
        toast.success(updates.completed ? 'Task completed!' : 'Task reopened');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    await handleUpdateTask(taskId, { completed: !completed });
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = async () => {
    if (editTitle.trim()) {
      await handleUpdateTask(editingTaskId, { title: editTitle.trim() });
      setEditingTaskId(null);
      setEditTitle('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return isAfter(new Date(), parseISO(dueDate)) && !isToday(parseISO(dueDate));
  };

  const filteredTasks = tasks.filter(task => {
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by category
    if (selectedCategory && task.category !== selectedCategory) {
      return false;
    }

    // Filter by status
    switch (activeFilter) {
      case 'active':
        return !task.completed && !task.archived;
      case 'completed':
        return task.completed && !task.archived;
      case 'all':
      default:
        return !task.archived;
    }
  });

  const completedToday = tasks.filter(task => 
    task.completed && 
    task.updatedAt && 
    isToday(parseISO(task.updatedAt))
  ).length;

  const totalActiveTasks = tasks.filter(t => !t.completed && !t.archived).length;
  const totalCompletedTasks = tasks.filter(t => t.completed && !t.archived).length;


  if (loading) {
    return (
      <div className="h-full p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Sidebar Skeleton */}
            <div className="w-full lg:w-64 space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded mb-2"></div>
                ))}
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="flex space-x-2 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded w-16"></div>
                  ))}
                </div>
              </div>
              
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load tasks</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 max-w-full overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <CategoryFilterPanel
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              completedToday={completedToday}
            />
          </div>

          {/* Main Content */}
          <TaskList
            tasks={filteredTasks}
            categories={categories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onAddTask={() => setShowForm(true)}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            editingTaskId={editingTaskId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            isOverdue={isOverdue}
            getCategoryById={getCategoryById}
            totalActiveTasks={totalActiveTasks}
            totalCompletedTasks={totalCompletedTasks}
          />
        </div>
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <TaskForm
                  categories={categories}
                  onSubmit={handleCreateTask}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;