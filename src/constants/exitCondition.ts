export const exitConditionLabels: Record<number, string> = {
  0: 'Undefined condition',
  1000: 'Feasibility plan provided',
  1001: 'Development timeline defined',
  1002: 'Code base initialized',
  1003: 'Token usage clarified',
  1004: 'License information present',
  1005: 'Descriptive lab name given',
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
