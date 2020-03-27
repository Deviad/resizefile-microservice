// import {ImageControllerHandler} from '../../services/ImageControllerHandler';
// import ImageController from '../../controller/ImageController';
// import app from '../../bootstrap';
// import {TypeORMCLient} from '../../utils/sqldb/client';
// import {Image} from '../../model';
//
// // jest.mock('typeorm/driver/mongodb/MongoDriver', () => ({}));
//
// describe('Post Endpoints', () => {
//
//   it('should create a new post', async () => {
//
//     jest.spyOn(ImageControllerHandler, 'createNewDbEntry').mockResolvedValue(Promise.resolve());
//
//     const imageRepo = new TypeORMCLient<Image>(Image);
//
//     jest.spyOn(imageRepo, 'save').mockResolvedValue({});
//
//     const controller = new ImageController(app, imageRepo);
//     await controller.save('/image');
//     expect(ImageControllerHandler.createNewDbEntry).toHaveBeenCalled();
//   });
// });
