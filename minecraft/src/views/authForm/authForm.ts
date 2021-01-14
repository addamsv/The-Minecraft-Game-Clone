class AuthForm {
  authScreen: HTMLDivElement;

  login: HTMLInputElement;

  password: HTMLInputElement;

  sendBtn: HTMLButtonElement;

  constructor() {
    this.authScreen = document.createElement('div');
    const authWrapper = document.createElement('div');
    const inputs = document.createElement('div');
    this.login = document.createElement('input');
    this.password = document.createElement('input');
    this.sendBtn = document.createElement('button');

    this.authScreen.classList.add('auth-screen', 'hide');
    authWrapper.classList.add('auth-wrapper');
    inputs.classList.add('inputs');
    this.login.classList.add('login-input');
    this.password.classList.add('password-input');
    this.sendBtn.classList.add('send-btn');

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
