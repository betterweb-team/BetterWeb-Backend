// Deque Implementation

class Node{
    /**
     * Node constructor
     * @param {Node | undefined} prev 
     * @param {Node | undefined} next 
     * @param {Object} val 
     */
    constructor(prev, next, val){
        this.prev = prev;
        this.next = next;
        this.val = val;
    }
}

class Deque{
    constructor(){
        this.front = this.back = undefined;
        this.size = 0;
    }

    /**
     * Checks whether the deque is empty
     * @returns {boolean} Whether the deque is empty
     */
    empty(){
        return this.size == 0;
    }

    /**
     * Pushes an item intp the deque
     * @param {Object} val The value to push
     * @param {boolean} frontPush Whether the push is to the front or back 
     * @returns {void}
     */
    push(val, frontPush=false){
        if(this.front === undefined && this.back === undefined)
            this.front = this.back = new Node(undefined, undefined, val);
        else if(frontPush){
            this.front = new Node(undefined, this.front, val);
            this.front.next.prev = this.front;
        }
        else{
            this.back = new Node(this.back, undefined, val);
            this.back.prev.next = this.back;
        }

        if(this.front === undefined)
            throw new Error('Front is undefined after push!');
        if(this.back === undefined)
            throw new Error('Back is undefined after push!');

        this.size++;
    }

    /**
     * Pops an item from the deque
     * @param {boolean} frontPop Whether the pop is from the front or back
     * @returns {Object} The popped element
     */
    pop(frontPop=false){
        if(this.size === 0)
            throw new Error('Deque is empty!');
        
        this.size--;

        if(this.size === 0){
            let ret = this.front.val;
            this.front = this.back = undefined;
            return ret;
        }
        else if(frontPop){
            let ret = this.front.val;
            this.front = this.front.next;
            this.front.prev = undefined;
            return ret;
        }
        else{
            let ret = this.back.val;
            this.back = this.back.prev;
            this.back.next = undefined;
            return ret;
        }
    }

    /**
     * Returns the top element of the deque (front or back)
     * @param {boolean} front Whether the first or last element is retrieved
     * @returns {object} The front or back element, whichever specified
     */
    top(front=false){
        if(this.size === 0)
            throw new Error('Deque is empty!');

        if(front)
            return this.front.val;
        else
            return this.back.val;
    }
}

module.exports = {
    Deque: Deque
};