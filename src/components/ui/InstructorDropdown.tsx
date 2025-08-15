// components/ui/InstructorDropdown.jsx

import React from 'react';
import { User, ChevronDown, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const InstructorDropdown = ({ 
  instructors = [], 
  loading = false, 
  error = null, 
  value, 
  onChange, 
  placeholder = "Select an instructor",
  required = true,
  label = "Instructor",
  className = ""
}) => {
  return (
    <FormItem className={className}>
      <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <User className="w-4 h-4" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </FormLabel>
      <FormControl>
        <Select value={value} onValueChange={onChange} disabled={loading}>
          <SelectTrigger className="w-full h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20">
            <SelectValue placeholder={
              loading 
                ? "Loading instructors..." 
                : error 
                  ? "Error loading instructors" 
                  : placeholder
            } />
            {loading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
            {!loading && <ChevronDown className="w-4 h-4 ml-2" />}
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            {loading ? (
              <SelectItem value="loading" disabled>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              </SelectItem>
            ) : error ? (
              <SelectItem value="error" disabled>
                <span className="text-red-500">Error loading instructors</span>
              </SelectItem>
            ) : instructors.length === 0 ? (
              <SelectItem value="empty" disabled>
                <span className="text-gray-500">No instructors available</span>
              </SelectItem>
            ) : (
              instructors.map((instructor) => (
                <SelectItem 
                  key={instructor.id} 
                  value={instructor.id.toString()}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {instructor.instructor_name}
                    </span>
                    {instructor.description && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {instructor.description}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
      {error && !loading && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          Failed to load instructors. Please try again.
        </p>
      )}
    </FormItem>
  );
};

export default InstructorDropdown;