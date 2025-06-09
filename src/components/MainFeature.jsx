import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isAfter, isToday, parseISO } from 'date-fns';
import ApperIcon from './ApperIcon';
import TaskForm from './TaskForm';
import CategoryFilter from './CategoryFilter';
import taskService from '../services/api/taskService';
import categoryService from '../services/api/categoryService';

const MainFeature = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-error';
      case 'medium': return 'border-warning';
      case 'low': return 'border-info';
      default: return 'border-gray-200';
    }
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
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200"
          >
            Try Again
          </button>
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
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              completedToday={completedToday}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {/* Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold font-display text-gray-900">
                  Your Tasks
                </h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
                >
                  <ApperIcon name="Plus" size={18} />
                  <span className="font-medium">Add Task</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
                {[
                  { id: 'all', label: 'All', count: filteredTasks.length },
                  { id: 'active', label: 'Active', count: tasks.filter(t => !t.completed && !t.archived).length },
                  { id: 'completed', label: 'Completed', count: tasks.filter(t => t.completed && !t.archived).length }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeFilter === filter.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {searchQuery ? 'No matching tasks' : 'No tasks yet'}
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {searchQuery 
                      ? 'Try adjusting your search or filters'
                      : 'Get started by creating your first task'
                    }
                  </p>
                  {!searchQuery && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowForm(true)}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200"
                    >
                      Create Task
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-3 pb-6">
                  <AnimatePresence>
                    {filteredTasks.map((task, index) => {
                      const category = getCategoryById(task.category);
                      const overdue = isOverdue(task.dueDate);
                      
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: task.completed ? 0.6 : 1, 
                            y: 0,
                            scale: 1
                          }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ 
                            delay: index * 0.05,
                            duration: 0.3
                          }}
                          className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${getPriorityColor(task.priority)} hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group`}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Checkbox */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleToggleComplete(task.id, task.completed)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                task.completed
                                  ? 'bg-success border-success'
                                  : 'border-gray-300 hover:border-success'
                              }`}
                            >
                              {task.completed && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="animate-spring-scale"
                                >
                                  <ApperIcon name="Check" className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                            </motion.button>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0">
                              {editingTaskId === task.id ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveEdit();
                                      if (e.key === 'Escape') handleCancelEdit();
                                    }}
                                    className="flex-1 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                                    autoFocus
                                  />
                                  <button
                                    onClick={handleSaveEdit}
                                    className="p-1 text-success hover:bg-success/10 rounded"
                                  >
                                    <ApperIcon name="Check" size={16} />
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                                  >
                                    <ApperIcon name="X" size={16} />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleEditTask(task)}
                                  className="cursor-pointer"
                                >
                                  <h3 className={`font-medium break-words ${
                                    task.completed 
                                      ? 'line-through text-gray-500' 
                                      : 'text-gray-900'
                                  }`}>
                                    {task.title}
                                  </h3>
                                </div>
                              )}

                              <div className="flex items-center space-x-3 mt-2">
                                {/* Category Badge */}
                                {category && (
                                  <span
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                    style={{
                                      backgroundColor: `${category.color}20`,
                                      color: category.color
                                    }}
                                  >
                                    {category.name}
                                  </span>
                                )}

                                {/* Priority Badge */}
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  task.priority === 'high' 
                                    ? 'bg-red-100 text-red-800' 
                                    : task.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {task.priority}
                                </span>

                                {/* Due Date */}
                                {task.dueDate && (
                                  <span className={`text-xs ${
                                    overdue 
                                      ? 'text-error font-medium' 
                                      : task.completed
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }`}>
                                    Due {format(parseISO(task.dueDate), 'MMM d')}
                                    {overdue && !task.completed && ' (Overdue)'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-1 text-gray-400 hover:text-error hover:bg-red-50 rounded transition-colors duration-200"
                              >
                                <ApperIcon name="Trash2" size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
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

export default MainFeature;