// Mongoose and mocking requests
const sinon = require('sinon');

const mongoose = require('mongoose')
mongoose.set('debug', true)
require('sinon-mongoose')

// initialize the app and models
const app = require('../../index.js')

// sending requests
const agent = require('supertest').agent(app);
// validating results
const expect = require('chai').expect;

// get the model
const Listing = mongoose.model('Listing')

var Mock = sinon.mock(Listing)

beforeEach(() => {
	Mock.restore(); // Unwraps the spy
	Mock = sinon.mock(Listing)
});

afterEach(() => {
	Mock.verify();
});

describe('Listing Integration tests', () => {
	const request = {
		"type": "villa",
		"address": {
			"street": "Justastreet",
			"streetNumber": "18",
			"municipality": "Justakommun",
			"geo": {
				"lat": 12.55555,
				"long": 55.12121
			},
		},
		"price": 2200000,
		"monthlyFee": 5120,
		"activeBidding": false
	}

	const expected = {
		"type": "villa",
		"address": {
			"street": "Justastreet",
			"streetNumber": "18",
			"municipality": "Justakommun",
			"geo": {
				"lat": 12.55555,
				"long": 55.12121
			},
		},
		"_id": "5cecf112a66bc43a217dfda3",
		"price": 2200000,
		"monthlyFee": 5120,
		"activeBidding": false,
		"__v": 0,
	}

	describe('listings.get', ()  => {

		it('Should return an array of all listings', (done) => {
	
			// Given (preconditions)
			Mock
			.expects('find')
			.chain('exec')
			.resolves([expected]);
	
			// When (someting happens)
			agent
			.get('/listings')
			.end((err,res) => {
			// Then (something should happen)
				expect(res.status).to.equal(200);
				expect(res.body).to.eql([expected]);
				done();
			});
		});

		it('Should get a listing by type', (done) => {
			Mock
			.expects('find')
			.withArgs({"type": "villa"})
			.chain('exec')
			.resolves(expected);

			agent
			.get('/listings?type=villa')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				expect(res.body).to.eql(expected);
				done();
			});
		});
	});

	describe('listings.getById', () => {
		it('Should get an individuall listing', (done) => {
			Mock
			.expects('findById')
			.withArgs("5cecf112a66bc43a217dfda3")
			.chain('exec')
			.resolves(expected);

			agent
			.get('/listings/5cecf112a66bc43a217dfda3')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				expect(res.body).to.eql(expected);
				done();
			});
		});
	});

	describe('listings.post', () => {
		it('Should be able to create a listing', (done) => {
			Mock
			.expects('create')
			.withArgs(request)
			.chain('exec')
			.resolves(expected);

			agent
			.post('/listings/')
			.send(request)
			.end((err, res) => {
				expect(res.status).to.equal(201);
				expect(res.body).to.eql(expected);
				done()
			});
		});
	});

	describe('listings.put', () => {
		it('Should be able to create a listing', (done) => {
			Mock
			.expects('updateOne')
			.withArgs({ _id: "5cecf112a66bc43a217dfda3" }, request)
			.chain('exec')
			.resolves({ 
				n: 1,
				nModified: 0,
				upserted: [ { index: 0, _id: "5cecf112a66bc43a217dfda3" } ],
				ok: 1 
			});

			agent
			.put('/listings/5cecf112a66bc43a217dfda3')
			.send(request)
			.end((err, res) => {
				expect(res.status).to.equal(201);
				done();
			});
		});

		it('Should be able to update a listing', (done) => {
			Mock
			.expects('updateOne')
			.withArgs({ _id: "5cecf112a66bc43a217dfda3" }, request)
			.chain('exec')
			.resolves({
				n: 1,
				nModified: 1,
				ok: 1
			});

			agent
			.put('/listings/5cecf112a66bc43a217dfda3')
			.send(request)
			.end((err, res) => {
				expect(res.status).to.equal(200);
				done();
			});
		});

		it('Should return 204 when a listing is not updated', (done) => {
			Mock
			.expects('updateOne')
			.withArgs({ _id: "5cecf112a66bc43a217dfda3" }, request)
			.chain('exec')
			.resolves({
				n: 1,
				nModified: 0,
				ok: 1
			});

			agent
			.put('/listings/5cecf112a66bc43a217dfda3')
			.send(request)
			.end((err, res) => {
				expect(res.status).to.equal(204);
				done();
			});
		});
	});

	describe('listings.deleteListing', () => {
		it('Should be able to delete a listing', (done) => {
			Mock
			.expects('findByIdAndDelete')
			.withArgs("5cecf112a66bc43a217dfda3")
			.chain('exec')
			.resolves(expected);

			agent
			.delete('/listings/5cecf112a66bc43a217dfda3')
			.send(request)
			.end((err, res) => {
				expect(res.status).to.equal(200);
				done();
			});
		});
	});


});