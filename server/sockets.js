// Module dependencies.
var Auth = require('./auth').getInstance(),
		Helper = require('./helpers'),
		Notification = require('./notification'),
		Session = require('./session'),
		Model = Model || Object;


var Socket = (function() {

	// Private attribute that holds the single instance
	var socketInstance;

	function constructor(io) {

	var passportUserId = '',
			currentBusinessId = '';

	var packet = {
		incoming: {
			init: function(data, callback) {
				var sid = data.sid.replace('s:','').split('.')[0];
				passportUserId = JSON.parse(Session.store.sessions[sid]).passport.user;

				if(passportUserId && passportUserId != '') {
	 				Helper.getUser(passportUserId, function(err, user) {
	 					if (err || !user) callback(false, null, '');
	 					callback(true, passportUserId, user.id, user.Business, user.meta.Business.current.id);
					});
				} else {
					callback(false, null, '');
				}				
			},
			user: {
				setUid: function(data, callback) {
					if(passportUserId) {				
		 				Helper.getUser(passportUserId, function(err, user) {
		 					if (err || !user) callback({success: false, error: err});
		 					user.id = data.uid;
		 					
		 					user.save(function(err){
		 						if(err) callback({success: false, error: err});
		 						callback(null);
		 					});
						});
					} else {
						callback({success: false, error: 'Not logged in'})
					}				
				},
			},

			business: {
				setBid: function(data, callback) {
					if(passportUserId) {				
		 				Helper.getUser(passportUserId, function(err, user) {
		 					if (err || !user) callback({success: false, error: err});
		 					user.Business[data.index].id = data.bid;
		 					
		 					user.save(function(err){
		 						if(err) callback({success: false, error: err});
		 						callback(null);
		 					});
						});
					} else {
						callback({success: false, error: 'Not logged in'})
					}				
				},
				select: function(data, callback) {
					if(passportUserId) {				
		 				Helper.getUser(passportUserId, function(err, user) {
		 					for(var i=0,l=user.Business.length; i<l; i++) {
		 						if(user.Business[i]._id == data.id) {
		 							user.meta.Business.current = {
		 								id: user.Business[i]._id,
										bid: user.Business[i].id,
										index: i
		 							}
		 							callback(null, {success: true, data: {bid: user.Business[i].id}})
		 							break;
		 						}
		 					}
		 				})
		 			} else {
						callback({success: false, error: 'Not logged in'})
					}	
				},
				create: function(data, callback) {
					if(passportUserId && data.bid) {
						Helper.getUser(passportUserId, function(err, user) {
							if(err || !user) callback({success: false, error: err || 'no user found!'});
							
							var timestamp = Helper.timestamp(true) + Helper.randomInt(10000, 99999),
	 								newBusiness = {
	 									id: data.bid,
			 							name: data.name,
			 							Analytics: {id: timestamp}
			 						},
			 						newAnalytics = new Model.Analytics({
										id: timestamp,
										name: data.name
									});
	 						
	 						user.Business.push(newBusiness);

	 						user.save(function(err, response){
	 							if(err) callback({success: false, error: err});
								newAnalytics.save(function(err){
									if (err) callback({success: false, error: err});
									callback(null, {success: true});
								});
	 						});
	 					});
					} else {
						callback({success: false, error: 'Not logged in'})
					}
				}
			}
		},

		outgoing: {

		}
	}

	io.sockets.on('connection', function (socket) {
		// init is called on initial page load 
		// it checks to see if user is logged in
		// and then returns the uid for firebase
		socket.on('init', function(data, callback) {
			packet.incoming.init(data, callback);
		});

		socket.on('setUid', function(data, callback) {
			packet.incoming.user.setUid(data, callback);
		});

		socket.on('setBid', function(data, callback) {
			packet.incoming.business.setBid(data, callback);
		});

		socket.on('createBusiness', function(data, callback) {
			packet.incoming.business.create(data, callback);
		});

		socket.on('setBusiness', function(data, callback) {
			packet.incoming.business.select(data, callback);
		});

		//setTimeout(function() {
			socket.on('getModules', function(data, callback) {
console.log(data);
				if(callback) {			
					/*callback({ 
						alerts: 'world2',
						facebook: {
							count: 10,
							messages: [{
								headline: 'New user comment on a Facebook post',
								link: '/social/facebook/notifications'
							}]
						},
						twitter: {
							count: 20,
							messages: [{
								headline: 'New mentions via Twitter',
								link: '/social/twitter/notifications'
							}]
						}

					});*/
					callback({
						modules: [
							{
								id: 'facebook',
								title: 'tip',
								type: 'text', // 'graph', 'text'
								menu: false,
								closeable: true,
								data: {
									viewport: []
								}
							},

							{
								id: 'facebook',
								title: 'notifications',
								type: 'list', // 'graph', 'text'
								icon: 'globe',
								menu: [],
								data: {
									viewport: [],
									help: ''
								}
							},

							{
								id: 'facebook',
								title: 'quick stats',
								class: 'statistics',
								type: 'list', // 'graph', 'text'
								menu: [],
								data: {
									viewport: [],
									help: ''
								}
							},

							{
								id: 'facebook',
								title: 'wall posts',
								class: 'posts', 
								type: 'graph', // 'graph', 'text'
								menu: { 
									custom: [
										{
											label: 'display column view', 
											icon: 'bar-chart',
											action: 'changeDisplay(column)', // 'dashboard', 'hide', 'help', 'resize', 'timeframe'
											current: null, // 'onDashboard', 'offDashboard', 'large', 'small', '30day', '60day'
											meta: null,
											divider: true
										}
									],
									timeframe: ['15 days', '30 days', '90 days']
								},
								data: {
									viewport: []
								}
							},
						]
					});
				}
			});
		//}, 5000);
  	//socket.on('my other event', function (data) {
			//console.log(data);
		//});


		socket.emit('name', {data: 'testing'});
	});

		// public members
		return {
			// public getter functions
			load: function(type) {
				return strategy[type]();
			},

		} // end return object
	} // end constructor

	return {
		getInstance: function(io) {
			if(!socketInstance)
				socketInstance = constructor(io);
			return socketInstance;
		}
	}

})();

module.exports = Socket;