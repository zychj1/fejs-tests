var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    assert = require('assert'),
    spies = require('chai-spies'),
    functions = require('../function'),
    partial = functions.partial,
    memoize = functions.memoize,
    perfectMemoize = functions.perfectMemoize,
    compose = functions.compose;

chai.use(spies);

describe('#partial', function () {
    var partialTest;
    beforeEach(function () {
        partialTest = function (a, b, c, d) {
            return a + b + c + d
        };
    });

    it('should return result of passed function if all arguments where passed', function () {
        var add = partial(partialTest),
            temp1 = add(1, 2),
            temp2 = temp1(3),
            res = temp2(9);

        assert.equal(add(1)(2, 3)(4), 10);
        assert.equal(add(1)(3)(4)(2), 10);
        assert.equal(res, 15);
    });

    it('should return function if not all parameters where passed', function () {
        var add = partial(partialTest),
            temp1 = add(1, 2),
            temp2 = temp1(3);

        assert.equal(typeof add(1)(2, 3), 'function');
        assert.equal(typeof temp2, 'function');
    });
});

describe('#compose', function () {
    var composeTest, composeTest2, composeTest3;
    beforeEach(function () {
        composeTest = function (x) {
            return x + 2
        };

        composeTest2 = function (x) {
            return x * x
        };

        composeTest3 = function (x) {
            return x + 1;
        };
    });

    it('should launch functions from right to left', function () {
        var tmp = compose(composeTest, composeTest2, composeTest3),
            tmp2 = compose(composeTest2, composeTest, composeTest3);
        assert.equal(tmp(2), 11);
        assert.equal(tmp(1), 6);

        assert.equal(tmp2(1), 16);
        assert.equal(tmp2(2), 25);
    });
});

describe('#memoize', function () {
    var memoizeTest, memoizeTest2;
    beforeEach(function () {
        memoizeTest = function (x) {
            return x + 1;
        };

        memoizeTest2 = function (obj, x) {
            return obj.x + x;
        };
    });

    it('should call memoizeTest functions once for each unique parameter', function () {
        var spy = chai.spy(memoizeTest),
            spy2 = chai.spy(memoizeTest2),
            tmp = memoize(spy),
            tmp2 = memoize(spy2);

        assert.equal(tmp(2), 3);
        assert.equal(tmp(2), 3);
        expect(spy).to.have.been.called.once;

        assert.equal(tmp2({
            x: 1
        }, 3), 4);

        assert.equal(tmp2({
            x: 1
        }, 3), 4);
        expect(spy2).to.have.been.called.once;
    });

    it('should call memoizeTest functions one time for each unique parameter', function () {
        var spy = chai.spy(memoizeTest),
            spy2 = chai.spy(memoizeTest2),
            tmp = memoize(spy),
            tmp2 = memoize(spy2);

        assert.equal(tmp(2), 3);
        expect(spy).to.have.been.called.once;

        assert.equal(tmp(3), 4);
        expect(spy).to.have.been.called.twice;

        assert.equal(tmp2({
            x: 1
        }, 3), 4);

        assert.equal(tmp2({
            x: 2
        }, 3), 5);
        expect(spy2).to.have.been.called.twice;
    });

});

describe('#perfectMemoize', function () {
    var memoizeTest, memoizeTest2, memoizeTest3;
    beforeEach(function () {
        memoizeTest = function (x) {
            return x + 1;
        };

        memoizeTest2 = function (obj, x) {
            return obj.x + x;
        };

        memoizeTest3 = function (obj, obj2) {
            return obj.x + obj2.x;
        };
    });

    it('should call memoizeTest functions once for each unique parameter', function () {
        var testObject = {
                x: 1
            },
            spy = chai.spy(memoizeTest),
            spy2 = chai.spy(memoizeTest2),
            tmp = perfectMemoize(spy),
            tmp2 = perfectMemoize(spy2);

        assert.equal(tmp(2), 3);
        assert.equal(tmp(2), 3);
        expect(spy).to.have.been.called.once;

        assert.equal(tmp2(testObject, 3), 4);

        assert.equal(tmp2(testObject, 3), 4);
        expect(spy2).to.have.been.called.once;
    });

    it('should call memoizeTest functions one time for each unique parameter', function () {
        var spy = chai.spy(memoizeTest),
            spy2 = chai.spy(memoizeTest2),
            tmp = perfectMemoize(spy),
            tmp2 = perfectMemoize(spy2);

        assert.equal(tmp(2), 3);
        expect(spy).to.have.been.called.once;

        assert.equal(tmp(3), 4);
        expect(spy).to.have.been.called.twice;

        assert.equal(tmp2({
            x: 1
        }, 3), 4);

        assert.equal(tmp2({
            x: 2
        }, 3), 5);
        expect(spy2).to.have.been.called.twice;
    });

    it('should call memoizeTest functions one time for each unique reference', function () {
        var testObject = {
                x: 1
            },
            testObject2 = {
                x: 1
            },
            spy = chai.spy(memoizeTest2),
            spy2 = chai.spy(memoizeTest3),
            tmp = perfectMemoize(spy),
            tmp2 = perfectMemoize(spy2);

        assert.equal(tmp(testObject, 2), 3);
        expect(spy).to.have.been.called.once;

        assert.equal(tmp(testObject, 2), 3);
        expect(spy).to.have.been.called.once;

        // different object with same structure
        assert.equal(tmp(testObject2, 2), 3);
        expect(spy).to.have.been.called.twice;

        // same objects different order
        assert.equal(tmp2(testObject, testObject2), 2);
        expect(spy2).to.have.been.called.once;
        assert.equal(tmp2(testObject2, testObject), 2);
        expect(spy2).to.have.been.called.twice;
        assert.equal(tmp2(testObject, testObject2), 2);
        expect(spy2).to.have.been.called.twice;

    });

});



