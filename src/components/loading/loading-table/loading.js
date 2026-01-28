import React from 'react';
import { BounceLoader } from 'react-spinners';

const TableLoading = () => {
    return (
        <div className="table-loading-container">
            <BounceLoader color="#BCDA72" size={60} />
        </div>
    );
};

export default TableLoading;