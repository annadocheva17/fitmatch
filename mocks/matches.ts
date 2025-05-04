export const matches = [
  // Accepted matches (current user is the initiator)
  {
    id: '1',
    userId: '1', // Current user
    matchedUserId: '2',
    status: 'accepted',
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2023-06-15T14:45:00Z',
  },
  {
    id: '2',
    userId: '1', // Current user
    matchedUserId: '6',
    status: 'accepted',
    createdAt: '2023-06-13T08:15:00Z',
    updatedAt: '2023-06-13T12:20:00Z',
  },
  {
    id: '3',
    userId: '1', // Current user
    matchedUserId: '7',
    status: 'accepted',
    createdAt: '2023-05-28T09:45:00Z',
    updatedAt: '2023-05-28T15:30:00Z',
  },
  
  // Accepted matches (current user is the recipient)
  {
    id: '4',
    userId: '5',
    matchedUserId: '1', // Current user
    status: 'accepted',
    createdAt: '2023-06-14T11:45:00Z',
    updatedAt: '2023-06-14T16:30:00Z',
  },
  {
    id: '5',
    userId: '8',
    matchedUserId: '1', // Current user
    status: 'accepted',
    createdAt: '2023-06-02T14:20:00Z',
    updatedAt: '2023-06-02T18:15:00Z',
  },
  
  // Pending matches (current user is the initiator)
  {
    id: '6',
    userId: '1', // Current user
    matchedUserId: '4',
    status: 'pending',
    createdAt: '2023-06-17T15:10:00Z',
    updatedAt: '2023-06-17T15:10:00Z',
  },
  {
    id: '7',
    userId: '1', // Current user
    matchedUserId: '9',
    status: 'pending',
    createdAt: '2023-06-18T10:25:00Z',
    updatedAt: '2023-06-18T10:25:00Z',
  },
  
  // Pending matches (current user is the recipient)
  {
    id: '8',
    userId: '3',
    matchedUserId: '1', // Current user
    status: 'pending',
    createdAt: '2023-06-16T09:20:00Z',
    updatedAt: '2023-06-16T09:20:00Z',
  },
  {
    id: '9',
    userId: '10',
    matchedUserId: '1', // Current user
    status: 'pending',
    createdAt: '2023-06-19T16:40:00Z',
    updatedAt: '2023-06-19T16:40:00Z',
  },
  
  // Declined matches (for history)
  {
    id: '10',
    userId: '1', // Current user
    matchedUserId: '3',
    status: 'declined',
    createdAt: '2023-05-20T11:30:00Z',
    updatedAt: '2023-05-20T14:15:00Z',
  },
  {
    id: '11',
    userId: '4',
    matchedUserId: '1', // Current user
    status: 'declined',
    createdAt: '2023-05-25T13:45:00Z',
    updatedAt: '2023-05-25T17:20:00Z',
  }
];