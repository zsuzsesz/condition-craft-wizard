
export type OperatorType = 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn' | 'between';

export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'select';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  options?: string[]; // For select fields
}

export interface Condition {
  id: string;
  fieldId: string;
  operator: OperatorType;
  value: any;
}

export type LogicalOperator = 'and' | 'or';

export interface ConditionGroup {
  id: string;
  logicalOperator: LogicalOperator;
  conditions: Condition[];
  groups: ConditionGroup[];
}

export interface ConditionBuilderState {
  availableFields: Field[];
  rootGroup: ConditionGroup;
}
