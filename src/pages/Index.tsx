
import React from 'react';
import ConditionBuilder from '@/components/condition-builder/ConditionBuilder';
import { Field } from '@/types/condition';
import { createGroup } from '@/utils/conditionUtils';

const Index = () => {
  // Sample fields for the condition builder
  const sampleFields: Field[] = [
    { id: 'name', name: 'Name', type: 'text' },
    { id: 'age', name: 'Age', type: 'number' },
    { id: 'email', name: 'Email', type: 'text' },
    { id: 'active', name: 'Active Status', type: 'boolean' },
    { id: 'role', name: 'Role', type: 'select', options: ['Admin', 'User', 'Guest', 'Manager'] },
    { id: 'joinDate', name: 'Join Date', type: 'date' },
    { id: 'score', name: 'Score', type: 'number' },
  ];

  // Create a sample initial condition (optional)
  const initialGroup = createGroup('and');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Condition Craft Wizard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Build complex nested conditions with an intuitive visual interface
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">How to use</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Use <strong>AND/OR</strong> toggle to set the logical operator for each group</li>
            <li>Add conditions using field, operator, and value selectors</li>
            <li>Create nested condition groups for complex logic</li>
            <li>View the JSON representation of your conditions</li>
            <li>Copy the JSON to use in your applications</li>
          </ul>
        </div>

        <ConditionBuilder 
          initialFields={sampleFields} 
          initialRootGroup={initialGroup}
          onConditionsChange={(rootGroup) => {
            console.log('Conditions updated:', rootGroup);
          }}
        />
      </div>
    </div>
  );
};

export default Index;
