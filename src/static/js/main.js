(function () {
	var Bomberman = {};

@@include('./main/Chat.js')
@@include('./main/Lobby.js')
@@include('./main/Logger.js')
@@include('./main/Me.js')
@@include('./main/Network.js')


	// $('window').on('unload', function () {
	// 	if (app.me.peer && !app.me.peer.destroyed)
	// 		app.me.peer.destroy();
	// });

	window.Bomberman = Bomberman;
})();