import { Types } from "ably/promises";
import * as Ably from "ably/promises";

(async () => {
    const optionalClientId = "optionalClientId"; // When not provided in authUrl, a default will be used.
    const ably = new Ably.Realtime.Promise({ authUrl: `/api/ably-token-request?clientId=${optionalClientId}` });
    const channel = ably.channels.get("some-channel-name");

    const messages = document.getElementById("messages");
    const form = document.getElementById("form");
    const input = document.getElementById("input") as HTMLInputElement;
    const username = setUsername().replace(/[^a-zA-Z0-9_-]/g, '');

    form.addEventListener("submit", (e:SubmitEvent) => {
        e.preventDefault();

        channel.publish({name: "chat-message", data: username+" > "+input.value});
        input.value = "";
        input.focus();
    });
    
    await channel.subscribe((msg: Types.Message) => {
        //console.log(msg);
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
    
        messageElement.id = msg.id + "-message";
    
        if (msg.name === "welcome-message") {
            messageElement.innerHTML = `<span class="welcome-message">${msg.data}</span>`;
        } else {
            var date = new Date(msg.timestamp);
            var hours = ('0' + date.getHours()).slice(-2);
            var minutes = ('0' + date.getMinutes()).slice(-2);
            var seconds = ('0' + date.getSeconds()).slice(-2);
            var formattedDateTime = hours + ':' + minutes + ':' + seconds;
            messageElement.textContent = formattedDateTime+" "+msg.data;
        }
    
        const messagesContainer = document.getElementById("messages");
        messagesContainer.appendChild(messageElement);
    });
    let date = new Date(Date.now());
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);
    let formattedDateTime = hours + ':' + minutes + ':' + seconds;
    channel.publish("welcome-message",`${formattedDateTime} - ${username} joined the chat`);

})();

export { };
