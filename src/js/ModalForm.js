export default class ModalForm {
  constructor(container) {
    this.container = container;
    this.submitListener = [];
  }

  bindToDOM() {
    this.container.insertAdjacentHTML('afterbegin', this.render());
    this.modalElement = this.container.querySelector('.modal__form');
    this.formElement = this.modalElement.querySelector('form');
    this.formElement.addEventListener('submit', (event) => this.submit(event));
    this.formElement.addEventListener('reset', () => this.close());
  }

  render() {
    return `
      <div class='modal__form'>
        <div class='modal__background'></div>
        <div class='modal__content'>
          <div class='modal__header'></div>
          <div class='modal__body'>
            <form class='modal__form' name='modal-form'>
              <div class='form__group'>
               <label class='form__label' for='username-field'>Username</label>
                <input class='form__input' id='username-field' name='name' placeholder='Please enter your name...'>
                 <div class='form__hint hidden'></div>
              </div>
              <div class='modal__footer'>
                <button type='reset' class='modal__close'>Close</button>
                <button type='submit' class='modal__ok'>Ok</button>
              </div>
            </form>
          </div>          
        </div>
      </div>
    `;
  }

  submit(event) {
    event.preventDefault();
    const { formElement } = this;
    if (formElement.elements.name.value === '') {
      return;
    }
    const data = {
      name: formElement.elements.name.value,
    };
    this.modalElement.querySelector('.modal__header').textContent = '';
    this.onSubmit(data);
  }

  close() {
    this.clearForm();
    this.modalElement.classList.remove('active');
  }

  showModal() {
    this.hideHint();
    this.modalElement.classList.add('active');
  }

  showHint(message) {
    const hintElement = this.formElement.querySelector('.form__hint');
    hintElement.textContent = message;
    hintElement.classList.remove('hidden');
  }

  hideHint() {
    const hintElement = this.formElement.querySelector('.form__hint');
    hintElement.textContent = '';
    hintElement.classList.add('hidden');
  }

  clearForm() {
    const { formElement } = this;
    formElement.elements.name.value = '';
  }

  addSubmitListener(callback) {
    this.submitListener.push(callback);
  }

  onSubmit(data) {
    this.submitListener.forEach((o) => o.call(null, data));
  }
}
