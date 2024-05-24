import { Types } from "ably/promises";
import * as Ably from "ably/promises";

(async () => {
    const optionalClientId = "optionalClientId"; // When not provided in authUrl, a default will be used.
    const ably = new Ably.Realtime.Promise({ authUrl: `/api/ably-token-request?clientId=${optionalClientId}` });
    const channel = ably.channels.get("some-channel-name");

    const messages = document.getElementById("messages");
    const form = document.getElementById("form");
    const input = document.getElementById("input") as HTMLInputElement;
    const username = document.getElementById("username");

    form.addEventListener("submit", (e:SubmitEvent) => {
        e.preventDefault();

        channel.publish({name: "chat-message", data: input.value});
        input.value = "";
        input.focus();
    });
    
    await channel.subscribe((msg: Types.Message) => {
        console.log(msg);
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
    
        // Füge eine eindeutige ID basierend auf der Nachrichten-ID hinzu
        messageElement.id = msg.id + "-message";
    
        if (msg.name === "welcome-message") {
            messageElement.innerHTML = `<span class="welcome-message">${msg.data}</span>`;
        } else {
            messageElement.textContent = msg.data;
        }
    
        const messagesContainer = document.getElementById("messages");
        messagesContainer.appendChild(messageElement);
    });
    
    channel.publish("welcome-message",`${username} joined the chat`);

})();

export { };
