const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

const api = request(process.env.BASE_URL);
const bookingData = require('./data/bookingdata.json');

let token;
let bookingId;

const Header = {
  accept: 'application/json',
  'Content-Type': 'application/json',
};

describe('E2E Booking API Testing', function () {
  this.timeout(10000);

  it('Create Token', async () => {
    const res = await api
      .post('/auth')
      .send({
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');

    token = res.body.token;
    console.log('Token created:', token);
  });

  it('Create Booking', async () => {
    const res = await api
      .post('/booking')
      .set(Header)
      .send(bookingData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('bookingid');

    bookingId = res.body.bookingid; 
    console.log('Booking created:', bookingId);
  });

  it('Should retrieve created booking', async () => {
    const res = await api
      .get(`/booking/${bookingId}`)
      .set(Header);

    expect(res.status).to.equal(200);
    expect(res.body).to.include({
      firstname: bookingData.firstname,
      lastname: bookingData.lastname,
    });

    console.log('Booking retrieved:', res.body);
  });

  it('Delete Booking', async () => {
    const res = await api
      .delete(`/booking/${bookingId}`)
      .set('Cookie', `token=${token}`);

    expect(res.status).to.equal(201);
    console.log('Booking deleted:', bookingId);
  });
});
