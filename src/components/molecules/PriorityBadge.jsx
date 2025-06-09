import React from 'react';

const PriorityBadge = ({ priority }) => {
    const className = `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        priority === 'high' 
            ? 'bg-red-100 text-red-800' 
            : priority === 'medium'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-blue-100 text-blue-800'
    }`;
    
    return (
        <span className={className}>
            {priority}
        </span>
    );
};

export default PriorityBadge;