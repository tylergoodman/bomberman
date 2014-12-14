(function () {

@@include('modules/Chat.js')
@@include('modules/Lobby.js')
@@include('modules/Logger.js')
@@include('modules/Me.js')
@@include('modules/Network.js')
@@include('modules/Game.js')


	$(window).on('unload', function () {
		if (!Me.peer.destroyed)
			Me.peer.destroy();
	});

})();