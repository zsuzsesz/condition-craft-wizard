import React from 'react';
import { ConditionGroup as ConditionGroupType, LogicalOperator, Condition, Field } from '@/types/condition';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogicalOperatorChange = (value: string) => {
    if (value === 'and' || value === 'or') {
      onUpdate(group.id, { logicalOperator: value as LogicalOperator });
    }
  };

  const handleConditionUpdate = (condition: Condition, updatedCondition: Partial<Condition>) => {
    const updatedConditions = group.conditions.map((c) =>
      c.id === condition.id ? { ...c, ...updatedCondition } : c
    );
    onUpdate(group.id, { conditions: updatedConditions });
  };

  const getBgColor = () => {
    const colors = ['bg-condition-group', 'bg-white', 'bg-blue-50', 'bg-indigo-50', 'bg-violet-50'];
    return colors[level % colors.length];
  };

  const getBorderColor = () => {
    const colors = [
      'border-condition-border', 
      'border-blue-200', 
      'border-indigo-200', 
      'border-violet-200', 
      'border-purple-200'
    ];
    return colors[level % colors.length];
  };

  return (
    <Card 
      className={`
        bg-condition-group-dark 
        border-condition-group-border 
        rounded-md 
        mb-3 
        shadow-sm 
        transition-all
        text-condition-group-text
      `}
    >
      <div className="flex items-center justify-between p-3 border-b border-condition-group-border">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 text-condition-group-text hover:bg-gray-700" 
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </Button>

          <span className="font-medium text-condition-group-text">
            {isRoot ? 'Where' : `${level > 0 ? 'And' : ''} Where`}
          </span>

          <ToggleGroup 
            type="single" 
            value={group.logicalOperator} 
            onValueChange={handleLogicalOperatorChange} 
            className="ml-2"
          >
            <ToggleGroupItem 
              value="and" 
              size="sm" 
              className="
                h-7 
                bg-condition-group-operator-bg 
                text-condition-group-operator-text 
                hover:bg-opacity-90
              "
            >
              AND
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="or" 
              size="sm" 
              className="
                h-7 
                bg-condition-group-operator-bg 
                text-condition-group-operator-text 
                hover:bg-opacity-90
              "
            >
              OR
            </ToggleGroupItem>
          </ToggleGroup>
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
          <div className="pl-5 border-l-2 border-condition-connector">
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
