import { NextFunction, Request, Response, Router } from 'express';
import { createTransport, Transporter } from 'nodemailer';

import { Emailer } from '../classes/emailer';
import {
  Association,
  Document,
  Objection,
  User,
  Vote,
} from '../schema/schemas';
import { Unit } from '../schema/unit';

import { DocumentsRouter } from './api/documents';

import { bugsnagClient } from '../config/bugsnag';

const documentsRoutes = new DocumentsRouter();

export class ApiRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.use(documentsRoutes.routePrefix, documentsRoutes.router);
    this.router.get('/directory', this.getDirectory);
    this.router.get('/rules', this.getRules);
    this.router.get('/units', this.getUnits);
    this.router.get('/objections', this.getObjections);
    this.router.get('/objections/past', this.getPastObjections);
    this.router.get('/objections/:id', this.getObjection);
    this.router.get('/inbox', this.getInbox);
    this.router.get('/outbox', this.getOutbox);
    this.router.post('/objections', this.fileObjection);
    this.router.post('/vote', this.submitVote);
    this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.sendStatus(200);
    });
  }

  private getDirectory = (req: Request, res: Response, next: NextFunction) => {
    // TODO: remove the hard coded 2
    const associationId = req.session.associationId || 2;
    Association.getDirectoryByAssociationId(associationId)
      .then((directory) => {
        res.send(directory);
      })
      .catch((error) => {
        bugsnagClient.notify(error);
        res.sendStatus(500);
      });
  }
  private getRules = (req: Request, res: Response, next: NextFunction) => {
    // TODO: remove the hard coded 2
    const associationId = req.session.associationId || 2;
    Association.getRuleListsByAssociationId(associationId)
      .then((ruleLists) => {
        res.send(ruleLists);
      })
      .catch((error) => {
        bugsnagClient.notify(error);
        res.sendStatus(500);
      });
  }
  private fileObjection = (req: Request, res: Response, next: NextFunction) => {
    // TODO: remove the hard coded 2
    const associationId = req.session.associationId || 2;
    const objection = req.body.objection;
    const byId = req.user.id;
    Objection.create({
      associationId,
      comment: objection.comment,
      submittedByUserId: byId,
      submittedAgainstUserId: objection.against,
    })
      .then((filedObjection) => {
        res.status(200).send({ success: true });
        // TODO: move this to a factory
        const transporter: Transporter = createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT, 10),
          secure: true, // upgrade later with STARTTLS
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
        const emailer = new Emailer(transporter);
        return Association.getUsersByAssociationId(associationId).then(
          (users) => {
            const emails = users.map((user) => user.email);
            const emailList = emails.join(', ');
            return emailer.sendMail({
              from: process.env.EMAIL_FROM,
              to: emailList,
              subject: 'A new objection has been submitted on HOA director',
              text: `
              A new objection has been submitted by ${req.user.name}
              To view the objection please use the following link: hoadirector.com/resolution-center/objection/view/${
                filedObjection.id
              }
            `,
              html: `
              <p>A new objection has been submitted by ${req.user.name}</p>
              <p>To view the objection click <a href="hoadirector.com/objection/view/${
                filedObjection.id
              }">here</a></p>
              <p>Or copy and paste the following link into your web browser:</p>
              <p>hoadirector.com/resolution-center/objection/view/${
                filedObjection.id
              }</p>
            `,
            });
          },
        );
      })
      .catch((error) => {
        bugsnagClient.notify(error);
        res.sendStatus(500);
      });
  }
  private submitVote = (req: Request, res: Response, next: NextFunction) => {
    // TODO: confirm user is in association
    // TODO: user more consise + type conversion
    const objectionId: number = parseInt(req.body.vote.objectionId);
    const approved: number = parseInt(req.body.vote.approved);
    const annonymous: number = req.body.annonymous
      ? parseInt(req.body.annonymous)
      : 0;
    const userId: number = parseInt(req.user.id);
    Vote.create({
      objectionId,
      approved,
      annonymous,
      userId,
    })
      .then((vote) => {
        res.status(200).send({});
      })
      .catch((error) => {
        bugsnagClient.notify(error);
        if (error.id === 100) {
          res.status(400).send({ message: error.message });
          return;
        }
        res.sendStatus(500);
      });
  }
  /**
   * Get objections for the users asscoiation
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getObjections = (req: Request, res: Response, next: NextFunction) => {
    const associationId: number = parseInt(req.session.associationId);
    Association.findByPk(associationId).then((association) => {
      association
        .getActiveObjections()
        .then((objections) => {
          res.send({ objections });
        })
        .catch((error) => {
          bugsnagClient.notify(error);
          res.sendStatus(500);
        });
    });
  }
  /**
   * Get objections for the users asscoiation
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getInbox = (req: Request, res: Response, next: NextFunction) => {
    const associationId: number = parseInt(req.session.associationId);
    const userId: number = parseInt(req.user.id);
    Association.findByPk(associationId).then((association) => {
      association
        .getUserInbox(userId)
        .then((objections) => {
          res.send({ objections });
        })
        .catch((error) => {
          bugsnagClient.notify(error);
          res.sendStatus(500);
        });
    });
  }
  /**
   * Get objections for the users asscoiation
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getOutbox = (req: Request, res: Response, next: NextFunction) => {
    const associationId: number = parseInt(req.session.associationId);
    const userId: number = parseInt(req.user.id);
    Association.findByPk(associationId).then((association) => {
      association
        .getUserOutbox(userId)
        .then((objections) => {
          res.send({ objections });
        })
        .catch((error) => {
          bugsnagClient.notify(error);
          res.sendStatus(500);
        });
    });
  }

  /**
   * Get expired for the users asscoiation
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getPastObjections = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const associationId: number = parseInt(req.session.associationId);
    Association.findByPk(associationId).then((association) => {
      association
        .getPastObjections()
        .then((objections) => {
          res.send({ objections });
        })
        .catch((error) => {
          bugsnagClient.notify(error);
          res.sendStatus(500);
        });
    });
  }

  /**
   * Get specific for the users asscoiation
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getObjection(req: Request, res: Response, next: NextFunction) {
    const associationId: number = parseInt(req.session.associationId);
    const objectionId: number = parseInt(req.params.id);
    Objection.findByPk(objectionId, {
      where: {
        associationId,
      },
      attributes: ['comment', 'closedAt', 'associationId', 'id'],
      include: [
        {
          model: User,
          as: 'submittedBy',
          attributes: ['id'],
          include: [
            {
              model: Unit,
              as: 'units',
              where: { associationId },
              attributes: ['addressLineOne'],
            },
          ],
        },
        {
          model: User,
          as: 'submittedAgainst',
          attributes: ['id'],
          include: [
            {
              model: Unit,
              as: 'units',
              where: { associationId },
              attributes: ['addressLineOne'],
            },
          ],
        },
      ],
    })
      .then(async (objection) => {
        const canVote = await objection.userCanVote(req.user);
        let results;
        if (objection.closedAt) {
          results = await objection.getResults();
        }
        res.send({ objection, canVote, results });
      })
      .catch((error) => {
        bugsnagClient.notify(error);
        res.status(500).send({ error });
      });
  }

  /**
   * Get specific for the users asscoiation
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getUnits(req: Request, res: Response, next: NextFunction) {
    const associationId: number = parseInt(req.session.associationId);
    Association.findByPk(associationId, {
      attributes: [],
      include: [
        {
          model: Unit,
          as: 'units',
          attributes: ['userId', 'addressLineOne'],
        },
      ],
    })
      .then((association) => {
        res.send({ units: association.units });
      })
      .catch((error) => {
        bugsnagClient.notify(error);
        res.sendStatus(500);
      });
  }
}

const apiRoutes = new ApiRouter().router;

export default apiRoutes;
