import {Application, Request, Response} from 'express';
import config from '../config';
import {TypeORMCLient} from '../utils/sqldb/client';
import {Image} from '../model';
import {ApiError} from '../error/Error';

const {server: {port}, databaseURL, domain} = config;

class ExpertController {
  private _app: Application;
  private _db: TypeORMCLient<Image>;

  constructor(app: Application, db: TypeORMCLient<Image>) {
    this._app = app;
    this._db = db;
  }

  public async save(endpoint: string): Promise<any> {
    return this._app.route(endpoint).post(async (req: Request, res: Response) => {
      try {
        const image = new Image();
        image.timestamp = new Date(Date.now()).toISOString();
        image.name = req.query.name + req.query.size;
        await this._db.em.save(image);
        res.status(201).json({'status': 'success'});
      } catch (error) {
       throw error;
      }
    });
  }

  // public async getExpert(endpoint: string): Promise<any> {
  //   return this._app.route(endpoint).get(async (req: Request, res: Response) => {
  //     try {
  //       if (!req.cookies.fireToken) {
  //         res.redirect('/experts/save/?origin=' + req.params.expertID);
  //       } else {
  //       const claims = await admin.auth().verifyIdToken(req.cookies.fireToken);
  //       if (claims) {
  //         const expert = await this._db.ref(`expertUnlocks/${claims['user_id']}`)
  //           .orderByKey()
  //           .equalTo(req.params.expertID)
  //           .once('value', (data) => {
  //             if (!data.exists()) {
  //               return {};
  //             } else {
  //               return data;
  //             }
  //           });
  //         const hasAccess = expert.val()[req.params.expertID];
  //         if (isEmpty(expert.val()) || !hasAccess) {
  //           res.status(200).render('pages/error.twig',
  //             {errorMessage: 'The expert requested is not available for you.'});
  //
  //         } else  {
  //           const experts = await this._db.ref(`experts`)
  //             .orderByKey()
  //             .once('value', (data) => data);
  //           const expertData = experts.val()[req.params.expertID];
  //           console.log('req.params.expertID', req.params.expertID);
  //           // const fullUrl = req.protocol + '://' + domain + req.originalUrl;
  //           // const fullUrl = req.protocol + '://' + domain + '/expert-list';
  //           const r = request(expertData.url);
  //           req.pipe(r).pipe(res);
  //         }
  //       }}
  //     } catch (error) {
  //       res.status(403).json({'status': 'error', 'message': error});
  //     }
  //   });
  // }
  //
  //
  // public async apiIndex(endpoint: string): Promise<any> {
  //   return this._app.route(endpoint).get(async (req: Request, res: Response) => {
  //     let noExpertError = 0;
  //     try {
  //       if (!req.cookies.fireToken) {
  //         res.status(403).json({'status': 'error', 'message': 'You need to be logged in'});
  //         return null;
  //       }
  //
  //       const claims = await admin.auth().verifyIdToken(req.cookies.fireToken);
  //       let expertsByUserId = await this._db.ref(`expertUnlocks/${claims['user_id']}`)
  //         .orderByKey()
  //         .once('value', (data) => {
  //           if (!data.exists()) {
  //             noExpertError = 1;
  //             return {};
  //           } else {
  //             return data;
  //           }
  //         });
  //       const expertsIds = (Object as any).keys(expertsByUserId.val()).map(expert => expert);
  //
  //       const pictureAbsoluteUrl =
  //         async (expert) => {
  //         console.log('expert', expert);
  //           const file = this._bucket.file(`${expert.picture}`);
  //           const fetchPictureUrl = async () => {
  //             expert.picture =  await file.getSignedUrl({
  //               action: 'read',
  //               expires: '03-09-2491'
  //             }).then(urls => urls[0]);
  //           };
  //           await fetchPictureUrl();
  //           return expert;
  //       };
  //       const buildExpertPublicUrl = (expert) => {
  //         expert.url = `//${config.domain}/experts/${expert.id}`;
  //         return expert;
  //       };
  //       const experts = await this._db.ref(`experts`)
  //         .orderByKey()
  //         .once('value', (data) => data);
  //       const joinExperts: IExpert[] =  expertsIds.map(id => (Object as any)
  //         .keys(experts.val())
  //         .filter(key => key === id)
  //         .map(expId => {
  //           let expert = experts.val()[expId];
  //           expert.id = expId;
  //           buildExpertPublicUrl(expert);
  //           expert = pictureAbsoluteUrl(expert);
  //           return expert;
  //         }));
  //
  //       // Google Firebase val() function returns the same result as if we were using the plain old
  //       // JSON.parse(JSON.stringify(someData))
  //       // The data we gather this way are in the form [[{someobj1}], [{someobj2}]]
  //       // So we need to take out from every object the array they are in using a flatMap function.
  //
  //
  //       const flattenJoinexperts = await Promise.all(flatMap(x => x, joinExperts));
  //       const expertsCategories =
  //         flow(
  //           flatMap(x => x),
  //           uniqBy('title'),
  //           map(x => x.title)
  //         )(flattenJoinexperts);
  //       res.status(200).json({'status': 'success', 'data': {experts: flattenJoinexperts, categories: expertsCategories}});
  //       // console.log('expertsCategories', expertsCategories);
  //
  //       return null;
  //     } catch (error) {
  //       // if (noExpertError) {
  //       //   error = 'Please complete the typeform';
  //       // }
  //       res.status(500).json({'status': 'error', 'message': error});
  //     }
  //   });
  // }
  // public async indexExpert(endpoint: string): Promise<any> {
  //   return this._app.route(endpoint).get(async (req: Request, res: Response) => {
  //
  //     // let noExpertError = 0;
  //     try {
  //       if (!req.cookies.fireToken) {
  //         console.log('firetoken', req.cookies.fireToken);
  //
  //         res.redirect('/experts/save');
  //         return null;
  //       }
  //
  //       // const fullUrl = req.protocol + '://' + domain + req.originalUrl;
  //       const fullUrl = req.protocol + '://' + domain + '/expert-list';
  //       const r = request(fullUrl);
  //       req.pipe(r).pipe(res);
  //     } catch (error) {
  //       res.status(403).render('pages/error.twig', {errorMessage: error});
  //     }
  //   });
  // }
  // public async testRoute(endpoint: string): Promise<any> {
  //   return this._app.route(endpoint).post(async (req: Request, res: Response) => {
  //      console.log('req.body', req.body);
  //     console.log('req.headers', req.headers);
  //     // let noExpertError = 0;
  //     try {
  //       // const fullUrl = req.protocol + '://' + domain + req.originalUrl;
  //       res.status(200).json({'status': 'success', 'data': req.body});
  //
  //     } catch (error) {
  //       res.status(403).render('pages/error.twig', {errorMessage: error});
  //     }
  //   });
  // }
  // public async typeForm(endpoint: string): Promise<any> {
  //   return this._app.route(endpoint).post(async (req: Request, res: Response) => {
  //     console.log('REQ.COOKIES', req.cookies);
  //     try {
  //       if (!req.cookies) {
  //         console.log('MY COOKIES', 'no cookies');
  //       }
  //       console.log('REQ.COOKIES', req.cookies);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // }
}

export default ExpertController;
