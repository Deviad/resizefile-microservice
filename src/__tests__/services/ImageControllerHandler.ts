import {ImageControllerHandler} from '../../services/ImageControllerHandler';

let mockInstance = null;
beforeEach(() => {
  mockInstance = () => {
    const obj: Record<any, any> = {
      em: {
        save: jest.fn((arg) => {
          return arg;
        })
      }
    };
    return obj;
  };
});

describe('When createNewDbEntry is called', () => {
  it('it should call save function', async (done) => {
    const instance = mockInstance();
    await ImageControllerHandler.createNewDbEntry(instance, 'hello');
    expect(instance.em.save).toBeCalledTimes(1);
    done();
  });
});
