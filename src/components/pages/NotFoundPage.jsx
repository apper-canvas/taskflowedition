import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <ApperIcon name="FileQuestion" className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-bold font-display text-gray-900 mb-2">
          404
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200 font-medium"
        >
          <ApperIcon name="Home" size={18} />
          <span>Go Home</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;