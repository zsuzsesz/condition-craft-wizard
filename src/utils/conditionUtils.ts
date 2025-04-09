import { Condition, ConditionGroup, Field, LogicalOperator } from '../types/condition';

// Generate a unique ID for new elements
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Create a new empty condition
export const createCondition = (fieldId: string = ""): Condition => {
  return {
    id: generateId(),
    fieldId,
    operator: 'equals',
    value: '',
  };
};

// Create a new empty group with one condition
export const createGroup = (logicalOperator: LogicalOperator = 'and'): ConditionGroup => {
  return {
    id: generateId(),
    logicalOperator,
    conditions: [createCondition()],
    groups: [],
  };
};

// Get field by id from available fields
export const getFieldById = (fields: Field[], fieldId: string): Field | undefined => {
  return fields.find((field) => field.id === fieldId);
};

// Add a condition to a group
export const addConditionToGroup = (group: ConditionGroup, fieldId: string = ""): ConditionGroup => {
  return {
    ...group,
    conditions: [...group.conditions, createCondition(fieldId)],
  };
};

// Add a nested group
export const addGroupToGroup = (group: ConditionGroup): ConditionGroup => {
  return {
    ...group,
    groups: [...group.groups, createGroup(group.logicalOperator)],
  };
};

// Remove a condition from a group
export const removeConditionFromGroup = (group: ConditionGroup, conditionId: string): ConditionGroup => {
  return {
    ...group,
    conditions: group.conditions.filter((condition) => condition.id !== conditionId),
  };
};

// Remove a nested group
export const removeGroupFromGroup = (group: ConditionGroup, groupId: string): ConditionGroup => {
  return {
    ...group,
    groups: group.groups.filter((nestedGroup) => nestedGroup.id !== groupId),
  };
};

// Update a condition within a group
export const updateCondition = (
  group: ConditionGroup, 
  conditionId: string, 
  updatedCondition: Partial<Condition>
): ConditionGroup => {
  return {
    ...group,
    conditions: group.conditions.map((condition) => 
      condition.id === conditionId 
        ? { ...condition, ...updatedCondition } 
        : condition
    ),
  };
};

// Update logical operator of a group
export const updateLogicalOperator = (
  group: ConditionGroup,
  logicalOperator: LogicalOperator
): ConditionGroup => {
  return {
    ...group,
    logicalOperator,
  };
};

// Update a nested group within a group hierarchy
export const updateNestedGroup = (
  group: ConditionGroup,
  groupId: string,
  updater: (group: ConditionGroup) => ConditionGroup
): ConditionGroup => {
  // If this is the group to update
  if (group.id === groupId) {
    return updater(group);
  }
  
  // Otherwise check nested groups
  return {
    ...group,
    groups: group.groups.map((nestedGroup) => 
      updateNestedGroup(nestedGroup, groupId, updater)
    ),
  };
};

// Convert condition structure to JSON
export const conditionToJson = (rootGroup: ConditionGroup): string => {
  return JSON.stringify(rootGroup, null, 2);
};
