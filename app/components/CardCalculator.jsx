import React from 'react';

const CardCalculator = ({ title, children }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-x1 font-bold mb-4 text-center">{title}</h2>
            {children}
        </div>    
    );
};

export default CardCalculator