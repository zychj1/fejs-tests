var should = require('chai').should(),
    assert = require('assert'),
    collection = require('../collection'),
    create = collection.create,
    every = collection.every,
    none = collection.none,
    unique = collection.unique,
    add = collection.add,
    map = collection.map;


describe('collection', function() {
    describe('#create', function() {
        var createTest;
        beforeEach(function() {
            createTest = function(index) {
                return index + 5;
            };
        });

        it('should return array with correct elements', function() {
            assert.deepEqual(create(5, createTest), [5, 6, 7, 8, 9]);
            assert.deepEqual(create(0, createTest), []);
        });

        it('should throw error if wrong values are passed', function() {
            (function() {
                create('not a number', createTest);
            }).should.throw();

            (function() {
                create(-1, createTest);
            }).should.throw();

            (function() {
                create(5);
            }).should.throw();
        });
    });

    describe('#map', function() {
        var mapTest, mapTestContext, arr;
        beforeEach(function() {
            mapTest = function(value) {
                return value * 2;
            };
            mapTestContext = {
                number: 3,
                mapTest: function(value) {
                    return value * this.number;
                }
            };
            arr = [1, 2, 3, 4, 5];
        });

        it('should return array with correct elements', function() {
            assert.deepEqual(map(arr, mapTest), [2, 4, 6, 8, 10]);
        });

        it('should launch iteratee with correct context', function() {
            assert.deepEqual(map(arr, mapTestContext.mapTest, mapTestContext), [3, 6, 9, 12, 15]);
            assert.notDeepEqual(map(arr, mapTestContext.mapTest), [3, 6, 9, 12, 15]);
        });
    });

    describe('#every', function() {
        var everyTest;

        beforeEach(function() {
            everyTest = function(value) {
                return value > 0;
            };
        });

        it('should return true if all values are greater than 0', function() {
            every([1, 2, 3], everyTest).should.equal(true);
        });

        it('should return false if all values are greater than 0', function() {
            every([-1, 2, 3], everyTest).should.equal(false);
        });
    });

    describe('#none', function() {
        var noneTest;

        beforeEach(function() {
            noneTest = function(lang) {
                return lang === 'JS';
            };
        });

        it('should return true if none of the values is equal to JS', function() {
            none(['php', 'Java', 'Kobol', 'C#'], noneTest).should.equal(true);
        });

        it('should return false if one of the values is equal to JS', function() {
            none(['JS', 'PHP', 'C++'], noneTest).should.equal(false);
        });
    });

    describe('#unique', function() {
        var uniqueTest, uniqueTestContext, arr;

        beforeEach(function() {
            arr = [1, 2, 2.5, 4, 4, 5, 5, 1.1];
            uniqueTest = function(value) {
                return Math.floor(value);
            };
            uniqueTestContext = {
                number: 1,
                uniqueTest: function(value) {
                    return Math.floor(value) + this.number;
                }
            };
        });

        it('should return array with correct elements', function() {
            assert.deepEqual(unique(arr, uniqueTest), [1, 2, 4, 5]);
        });

        it('should launch iteratee with correct context', function() {
            assert.deepEqual(unique(arr, uniqueTestContext.uniqueTest, uniqueTestContext), [2, 3, 5, 6]);
        });

    });

    describe('#add', function() {
        var arr;

        beforeEach(function() {
            arr = ['Metallica', 'Queen', 'Nirvana'];
        });

        it('should create new array without changing old one', function() {
            var result = ['Metallica', 'Queen', 'Nirvana', 'Black Sabbath', 'Slayer', 'Iron Maiden']
            assert.deepEqual(add(arr, 'Black Sabbath', 'Slayer', 'Iron Maiden'), result);
            assert.deepEqual(arr, ['Metallica', 'Queen', 'Nirvana']);
        });


    });
});

