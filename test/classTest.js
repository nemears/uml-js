import assert from 'assert';
import UmlManager from '../lib/manager';
import parse from '../lib/parse';

describe('ClassTests', () => {
    describe('parsingTests', () => {
        it('basicParsingTest', async () => {
            const manager = new UmlManager();
            const data = {
                class: {
                    id: 'T1J0hAryQORw9sMaNfgUwVDor7eS',
                    name: 'blahaj',
                    ownedAttributes: [
                        'RI5EBAFWoJncjrIkOhB_T1NIGM_R.yml'
                    ]
                }
            }
            const propertyData = {
                class: 'T1J0hAryQORw9sMaNfgUwVDor7eS',
                property: {
                    id: 'RI5EBAFWoJncjrIkOhB_T1NIGM_R',
                    name: 'tooth'
                }
            }
            const clazz = parse(data);
            manager.add(clazz);
            assert.equal(clazz.id, 'T1J0hAryQORw9sMaNfgUwVDor7eS');
            assert.equal(clazz.name, 'blahaj');
            for (let id of clazz.ownedAttributes.ids()) {
                assert.equal(id, 'RI5EBAFWoJncjrIkOhB_T1NIGM_R');
            }
            const property = parse(propertyData);
            manager.add(property);
            assert.equal(property.id, 'RI5EBAFWoJncjrIkOhB_T1NIGM_R');
            assert.equal(property.name, 'tooth');
            const propertyClazz = await property.clazz.get();
            assert.equal(propertyClazz.id, clazz.id);
        });
    });
    describe('emitting tests', () => {
        it('emitClassTest', () => {
            const manager = new UmlManager();
            const clazz = manager.create('class');
            const property = manager.create('property');
            const owningPackage = manager.create('package');
            clazz.name = 'blahaj';
            clazz.ownedAttributes.add(property);
            clazz.owningPackage.set(owningPackage);
            const clazzEmit = clazz.emit();
            assert.equal(JSON.stringify(clazzEmit), JSON.stringify({
                class: {
                    id: clazz.id,
                    name: 'blahaj',
                    ownedAttributes: [
                        property.id + '.yml'
                    ]
                },
                owningPackage: owningPackage.id
            }));
            const propertyEmit = property.emit();
            assert.equal(JSON.stringify(propertyEmit), JSON.stringify({
                property: {
                    id: property.id
                },
                class: clazz.id
            }));
            const packageEmit = owningPackage.emit();
            assert.equal(JSON.stringify(packageEmit), JSON.stringify({
                package: {
                    id: owningPackage.id,
                    packagedElements: [
                        clazz.id + '.yml'
                    ]
                }
            }));
        });
    })
});