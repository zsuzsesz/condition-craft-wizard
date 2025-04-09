
import React from 'react';
import { Condition, Field, OperatorType } from '@/types/condition';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface ConditionItemProps {
  condition: Condition;
  fields: Field[];
  onUpdate: (updatedCondition: Partial<Condition>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const ConditionItem = ({ condition, fields, onUpdate, onRemove, canRemove }: ConditionItemProps) => {
  const selectedField = fields.find((field) => field.id === condition.fieldId);

  const operatorOptions = (): { value: OperatorType; label: string }[] => {
    // Default operators for all field types
    const defaultOperators: { value: OperatorType; label: string }[] = [
      { value: 'equals', label: 'Equals' },
      { value: 'notEquals', label: 'Not Equals' },
    ];

    // Add type-specific operators
    if (selectedField) {
      switch (selectedField.type) {
        case 'text':
          return [
            ...defaultOperators,
            { value: 'contains', label: 'Contains' },
          ];
        case 'number':
          return [
            ...defaultOperators,
            { value: 'greaterThan', label: 'Greater Than' },
            { value: 'lessThan', label: 'Less Than' },
            { value: 'between', label: 'Between' },
          ];
        case 'select':
          return [
            ...defaultOperators,
            { value: 'in', label: 'In' },
            { value: 'notIn', label: 'Not In' },
          ];
        default:
          return defaultOperators;
      }
    }
    return defaultOperators;
  };

  const renderValueInput = () => {
    if (!selectedField) {
      return <Input type="text" placeholder="Value" className="w-full" />;
    }

    switch (selectedField.type) {
      case 'boolean':
        return (
          <Select 
            value={condition.value?.toString()} 
            onValueChange={(value) => onUpdate({ value: value === 'true' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'select':
        return (
          <Select 
            value={condition.value} 
            onValueChange={(value) => onUpdate({ value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {selectedField.options?.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return condition.operator === 'between' ? (
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              placeholder="Min" 
              value={condition.value?.min || ''} 
              onChange={(e) => {
                const min = parseFloat(e.target.value);
                onUpdate({ 
                  value: { ...condition.value, min: isNaN(min) ? '' : min } 
                });
              }}
              className="w-1/2"
            />
            <span>to</span>
            <Input 
              type="number" 
              placeholder="Max" 
              value={condition.value?.max || ''} 
              onChange={(e) => {
                const max = parseFloat(e.target.value);
                onUpdate({ 
                  value: { ...condition.value, max: isNaN(max) ? '' : max } 
                });
              }}
              className="w-1/2"
            />
          </div>
        ) : (
          <Input 
            type="number" 
            placeholder="Value" 
            value={condition.value || ''} 
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              onUpdate({ value: isNaN(value) ? '' : value });
            }}
          />
        );
      case 'date':
        return (
          <Input 
            type="date" 
            value={condition.value || ''} 
            onChange={(e) => onUpdate({ value: e.target.value })}
          />
        );
      default:
        return (
          <Input 
            type="text" 
            placeholder="Value" 
            value={condition.value || ''} 
            onChange={(e) => onUpdate({ value: e.target.value })}
          />
        );
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-200 animate-fade-in">
      <Select 
        value={condition.fieldId} 
        onValueChange={(value) => onUpdate({ fieldId: value, operator: 'equals', value: '' })}
      >
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="Select field..." />
        </SelectTrigger>
        <SelectContent>
          {fields.map((field) => (
            <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={condition.operator} 
        onValueChange={(value) => onUpdate({ operator: value as OperatorType })}
      >
        <SelectTrigger className="min-w-[140px]">
          <SelectValue placeholder="Operator..." />
        </SelectTrigger>
        <SelectContent>
          {operatorOptions().map((op) => (
            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex-1">
        {renderValueInput()}
      </div>

      {canRemove && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove} 
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
};

export default ConditionItem;
