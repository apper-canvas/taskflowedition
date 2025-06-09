import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { parseISO, isToday, isAfter } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import TaskCard from '@/components/molecules/TaskCard';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

const ArchiveContent = () => {
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadArchivedTasks();
  }, []);

  const loadArchivedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setArchivedTasks(tasksData.filter(task => task.archived));
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load archived tasks');
      toast.error('Failed to load archived tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreTask = async (taskId) => {
    try {
      const updatedTask = await taskService.update(taskId, { archived: false });
      setArchivedTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task restored successfully');
    } catch (err) {
      toast.error('Failed to restore task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to permanently delete this task?')) {
      try {
        await taskService.delete(taskId);
        setArchivedTasks(prev => prev.filter(task => task.id !== taskId));
        toast.success('Task permanently deleted');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  // Archive doesn't support inline edit/toggle, but TaskCard expects these props.
  // We can pass no-op functions or hide the elements in TaskCard if needed,
  // but for a true atomic design, TaskCard should be flexible or have a specific
  // 'archive' variant. For now, pass no-ops and hide actions.
  const noOp = () => {};

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return isAfter(new Date(), parseISO(dueDate)) && !isToday(parseISO(dueDate));
  };


  const filteredTasks = archivedTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
          </div>
          
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-sm mb-4"
            >
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load archive</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            onClick={loadArchivedTasks}
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
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Archive" className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-gray-900">Archive</h1>
              <p className="text-gray-500">View and restore archived tasks</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search archived tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Archived Tasks */}
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
                <ApperIcon name="Archive" className="w-16 h-16 text-gray-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchQuery ? 'No matching archived tasks' : 'No archived tasks'}
              </h3>
              <p className="mt-2 text-gray-500">
                {searchQuery 
                  ? 'Try adjusting your search'
                  : 'Completed tasks you archive will appear here'
                }
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3 pb-6">
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ 
                        delay: index * 0.05,
                        duration: 0.3
                      }}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 break-words mb-2">
                            {task.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {/* Category Badge */}
                            {getCategoryById(task.category) && (
                              <CategoryBadge category={getCategoryById(task.category)} />
                            )}

                            {/* Priority Badge */}
                            <PriorityBadge priority={task.priority} />

                            {/* Completed Status */}
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <ApperIcon name="Check" size={12} className="mr-1" />
                              Completed
                            </span>
                          </div>

                          {/* Archive Date */}
                          <p className="text-xs text-gray-500">
                            Archived {task.updatedAt ? format(parseISO(task.updatedAt), 'MMM d, yyyy') : 'Unknown date'}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-4">
                          <Button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRestoreTask(task.id)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                            title="Restore task"
                          >
                            <ApperIcon name="Undo2" size={16} />
                          </Button>
                          <Button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-error hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete permanently"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchiveContent;