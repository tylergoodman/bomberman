(function () {
	var Bomberman = {};

@@include('main/*.js')


	$('window').on('unload', function () {
		// if (app.me.peer && !app.me.peer.destroyed)
		// 	app.me.peer.destroy();
	});

	window.Bomberman = Bomberman;
})();