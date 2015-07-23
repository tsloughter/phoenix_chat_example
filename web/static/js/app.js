import {Socket} from "phoenix"

class App {

  static init(){
    let socket = new Socket("/ws", {
      logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
    })
    socket.connect()
    var $status    = $("#status")
    var $messages  = $("#messages")
    var $input     = $("#message-input")
    var $username  = $("#username")

    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.chan("rooms:lobby", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    $input.off("keypress").on("keypress", e => {
      if (e.keyCode == 13) {
        chan.push("new:msg", {user: $username.val(), body: $input.val()})
        $input.val("")
      }
    })

      chan.on("new:msg", msg => {
          $messages.append(this.messageTemplate(msg))
          $messages.listview('refresh');

          // Scroll to bottom of page
          $("#messages-wrapper").animate({ scrollTop: $("#messages-wrapper").scrollHeight }, 'slow');
    })

    chan.on("user:entered", msg => {
      var username = this.sanitize(msg.user || "anonymous")
      $messages.append(`<br/><i>[${username} entered]</i>`)
    })
  }

  static sanitize(html){ return $("<div/>").text(html).html() }

  static messageTemplate(msg){
    let username = this.sanitize(msg.user || "anonymous")
    let body     = this.sanitize(msg.body)

    return(`<li><span class='username'>[${username}]</span>&nbsp; ${body}</li>`)
  }

}

$( () => App.init() )

export default App
