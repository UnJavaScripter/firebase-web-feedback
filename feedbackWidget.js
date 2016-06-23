class FeedbackWidget {

  constructor(firebaseInstance, userName) {

    // Component
    let widget = document.createElement("div");
    widget.innerHTML = `
      <style type="text/css">
        .fw--container {
          position: fixed;
          right: 0;
          bottom: 0;
          z-index: 1;
          text-align: right;
        }
        .fw--text-area-container {
          background: #2980b9;
          border-radius: 3px;
          box-shadow: 0px 0px 5px 0px #3498db;
          margin-bottom: 0.5em;
          margin-right: 0.5em;
          z-index: 1;
          will-change: transform;
          opacity: 0;
          transform: translateX(105%);
        }


        /* Animation */
        .fw--animatable.fw--text-area-container {
          transition: opacity 0.3s cubic-bezier(0,0,0.3,1), transform 0.5s cubic-bezier(0,0,0.3,1); 
        }

        .fw--visible.fw--animatable.fw--text-area-container {
          transition: opacity 0.5s cubic-bezier(0,0,0.3,1), transform 0.3s cubic-bezier(0,0,0.3,1); 
        }

        .fw--visible {
          transform: translateX(0%);
          opacity: 1;
        }

        /* /Animation */

        .fw--text-area {
          margin-top: 0.7em;
          margin-right: 0.5em;
          margin-bottom: 0.5em;
          margin-left: 0.5em;
          resize: none;
          font-size: 1.2em;
        }

        button[class^="fw--button-"] {
          max-height: 2em;
          max-width: 2em; 
          height: 2em;
          width: 2em; 
          border: none;
          font-size: 1em;
          padding-top: 0.5em;
          padding-right: 0.7em;
          padding-bottom: 0.5em;
          padding-left: 0.7em;
          border-radius: 50%;
          margin-right: 1em;
          margin-bottom: 1em;
        }

        .fw--button-close {
          background: #c0392b;
          color: white;
        }

        .fw--button-send {
          background: #44a8fb;
          color: white;
        }

        .fw--button-open {
          background: #3498db;
          color: white;
          font-size: 1.6em!important;
        }

        .fw--button-open:hover {
          cursor: pointer;
        }

      </style>
      <div class="fw--container">
        <div class="fw--text-area-container">
          <textarea class="fw--text-area" placeholder="Cuéntanos tu experiencia" rows="5" cols="25"></textarea>
          <div>
            <button class="fw--button-close" onClick="fw.close()" title="Cancelar">X</button>
            <button class="fw--button-send" onClick="fw.send()" title="Enviar">></button>
          </div>
        </div>
        
        <button class="fw--button-open" onClick="fw.open()" title="Comentarios">?</button>
      </div>
    `;

    document.body.appendChild(widget);
    

    this.firebaseInstance = firebaseInstance;
    this.userName = userName || `guest_${Math.ceil(Math.random()*1000)}`;

    this.fwOpened = false;
    this.textSection = document.querySelector(".fw--text-area-container");
    this.textField = document.querySelector(".fw--text-area");
    this.submitButton = document.querySelector(".fw--button-open");
    
    this.textSection_initial = this.textSection.getBoundingClientRect();

    this.onTransitionEnd = this.onTransitionEnd.bind(this);

    this.firebaseAuth();

  }
  
  firebaseAuth() {
    if(firebase){
      
      firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          console.log('signin');
          // ...
        } else {
          console.log('signout');
          // User is signed out.
          // ...
        }
        // ...
      });

    }
  }



  onTransitionEnd (evt) {

    this.textSection.classList.remove('fw--animatable');
    
    //this.textSection.style.transform = 'none';

    if(this.textSection.classList.contains('fw--expanded-text-container_enter')){
      this.textField.focus();
    }

    this.textSection.removeEventListener('transitionend', this.onTransitionEnd);
  }
  
  open () {
    this.textSection.classList.add('fw--visible');
    this.textSection.classList.add('fw--animatable');
    this.textSection.addEventListener('transitionend', this.onTransitionEnd);
  }

  close () {
    this.textSection.classList.remove('fw--visible');
    this.textSection.classList.add('fw--animatable');
    this.textSection.addEventListener('transitionend', this.onTransitionEnd);
  }

  send () {
    if(this.textField.value){

      let feedbackObj = {
        date: Date.now(),
        message: this.textField.value,
        page: window.location.href
      };

      this.firebaseInstance.database().ref(this.userName).push(feedbackObj);

      this.textField.value = '';
      this.close();
    }else{
      this.textField.placeholder = 'Ingresa un comentario';
      this.textField.focus();
    }
  }

}