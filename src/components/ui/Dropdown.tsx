"use client";

import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { ChevronDown, X, Check, Search } from "lucide-react";
import axios from "axios";

interface DropdownProps {
  id: string;
  label?: string;
  value: string | string[];
  onChange: (value: any) => void;
  endpoint?: string;
  params?: Record<string, any>;
  mapOptions?: (data: any) => Array<{ value: string; label: string }>;
  options?: Array<{ value: string; label: string }> | string[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  multiSelect?: boolean;
  searchable?: boolean;
}

export default function Dropdown({
  id,
  label,
  value,
  onChange,
  endpoint,
  params = {},
  mapOptions,
  options: optionsProp,
  required = false,
  error,
  disabled = false,
  placeholder = "Select option",
  multiSelect = false,
  searchable = true
}: DropdownProps) {
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [fetched, setFetched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync static options
  useEffect(() => {
    if (optionsProp) {
      const mapped = Array.isArray(optionsProp)
        ? optionsProp.map((opt) =>
            typeof opt === "string" ? { value: opt, label: opt } : opt
          )
        : [];
      setOptions(mapped);
      setFetched(true);
    }
  }, [optionsProp]);

  const fetchOptions = async () => {
    if (!endpoint) return;
    setLoading(true);
    setFetchError("");
    try {
      const response = await axios.get(endpoint, { params });
      
      let data = response.data;
      if (data.message && Array.isArray(data.message)) {
        data = data.message;
      } else if (data.data && Array.isArray(data.data)) {
        data = data.data;
      }
      
      if (Array.isArray(data)) {
        const mappedOptions = mapOptions ? mapOptions(data) : data.map((item: any) => ({
          value: item.name || item.value || String(item),
          label: item.label || item.name || item.value || String(item)
        }));
        setOptions(mappedOptions);
        setFetched(true);
      } else {
        setOptions([]);
        setFetchError("No data available");
      }
    } catch (err: any) {
      console.error(`Error fetching ${label || id}:`, err);
      setFetchError(err?.response?.data?.message || `Failed to load ${label || id}`);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    if (!fetched && !loading && !fetchError && endpoint) {
      fetchOptions();
    }
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const handleRetry = () => {
    setFetchError("");
    fetchOptions();
  };

  // For single select
  const handleSingleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  // For multi select
  const handleMultiSelect = (selectedValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentValues = Array.isArray(value) ? value : [];
    let newValues: string[];
    
    if (currentValues.includes(selectedValue)) {
      newValues = currentValues.filter(v => v !== selectedValue);
    } else {
      newValues = [...currentValues, selectedValue];
    }
    
    onChange(newValues);
  };

  const removeSelectedItem = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (Array.isArray(value)) {
      const newValues = value.filter(v => v !== itemToRemove);
      onChange(newValues);
    }
  };

  // Get display labels for multi select
  const getSelectedLabels = () => {
    if (!Array.isArray(value) || value.length === 0) return null;
    return value.map(val => {
      const found = options.find(opt => opt.value === val);
      return found || { value: val, label: val };
    });
  };

  // Get selected option label for single select
  const getSelectedLabel = () => {
    if (!value || Array.isArray(value)) return placeholder;
    const selected = options.find(opt => opt.value === value);
    return selected ? selected.label : value;
  };

  // Check if an option is selected
  const isSelected = (optionValue: string) => {
    if (multiSelect) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  // Filter options based on search query
  const filteredOptions = options.filter(opt =>
    (opt.label || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative space-y-1 w-full" ref={containerRef}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      {/* Dropdown trigger button */}
      <div
        onClick={handleClick}
        className={`w-full min-h-10 px-3 py-2 rounded-md border ${
          error ? "border-red-500" : fetchError ? "border-red-500" : "border-slate-200"
        } bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent cursor-pointer flex flex-wrap items-center gap-1 relative hover:border-slate-300 transition-colors ${
          disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""
        }`}
      >
        {multiSelect && Array.isArray(value) && value.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1 flex-1 pr-6">
            {getSelectedLabels()?.map((selected) => (
              <span
                key={selected.value}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent rounded-md text-xs font-medium"
              >
                {selected.label}
                <button
                  onClick={(e) => removeSelectedItem(selected.value, e)}
                  className="hover:text-accent-foreground focus:outline-none"
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className={`flex-1 truncate pr-6 ${!value || (Array.isArray(value) && value.length === 0) ? "text-slate-400" : ""}`}>
            {loading ? "Loading..." : fetchError ? "Failed to load" : getSelectedLabel()}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown menu */}
      {isOpen && !loading && !fetchError && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden flex flex-col max-h-60">
          {searchable && (
            <div className="p-2 border-b border-slate-200 bg-white sticky top-0 z-10" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto flex-1 max-h-48 py-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-slate-400 text-center">No options available</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={(e) => multiSelect ? handleMultiSelect(option.value, e) : handleSingleSelect(option.value)}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                    isSelected(option.value) 
                      ? "bg-accent/5 text-accent font-medium" 
                      : "text-slate-700"
                  }`}
                >
                  {multiSelect ? (
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected(option.value) 
                        ? "bg-accent border-accent" 
                        : "border-slate-300"
                    }`}>
                      {isSelected(option.value) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  ) : (
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected(option.value) 
                        ? "border-accent" 
                        : "border-slate-300"
                    }`}>
                      {isSelected(option.value) && (
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      )}
                    </div>
                  )}
                  <span className="flex-1">{option.label}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Loading and error states */}
      {loading && (
        <p className="text-xs text-slate-400 mt-1">Fetching options...</p>
      )}

      {fetchError && !loading && (
        <div className="mt-1">
          <p className="text-xs text-red-500 inline">{fetchError}. </p>
          <button
            type="button"
            onClick={handleRetry}
            className="text-xs text-accent underline font-medium hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {error && !fetchError && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}