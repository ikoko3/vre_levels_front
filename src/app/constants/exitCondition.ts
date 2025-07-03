//The numbers should be propably be synced with the other project
export const exitConditionLabels: Record<number, string> = {
  //Level 0
  0: 'Undefined condition',
  1000: 'Feasibility plan provided',
  1001: 'Development timeline defined',
  1002: 'Code base initialized',
  1003: 'Token usage clarified',
  1004: 'License information present',
  1005: 'Descriptive lab name given',

  // Level 1
  1100: 'Lab metadata is available outside the lab',
  1101: 'Metadata is tracked via version control',
  1102: 'Personal tokens are not tracked in version control',
  1103: 'Software and library versions are pinned',
  1104: 'Input data is ready for experiments',
  1105: 'Read-only data is stored in an external catalogue',
  1106: 'Lab executes without technical errors on a clean machine',
  1107: 'Each notebook cell has a clearly described responsibility',
  1108: 'Code follows a consistent and recognized style guide',
  1109: 'Parallel processing is applied where applicable',
  1110: 'Missing files or objects raise clear and explicit errors',
  1111: 'External tools and CLIs are clearly labeled and documented',
  1112: 'Notebook cells can be containerized',
  1113: 'Benchmark performed to assess resource needs',
  1114: 'Resources are provisioned for scientific scenarios',
  1115: 'Containerized cells run without manual changes',
  1116: 'The lab can be demonstrated successfully',
};

//This should change along with the enum from the other package
export const exitConditionStatuses: Record<number, string> = {
  0: 'Unfulfilled',
  100: 'In Progress',
  101: 'Blocked',
  200: 'Requested Evaluation',
  201: 'Under Evalutation',
  300: 'Verified',
};

// export enum  {
//     Unknown = 0,

//     //Development
//     InProgress = 100,
//     Blocked = 101,

//     //Evaluation
//     RequestedEvaluation = 200,
//     UnderEvalutaion = 201,

//     //Final status
//     Verified = 300,
// }
