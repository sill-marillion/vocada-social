/**
 * Partials Controller
 */

var Helper = require('../server/helpers'),
		Model = Model || Object;

var PartialsController = {
	index: {
 		//restricted: false,
 		get: function(req, res) {
 			res.render('partials/index');
 		}
 	},
 	data: {
 		get: function(req, res) {
 			res.render('partials/data');
 		}
 	},
 	module: {
 		get: function(req, res) {
 			res.render('partials/module');
 		}
 	},
 	viewport: {
 		get: function(req, res) {
 			res.render('partials/viewport');
 		}
 	},
 	menu: {
 		get: function(req, res) {
 			res.render('partials/menu');
 		}
 	},

 	// navigation partials
 	header: {
		path: '/partials/header',
		get: function(req, res) {
			res.render('partials/header');
		}
	},
	navigation: {
		path: '/partials/menus/navigation',
		get: function(req, res) {
			res.render('partials/menus/navigation');
		}
	},

	// module viewport partials
	facebook_notifications: {
		path: '/partials/modules/facebook/notifications/index',
		get: function(req, res) {
			res.render('partials/modules/facebook/notifications/index');
		}
	},

 	// help viewport partials
 	facebook_notifications_help: {
 		path: '/partials/modules/facebook/notifications/help',
 		get: function(req, res) {
 			res.render('partials/modules/facebook/notifications/help');
 		}
 	},
 	facebook_likes_help: {
 		path: '/partials/modules/facebook/notifications/management',
 		get: function(req, res) {
 			res.render('partials/modules/facebook/notifications/management');
 		}
 	},

 	// options viewport partials
 	facebook_notifications_management: {
 		path: '/partials/modules/facebook/notifications/management',
 		get: function(req, res) {
 			res.render('partials/modules/facebook/notifications/management');
 		}
 	},
}

module.exports = PartialsController;