let clients = [];

let addClient = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingClient = clients.find((client) => client.room === room && client.name === name);

    if(existingClient) {
        return {error: 'Username is taken'};
    }

    const client = {id, name, room};

    clients.push(client);

    return {client}
}

let removeClient = (id) => {
    const index = clients.findIndex((client) => client.id === id);

    if(index !== -1) return clients.splice(index, 1)[0];
}

let getClient = (id) => clients.find((client) => client.id === id);


let getClientsInRoom = (room) => clients.filter((client) => client.room === room);

module.exports = { addClient, removeClient, getClient, getClientsInRoom };