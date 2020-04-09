import config from '../../../config';

export default function () {
  describe('transaction', function () {
    this.timeout(config.timeout);

    before(function (done) {
      done();
    });
    afterEach(function (done) {
      done();
    });
  });
};