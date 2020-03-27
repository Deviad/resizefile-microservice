import {cacheErrorHandler} from '../services/cacheErrorHandler';
import {Request, Response} from 'express';

jest.mock('../services/CacheProvider');

import CacheProvider from '../services/CacheProvider';


let mockInstance = null;
beforeEach(() => {
  mockInstance = () => {
    const obj: Record<any, any> = {
      next: jest.fn(),
      req: {
        body: jest.fn().mockReturnValue({}),
        params: jest.fn().mockReturnValue({}),
      },
      res: {
        json: jest.fn().mockReturnValue({}),
        send: jest.fn().mockReturnValue({}),
        status: jest.fn().mockReturnValue({}),
      },
    };
    return obj;
  };
});


describe('When resize is called and an image is missing', () => {
  it('it should return an error', async (done) => {
    const instance = mockInstance() as NonNullable<any>;
    instance.req.originalUrl = '/image/resize?japanese_tree&size=300x400';
    instance.req.url = '/image/resize?japanese_tree&size=300x400';
    instance.req.query = {};
    instance.req.query.name = 'japanese_tree';
    instance.req.query.size = '300x400';

    const getCache = jest.fn();
    getCache.mockReturnValue(new Map<string, boolean>());

    CacheProvider.getCache = getCache.bind(CacheProvider);
    const cache = CacheProvider.getCache();

    cache.set(instance.req.query.name + instance.req.query.size, true);
    cacheErrorHandler(instance.req as unknown as Request, instance.res as unknown as Response, instance.next);
    expect(getCache).toBeCalled();
    done();
  });
});

