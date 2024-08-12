import { Button } from 'antd';
import React, { useState } from 'react';

const Export = ({title = null , columnHeader , exportData , fileName}) => {

    const [preparingExcel, setPreparingExcel] = useState(false)

    const exportToCSV = (e) => {
        setPreparingExcel(true);
        // e.preventDefault();
        const csvContent = columnHeader + exportData
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const a = document.createElement('a');
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
        setPreparingExcel(false);
      };
      

  return (
    <Button className='export-to-excel-btn' onClick={exportData?.length > 0 ? () => exportToCSV() : null} loading={preparingExcel} title={title}>
        <i class="fi fi-ts-file-export"></i>
        <span>Export To Excel</span>
    </Button>
  )
}

export default Export