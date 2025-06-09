import React from 'react';

const CategoryBadge = ({ category }) => {
    if (!category) return null;
    return (
        <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={{
                backgroundColor: `${category.color}20`,
                color: category.color
            }}
        >
            {category.name}
        </span>
    );
};

export default CategoryBadge;