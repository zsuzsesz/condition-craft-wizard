
import React, { useState } from 'react';
import { 
  ConditionBuilderState, 
  ConditionGroup as ConditionGroupType,
  Field, 
  LogicalOperator 
} from '@/types/condition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ConditionGroup from './ConditionGroup';
import { 
  addConditionToGroup, 
  addGroupToGroup, 
  createGroup, 
  removeConditionFromGroup, 
  removeGroupFromGroup, 
  updateLogicalOperator,
  updateNestedGroup,
  conditionToJson
} from '@/utils/conditionUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

interface ConditionBuilderProps {
  initialFields: Field[];
  initialRootGroup?: ConditionGroupType;
  onConditionsChange?: (rootGroup: ConditionGroupType) => void;
}

const ConditionBuilder = ({
  initialFields, 
  initialRootGroup, 
  onConditionsChange
}: ConditionBuilderProps) => {
  const { toast } = useToast();
  
  // Initialize state with provided fields and root group or defaults
  const [state, setState] = useState<ConditionBuilderState>({
    availableFields: initialFields,
    rootGroup: initialRootGroup || createGroup('and'),
  });

  // Update a condition group
  const handleUpdateGroup = (groupId: string, updates: Partial<ConditionGroupType>) => {
    setState((prevState) => {
      const newRootGroup = updateNestedGroup(
        prevState.rootGroup,
        groupId,
        (group) => ({ ...group, ...updates })
      );
      
      if (onConditionsChange) {
        onConditionsChange(newRootGroup);
      }
      
      return {
        ...prevState,
        rootGroup: newRootGroup,
      };
    });
  };

  // Add a condition to a group
  const handleAddCondition = (groupId: string) => {
    setState((prevState) => {
      const newRootGroup = updateNestedGroup(
        prevState.rootGroup,
        groupId,
        (group) => addConditionToGroup(group)
      );
      
      if (onConditionsChange) {
        onConditionsChange(newRootGroup);
      }
      
      return {
        ...prevState,
        rootGroup: newRootGroup,
      };
    });
  };

  // Add a sub-group to a group
  const handleAddGroup = (groupId: string) => {
    setState((prevState) => {
      const newRootGroup = updateNestedGroup(
        prevState.rootGroup,
        groupId,
        (group) => addGroupToGroup(group)
      );
      
      if (onConditionsChange) {
        onConditionsChange(newRootGroup);
      }
      
      return {
        ...prevState,
        rootGroup: newRootGroup,
      };
    });
  };

  // Remove a condition from a group
  const handleRemoveCondition = (groupId: string, conditionId: string) => {
    setState((prevState) => {
      const newRootGroup = updateNestedGroup(
        prevState.rootGroup,
        groupId,
        (group) => removeConditionFromGroup(group, conditionId)
      );
      
      if (onConditionsChange) {
        onConditionsChange(newRootGroup);
      }
      
      return {
        ...prevState,
        rootGroup: newRootGroup,
      };
    });
  };

  // Remove a group
  const handleRemoveGroup = (groupId: string) => {
    // Find parent group that contains the group to remove
    const findParentGroup = (
      currentGroup: ConditionGroupType,
      targetGroupId: string
    ): ConditionGroupType | null => {
      // Check if any direct child groups match the target
      const directChildMatch = currentGroup.groups.find(
        (group) => group.id === targetGroupId
      );
      
      if (directChildMatch) {
        return currentGroup;
      }
      
      // Recursively check nested groups
      for (const nestedGroup of currentGroup.groups) {
        const result = findParentGroup(nestedGroup, targetGroupId);
        if (result) {
          return result;
        }
      }
      
      return null;
    };

    setState((prevState) => {
      const parentGroup = findParentGroup(prevState.rootGroup, groupId);
      
      if (parentGroup) {
        const newRootGroup = updateNestedGroup(
          prevState.rootGroup,
          parentGroup.id,
          (group) => removeGroupFromGroup(group, groupId)
        );
        
        if (onConditionsChange) {
          onConditionsChange(newRootGroup);
        }
        
        return {
          ...prevState,
          rootGroup: newRootGroup,
        };
      }
      
      return prevState;
    });
  };

  // Reset the condition builder
  const handleReset = () => {
    const newRootGroup = createGroup('and');
    
    setState({
      availableFields: state.availableFields,
      rootGroup: newRootGroup,
    });
    
    if (onConditionsChange) {
      onConditionsChange(newRootGroup);
    }
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    const json = conditionToJson(state.rootGroup);
    navigator.clipboard.writeText(json);
    
    toast({
      title: "JSON copied to clipboard",
      description: "The condition structure has been copied as JSON.",
    });
  };

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold">Condition Builder</CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="builder" className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="builder" className="p-0 mt-0">
          <CardContent className="p-4">
            <ConditionGroup
              group={state.rootGroup}
              fields={state.availableFields}
              level={0}
              isRoot
              onUpdate={handleUpdateGroup}
              onAddCondition={handleAddCondition}
              onAddGroup={handleAddGroup}
              onRemoveCondition={handleRemoveCondition}
              onRemoveGroup={handleRemoveGroup}
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="json" className="p-0 mt-0">
          <CardContent className="p-4">
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {conditionToJson(state.rootGroup)}
            </pre>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t border-gray-200 bg-gray-50">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleCopyJson}>
          Copy JSON
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConditionBuilder;
