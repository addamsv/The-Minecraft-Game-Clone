import MainModelInterface from '../../models/mainModelInterface';

class MainMenu {
  mainMenuScreen: HTMLDivElement;

  playBtn: HTMLButtonElement;

  settingsBtn: HTMLButtonElement;

  quitBtn: HTMLButtonElement;

  input: HTMLInputElement;

  /* password temporary */
  password: HTMLInputElement;

  inputBtn: HTMLButtonElement;

  model: MainModelInterface;

  constructor(model: MainModelInterface) {
    this.model = model;
    this.model.auth('serega', '123');

    this.mainMenuScreen = document.createElement('div');
    const btnsWrapper = document.createElement('div');
    const inputWrapper = document.createElement('div');
    this.input = document.createElement('input');
    /* password temporary */
    this.password = document.createElement('input');
    this.inputBtn = document.createElement('button');
    this.playBtn = document.createElement('button');
    this.settingsBtn = document.createElement('button');
    this.quitBtn = document.createElement('button');

    this.input.placeholder = 'Input your name here';
    /* password temporary */
    this.password.placeholder = 'Password Here';

    this.inputBtn.textContent = 'Sent';
    this.playBtn.textContent = 'Play game';
    this.settingsBtn.textContent = 'Settings';
    this.quitBtn.textContent = 'Quit game';

    this.mainMenuScreen.classList.add('main-menu-screen');
    btnsWrapper.classList.add('btns-wrapper');
    inputWrapper.classList.add('input-wrapper');
    this.input.classList.add('input');
    /* password password temporary */
    this.password.classList.add('input');
    this.inputBtn.classList.add('input-btn');
    this.playBtn.classList.add('main-menu-btn', 'play-btn');
    this.settingsBtn.classList.add('main-menu-btn', 'settings-btn');
    this.quitBtn.classList.add('main-menu-btn', 'quit-btn');
    inputWrapper.append(this.input, this.inputBtn);
    /* password temporary */
    btnsWrapper.append(this.password);
    btnsWrapper.append(inputWrapper, this.playBtn, this.settingsBtn, this.quitBtn);
    this.mainMenuScreen.appendChild(btnsWrapper);
    document.body.appendChild(this.mainMenuScreen);

    /*
    * password Temporary!
    */
    this.chatTemporary();
  }

  /*
  * password Temporary!
  */
  chatTemporary() {
    this.mainMenuScreen.innerHTML += `
    <style type="text/css">
      #chat-container {
          width: 290px;
          position: absolute;
          bottom: 5px;
          right: 45px;
          background: #efefff44;
          padding: 0px 0px 5px 0px; 
          border-radius: 5px 5px 5px 5px;
          -moz-border-radius: 4px 4px 4px 4px;
          -webkit-border-radius: 4px 4px 4px 4px;
          box-shadow: 0px 16px 16px #0005;
      }

      input#sock-msg {
          width: 94%;
          padding: 19px 19px;
          margin:  14px 14px;
          font-size: 1em;
      }

      textarea#sock-msg {
          outline: none;
          resize: none;
          width: 84%;
          height: 40px;
          padding: 15px 15px;
          margin: 5px 8px;
          border: 1px solid #CCCCCC;
          border-radius: 3px;
          font-family: Arial, sans-serif;
          font-size: 13px;
          font-style: normal;
          font-variant: normal;
          color: #556D;
          line-height: 14px;
      }

      #scroll-container {
          height: 350px;
          max-height: 350px;
          overflow-y: auto;
      }

      #sock-container { 

          display: table;
          resize: none;
          width: 100%;
          background: #aaa1;
          height: 350px;
          max-height: 350px;
          overflow-y: auto;
      }

      #sock-info {
          display: table-cell;
          vertical-align: bottom;
          border: 0px solid #CCCCCC;
          border-right-color: #CCCCCC;
          border-bottom-color: #CCCCCC;
          background: #fff;
          width: 100%;
      }

      #scroll-container {
          height: 350px;
          max-height: 350px;
          overflow-y: auto;
      }

      #scroll-container {
          scrollbar-face-color: #367CD2;
          scrollbar-shadow-color: #FFFFFF;
          scrollbar-highlight-color: #FFFFFF;
          scrollbar-3dlight-color: #FFFFFF;
          scrollbar-darkshadow-color: #FFFFFF;
          scrollbar-track-color: #FFFFFF;
          scrollbar-arrow-color: #FFFFFF;
      }

      #scroll-container::-webkit-scrollbar-thumb {
          background-color: #fff;
          outline: 0px solid #fff;
          border-radius: 10px;
          background: #eee; 
          -webkit-box-shadow: inset 0 0 0 rgba(0,0,0,0.5); 
      }

      #scroll-container::-webkit-scrollbar-track {
          -webkit-border-radius: 10px;
          border-radius: 10px;
      }

      #scroll-container::-webkit-scrollbar {
          width: 0.7em;
      }

      .someone-sock-info {
          font-family: tahoma;
          font-size: 0.8em;
          line-height: 1.5em;
          margin: 0.1em 6em 1.2em 1.1em;
          padding: 4px 10px 4px 16px;
          -moz-border-radius: 15px 15px 15px 0px;
          -moz-transition: background-color .2s ease-in-out;
          -webkit-border-radius: 15px 15px 15px 0px;
          -webkit-transition: background-color .2s ease-in-out;
          background: #fff;
          background-size: 6% 100%;
          border-radius: 15px 15px 15px 0px;
          box-shadow: 2px 2px 5px #0005;
          color: #888c;
          float: left;
          clear: left;
          font-weight: normal;
          transition: background-color .2s ease-in-out;
          max-width: 65%;
      }
      .user-sock-info {
          font-family: tahoma;
          font-size: 0.8em;
          line-height: 1.5em;
          margin: 0.1em 1em 1.2em 6em;
          padding: 4px 10px 4px 16px;
          -moz-border-radius: 15px 15px 0px 15px;
          -moz-transition: background-color .2s ease-in-out;
          -webkit-border-radius: 15px 15px 0px 15px;
          -webkit-transition: background-color .2s ease-in-out;
          background: #eee8;
          background-size: 6% 100%;
          border-radius: 15px 15px 0px 15px;
          box-shadow: 2px 2px 5px #0005;
          color: #888c;
          float: right;
          clear: right;
          font-weight: normal;
          transition: background-color .2s ease-in-out;
          max-width: 65%;
      }
      .messInfo {
          font-size: 0.3em;
      }
      .info {
          font-family: tahoma;
          font-size: 0.8em;
          color: red;
          margin: 0.1em 4em 0.1em 4em;
          padding: 12px 10px 12px 16px;
          float: left;
          clear: left;
          vertical-align: bottom;
          background: #fff;
          height: 15px;
          width: 70%;
      }
    </style>
    <div id='chat-container'>
      <div id='scroll-container'>
          <div id="sock-container">
              <div id="sock-info"></div>
          </div> 
      </div>
      <textarea id='sock-msg' placeholder="Please Enter Your Message"></textarea>
    </div>

  }
}

export default MainMenu;
