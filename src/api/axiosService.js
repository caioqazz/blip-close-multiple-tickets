import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

export const getIntents = async (key, url, handleError) => {

    const headers = {
        "Content-Type": "application/json",
        Authorization: `${key}`
    };

    const body = {
        "id": uuidv4(),
        "to": "postmaster@ai.msging.net",
        "method": "get",
        "uri": "/intentions?take=100"
    }
    try {
        let response = await axios.post(url, body, {
            headers: headers
        });
        return response.data.resource.items;
    } catch (error) {
        console.error(`Error to load intentions`)
        handleError();
    }


}

export const getAnswers = async (key, url, intent) => {

    const headers = {
        "Content-Type": "application/json",
        Authorization: `${key}`
    };

    const body = {
        "id": uuidv4(),
        "to": "postmaster@ai.msging.net",
        "method": "get",
        "uri": `/intentions/${encodeURI(intent)}?deep=true`
    }
    try {
        let response = await axios.post(url, body, {
            headers: headers
        });
        return response.data.resource;
    } catch (error) {
        console.error(`Error to load Answers`)
    }
}

export const getOpenTickets = async (key, url, toastError) => {

    const headers = {
        "Content-Type": "application/json",
        Authorization: `${key}`
    };

    const body = {
        "id": uuidv4(),
        "to": "postmaster@desk.msging.net",
        "method": "get",
        "uri": "/tickets?$filter=status%20eq%20'open'&$skip=0&$take=5000"
    }
    try {
        let response = await axios.post(url, body, {
            headers: headers
        });
        let items = [];
        for (const item of response.data.resource.items) {
            items.push({ ...item, lastMessageDate: await getLastMessage(key, url, item.customerIdentity) })
        }

        return items;
    } catch (error) {
        console.error(`Error to load tickets`)
        toastError(`Error to load tickets`)
        return [];
    }


}


export const getLastMessage = async (key, url, customerIdentity) => {

    const headers = {
        "Content-Type": "application/json",
        Authorization: `${key}`
    }

    const body = {
        "id": uuidv4(),
        "method": "get",
        "uri": `/threads/${customerIdentity}?$take=100`
    }
    try {
        let response = await axios.post(url, body, {
            headers: headers
        });
        return response.data.resource.items.find(e => e.direction === 'received').date;
    } catch (error) {
        console.error(`Error to get last message`)
        return "couldn't find"

    }


}



export const closeTicket = async (key, url, ticketId, toastError) => {

    const headers = {
        "Content-Type": "application/json",
        Authorization: `${key}`
    }

    const body = {
        "id": uuidv4(),
        "to": "postmaster@desk.msging.net",
        "method": "set",
        "uri": "/tickets/change-status",
        "type": "application/vnd.iris.ticket+json",
        "resource": {
            "id": ticketId,
            "status": "ClosedAttendant"
        }
    }
    try {
        const response = await axios.post(url, body, {
            headers: headers
        });
        if (response.data.status === 'success') {
            return true;
        }
        
        toastError(`Error to close ticket ${ticketId}`);
        return false;
    } catch (error) {
        console.error(`Error to close ticket ${ticketId} - ${error}`);
        toastError(`Error to close ticket ${ticketId}`);
        return false;

    }


}
