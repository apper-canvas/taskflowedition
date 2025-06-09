import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import TaskCard from '@/components/molecules/TaskCard';

const TaskList = ({
  tasks,
  categories,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  onAddTask,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onSaveEdit,
  onCancelEdit,
  editingTaskId,
  editTitle,
  setEditTitle,
  isOverdue,
  getCategoryById,
  totalActiveTasks,
  totalCompletedTasks
}) => {
  const allTasksCount = tasks.length;

return (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold font-display text-gray-900">
            Your Tasks
          </h2>
          <Button
            onClick={onAddTask}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
          >
            <ApperIcon name="Plus" size={18} />
            <span className="font-medium">Add Task</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
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
            { id: 'all', label: 'All', count: allTasksCount },
            { id: 'active', label: 'Active', count: totalActiveTasks },
            { id: 'completed', label: 'Completed', count: totalCompletedTasks }
          ].map((filter) => (
            <Button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
      </div>
{/* Task List */}
      <div className="space-y-3 pb-6">
        {tasks.length === 0 ? (
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
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddTask}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200"
              >
                Create Task
              </Button>
            )}
</motion.div>
        ) : (
          <AnimatePresence>
            {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={getCategoryById(task.category)}
                  isOverdue={isOverdue}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDeleteTask}
                  onEditStart={onEditTask}
                  onEditSave={onSaveEdit}
                  onEditCancel={onCancelEdit}
                  editingTaskId={editingTaskId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  // Prop for transition delay to maintain staggered animation
                  transition={{ delay: index * 0.05, duration: 0.3 }}
/>
              ))}
            </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TaskList;