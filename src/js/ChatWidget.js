import createRequest from './request';
import ModalForm from './ModalForm';

export default class ChatWidget {
  constructor(container) {
    this.container = container;
  }

  init() {
    this.bindToDOM();
    this.modal = new ModalForm(this.container);
    this.modal.bindToDOM();
    this.registerEvents();
    this.subscribeEvents();
  }

  bindToDOM() {
    const chatTemplate = this.renderChatTemplate();
    this.container.insertAdjacentHTML('beforeend', chatTemplate);

    this.userListContainer = this.container.querySelector('.chat__userlist');
    this.inputElement = this.container.querySelector('.form__input');
    this.connectButton = this.container.querySelector('.chat__connect');
    this.messageContainer = this.container.querySelector('.chat__messages-container');
  }

  registerEvents() {
    this.connectButton.addEventListener('click', () => this.modal.showModal());
    this.inputElement.addEventListener('keydown', (event) => {
      if (event.keyCode === 13) {
        this.sendMessage();
      }
    });
  }

  subscribeEvents() {
    this.modal.addSubmitListener(this.onSubmitHandler.bind(this));
  }

  async onSubmitHandler(userName) {
    const response = await createRequest(JSON.stringify(userName));
    if (response.status === 'ok') {
      this.modal.hideHint();
      this.modal.close();
      this.connectButton.classList.add('hidden');
      this.user = response.user;
      this.inputElement.disabled = false;
      this.websocket = new WebSocket('wss://deizee-chat-backend.herokuapp.com/chat');
      this.websocket.addEventListener('message', (event) => this.renderMessage(event));
      window.addEventListener('beforeunload', () =>
        this.websocket.send(
          JSON.stringify({
            type: 'exit',
            user: this.user,
          })
        )
      );
    } else {
      this.modal.showHint(response.message);
    }
  }

  sendMessage() {
    const { value } = this.inputElement;
    this.websocket.send(JSON.stringify({ type: 'send', message: value, user: this.user }));
    this.inputElement.value = '';
  }

  renderMessage(event) {
    const receivedData = JSON.parse(event.data);
    if (Array.isArray(receivedData)) {
      this.userListContainer.textContent = '';
      receivedData.forEach((user) => {
        const userTemplate = `
          <div class='chat__user' data-user-id='${user.id}'>
            ${user.name === this.user.name ? `${user.name} (you)` : user.name}
          </div>
        `;
        this.userListContainer.insertAdjacentHTML('beforeend', userTemplate);
      });
      return;
    }
    const sourceDate = new Date();
    const date = `${sourceDate
      .toLocaleTimeString()
      .slice(0, 5)} ${sourceDate.toLocaleDateString()} `;
    const messageTemplate = `
      <div class='message__container ${
        receivedData.user.name === this.user.name
          ? 'message__container-yourself'
          : 'message__container-interlocutor'
      }'>
        <div class='message__header'>
          ${
            receivedData.user.name === this.user.name
              ? `${receivedData.user.name} (you)`
              : receivedData.user.name
          }, ${date}
        </div>
        <div class='message__body'>
          ${receivedData.message}
        </div>
      </div>
    `;
    this.messageContainer.insertAdjacentHTML('beforeend', messageTemplate);
    this.messageContainer.lastElementChild.scrollIntoView();
  }

  renderChatTemplate() {
    return `
      <div class='container'>
        <div class='chat__header'>
          <h1 class='chat__title'>Deizee Chat</h1>
        </div>
        <div class='chat__connect'>Chat connect</div>
        <div class='chat__container'>
          <div class='chat__userlist'></div>
          <div class='chat__area'>
            <div class='chat__messages-container'></div>
            <div class='chat__messages-input'>
              <div class='form__group'>
                <input 
                  class='form__input'
                  type='text' 
                  id='message-field' 
                  name='message' 
                  placeholder='Please enter your message...' 
                  disabled='true'>
              </div>
            </div>
        </div>
      </div>
    `;
  }
}
