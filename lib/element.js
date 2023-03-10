import Set from './set.js'
import Singleton from './singleton.js';

export function randomID() {
    let ret  =  "";
    const base64chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
                        ,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
                        ,'0','1','2','3','4','5','6','7','8','9','_','&'];
    for (let i = 0; i < 28; i++) {
        ret += base64chars[Math.floor(Math.random() * 64)];
    }
    return ret;
}

export function nullID() {
    let ret = '';
    for (let i = 0; i < 28; i++) {
        ret += 'A';
    }
    return ret;
}

export default class Element {
    constructor(manager) {
        this.manager = manager;
        this.id = randomID();
        this.ownedElements = new Set(this);
        this.owner = new Singleton(this);
        this.sets = {
            "ownedElements" : this.ownedElements,
            "owner" : this.owner
        }
        this.ownedElements.opposite = "owner";
        this.owner.opposite = "ownedElements";
    }
}

export function emitEl(data, alias, el) {
    data[alias].id = el.id;
}

export function isSubClassOfElement(elementType) {
    return elementType === 'element' || elementType === 'ELEMENT';
}