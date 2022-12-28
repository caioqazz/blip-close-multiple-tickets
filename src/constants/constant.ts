export const FILTER_DEFAULT = {
  'dates': {
    'storage': {
      'select': '<',
      'date': ''
    },
    'open': {
      'select': '<',
      'date': ''
    },
    'status': {
      'select': '<',
      'date': ''
    },
    'lastMessageDate': {
      'select': '<',
      'date': ''
    }
  },
  'identities': {
    'agent': '',
    'customer': ''
  },
  'pagination': {
    'skip': 0,
    'take': 200
  },
  'status': {
    'closedClient': false,
    'waiting': false,
    'closedClientInactivity': false,
    'open': true
  }
}
export const TAGS_DEFAULT = {
  tags: [],
  isTagsRequired: false
}
export const TICKET_DEFAULT = []
export const TICKET_TABLE_MODEL = [
  {
    label: 'Sequential Id',
    key: 'sequentialId'
  },
  {
    label: 'Customer Identity',
    key: 'customerIdentity'
  },
  {
    label: 'Team',
    key: 'team'
  },
  {
    label: 'Open Date',
    key: 'openDate'
  },
  {
    label: 'Status',
    key: 'status'
  },
  {
    label: 'Last Client Message Date',
    key: 'lastMessageDate'
  }
]
export const MODAL_DEFAULT = {
  position: 0,
  display: false,
  item: {}
}
