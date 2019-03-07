const Deque = require('../deque.js');
const assert = require('assert');

var deq = new Deque.Deque();

/**
 * Shorthand for saying that a test was passed
 * @param {Object} x The test number/label/whatever
 */
function passed(x){
    console.log(`Passed test "${x}"`);
}

deq.push(4);
deq.push(3);
deq.push(2, true);
assert.deepEqual(deq.top(), 3);
assert.deepEqual(deq.top(true), 2);

passed('push');

assert.deepEqual(deq.size, 3);

passed('size');

deq.pop();
assert.deepEqual(deq.top(), 4);
deq.pop();
assert.deepEqual(deq.top(), 2);
deq.pop();

passed('pop');

const ERROR_VALIDATOR = err => err !== undefined && /Deque is empty/.test(err);
assert(deq.empty());
assert.deepEqual(deq.size, 0);
assert.throws(() => deq.pop(), ERROR_VALIDATOR);
assert.throws(() => deq.pop(true), ERROR_VALIDATOR);
assert.throws(() => deq.top(), ERROR_VALIDATOR);
assert.throws(() => deq.top(true), ERROR_VALIDATOR);

passed('exception')

deq.push(1, false);
assert.deepEqual(deq.top(), deq.top(true));

passed('one element');

deq.push(2, true);
assert.deepEqual(deq.top(true), 2);
assert.deepEqual(deq.size, 2);

passed('push 2');