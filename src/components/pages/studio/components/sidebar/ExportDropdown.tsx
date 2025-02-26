import React, { useState } from 'react';
import { ExportType, Project } from '@fullstackcraftllc/codevideo-types';
import { exportProject } from '@fullstackcraftllc/codevideo-doc-gen';
import { useAppSelector } from '../../../../../hooks/useAppSelector';

export const ExportDropdown: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<ExportType | ''>('');
  const [exportComplete, setExportComplete] = useState(false);
  const { projects, currentProjectIndex } = useAppSelector(state => state.editor);
  const project = projects[currentProjectIndex]?.project as Project;
  
  const handleExportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExportType(e.target.value as ExportType | '');
    setExportComplete(false);
  };
  
  const handleExport = async () => {
    if (!exportType || !project) return;
    
    setIsExporting(true);
    setExportComplete(false);
    
    try {
      await exportProject(project, exportType);
      setExportComplete(true);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={exportType}
          onChange={handleExportChange}
          disabled={isExporting}
          className="w-50 px-4 py-2 pr-8 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" disabled>Export project to...</option>
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
          <option value="pdf">PDF</option>
          <option value="zip">ZIP</option>
          <option value="json">JSON</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      <button
        onClick={handleExport}
        disabled={!exportType || isExporting || !project}
        className={`px-4 py-2 rounded-md transition-colors ${
          exportType && !isExporting && project
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
        }`}
      >
        {isExporting ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </div>
        ) : exportComplete ? (
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Exported!
          </div>
        ) : (
          'Export!'
        )}
      </button>
    </div>
  );
};