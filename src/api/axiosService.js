import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const TAKE_PAGINATION_MAX_VALUE = 100;

export const getIntents = async (key, url, handleError) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${key}`,
  };

  const body = {
    id: uuidv4(),
    to: "postmaster@ai.msging.net",
    method: "get",
    uri: "/intentions?take=100",
  };
  try {
    let response = await axios.post(url, body, {
      headers: headers,
    });
    return response.data.resource.items;
  } catch (error) {
    console.error(`Error to load intentions`);
    handleError();
  }
};

export const getAnswers = async (key, url, intent) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${key}`,
  };

  const body = {
    id: uuidv4(),
    to: "postmaster@ai.msging.net",
    method: "get",
    uri: `/intentions/${encodeURI(intent)}?deep=true`,
  };
  try {
    let response = await axios.post(url, body, {
      headers: headers,
    });
    return response.data.resource;
  } catch (error) {
    console.error(`Error to load Answers`);
  }
};

export const getTicketsPagination = async (
  header,
  toastError,
  updateProgressBar
) => {
  let headerCopy = JSON.parse(JSON.stringify(header));

  let tickets = [];
  while (headerCopy.pagination.skip < header.pagination.take) {
    let ticketsPagination = await getTickets(
      headerCopy,
      toastError,
      updateProgressBar,
      tickets.length
    );
    if (ticketsPagination.length === 0) {
      updateProgressBar(100);
      break;
    }

    tickets = [...tickets, ...ticketsPagination];

    headerCopy.pagination.skip += TAKE_PAGINATION_MAX_VALUE;

    let percentage =
      (headerCopy.pagination.skip / headerCopy.pagination.take) * 100;
    updateProgressBar(percentage.toFixed(2));
  }

  return tickets.filter(
    (value, index, self) => self.map((x) => x.id).indexOf(value.id) === index
  );
};

export const getTickets = async (header, toastError) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${header.key}`,
  };
  const body = {
    id: uuidv4(),
    to: "postmaster@desk.msging.net",
    method: "get",
    uri: `/tickets?$filter=status%20eq%20'${Object.keys(header.status).find(
      (k) => header.status[k]
    )}'and%20(closed%20eq%20false)'${
      header.identities.customer
        ? `%20and%20(substringof('${encodeURI(
            header.identities.customer
          )}'%2CCustomerIdentity))`
        : ""
    }${
      header.dates.storage.date
        ? `%20and%20storageDate%20${
            header.dates.storage.select === ">" ? "ge" : "le"
          }%20datetimeoffset'${encodeURIComponent(header.dates.storage.date)}'`
        : ""
    }${
      header.dates.open.date
        ? `%20and%20openDate%20${
            header.dates.open.select === ">" ? "ge" : "le"
          }%20datetimeoffset'${encodeURIComponent(header.dates.open.date)}'`
        : ""
    }${
      header.dates.status.date
        ? `%20and%20statusDate%20${
            header.dates.status.select === ">" ? "ge" : "le"
          }%20datetimeoffset'${encodeURIComponent(header.dates.status.date)}'`
        : ""
    }${
      header.identities.agent
        ? `%20and%20(AgentIdentity%20eq%20'${encodeURI(
            header.identities.agent
          )}')`
        : ""
    }&$skip=${header.pagination.skip}&$take=100`,
  };
  try {
    let response = await axios.post(header.url, body, {
      headers: headers,
    });

    if (response.data.status !== "success")
      throw new Error(
        "Exception message: Error to load tickets " + JSON.stringify(response)
      );

    let items = [];
    for (const item of response.data.resource.items) {
      items.push({
        ...item,
        lastMessageDate: await getLastMessage(
          header.key,
          header.url,
          item.customerIdentity,
          item.id
        ),
      });
    }
    if (header.dates.lastMessageDate.date !== "")
      return items.filter(
        (e) =>
          (header.dates.lastMessageDate.select === "<" &&
            header.dates.lastMessageDate.date > e.lastMessageDate) ||
          (header.dates.lastMessageDate.select === ">" &&
            header.dates.lastMessageDate.date < e.lastMessageDate)
      );
    else return items;
  } catch (error) {
    console.error(`Error to load tickets` + error);
    toastError(`Error to load tickets`);
    return [];
  }
};

export const getLastMessage = async (key, url, customerIdentity, ticketId) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${key}`,
  };

  const body = {
    id: uuidv4(),
    method: "get",
    to: "postmaster@desk.msging.net",
    uri: `/tickets/${ticketId}/messages?$take=100${
      customerIdentity.includes("tunnel") ? "&getFromOwnerIfTunnel=true" : ""
    }`,
  };
  try {
    let response = await axios.post(url, body, {
      headers: headers,
    });

    if (response.data.resource.items.length === 0) return "More than 90 days";

    return response.data.resource.items.find((e) => e.direction === "received")
      .date;
  } catch (error) {
    console.error(`Error to get last message - ${error}`);
    return "Couldn't find";
  }
};

export const closeTicket = async (key, url, ticketId, toastError) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${key}`,
  };

  const body = {
    id: uuidv4(),
    to: "postmaster@desk.msging.net",
    method: "set",
    uri: "/tickets/change-status",
    type: "application/vnd.iris.ticket+json",
    resource: {
      id: ticketId,
      status: "ClosedAttendant",
    },
  };
  try {
    const response = await axios.post(url, body, {
      headers: headers,
    });

    if (response.data.status === "success") {
      return true;
    }

    toastError(
      `Error to close ticket ${ticketId}- ${JSON.stringify(response)}`
    );
    return false;
  } catch (error) {
    console.error(`Error to close ticket ${ticketId} - ${error}`);
    toastError(`Error to close ticket ${ticketId}`);
    return false;
  }
};

export const closeTicketAlreadyClosedClient = async (
  key,
  url,
  ticketId,
  toastError
) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${key}`,
  };

  const body = {
    id: uuidv4(),
    to: "postmaster@desk.msging.net",
    method: "set",
    uri: `/tickets/${ticketId}/close`,
    type: "application/vnd.iris.ticket+json",
    resource: {
      id: ticketId,
      tags: [],
      status: "ClosedClient",
    },
  };
  try {
    const response = await axios.post(url, body, {
      headers: headers,
    });

    if (response.data.status === "success") {
      return true;
    }

    toastError(
      `Error to close ticket ${ticketId}- ${JSON.stringify(response)}`
    );
    return false;
  } catch (error) {
    console.error(`Error to close ticket ${ticketId} - ${error}`);
    toastError(`Error to close ticket ${ticketId}`);
    return false;
  }
};
