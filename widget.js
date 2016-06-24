class FirebaseUser {
  constructor(firebaseInstance, userName) {
    this.firebaseInstance = firebaseInstance;
    this.userName = userName;

    let widget = document.createElement("div");
    widget.innerHTML = `
    <form>
      <textarea id="area"></textarea>
      <button id="botoncito" type="button">Enviar</button>
    </form>
    `;

    document.body.appendChild(widget);

    

    let boton = document.getElementById('botoncito');

    this.send = this.send.bind(this);

    boton.addEventListener('click', this.send);

  }

  send(){
    let message = document.getElementById('area').value;

    let feedbackObj = {
      "user": this.userName,
      "date": Date.now(),
      "message": message
    };

    console.log(this);
    this.firebaseInstance.database().ref(this.userName).set(feedbackObj);

  }
}

