import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory, completedToday }) => {
  return (
    <div className="space-y-4">
      {/* Today's Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-4 shadow-sm"
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Target" className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold font-display text-gray-900">Today's Progress</h3>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">{completedToday}</div>
          <div className="text-sm text-gray-500">tasks completed</div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg p-4 shadow-sm"
      >
        <h3 className="font-semibold font-display text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="font-medium">All Categories</span>
          </button>
          
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(category.id)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.taskCount || 0}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-4 shadow-sm"
      >
        <h3 className="font-semibold font-display text-gray-900 mb-3">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Circle" className="w-4 h-4 text-info" />
              <span className="text-sm text-gray-600">Active</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {categories.reduce((sum, cat) => sum + (cat.activeTasks || 0), 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {categories.reduce((sum, cat) => sum + (cat.completedTasks || 0), 0)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryFilter;