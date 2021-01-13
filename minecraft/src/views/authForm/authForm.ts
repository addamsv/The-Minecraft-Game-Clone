class AuthForm {
  authScreen: HTMLDivElement;

  login: HTMLInputElement;

  password: HTMLInputElement;

  sendBtn: HTMLButtonElement;

  constructor() {
    this.authScreen = document.createElement('div');
    const inputs = document.createElement('div');
    this.login = document.createElement('input');
    this.password = document.createElement('input');
    this.sendBtn = document.createElement('button');

    this.authScreen.classList.add('auth-screen', 'hide');
    inputs.classList.add('inputs');

    this.sendBtn.textContent = 'Sign Up';
    this.login.placeholder = 'Login';
    this.password.placeholder = 'Password';

    inputs.append(this.login, this.password);
    this.authScreen.append(inputs, this.sendBtn);
    document.body.appendChild(this.authScreen);
  }

  toggle() {
    this.authScreen.classList.toggle('hide');
  }
}

export default AuthForm;
