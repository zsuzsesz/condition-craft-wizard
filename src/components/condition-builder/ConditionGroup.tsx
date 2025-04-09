
import React, { useState } from 'react';
import { ConditionGroup as ConditionGroupType, LogicalOperator, Condition, Field } from '@/types/condition';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ConditionItem from './ConditionItem';
import { Card, CardContent } from '@/components/ui/card';

interface ConditionGroupProps {
  group: ConditionGroupType;
  fields: Field[];
  level: number;
  isRoot?: boolean;
  onUpdate: (groupId: string, updatedGroup: Partial<ConditionGroupType>) => void;
  onAddCondition: (groupId: string) => void;
  onAddGroup: (groupId: string) => void;
  onRemoveCondition: (groupId: string, conditionId: string) => void;
  onRemoveGroup: (groupId: string) => void;
}

const ConditionGroup = ({
  group,
  fields,
  level,
  isRoot = false,
  onUpdate,
  onAddCondition,
  onAddGroup,
  onRemoveCondition,
  onRemoveGroup,
}: ConditionGroupProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogicalOperatorChange = (checked: boolean) => {
    const newOperator = checked ? 'or' : 'and';
    onUpdate(group.id, { logicalOperator: newOperator as LogicalOperator });
  };

  const handleConditionUpdate = (condition: Condition, updatedCondition: Partial<Condition>) => {
    const updatedConditions = group.conditions.map((c) =>
      c.id === condition.id ? { ...c, ...updatedCondition } : c
    );
    onUpdate(group.id, { conditions: updatedConditions });
  };

  return (
    <Card 
      className={`
        bg-white 
        border-gray-200 
        rounded-md 
        mb-3 
        shadow-sm 
        transition-all
        text-gray-800
      `}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 text-gray-600 hover:bg-gray-100" 
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </Button>

          <span className="font-medium text-gray-700">
            {isRoot ? 'Where' : `${level > 0 ? 'And' : ''} Where`}
          </span>

          <div className="flex items-center space-x-3 bg-gray-100 px-3 py-1 rounded-md">
            <span className={`text-sm font-medium ${group.logicalOperator === 'and' ? 'text-blue-600' : 'text-gray-500'}`}>
              AND
            </span>
            
            <Switch
              checked={group.logicalOperator === 'or'}
              onCheckedChange={handleLogicalOperatorChange}
              className={`${
                group.logicalOperator === 'or'
                  ? 'bg-purple-500'
                  : 'bg-blue-500'
              }`}
            />
            
            <span className={`text-sm font-medium ${group.logicalOperator === 'or' ? 'text-purple-600' : 'text-gray-500'}`}>
              OR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isRoot && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemoveGroup(group.id)}
              className="h-7 text-gray-500 hover:text-red-500"
            >
              <Trash2 size={15} />
            </Button>
          )}
        </div>
      </div>

      {!collapsed && (
        <CardContent className="p-3">
          <div className="pl-5 border-l-2 border-gray-200">
            {group.conditions.map((condition, index) => (
              <div key={condition.id} className="mb-2">
                <ConditionItem
                  condition={condition}
                  fields={fields}
                  onUpdate={(updatedCondition) => handleConditionUpdate(condition, updatedCondition)}
                  onRemove={() => onRemoveCondition(group.id, condition.id)}
                  canRemove={group.conditions.length > 1 || group.groups.length > 0}
                />
              </div>
            ))}
            
            {group.groups.map((nestedGroup) => (
              <div key={nestedGroup.id} className="mt-3">
                <ConditionGroup
                  group={nestedGroup}
                  fields={fields}
                  level={level + 1}
                  onUpdate={onUpdate}
                  onAddCondition={onAddCondition}
                  onAddGroup={onAddGroup}
                  onRemoveCondition={onRemoveCondition}
                  onRemoveGroup={onRemoveGroup}
                />
              </div>
            ))}
            
            <div className="mt-3 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onAddCondition(group.id)}
                className="h-8"
              >
                <Plus size={14} className="mr-1" /> Add Condition
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onAddGroup(group.id)}
                className="h-8"
              >
                <Plus size={14} className="mr-1" /> Add Sub-Group
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ConditionGroup;
