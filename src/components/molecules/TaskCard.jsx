import React from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import CategoryBadge from '@/components/molecules/CategoryBadge';
import PriorityBadge from '@/components/molecules/PriorityBadge';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'border-error';
    case 'medium': return 'border-warning';
    case 'low': return 'border-info';
    default: return 'border-gray-200';
  }
};

const TaskCard = ({ 
    task, 
    category, 
    isOverdue, 
    onToggleComplete, 
    onDelete, 
    onEditStart, 
    onEditSave, 
    onEditCancel, 
    editingTaskId, 
    editTitle, 
    setEditTitle 
}) => {
    const isEditing = editingTaskId === task.id;
    const overdue = isOverdue(task.dueDate);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
                opacity: task.completed ? 0.6 : 1, 
                y: 0,
                scale: 1
            }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
                duration: 0.3
            }}
            className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${getPriorityColor(task.priority)} hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group`}
        >
            <div className="flex items-start space-x-3">
                {/* Checkbox */}
                <Button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggleComplete(task.id, task.completed)}
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
                </Button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <div className="flex items-center space-x-2">
                            <Input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') onEditSave();
                                    if (e.key === 'Escape') onEditCancel();
                                }}
                                className="flex-1 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                                autoFocus
                            />
                            <Button
                                onClick={onEditSave}
                                className="p-1 text-success hover:bg-success/10 rounded"
                            >
                                <ApperIcon name="Check" size={16} />
                            </Button>
                            <Button
                                onClick={onEditCancel}
                                className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                            >
                                <ApperIcon name="X" size={16} />
                            </Button>
                        </div>
                    ) : (
                        <div
                            onClick={() => onEditStart(task)}
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
                        <CategoryBadge category={category} />

                        {/* Priority Badge */}
                        <PriorityBadge priority={task.priority} />

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
                    <Button
                        onClick={() => onDelete(task.id)}
                        className="p-1 text-gray-400 hover:text-error hover:bg-red-50 rounded transition-colors duration-200"
                    >
                        <ApperIcon name="Trash2" size={16} />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;