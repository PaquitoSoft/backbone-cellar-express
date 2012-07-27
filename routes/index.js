var wines = require('../lib/data.js'),
	util = require('util');

/*
 * GET home page.
 */
exports.index = function(req, res){
	res.render('index', {
		title: 'Express',
		wines: JSON.stringify(wines.findAll())
	});
};



exports.getAll = function(req, res) {
	res.json(wines.findAll());
};
exports.searchWine = function(req, res) {
	res.json(wines.findByName(req.params.query));
};
exports.getWine = function(req, res) {
	res.json(wines.findById(req.params.id));
};
exports.createWine = function(req, res) {
	res.json(wines.create(req.body));
};
exports.updateWine = function(req, res) {
	wines[req.body.id - 1] = req.body;
	res.json(req.body);
};
exports.removeWine = function(req, res) {
	wines.remove(req.id);
	res.json({});
};