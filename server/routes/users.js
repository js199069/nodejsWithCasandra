var cassandra = require('cassandra-driver');

const client = new cassandra.Client({
	contactPoints: [process.env.CASSANDRA_IP || 'cassandra'],
	localDataCenter: process.env.DATA_CENTRE,
  });
client.connect(function(err, result){
	console.log('users: cassandra connected');
});


/*
 * GET users listing.
 */
exports.list = function(req, res){

	console.log('users: list');
	client.execute('SELECT * FROM people.subscribers',[], function(err, result){
		if(err){
			console.log('users: list err:', err);
			res.status(404).send({msg: err});
		} else {
			console.log('users: list success:', result.rows);
			res.render('users', {page_title:"Users", data: result.rows})
		}
	});

};

exports.add = function(req, res){
  res.render('add_user',{page_title:"Add Users"});
};

exports.edit = function(req, res){

    var id = req.params.id;


	console.log('users: edit');

	client.execute("SELECT * from people.subscribers WHERE id = " + id + " ALLOW FILTERING",[], function(err, result){
		if(err){
			console.log('users: edit err:', err);
			res.status(404).send({msg: err});
		} else {
			console.log('users: edit success:');
			res.render('edit_user',{page_title:"Edit Users", data: result.rows});
		}
	});

};

/*Save the user*/
exports.save = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));

	console.log('users: save');

	client.execute("INSERT INTO people.subscribers (id, name, address, email, phone) VALUES (now(), '" + input.name + "', '" + input.address + "', '" + input.email + "', '" + input.phone + "')",[], function(err, result){
		if(err){
			console.log('users: add err:', err);
			res.status(404).send({msg: err});
		} else {
			console.log('users: add success:');
			res.redirect('/users');
		}
	});
};

exports.save_edit = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;


	console.log('users: save_edit');

	client.execute("UPDATE people.subscribers set name = '" + input.name + "', address = '" + input.address + "', email = '" + input.email + "', phone = '" + input.phone + "' WHERE id = " + id,[], function(err, result){
		if(err){
			console.log('users: save_edit err:', err);
			res.status(404).send({msg: err});
		} else {
			console.log('users: save_edit success:');
			res.redirect('/users');
		}
	});

};


exports.delete_user = function(req,res){

    var id = req.params.id;

	console.log('users: delete');

	client.execute("DELETE FROM people.subscribers WHERE id = " + id,[], function(err, result){
		if(err){
			console.log('users: delete err:', err);
			res.status(404).send({msg: err});
		} else {
			console.log('users: delete success:');
			res.redirect('/users');
		}
	});

};


